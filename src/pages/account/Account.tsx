// src/pages/account/Account.tsx
import { Tabs, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import ProfileSection from "./components/ProfileSection";
import AddressSection from "./components/AddressSection";
import PaymentSection from "./components/PaymentSection";
import OrdersSection from "./components/OrdersSection";
import ReviewsSection from "./components/ReviewsSection";
import PreferencesSection from "./components/PreferencesSection";
import WishlistSection from "./components/WishlistSection";

const { Title } = Typography;

const Account = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const tabs = [
    {
      key: "profile",
      label: "Perfil",
      children: <ProfileSection />,
    },
    {
      key: "addresses",
      label: "Direcciones",
      children: <AddressSection />,
    },
  /*   {
      key: "payment",
      label: "Métodos de pago",
      children: <PaymentSection />,
    }, */
    {
      key: "orders",
      label: "Pedidos",
      children: <OrdersSection />,
    },
    {
      key: "wishlist",
      label: "Lista de deseos",
      children: <WishlistSection />,
    },
    {
      key: "reviews",
      label: "Reseñas",
      children: <ReviewsSection />,
    },
    {
      key: "preferences",
      label: "Preferencias",
      children: <PreferencesSection />,
    },
  ];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="px-5 py-8 max-w-[1280px] mx-auto lg:px-10">
      <Title level={2} className="mb-8 text-center lg:text-left">
        Mi cuenta
      </Title>
      <Tabs
        defaultActiveKey="profile"
        items={tabs}
        className="account-tabs"
        size="large"
      />
    </div>
  );
};

export default Account;