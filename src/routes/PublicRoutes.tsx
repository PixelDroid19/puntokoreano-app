import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.component";

const PublicRoutes = () => {
    const [ auth ] = React.useState<boolean>(false);

    return auth ? <Navigate to="/" />   : <MainLayout><Outlet /></MainLayout>
}
export default PublicRoutes;