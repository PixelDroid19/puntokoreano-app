import type React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { notification } from "antd";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart, Car, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./CardProducts.styles.css";

interface Vehicle {
  _id: string;
  line_id: {
    _id: string;
    name: string;
    model_id: {
      _id: string;
      name: string;
      year: number;
    };
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  group: string;
  subgroup: string;
  stock: number;
  code: number;
  shipping: string[];
  images: string[];
  thumb: string | null;
  carousel: string[];
  active: boolean;
  short_description?: string;
  compatible_vehicles: Vehicle[];
  discount?: {
    isActive: boolean;
    percentage: number;
    type?: string;
  };
}

interface Props {
  inline?: boolean;
  product: Product;
}

const CardProducts = ({ inline = false, product }: Props) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [isHovering, setIsHovering] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasCompatibleVehicles = product.compatible_vehicles.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      if (isExpanded && hasCompatibleVehicles) {
        setScrollPosition(0);
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [isExpanded, hasCompatibleVehicles]);

  useEffect(() => {
    if (isHovering && hasCompatibleVehicles && scrollRef.current) {
      const highlight = () => {
        const tags = scrollRef.current?.querySelectorAll(".vehicle-tag");
        if (tags && tags.length > 0) {
          const index = Math.floor((scrollPosition / 100) % tags.length);
          tags.forEach((tag, i) => {
            tag.classList.toggle("highlight-tag", i === index);
          });
        }
      };

      highlight();
      const interval = setInterval(() => {
        setScrollPosition((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isHovering, scrollPosition, hasCompatibleVehicles]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.stock === 0) {
      notification.warning({
        message: "Producto sin stock",
        description: "Este producto no está disponible actualmente",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumb || product.images[0] || "/placeholder.svg",
      stock: product.stock,
    });

    notification.success({
      message: "Producto agregado",
      description: "El producto fue agregado al carrito exitosamente",
    });
  };

  const discountedPrice = product.discount?.isActive
    ? Math.round(product.price * (1 - product.discount.percentage / 100))
    : product.price;

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasCompatibleVehicles) {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    }
  };

  const mainContentClick = () => {
    navigate(`/store/product/${product.id}`);
  };

  const imagesToDisplay = () => {
    if (product.thumb) {
      return [product.thumb];
    }

    if (product.carousel && product.carousel.length > 0) {
      return product.carousel;
    }

    return ["/placeholder.svg"];
  };

  return (
    <div className="p-2 w-full sm:w-[300px] md:w-[320px] lg:w-[280px] xl:w-[300px]">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative">
        {/* Badges */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 z-10 bg-gray-600/90 text-white text-sm px-3 py-1 rounded-full">
            Agotado
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-2 right-2 z-10 bg-yellow-500/90 text-white text-sm px-3 py-1 rounded-full">
            ¡Últimas {product.stock} unidades!
          </div>
        )}
        {product.discount?.isActive && (
          <div className="absolute top-2 left-2 z-10 bg-red-500/90 text-white text-sm px-3 py-1 rounded-full">
            {product.discount.percentage}% OFF
          </div>
        )}

        {/* Image Section - Altura fija */}
        <div
          className="relative h-[200px] w-full cursor-pointer overflow-hidden bg-gray-100"
          onClick={mainContentClick}
        >
          {inline ? (
            <img
              src={product.thumb || product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="product-card-image"
            />
          ) : (
            <Swiper
              navigation
              loop
              modules={[Navigation, Pagination]}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="h-full w-full product-swiper"
            >
              {imagesToDisplay().map((image, idx) => (
                <SwiperSlide key={`${idx}-image-${product.id}`}>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - imagen ${idx + 1}`}
                    className="product-card-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Color Bar */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#E8832F]" />
          <div className="flex-1 bg-[#302582]" />
          <div className="flex-1 bg-[#9C089F]" />
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Clickable Area for Title/Nav */}
          <div
            className="cursor-pointer flex-grow flex flex-col"
            onClick={mainContentClick}
          >
            {/* Product Name - Altura fija */}
            <h3 className="font-bold text-lg line-clamp-2 min-h-[30px]">
              {product.name}
            </h3>

            <div
              onClick={toggleExpand}
              className={`flex items-center justify-between text-gray-600 text-sm mb-2 ${
                hasCompatibleVehicles ? "cursor-pointer" : ""
              }`}
              style={{ height: "32px" }}
            >
              {hasCompatibleVehicles ? (
                <>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Aplicaciones:</span>
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={toggleExpand}
                    aria-expanded={isExpanded}
                    aria-controls={`applications-${product.id}`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Sin aplicaciones</span>
                </div>
              )}
            </div>

            {/* Aplicaciones mejoradas sin scrollbars feos */}
            <div
              id={`applications-${product.id}`}
              ref={scrollRef}
              className={`transition-all duration-300 ease-in-out ${
                isExpanded && hasCompatibleVehicles
                  ? "max-h-[120px] overflow-y-auto custom-scrollbar"
                  : "max-h-0 overflow-hidden"
              }`}
              onMouseEnter={
                hasCompatibleVehicles ? () => setIsHovering(true) : undefined
              }
              onMouseLeave={
                hasCompatibleVehicles
                  ? () => {
                      setIsHovering(false);
                      setScrollPosition(0);
                    }
                  : undefined
              }
            >
              {hasCompatibleVehicles && (
                <div className="flex flex-wrap gap-1 pt-1 pb-2">
                  {product.compatible_vehicles.map((vehicle) => (
                    <span
                      key={vehicle._id}
                      className="vehicle-tag inline-block px-2 py-1 text-xs text-white bg-[#302582] rounded-md whitespace-nowrap mb-1 transition-all duration-300"
                    >
                      {vehicle?.line_id?.model_id?.name} {vehicle?.line_id?.name} (
                      {vehicle?.line_id?.model_id?.year})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price and Stock - Mejorado con grid para alineación */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Precio</span>
                {product.discount?.isActive ? (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      $ {product.price.toLocaleString()} COP
                    </span>
                    <span className="font-bold text-lg text-[#000000]">
                      $ {discountedPrice.toLocaleString()} COP
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg text-[#000000]">
                    $ {product.price.toLocaleString()} COP
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">Stock</span>
                <span
                  className={`font-medium ${
                    product.stock === 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {product.stock} unidades
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`
              w-full px-4 py-2.5 rounded-lg transition-all duration-300 mt-4
              flex items-center justify-center gap-2 font-medium text-sm
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
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProducts;
