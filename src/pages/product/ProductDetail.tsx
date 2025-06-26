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
import ArticleRelation from "./components/ArticulesRelation.component";
import { useQuery } from "@tanstack/react-query";
import { apiGet, ENDPOINTS } from "@/api/apiClient";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import DescriptionProduct from "./components/Description.component";
import ReviewsProduct from "./components/Reviews.component";
import { useProductReviews } from "@/hooks/useProductReviews";
import Applies from "./components/Applies.component";

interface Seo {
  title: string;
  description: string;
  keywords: string[];
}

interface Discount {
  isActive: boolean;
  type: "permanent" | "temporary";
  percentage: number;
  startDate?: string;
  endDate?: string;
}

interface CompatibleVehicle {
  _id: string;
  model: {
    _id: string;
    name: string;
    year: number;
    family: {
      _id: string;
      name: string;
      brand: {
        _id: string;
        name: string;
      };
    };
  };
  transmission_id: {
    _id: string;
    name: string;
  };
  fuel_id: {
    _id: string;
    name: string;
  };
  color?: string;
  price?: number | null;
  active: boolean;
  displayName?: string;
  fullInfo?: {
    brand?: string;
    family?: string;
    model?: string;
    year?: number;
    transmission?: string;
    fuel?: string;
    color?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface VehicleCompatibility {
  directVehicles: number;
  groupVehicles: number;
  totalVehicles: number;
  hasMoreVehicles: boolean;
  groups: Array<{
    _id: string;
    name: string;
    vehicleCount: number;
    category: string;
  }>;
}

interface ApplicabilityGroup {
  _id: string;
  name: string;
  description?: string;
  category: string;
  estimatedVehicleCount: number;
}

interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface Rating {
  average: number;
  total: number;
  count: number;
  distribution: RatingDistribution;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  code: string;
  short_description: string;
  long_description: string;
  group: string;
  subgroup: string;
  shipping: string[];
  thumb: string;
  carousel: string[];
  active: boolean;
  discount: Discount | null;
  specifications: any[];
  variants: any[];
  videoUrl: string;
  warranty: string;
  seo: Seo;
  compatible_vehicles: CompatibleVehicle[];
  applicabilityGroups: ApplicabilityGroup[];
  vehicleCompatibility: VehicleCompatibility;
  related_products: any[];
  createdAt: string;
  updatedAt: string;
  views: number;
  rating: Rating;
}

interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductData;
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
      id ? apiGet<ProductDetailResponse>(
            ENDPOINTS.PRODUCTS.PRODUCT_DETAIL,
            { id }
          )
        : Promise.reject("No id"),
    enabled: !!id,
  });
  console.log(' productResponse?.data',  productResponse?.data);
  const product = productResponse?.data;
  const isProductInWishlist = product ? isInWishlist(product.id) : false;

  let displayPrice = product?.price || 0;
  let originalPrice: number | undefined = product?.price;
  let discountPercentage = 0;
  let isDiscounted = false;
  let finalPriceForCart = product?.price || 0;

  if (product?.discount?.isActive && product.discount.percentage > 0) {
    let discountAppliesNow = false;

    if (product.discount.type === "permanent") {
      discountAppliesNow = true;
    } else if (product.discount.type === "temporary") {
      const now = new Date();
      const startDate = product.discount.startDate
        ? new Date(product.discount.startDate)
        : null;
      const endDate = product.discount.endDate
        ? new Date(product.discount.endDate)
        : null;

      if (startDate && endDate && now >= startDate && now <= endDate) {
        discountAppliesNow = true;
      }
    }

    if (discountAppliesNow) {
      isDiscounted = true;
      discountPercentage = product.discount.percentage;
      displayPrice = product.price * (1 - discountPercentage / 100);
      finalPriceForCart = displayPrice;
    } else {
      isDiscounted = false;
      displayPrice = product.price;
      finalPriceForCart = product.price;
      originalPrice = undefined;
    }
  } else {
    isDiscounted = false;
    displayPrice = product?.price || 0;
    finalPriceForCart = product?.price || 0;
    originalPrice = undefined;
  }

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPriceForCart,
      image: product.thumb || (product.carousel && product.carousel[0]) || "/placeholder.svg",
      stock: product.stock,
    });
    if (Number(count) > 1) {
      useCartStore.getState().updateQuantity(product.id, Number(count));
    }

    notification.success({
      message: "Producto agregado",
      description: "El producto fue agregado al carrito exitosamente",
    });
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isProductInWishlist) {
      removeFromWishlist(product.id);
      notification.info({
        message: "Producto eliminado",
        description: "El producto fue eliminado de la lista de deseos",
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: finalPriceForCart,
        image: product.thumb || (product.carousel && product.carousel[0]) || "/placeholder.svg",
        stock: product.stock,
      });
      notification.success({
        message: "Producto agregado",
        description: "El producto fue agregado a la lista de deseos",
      });
    }
  };

  const handleClicPlus = () => {
    if (product?.stock && product.stock > 0 && Number(count) < product.stock) {
      setCount(`${Number(count) + 1}`);
    } else if (product?.stock === 0) {
      notification.warning({ message: "Producto sin stock" });
    } else {
      notification.warning({
        message: `Solo quedan ${product?.stock} unidades en stock`,
      });
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
      const width = Math.max(20, count.length * 10 + 2);
      inputRef.current.style.width = `${width}px`;
    }
  }, [count]);

  useEffect(() => {
    if (window.location.hash === "#reviews" && reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    return () => {
      if (window.location.hash === "#reviews") {
        window.history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
      }
    };
  }, [id]);

  const goToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.location.hash = "reviews";
    }
  };

  const tabs = [
    {
      key: "1",
      label: "Descripción",
      children: (
        <DescriptionProduct
          name={product?.name}
          long_description={product?.long_description || ""}
          group={product?.group}
          subgroup={product?.subgroup}
          productId={product?.id}
          compatibleVehicleIds={product?.compatible_vehicles?.map(v => v._id) || []}
          applicabilityGroups={product?.applicabilityGroups || []}
          vehicleCompatibility={product?.vehicleCompatibility}
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
        <ArticleRelation related_products={product?.related_products || []} />
      ),
    },
  ];

  if (isLoading) return <div className="text-center p-10">Cargando...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error al cargar el producto.
      </div>
    );
  if (!product)
    return <div className="text-center p-10">Producto no encontrado.</div>;

  return (
    <div className="px-5 mb-10 max-w-[1280px] lg:mx-auto lg:px-10">
      <div
        className="flex items-center gap-2 mb-4 w-fit mt-5 cursor-pointer group"
        onClick={() => navigate("/store")}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="text-base group-hover:text-[rgb(96,36,170)] transition-colors"
        />
        <p className="text-lg font-semibold group-hover:text-[rgb(96,36,170)] transition-colors">
          Tienda
        </p>
      </div>

      <section className="mt-5 lg:flex lg:gap-8">
        <ImagesView 
          images={product.carousel?.length > 0 ? product.carousel : (product.thumb ? [product.thumb] : [])} 
          videoUrl={product.videoUrl}
        />
        <div className="flex flex-col lg:flex-1 lg:py-2 space-y-4 mt-4 lg:mt-0">
          <div>
            <h1 className="font-bold text-xl mb-2 lg:text-2xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
              {isDiscounted && originalPrice !== undefined ? (
                <>
                  <h4 className="font-bold text-xl text-red-600">
                    $ {displayPrice.toLocaleString("es-CO")} COP
                  </h4>
                  <h5 className="text-base text-gray-500 line-through">
                    $ {originalPrice.toLocaleString("es-CO")} COP
                  </h5>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                    -{discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <h4 className="font-bold text-xl text-[#030202]">
                  $ {displayPrice.toLocaleString("es-CO")} COP
                </h4>
              )}
              <div className="flex items-center gap-2">
                <CountReview rating={product.rating.average} />
                {stats.totalReviews > 0 ? (
                  <button
                    onClick={goToReviews}
                    className="text-sm text-gray-500 hover:text-[#59214f] hover:underline"
                  >
                    ({stats.totalReviews} reseñas)
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">(Sin reseñas)</span>
                )}
              </div>
            </div>
          </div>

          <div className="py-1 border-t border-b border-gray-100 space-y-4">
            {product.stock > 0 && (
              <p className="text-sm text-green-600 font-medium">
                En Stock ({product.stock} disponibles)
              </p>
            )}
            <Space className="gap-4 w-full items-center">
              <Space className="gap-0">
                <button
                  onClick={handleClicRest}
                  disabled={Number(count) <= 1}
                  className="w-8 h-10 bg-gray-200 rounded-l-md font-bold text-xl flex justify-center items-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <input
                  ref={inputRef}
                  value={count}
                  type="text"
                  inputMode="numeric"
                  className="outline-none h-10 px-1 w-8 text-lg font-bold text-center box-content border-y border-gray-200 bg-white"
                  readOnly
                  aria-label="Cantidad seleccionada"
                />
                <button
                  onClick={handleClicPlus}
                  disabled={
                    product.stock === 0 || Number(count) >= product.stock
                  }
                  className="w-8 h-10 bg-gray-200 rounded-r-md font-bold text-xl flex justify-center items-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </Space>
              <button
                className={`
                  flex-1 px-4 py-2.5 rounded-lg transition-all duration-300
                  flex items-center justify-center gap-2 font-medium text-base
                  ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : `
                        bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white
                        hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
                        active:scale-95 shadow-md hover:shadow-lg
                      `
                  }
                `}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </button>
            </Space>

            <button
              className={`
                w-full px-4 py-2.5 rounded-lg transition-all duration-300
                flex items-center justify-center gap-2 font-medium text-base
                ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `
                        bg-gradient-to-r from-purple-600 to-indigo-700 text-white
                        hover:from-purple-700 hover:to-indigo-800
                        active:scale-95 shadow-md hover:shadow-lg
                      `
                }
                `}
              disabled={product.stock === 0}
              onClick={handleBuyNow}
            >
              Comprar ahora
            </button>

            {product.stock === 0 && (
              <p className="text-red-600 mt-2 text-center font-semibold">
                Producto agotado
              </p>
            )}

            <div
              className="mt-4 flex items-center cursor-pointer w-fit group"
              onClick={handleWishlist}
            >
              <FontAwesomeIcon
                icon={isProductInWishlist ? faHeartSolid : faHeart}
                className={`text-xl mr-2 transition-colors duration-200 ${
                  isProductInWishlist
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
              <p className="text-base text-gray-600 group-hover:text-black transition-colors">
                {isProductInWishlist
                  ? "Quitar de Lista de Deseos"
                  : "Añadir a Lista de Deseos"}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            {product.warranty && (
              <div className="mb-4">
                <p className="font-bold text-base mb-2">Garantía</p>
                <p className="text-sm text-gray-600">{product.warranty}</p>
              </div>
            )}
            
            <p className="font-bold text-base mb-2">Pago seguro garantizado</p>
            <Image
              className="max-w-[300px]"
              preview={false}
              src="https://risingtheme.com/html/demo-partsix/partsix/assets/img/other/safe-checkout.webp"
              alt="Métodos de pago seguro"
            />
          </div>
        </div>
      </section>

      <div className="w-full mt-4" ref={reviewsRef}>
        <Tabs
          defaultActiveKey={window.location.hash === "#reviews" ? "2" : "1"}
          items={tabs}
        />
      </div>

      <div>
        <SectionProducts
          inline
          title={"Productos relacionados"}
          search={false}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
