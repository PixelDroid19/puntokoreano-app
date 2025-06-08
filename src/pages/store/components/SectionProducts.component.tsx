// components/SectionProducts.component.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { apiPost, ENDPOINTS } from "@/api/apiClient";
import CardProducts from "./CardProducts";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  inline?: boolean;
  title?: string | null;
  search?: boolean;
}

// Definición de Product según los requisitos de CardProducts
interface Product {
  id: string;
  name: string;
  price: number;
  group: string;
  subgroup: string;
  stock: number;
  code: number; // Cambiado a number según el error del linter
  shipping: string[];
  images: string[];
  image: string | null;
  thumb: string | null;
  carousel: string[];
  active: boolean;
  short_description: string;
  discount: {
    isActive: boolean;
    percentage: number;
    type?: "permanent" | "temporary";
  };
  createdAt: string;
  updatedAt: string;
  _id?: string;
  compatible_vehicles: any[];
  vehicleCompatibility?: any;
}

interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  perPage: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    products: any[]; //
    pagination: PaginationInfo;
  };
  filtersApplied?: any;
  sorting?: any;
}


interface VehicleFilters {
  brand_id?: string;
  family_id?: string;
  model_id?: string;
  transmission_id?: string;
  fuel_id?: string;
  [key: string]: string | undefined;
}

interface ProductFilters {
  search?: string;
  group?: string;
  subgroup?: string;
  active?: boolean;
  stockStatus?: string;
  hasDiscount?: boolean;
  discountType?: string;
  priceMin?: number;
  priceMax?: number;
  [key: string]: string | number | boolean | undefined;
}

interface RequestBody {
  vehicleFilters: VehicleFilters;
  productFilters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
  };
  sorting: {
    sortBy: string;
    sortOrder: string;
  };
}

