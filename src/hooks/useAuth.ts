// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import axios from "axios";
import ENDPOINTS from "@/api";
import { notification } from "antd";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
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
  } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN.url, {
        email,
        password,
      });

      const { user, token } = response.data.data;

      // Guardar en el store
      storeLogin(user, token);

      // Configurar token en axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || "Credenciales inválidas";
      notification.error({
        message: "Error al iniciar sesión",
        description: message,
      });
      return { success: false, error: message };
    }
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
