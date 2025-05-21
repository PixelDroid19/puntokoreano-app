// src/routes/PrivateRoutes.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.component";
import { useAuthStore } from "@/store/auth.store";
import ENDPOINTS from "@/api";
import axios from "axios";
import Loading from "@/components/layout/Loading.component";

const PrivateRoutes = () => {
  const { isAuthenticated, token, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      // Si no hay token, no necesitamos verificar
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        // Verificar validez del token con el backend
        await axios.get(ENDPOINTS.AUTH.CHECK_SESSION.url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Si llegamos aquí, el token es válido
        setIsVerifying(false);
      } catch (error) {
        // Si hay error, el token no es válido o está expirado
        console.error("Error al verificar la sesión:", error);
        await logout();
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [token, logout]);

  // Mientras verificamos, mostrar loading
  if (isVerifying) {
    return <Loading />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado y el token es válido, mostrar el contenido protegido
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoutes;
