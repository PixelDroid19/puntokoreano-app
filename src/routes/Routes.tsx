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
import Blog from "../pages/blog/Blog.page";
import VehiclesBrand from "../pages/blog/components/Vehicles.component";
import BlogPost from "../pages/blog/components/Post.component";
import Cart from "../pages/cart/Cart.page";
import Login from "../pages/auth/Login";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css";
import Register from "@/pages/auth/Register";
import Articles from "../pages/blog/components/Articules.component";
import DevelopmentView from "@/components/DevelopmentView/DevelopmentView";

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
        <Route path="/blog" element={<DevelopmentView />} /> {/* components <Blog /> */}
        <Route path="/blog/:brand/vehicles" element={<VehiclesBrand />} />
        <Route path="/blog/:brand/:vehicle/articles" element={<Articles />} />
        <Route path="/blog/article/:slug" element={<BlogPost />} />
        <Route path="/store/cart" element={<Cart />} />
        <Route path="/store/checkout" element={<Checkout />} />
        <Route path="/store/finish-order" element={<ThanksOrder />} />
      </Route>

      {/* Protected routes (require login) */}
      <Route element={<PrivateRoutes />}>
        {/* Add any routes that should require authentication here */}
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
    if (token) {
      // Set axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      offset: 200,
      duration: 800,
      once: true,
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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default Routes;
