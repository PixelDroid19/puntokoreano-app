// components/Filter.component.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Form, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ENDPOINTS from "@/api/index.js";

interface FilterParams {
  brand: string;
  model: string;
  family: string;
  transmission: string;
  fuel: string;
  line: string;
  search?: string;
}

const FilterStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Estado inicial con valores de URL o defaults
  const [filters, setFilters] = useState<FilterParams>({
    brand: "ssangyong",
    model: searchParams.get("model") || "",
    family: searchParams.get("family") || "",
    transmission: searchParams.get("transmission") || "",
    fuel: searchParams.get("fuel") || "",
    line: searchParams.get("line") || "",
    search: searchParams.get("search") || "",
  });

  // Generación estática de años
  const modelYears = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => ({
    label: `${2003 + i}`,
    value: `${2003 + i}`,
  }));

  // Fetch de datos del API
  const { data: filterData } = useQuery({
    queryKey: ["getFilters"],
    queryFn: async () => {
      const response = await axios.get(ENDPOINTS.FILTERS.GET_ALL.url);
      return response.data;
    },
  });

  // Funciones para obtener opciones de los filtros
  const getFamilyOptions = () => {
    if (!filters.model) return [];
    return filterData?.data?.families?.[filters.model] || [];
  };

  const getTransmissionOptions = () => {
    if (!filters.model || !filters.family) return [];
    return filterData?.data?.transmissions?.[filters.model]?.[filters.family] || [];
  };

  const getFuelOptions = () => {
    if (!filters.model || !filters.family || !filters.transmission) return [];
    return (
      filterData?.data?.fuels?.[filters.model]?.[filters.family]?.[
        filters.transmission
      ] || []
    );
  };

  const getLineOptions = () => {
    if (!filters.model || !filters.family || !filters.transmission || !filters.fuel)
      return [];
    return (
      filterData?.data?.lines?.[filters.model]?.[filters.family]?.[
        filters.transmission
      ]?.[filters.fuel] || []
    );
  };

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Manejador de cambios en los filtros
  const handleFilterChange = (filterType: keyof FilterParams, value: string) => {
    const updates: Record<keyof FilterParams, () => Partial<FilterParams>> = {
      model: () => ({
        model: value,
        family: "",
        transmission: "",
        fuel: "",
        line: "",
      }),
      family: () => ({
        family: value,
        transmission: "",
        fuel: "",
        line: "",
      }),
      transmission: () => ({
        transmission: value,
        fuel: "",
        line: "",
      }),
      fuel: () => ({
        fuel: value,
        line: "",
      }),
      line: () => ({
        line: value,
      }),
      brand: () => ({
        brand: value,
      }),
      search: () => ({
        search: value,
      }),
    };

    setFilters((prev) => ({
      ...prev,
      ...(updates[filterType] ? updates[filterType]() : { [filterType]: value }),
    }));
  };

  const handleSearch = () => {
    // Crear URLSearchParams con los filtros
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    // Navegar a la página de productos con los filtros
    navigate({
      pathname: "/store",
      search: searchParams.toString(),
    });
  };

  return (
    <div className="">
      {/* Imágenes de fondo */}
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        <div className="w-1/3 hidden 2xl:block relative">
          <img
            src="/images/part-diagram-1.png"
            alt="Diagrama 1"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-1/3 hidden 2xl:block relative">
          <img
            src="/images/part-diagram-2.png"
            alt="Diagrama 2"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 py-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Título con barra de colores */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-center mb-4">
              Encuentra la pieza que necesitas para tu vehiculo
            </h1>
            <div className="flex h-1">
              <div className="flex-1 bg-[#6D21A7]" />
              <div className="flex-1 bg-[#EC0382]" />
              <div className="flex-1 bg-[#FAB21F]" />
            </div>
          </div>

          {/* Búsqueda general */}
          <Form.Item label="Búsqueda" className="mb-6">
            <Input
              placeholder="Buscar por nombre o categoría..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg"
              size="large"
            />
          </Form.Item>

          {/* Formulario de filtros */}
          <Form layout="vertical">
            <Form.Item label="Modelo" required className="font-bold">
              <Select
                value={filters.model}
                options={modelYears}
                onChange={(value) => handleFilterChange("model", value)}
                placeholder="Selecciona el modelo"
                className="w-full"
              />
            </Form.Item>

            <Form.Item label="Familia" required className="font-bold">
              <Select
                value={filters.family}
                options={getFamilyOptions()}
                onChange={(value) => handleFilterChange("family", value)}
                disabled={!filters.model}
                placeholder="Selecciona la familia"
                className="w-full"
              />
            </Form.Item>

            <Form.Item label="Caja de velocidades" required className="font-bold">
              <Select
                value={filters.transmission}
                options={getTransmissionOptions()}
                onChange={(value) => handleFilterChange("transmission", value)}
                disabled={!filters.family}
                placeholder="Selecciona la caja de velocidades"
                className="w-full"
              />
            </Form.Item>

            <Form.Item label="Tipo de combustible" required className="font-bold">
              <Select
                value={filters.fuel}
                options={getFuelOptions()}
                onChange={(value) => handleFilterChange("fuel", value)}
                disabled={!filters.transmission}
                placeholder="Selecciona el tipo de combustible"
                className="w-full"
              />
            </Form.Item>

            <Form.Item label="Linea" required className="font-bold">
              <Select
                value={filters.line}
                options={getLineOptions()}
                onChange={(value) => handleFilterChange("line", value)}
                disabled={!filters.fuel}
                placeholder="Selecciona la línea"
                className="w-full"
              />
            </Form.Item>

            <button
              className={`
                w-full px-4 py-2.5 rounded-lg transition-all duration-300
                flex items-center justify-center gap-2 font-medium
                ${
                  !Object.values(filters).some(Boolean)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : `
                      bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white 
                      hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
                      active:scale-95
                    `
                }
              `}
              onClick={handleSearch}
              disabled={!Object.values(filters).some(Boolean)}
            >
              Buscar
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FilterStore;