const SectionProducts = ({ inline, title, search = true }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Media queries
  const sm = useMediaQuery({ query: "(min-width: 640px)" });
  const md = useMediaQuery({ query: "(min-width: 768px)" });
  const lg = useMediaQuery({ query: "(min-width: 1024px)" });
  const xl = useMediaQuery({ query: "(min-width: 1280px)" });
  const xl2 = useMediaQuery({ query: "(min-width: 1536px)" });
  const xl3 = useMediaQuery({ query: "(min-width: 1800px)" });

  // --- Recolección y Mapeo de Filtros ---
  const urlParams = Object.fromEntries(searchParams.entries());

  const requestBody: RequestBody = {
    vehicleFilters: {
      brand_id: urlParams.brand || undefined,
      family_id: urlParams.family || undefined,
      model_id: urlParams.model || undefined,
      transmission_id: urlParams.transmission || undefined,
      fuel_id: urlParams.fuel || undefined,
    },
    productFilters: {
      search: urlParams.search || undefined,
      group: urlParams.group || undefined,
      subgroup: urlParams.subgroup || undefined,
      active: urlParams.active ? urlParams.active === "true" : undefined,
      stockStatus: urlParams.stockStatus || undefined,
      hasDiscount: urlParams.hasDiscount
        ? urlParams.hasDiscount === "true"
        : undefined,
      discountType: urlParams.discountType || undefined,
      priceMin: urlParams.priceMin ? Number(urlParams.priceMin) : undefined,
      priceMax: urlParams.priceMax ? Number(urlParams.priceMax) : undefined,
    },
    pagination: {
      page: parseInt(urlParams.page || "1", 10),
      limit: parseInt(urlParams.limit || "10", 10),
    },
    sorting: {
      sortBy: urlParams.sortBy || "createdAt",
      sortOrder: urlParams.sortOrder || "desc",
    },
  };

  Object.keys(requestBody.vehicleFilters).forEach(
    (key) =>
      requestBody.vehicleFilters[key] === undefined &&
      delete requestBody.vehicleFilters[key]
  );
  Object.keys(requestBody.productFilters).forEach(
    (key) =>
      requestBody.productFilters[key] === undefined &&
      delete requestBody.productFilters[key]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set("search", searchTerm);
        newParams.set("page", "1"); // Reset página
      } else {
        newParams.delete("search");
      }
      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["products", requestBody],
    queryFn: async () => {

      return await apiPost<ApiResponse>(ENDPOINTS.PRODUCTS.SEARCH, requestBody);
    },
  });

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center text-red-500 py-8">
        Error al cargar los productos.
      </div>
    );
  }


  const formatProducts = (rawProducts: any[]): Product[] => {
    return rawProducts.map(product => ({
      ...product,
      code: typeof product.code === 'string' ? parseInt(product.code, 10) || 0 : product.code,
      compatible_vehicles: product.compatible_vehicles || []
    }));
  };

  const rawProducts = data?.data?.products || [];
  const products = formatProducts(rawProducts);
  const paginationInfo = data?.data?.pagination;

  const hasActiveVehicleFilters =
    Object.keys(requestBody.vehicleFilters).length > 0;

  const hasActiveProductFilters = Object.keys(requestBody.productFilters).some(
    (key) => key !== "active" || requestBody.productFilters[key] !== true
  );
  const hasActiveFilters = hasActiveVehicleFilters || hasActiveProductFilters;


  return (
    <div className="mx-5 mb-10 max-w-[1280px] lg:px-0 xl:mx-auto lg:mx-auto">
      <div className="flex flex-col gap-4 mt-8">
        {!!search && (
          <div className="w-full max-w-md mx-auto">
            <Input
              placeholder="Buscar por nombre, código..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full py-2 px-4 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size="large"
              allowClear
            />
          </div>
        )}

        {/* Título */}
        <div className="flex items-center gap-2 mt-2 py-2 border-b border-b-[#e5e5e5]">
          <h2 className="text-xl uppercase lg:text-2xl">
            {title ? (
              <strong>{title}</strong>
            ) : (
              <strong>
                {requestBody.productFilters.search
                  ? `Resultados para "${requestBody.productFilters.search}"`
                  : hasActiveFilters
                    ? "Productos Filtrados"
                    : "Productos"}
              </strong>
            )}
          </h2>
        </div>
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Lista o Mensaje "No encontrado" */}
      {!isLoading && products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No se encontraron productos
            {hasActiveFilters &&
              " que coincidan con los filtros seleccionados."}
          </p>
        </div>
      ) : !isLoading && inline ? (
        <div className="relative px-10 py-4">
          <Swiper
            data-aos="fade-left"
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop={
              products.length >
              (xl3 ? 3 : xl2 ? 3 : xl ? 3 : lg ? 3 : md ? 2 : sm ? 2 : 1)
            }
            modules={[Navigation]}
            slidesPerView={
              xl3 ? 3 : xl2 ? 3 : xl ? 3 : lg ? 3 : md ? 2 : sm ? 2 : 1
            }
            spaceBetween={30}
            className="products-swiper"
            style={
              {
                "--swiper-navigation-size": "25px",
                "--swiper-theme-color": "#9C089F",
              } as React.CSSProperties
            }
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <CardProducts inline product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer"></div>
          <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer"></div>
        </div>
      ) : (
        !isLoading && (
          <div className="flex justify-center flex-wrap gap-8 lg:justify-evenly">
            {products.map((product) => (
              <div key={product.id} data-aos="fade-up">
                <CardProducts product={product} />
              </div>
            ))}
          </div>
        )
      )}

      {/* Paginación */}
      {!isLoading && paginationInfo && paginationInfo.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {/* Botón Anterior */}
            {paginationInfo.page > 1 && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (paginationInfo.page - 1).toString());
                  setSearchParams(newParams, { replace: true });
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                aria-label="Página anterior"
              >
                <ArrowLeft />
              </button>
            )}
            {/* Números de Página */}
            {Array.from({ length: paginationInfo.pages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (i + 1).toString());
                  setSearchParams(newParams, { replace: true });
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${paginationInfo.page === i + 1
                    ? "bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
                aria-label={`Ir a página ${i + 1}`}
                aria-current={
                  paginationInfo.page === i + 1 ? "page" : undefined
                }
              >
                {i + 1}
              </button>
            ))}

            {paginationInfo.page < paginationInfo.pages && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", (paginationInfo.page + 1).toString());
                  setSearchParams(newParams, { replace: true });
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                aria-label="Página siguiente"
              >
                <ArrowRight />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info de resultados */}
      {!isLoading && paginationInfo && products.length > 0 && (
        <div className="text-center text-gray-500 mt-4">
          Mostrando {products.length} de {paginationInfo.total} productos
          {paginationInfo.pages > 1 &&
            ` (Página ${paginationInfo.page} de ${paginationInfo.pages})`}
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
