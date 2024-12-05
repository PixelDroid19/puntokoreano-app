// src/routes/PrivateRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.component";
import { useAuthStore } from "@/store/auth.store";

const PrivateRoutes = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;
