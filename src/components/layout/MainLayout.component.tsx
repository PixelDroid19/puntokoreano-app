// src/components/layout/MainLayout.component.tsx
import { Layout, Menu, Badge, Dropdown } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faHeart,
  faSearch,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";
import {
  Link,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Footer from "../../pages/home/components/Footer.component"; // Adjust path if needed
import { useEffect, useState } from "react";
import CartModal from "../Modals/CartModal.component";
import WhatsAppButton from "../buttons/Whatsapp.component";
import WishlistModal from "../Modals/Wishlist.component";
import GroupsModal from "../Modals/GroupsModal.component";
import TermsModal from "../Modals/TermsModal.component";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useTermsStore } from "@/store/terms.store"; // Import the terms store
import "./style.css";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactElement;
}

export const MainLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ query: "(max-width: 1023px)" });
  const isDesk = useMediaQuery({ query: "(min-width: 1024px)" });

  // State for other modals
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [openWish, setOpenWish] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<boolean>(false);

  const {
    isOpen: termsIsOpen,
    acceptTerms,
    checkInitialAcceptanceAndOpen,
  } = useTermsStore();

  // Auth and other store hooks
  const { isAuthenticated, user } = useAuthStore();
  const { totalItems: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { logout } = useAuth();

  useEffect(() => {
    checkInitialAcceptanceAndOpen();
  }, []);

  const handleOpenCarModal = () => setOpenCart(true);
  const handleOpenWishModal = () => setOpenWish(true);

  const items = [
    { key: 1, label: <Link to={"/"}>Inicio</Link> },
    { key: 2, label: <Link to={"/store/search"}>Tienda</Link> },
    { key: 3, label: <Link to={"/blog"}>Blog</Link> },
    { key: 4, label: <Link to={"/about"}>Nosotros</Link> },
  ];

  const userMenuItems = [
    {
      key: "1",
      label: isAuthenticated ? (
        <div className="px-4 py-2 text-gray-600">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.email}</p>
        </div>
      ) : (
        <Link to="/login" className="px-4 py-2">
          Iniciar Sesión
        </Link>
      ),
    },
    ...(isAuthenticated
      ? [
          {
            key: "2",
            label: (
              <Link
                to="/account"
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                Mi Cuenta
              </Link>
            ),
          },
          {
            key: "3",
            label: (
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Cerrar Sesión
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Layout>
      <ScrollRestoration />
      <Header className="header">
        <div className={`${isTablet && "justify-between"} container-header`}>
          {location.pathname.includes("store") &&
            !location.pathname.includes("search") &&
            isTablet && (
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-white text-xl p-2 cursor-pointer"
                  onClick={() => setOpenGroups(true)}
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-white text-xl p-2 cursor-pointer"
                />
              </div>
            )}
          <figure className="figure-logo" onClick={() => navigate("/")}>
            {(location.pathname === "/" ||
              location.pathname === "/store/search" ||
              !location.pathname.startsWith("/store") ||
              isDesk) && (
              <img
                className="logo"
                src="https://puntokoreano.com/images/logos/logo_1.png"
                alt="Punto Koreano Logo"
              />
            )}
            <figcaption className="figcaption-logo hover:text-b">
              Punto Koreano
            </figcaption>
          </figure>

          <div className="flex items-center">
            {(location.pathname === "/" ||
              location.pathname === "/store/search" ||
              !location.pathname.startsWith("/store") ||
              isDesk) && (
              <Menu
                className="header-menu"
                theme="dark"
                mode="horizontal"
                items={items}
                defaultSelectedKeys={["home"]}
                overflowedIndicator={
                  <FontAwesomeIcon
                    icon={faBars}
                    className="text-white"
                    size="xl"
                  />
                }
              />
            )}

            {((location.pathname.includes("store") &&
              !location.pathname.includes("search")) ||
              (isDesk && location.pathname.includes("store"))) && (
              <Badge count={wishlistItems.length} size="small">
                <FontAwesomeIcon
                  onClick={handleOpenWishModal}
                  icon={faHeart}
                  className="text-white text-xl p-2 cursor-pointer"
                />
              </Badge>
            )}

            {((location.pathname.includes("store") &&
              !location.pathname.includes("search")) ||
              (isDesk && location.pathname.includes("store"))) && (
              <Badge count={cartItems} size="small">
                <FontAwesomeIcon
                  onClick={handleOpenCarModal}
                  icon={faCartShopping}
                  className="text-white text-xl p-2 cursor-pointer"
                />
              </Badge>
            )}

            {(location.pathname === "/" ||
              location.pathname === "/store/search" ||
              !location.pathname.startsWith("/store") ||
              isDesk) && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <button className="user-btn">
                  <FontAwesomeIcon
                    className="text-inherit"
                    icon={faUser}
                    size="xl"
                  />
                </button>
              </Dropdown>
            )}
          </div>
        </div>
      </Header>
      <Content className="relative">
        {children}
        <WhatsAppButton />
      </Content>
      {/* Modals */}
      <WishlistModal open={openWish} setOpen={setOpenWish} />
      <CartModal open={openCart} setOpen={setOpenCart} />
      <GroupsModal open={openGroups} setOpen={setOpenGroups} />

      <TermsModal open={termsIsOpen} onAccept={acceptTerms} />
      <Footer />
    </Layout>
  );
};

export default MainLayout;
