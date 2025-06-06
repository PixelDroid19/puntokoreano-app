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
// Importamos el interceptor (sólo importar - no lo inicializamos aún)
import "@/utils/axiosInterceptor";

import AOS from "aos";
import "aos/dist/aos.css";
import Register from "@/pages/auth/Register";
import Account from "@/pages/account/Account";
import BlogListPage from "@/pages/blog/BlogListPage";
import BlogDetailPage from "@/pages/blog/BlogDetailPage";
import AnimationProvider from "@/components/AnimationProvider";
import { homeLoader, aboutLoader } from "@/utils/routeLoaders";

const Routes = () => {
  const is576 = useMediaQuery({ query: "(min-width: 576px)" });
  const isXl = useMediaQuery({ query: "(min-width: 1280px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  
  // Configuración optimizada de React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos
        gcTime: 30 * 60 * 1000, // 30 minutos - tiempo de limpieza de caché
        refetchOnWindowFocus: false, // No refetch al volver a la ventana
        refetchOnMount: false, // No refetch al montar si hay datos válidos
        retry: 3, // Reintentos en caso de error
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });

  // Crear router con loaders optimizados
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
          {/* Rutas optimizadas con prefetching */}
          <Route 
            path="/" 
            element={<Home />} 
            loader={homeLoader(queryClient)}
          />
          <Route 
            path="/about" 
            element={<About />} 
            loader={aboutLoader(queryClient)}
          />
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

  // Initialize auth from localStorage if available
  const { token } = useAuthStore();
  useEffect(() => {
    // No necesitamos inicializar el interceptor aquí, ya se hace en la importación
    // setupAxiosInterceptors();

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
