// components/SectionProducts.component.tsx
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import ENDPOINTS from "@/api";
import CardProducts from "./CardProducts";
import { useState, useEffect } from "react";
import "swiper/css";

interface Props {
  inline?: boolean;
}

interface Product {
  _id: string;
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
}

const SectionProducts = ({ inline }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Media queries para responsive design
  const sm = useMediaQuery({ query: "(min-width: 640px)" });
  const md = useMediaQuery({ query: "(min-width: 768px)" });
  const lg = useMediaQuery({ query: "(min-width: 1024px)" });
  const xl = useMediaQuery({ query: "(min-width: 1280px)" });
  const xl2 = useMediaQuery({ query: "(min-width: 1536px)" });
  const xl3 = useMediaQuery({ query: "(min-width: 1800px)" });

  // Extraer parámetros de filtrado
  const filterParams = {
    search: searchParams.get("search"),
    model: searchParams.get("model"),
    family: searchParams.get("family"),
    transmission: searchParams.get("transmission"),
    fuel: searchParams.get("fuel"),
    line: searchParams.get("line"),
    brand: searchParams.get("brand"),
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set("search", searchTerm);
        newParams.set("page", "1"); // Reset página
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearchParams]);

  // Verificar si hay filtros
  const hasActiveFilters = Object.values(filterParams).some(
    (value) => value !== null && value !== undefined && value !== ""
  );

  // Query para obtener productos
  const { data, isLoading } = useQuery({
    queryKey: ["products", filterParams],
    queryFn: async () => {
      const endpoint = hasActiveFilters
        ? ENDPOINTS.PRODUCTS.FILTER
        : ENDPOINTS.PRODUCTS.GET_ALL;

      const response = await axios.get(endpoint.url, {
        params: hasActiveFilters ? filterParams : undefined,
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  const products = data?.data?.products || [];

  return (
    <div className="mx-5 mb-10 max-w-[1280px] lg:px-0 xl:mx-auto lg:mx-auto">
      <div className="flex flex-col gap-4 mt-8">
        {/* Barra de búsqueda */}
        <div className="w-full max-w-md mx-auto">
          <Input
            placeholder="Buscar..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full py-2 px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            size="large"
          />
        </div>

        {/* Título con resultados */}
        <div className="flex items-center gap-2 mt-2 py-2 border-b border-b-[#e5e5e5]">
          <h2 className="text-xl uppercase lg:text-2xl">
            <strong>
              {searchTerm
                ? `Resultados para "${searchTerm}"`
                : hasActiveFilters
                ? "Productos filtrados"
                : "Productos"}
            </strong>
            {!hasActiveFilters && !searchTerm && " populares"}
          </h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No se encontraron productos
            {hasActiveFilters && " con los filtros seleccionados"}
          </p>
        </div>
      ) : inline ? (
        <Swiper
          data-aos="fade-left"
          navigation
          loop={products.length > 3}
          modules={[Navigation]}
          slidesPerView={
            xl3 ? 3 : xl2 ? 3 : xl ? 3 : lg ? 3 : md ? 2 : sm ? 2 : 1
          }
          spaceBetween={20}
          style={
            {
              "--swiper-navigation-size": "30px",
            } as React.CSSProperties
          }
        >
          {products.map((product: Product) => (
            <SwiperSlide key={product._id}>
              <CardProducts inline product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex justify-center flex-wrap gap-8 lg:justify-evenly">
          {products.map((product: Product) => (
            <div key={product._id} data-aos="fade-up">
              <CardProducts product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {data?.data?.pagination && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: data.data.pagination.pages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (i + 1).toString());
                  setSearchParams(newParams);
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-300
                  ${
                    Number(filterParams.page) === i + 1
                      ? "bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info de resultados */}
      {data?.data?.pagination && (
        <div className="text-center text-gray-500 mt-4">
          Mostrando {products.length} de {data.data.pagination.total} productos
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
