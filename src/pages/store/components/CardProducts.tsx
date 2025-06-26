import type React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { notification } from "antd";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart, Car, Eye } from "lucide-react";
import { useState } from "react";
import "./CardProducts.styles.css";
import ProductCompatibleVehiclesModal from "@/components/ProductCompatibleVehiclesModal";

interface Vehicle {
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
  transmission_id?: {
    _id: string;
    name: string;
  };
  fuel_id?: {
    _id: string;
    name: string;
  };
  color?: string;
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

interface Product {
  id: string;
  name: string;
  price: number;
  group: string;
  subgroup: string;
  stock: number;
  code: number;
  shipping: string[];
  thumb: string | null;
  carousel: string[];
  active: boolean;
  short_description?: string;
  compatible_vehicles: Vehicle[];
  vehicleCompatibility?: VehicleCompatibility;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar la nueva estrategia de compatibilidad
  const totalVehicles = product.vehicleCompatibility?.totalVehicles || 0;
  const hasCompatibleVehicles = totalVehicles > 0;

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
      image: product.thumb || (product.carousel && product.carousel[0]) || "/placeholder.svg",
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

  const openVehiclesModal = (e: React.MouseEvent) => {
    if (hasCompatibleVehicles) {
      e.stopPropagation();
      setIsModalOpen(true);
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

        {/* Image Section - Dimensiones optimizadas para miniatura */}
        <div
          className="relative w-full aspect-square cursor-pointer overflow-hidden bg-white"
          onClick={mainContentClick}
        >
          {inline ? (
            <div className="product-image-container">
              <img
                src={product.thumb || (product.carousel && product.carousel[0]) || "/placeholder.svg"}
                alt={product.name}
                className="product-card-image"
                loading="lazy"
              />
            </div>
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
                  <div className="product-image-container">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - imagen ${idx + 1}`}
                      className="product-card-image"
                      loading="lazy"
                    />
                  </div>
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
              onClick={openVehiclesModal}
              className={`flex items-center justify-between text-gray-600 text-sm mb-2 ${
                hasCompatibleVehicles ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              style={{ height: "32px" }}
            >
              {hasCompatibleVehicles ? (
                <>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span className="text-xs">
                      {totalVehicles} vehículos compatibles
                    </span>
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={openVehiclesModal}
                    title="Ver vehículos compatibles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Sin aplicaciones</span>
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

      {/* Modal de vehículos compatibles */}
      <ProductCompatibleVehiclesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={product.id}
        productName={product.name}
        totalVehicles={totalVehicles}
      />
    </div>
  );
};

export default CardProducts;
