// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import ENDPOINTS from "@/api";
import { apiGet, apiPost } from "@/api/apiClient";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Record<string, any>;
    token: string;
    expiresAt: number;
  };
}

// Definición del tipo de preferencias del usuario
interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  theme?: "light" | "dark";
  language?: string;
}

// Definición del tipo User para resolver el error del linter
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin"; // Restringido a valores permitidos
  preferences: UserPreferences;
  [key: string]: any; // Para permitir propiedades adicionales
}

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    updateUser: storeUpdateUser,
    setTokenExpiry,
  } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {

      const response = await apiPost<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        { email, password }
      );

      const { user, token, expiresAt } = response.data;

      // Asegurar que las preferencias del usuario tengan los valores por defecto necesarios
      const defaultPreferences: UserPreferences = {
        notifications: true,
        newsletter: false,
        theme: "light",
        language: "es",
        ...(user.preferences || {})
      };

      // Obtener otras propiedades del usuario excluyendo las que ya procesamos
      const { id, name, email: userEmail, role, preferences, ...otherProps } = user;

      // Convertir user a tipo User para resolver el error del linter
      const userData: User = {
        id: String(id),
        name: name || '',
        email: userEmail || '',
        role: (role === "admin" ? "admin" : "user"),
        preferences: defaultPreferences,
        ...otherProps
      };

      // Store complete user data and token expiry
      storeLogin(userData, token);
      setTokenExpiry(expiresAt);



      navigate("/");
      return { success: true };
    } catch (error: any) {

      return { success: false, error: error.response?.data?.message };
    }
  };



  const handleRegister = async (data: RegisterData) => {
    try {

      const response = await apiPost(ENDPOINTS.AUTH.REGISTER, data);

      if (response.success) {

        navigate("/login");
      }

      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error durante el registro";

      return { success: false, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      // Opcionalmente, notificar al backend del cierre de sesión
      if (token) {
        await apiPost(ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      // Ignorar errores al cerrar sesión
    } finally {
      // Limpiar store
      storeLogout();

      // Redirigir
      navigate("/login");


    }
  };

  const checkAuth = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
      return false;
    }

    try {
      // Verificar con el backend si la sesión sigue siendo válida
      await apiGet(ENDPOINTS.AUTH.CHECK_SESSION);
      return true;
    } catch (error) {
      // Si hay error, la sesión no es válida
      handleLogout();
      return false;
    }
  };



  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth,
    updateUser: storeUpdateUser,
  };
};

// Hook para proteger rutas
export const useRequireAuth = () => {
  const { isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !token) {
    navigate("/login", { replace: true });
  }

  return isAuthenticated;
};
