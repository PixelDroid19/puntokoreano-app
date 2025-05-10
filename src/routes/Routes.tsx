// src/routes/Routes.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import Home from "../pages/home/Home.page";
import { ConfigProvider } from "antd";
import { useMediaQuery } from "react-responsive";
import About from "../pages/about/About.page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Store from "../pages/store/store.page";
import FilterStore from "../pages/store/components/Filter.component";
import ProductDetail from "../pages/product/ProductDetail";
import Checkout from "../components/checkout/Checkout.component";
import ThanksOrder from "../components/orders/Thanks.component";
import Cart from "../pages/cart/Cart.page";
import Login from "../pages/auth/Login";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import setupAxiosInterceptors from "@/utils/axiosInterceptor";

import AOS from "aos";
import "aos/dist/aos.css";
import Register from "@/pages/auth/Register";
import Account from "@/pages/account/Account";
import BlogListPage from "@/pages/blog/BlogListPage";
import BlogDetailPage from "@/pages/blog/BlogDetailPage";
import AnimationProvider from "@/components/AnimationProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Semi-public routes (don't require login but use MainLayout) */}
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/store/search" element={<FilterStore />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/product/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/store/cart" element={<Cart />} />
        <Route path="/store/checkout" element={<Checkout />} />
        <Route path="/store/finish-order" element={<ThanksOrder />} />
      </Route>

      {/* Protected routes (require login) */}
      <Route element={<PrivateRoutes />}>
        {/* Add any routes that should require authentication here */}
        <Route path="/account" element={<Account />} />
      </Route>
      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )
);

const Routes = () => {
  const is576 = useMediaQuery({ query: "(min-width: 576px)" });
  const isXl = useMediaQuery({ query: "(min-width: 1280px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const queryClient = new QueryClient();

  // Initialize auth from localStorage if available
  const { token } = useAuthStore();
  useEffect(() => {
    // Setup axios interceptors for token expiration handling
    setupAxiosInterceptors();

    if (token) {
      // Set axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    // Configuramos AOS para usar animaciones más ligeras
    // Ya que ahora usaremos Anime.js para las animaciones principales
    AOS.init({
      startEvent: "DOMContentLoaded",
      offset: 200,
      duration: 400, // Reducida duración para que no interfiera con Anime.js
      once: true,
      disable: 'mobile', // Desactivamos en móvil para usar nuestras animaciones personalizadas
    });
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Exo, sans-serif",
          fontSize: isTabletOrMobile ? 14 : 16,
        },
        components: {
          Button: {
            colorPrimaryHover: `#E2000E`,
            colorPrimaryActive: `#E2000E`,
            colorBgTextHover: `#FFFFF`,
            colorText: `#FFEC0C`,
          },
          Steps: {
            customIconTop: isXl ? -4 : is576 ? -2 : 0.5,
          },
          Form: {
            fontSize: 16,
          },
          Menu: {
            itemColor: "#FFFFF",
            horizontalItemSelectedBg: "#1677ff",
            horizontalItemHoverBg: "#1677ff",
            horizontalItemSelectedColor: "#FFFFFF",
            horizontalItemHoverColor: "#FFFFFF",
            itemSelectedColor: "#FFFFFF",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AnimationProvider>
          <RouterProvider router={router} />
        </AnimationProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default Routes;
