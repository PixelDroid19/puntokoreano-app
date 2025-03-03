import { useNavigate } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { notification } from "antd";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart } from "lucide-react";

// Importar los estilos
import "./CardProducts.styles.css";

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
  active: boolean;
  model: string;
}

interface Props {
  inline?: boolean;
  product: Product;
}

const CardProducts = ({ inline = false, product }: Props) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

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
      image: product.images[0],
      stock: product.stock,
    });

    notification.success({
      message: "Producto agregado",
      description: "El producto fue agregado al carrito exitosamente",
    });
  };

  return (
    <div className="p-2 w-full sm:w-[300px] md:w-[320px] lg:w-[280px] xl:w-[300px]">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative">
        {/* Stock badges */}
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

        {/* Image container */}
        <div
          className="relative h-[240px] w-full cursor-pointer overflow-hidden bg-gray-100"
          onClick={() => navigate(`/store/product/${product.id}`)}
        >
          {inline ? (
            <img
              src={product.images[0]}
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
              {product.images.map((image, idx) => (
                <SwiperSlide key={`${idx}-image-${product.id}`}>
                  <img
                    src={image}
                    alt={`${product.name} - imagen ${idx + 1}`}
                    className="product-card-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="flex h-2">
          <div className="flex-1 bg-[#E8832F] h-1" />
          <div className="flex-1 bg-[#302582] h-1" />
          <div className="flex-1 bg-[#9C089F] h-1" />
        </div>

        {/* Product info */}
        <div className="p-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/store/product/${product.id}`)}
          >
            <h3 className="font-bold text-lg line-clamp-2 min-h-[30px]">
              {product.name}
            </h3>
            <p className=" mb-2">
              {product.model}
            </p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Precio</span>
                <span className="font-bold text-lg text-[#000000]">
                  $ {product.price.toLocaleString()} COP
                </span>
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

          {/* Add to cart button */}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
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
