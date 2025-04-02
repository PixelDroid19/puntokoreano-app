// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import axios from "axios";
import ENDPOINTS from "@/api";
import { notification } from "antd";
import setupAxiosInterceptors from "../utils/axiosInterceptor";

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
      // Step 3: Send login request with encrypted password and sessionId
      const response = await axios.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN.url,
        {
          email,
          password,
        }
      );

      const { user, token, expiresAt } = response.data.data;

      // Store complete user data and token expiry
      storeLogin(user, token);
      setTokenExpiry(expiresAt);

      // Configure axios
      configureAxiosAuth(token);

      navigate("/");
      return { success: true };
    } catch (error: any) {
      handleAuthError(error, "Error al iniciar sesión");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const configureAxiosAuth = (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Setup axios interceptors for token expiration
    setupAxiosInterceptors();
  };

  const handleAuthError = (error: any, defaultMessage: string) => {
    const message = error.response?.data?.message || defaultMessage;
    notification.error({
      message: defaultMessage,
      description: message,
    });
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const response = await axios.post(ENDPOINTS.AUTH.REGISTER.url, data);

      if (response.data.success) {
        notification.success({
          message: "Registro exitoso",
          description:
            "Tu cuenta ha sido creada correctamente. Por favor inicia sesión.",
        });
        navigate("/login");
      }

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error durante el registro";
      notification.error({
        message: "Error al registrarse",
        description: message,
      });
      return { success: false, error: message };
    }
  };

  const handleLogout = () => {
    // Limpiar store
    storeLogout();

    // Limpiar header de axios
    delete axios.defaults.headers.common["Authorization"];

    // Redirigir
    navigate("/login");

    notification.success({
      message: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const checkAuth = () => {
    if (!isAuthenticated || !token) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // Configurar axios con el token guardado al inicializar
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setupAxiosInterceptors(); // Setup interceptors on hook initialization if token exists
  }

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
