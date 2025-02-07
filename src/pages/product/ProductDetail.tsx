// src/pages/product/ProductDetail.tsx
import { Image, Space, Tabs, notification } from "antd";
import CountReview from "../store/components/CountReview.component";
import ImagesView from "./components/Images.component";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import SectionProducts from "../store/components/SectionProducts.component";
import ArticuleRelation from "./components/ArticulesRelation.component";
import Applies from "./components/Applies.component";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ENDPOINTS from "@/api";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import DescriptionProduct from "./components/Description.component";
import ReviewsProduct from "./components/Reviews.component";
import { useProductReviews } from "@/hooks/useProductReviews";

// Definir interfaces
interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    active: boolean;
    code: number;
    created_at: string;
    description: string;
    group: string;
    images: string[];
    name: string;
    price: number;
    long_description: string;
    short_description: string;
    related_products: any[];
    shipping: string[];
    stock: number;
    subgroup: string;
    updated_at: string;
  };
}

const ProductDetail = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState<string>("1");
  const inputRef = useRef<HTMLInputElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

  const { stats } = useProductReviews(id || "");
  const { addItem: addToCart } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery<ProductDetailResponse>({
    queryKey: ["Product", id],
    queryFn: () =>
      axios
        .get(`${ENDPOINTS.PRODUCTS.PRODUCT_DETAIL.url}/${id}`)
        .then((response) => response.data),
  });

  const product = productResponse?.data;
  const isProductInWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
    });

    notification.success({
      message: "Producto agregado",
      description: "El producto fue agregado al carrito exitosamente",
    });
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isProductInWishlist) {
      removeFromWishlist(product.id);
      notification.success({
        message: "Producto eliminado",
        description: "El producto fue eliminado de la lista de deseos",
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
      });
      notification.success({
        message: "Producto agregado",
        description: "El producto fue agregado a la lista de deseos",
      });
    }
  };

  const handleClicPlus = () => {
    if (product?.stock && Number(count) < product.stock) {
      setCount(`${Number(count) + 1}`);
    }
  };

  const handleClicRest = () => {
    Number(count) > 1 && setCount(`${Number(count) - 1}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/store/checkout");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${count.length * 10 + 2}px`;
    }
  }, [count]);

  useEffect(() => {
    if (window.location.hash === "#reviews" && reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const goToReviews = () => {
    const reviewsTab = document.querySelector('[data-tab-key="2"]');
    if (reviewsTab) {
      reviewsTab.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#reviews");
    }
  };

  const tabs = [
    {
      key: "1",
      label: "Descripcion",
      children: (
        <DescriptionProduct
          name={product?.name}
          long_description={product?.long_description || ""}
          short_description={product?.short_description || ""}
          group={product?.group}
          subgroup={product?.subgroup}
        />
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <span>Calificaciones</span>
          <span className="text-sm text-gray-500">
            ({stats.totalReviews || 0})
          </span>
        </div>
      ),
      children: <ReviewsProduct />,
    },
    {
      key: "3",
      label: "Artículos relacionados",
      children: (
        <ArticuleRelation related_products={product?.related_products || []} />
      ),
    },
   /*  {
      key: "4",
      label: "Aplicaciones",
      children: <Applies />,
    }, */
  ];

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar el producto</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="px-5 mb-10 max-w-[1280px] lg:mx-auto lg:px-10">
      <div
        className="flex items-center gap-2 mb-4 w-fit mt-5 cursor-pointer"
        onClick={() => navigate("/store")}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-base" />
        <p className="text-lg font-semibold">Tienda</p>
      </div>

      <section className="mt-5 lg:flex lg:gap-5 2xl:w-[1280px] 2xl:mx-auto">
        <ImagesView images={product.images} />
        <div>
          <h1 className="font-bold text-xl mb-2 lg:text-2xl">{product.name}</h1>
          <div className="flex gap-4">
            <h4 className="font-bold text-base text-[#030202]">
              $ {product.price.toLocaleString()} COP
            </h4>
            <div className="flex items-center gap-2">
              <CountReview />
              {stats.totalReviews > 0 && (
                <button
                  onClick={goToReviews}
                  className="text-sm text-gray-500 hover:text-[#59214f]"
                >
                  Ver {stats.totalReviews} reseñas
                </button>
              )}
            </div>
          </div>

          <p>{product.description}</p>
          <Space className="mt-4 gap-8">
            <Space className="gap-0">
              <button
                onClick={handleClicRest}
                className="w-8 h-10 bg-gray-300 rounded-l-full font-bold text-xl flex justify-center items-center"
              >
                -
              </button>
              <input
                ref={inputRef}
                value={count}
                type="number"
                className="outline-none h-10 px-2 w-2 text-lg font-bold text-center box-content"
                readOnly
              />
              <button
                onClick={handleClicPlus}
                disabled={product.stock === 0 || Number(count) >= product.stock}
                className="w-8 h-10 bg-gray-300 rounded-r-full font-bold text-xl flex justify-center items-center disabled:opacity-50"
              >
                +
              </button>
            </Space>
            <button
              className={`
                w-full px-4 py-2.5 rounded-lg transition-all duration-300
                flex items-center justify-center gap-2 font-medium
                ${
                  product.stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : `
                      bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white 
                      hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
                      active:scale-95
                    `
                }
              `}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </button>
          </Space>

          <Space
            className="mt-4 flex items-center cursor-pointer w-fit hover:text-[#E2060F]"
            onClick={handleWishlist}
          >
            <FontAwesomeIcon
              icon={isProductInWishlist ? faHeartSolid : faHeart}
              className={`text-lg ${
                isProductInWishlist ? "text-[#E2060F]" : ""
              }`}
            />
            <p className="text-base">
              {isProductInWishlist
                ? "Quitar de la lista de deseos"
                : "Añadir a la lista de deseos"}
            </p>
          </Space>

          <button
            className={`
            w-full px-4 py-2.5 rounded-lg transition-all duration-300
            flex items-center justify-center gap-2 font-medium
            ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : `
                  bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white 
                  hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
                  active:scale-95
                `
            }
          `}
            disabled={product.stock === 0}
            onClick={handleBuyNow}
          >
            Comprar ahora
          </button>

          {product.stock === 0 && (
            <p className="text-red-500 mt-2 text-center">
              Producto sin stock disponible
            </p>
          )}

          <Space className="flex flex-col justify-start items-start">
            <p className="mt-2 font-bold text-base">Pago seguro garantizado</p>
            <Image
              preview={false}
              src="https://risingtheme.com/html/demo-partsix/partsix/assets/img/other/safe-checkout.webp"
            />
          </Space>
        </div>
      </section>
      <div className="w-full 2xl:w-[1280px] 2xl:mx-auto" ref={reviewsRef}>
        <Tabs
          defaultActiveKey={window.location.hash === "#reviews" ? "2" : "1"}
          items={tabs}
        />
      </div>

      <div>
        <SectionProducts inline />
      </div>
    </div>
  );
};

export default ProductDetail;
