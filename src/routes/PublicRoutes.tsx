import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.component";
import { useAuthStore } from "@/store/auth.store";

const PublicRoutes = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    // Si el usuario está autenticado y está en la página de login, 
    // redirigir a la página principal
    if (isAuthenticated && location.pathname === '/login') {
        console.log("✅ Usuario ya autenticado, redirigiendo desde login a home");
        return <Navigate to="/" replace />;
    }

    return <MainLayout><Outlet /></MainLayout>;
}
export default PublicRoutes;