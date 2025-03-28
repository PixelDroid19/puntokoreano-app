// components/Filter.component.tsx
import React, { useState, useEffect, useMemo } from "react"; // Importar React, useMemo
import { useQuery } from "@tanstack/react-query";
import { Form, Select, Input, Spin } from "antd"; // Importar Spin para loading
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ENDPOINTS from "@/api/index.js"; // Asegúrate que la ruta sea correcta

// --- Interfaces ---
interface FilterSelection {
  // Estado local para los IDs seleccionados
  brandId: string | null;
  familyId: string | null;
  modelId: string | null;
  lineId: string | null;
  transmissionId: string | null;
  fuelId: string | null;
}

// Interfaces para los datos devueltos por el API de opciones
interface BrandOption {
  id: string;
  name: string;
}
interface FamilyOption {
  id: string;
  name: string;
  brandId: string | null;
}
interface ModelOption {
  id: string;
  name: string;
  year: number;
  familyId: string | null;
  brandId: string | null;
}
interface LineOption {
  id: string;
  name: string;
  modelId: string | null;
  brandId: string | null;
}
interface TransmissionOption {
  id: string;
  name: string;
}
interface FuelOption {
  id: string;
  name: string;
}

interface FilterOptionsData {
  brands: BrandOption[];
  families: FamilyOption[];
  models: ModelOption[];
  lines: LineOption[];
  transmissions: TransmissionOption[];
  fuels: FuelOption[];
}

interface FilterApiResponse {
  success: boolean;
  message: string;
  data: FilterOptionsData;
}

// --- Componente ---
const FilterStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Leer params iniciales si es necesario
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Estado para los IDs seleccionados en los dropdowns
  const [selectedFilters, setSelectedFilters] = useState<FilterSelection>({
    brandId: searchParams.get("brand") || null, // Usar 'brand' como en tu UI original para URL params
    familyId: searchParams.get("family") || null,
    modelId: searchParams.get("model") || null,
    lineId: searchParams.get("line") || null,
    transmissionId: searchParams.get("transmission") || null,
    fuelId: searchParams.get("fuel") || null,
  });

  // --- Fetch de opciones de filtro ---
  const {
    data: filterOptionsData,
    isLoading: isLoadingOptions,
    error: optionsError,
  } = useQuery<FilterApiResponse>({
    queryKey: ["vehicleFilterOptions"], // Key única para esta query
    queryFn: async () => {
      const response = await axios.get(
        ENDPOINTS.PRODUCTS.VEHICLE_FILTER_OPTIONS.url
      );
      return response.data;
    },
    staleTime: Infinity, // Cachear indefinidamente
  });

  const options = filterOptionsData?.data; // Acceso más corto a las opciones

  // --- Lógica de Filtros en Cascada (con useMemo para optimización) ---

  const brandOptions = useMemo(
    () => options?.brands.map((b) => ({ label: b.name, value: b.id })) || [],
    [options?.brands]
  );

  const familyOptions = useMemo(() => {
    if (!selectedFilters.brandId || !options?.families) return [];
    return options.families
      .filter((f) => f.brandId === selectedFilters.brandId)
      .map((f) => ({ label: f.name, value: f.id }));
  }, [selectedFilters.brandId, options?.families]);

  const modelOptions = useMemo(() => {
    if (!selectedFilters.familyId || !options?.models) return [];
    // También podrías filtrar por brandId si es necesario
    return options.models
      .filter(
        (m) =>
          m.familyId ===
          selectedFilters.familyId /* && m.brandId === selectedFilters.brandId */
      )
      .map((m) => ({ label: m.name, value: m.id })); // 'name' ya incluye el año
  }, [
    selectedFilters.familyId,
    /* selectedFilters.brandId, */ options?.models,
  ]);

  const lineOptions = useMemo(() => {
    if (!selectedFilters.modelId || !options?.lines) return [];
    // También podrías filtrar por brandId si es necesario
    return options.lines
      .filter(
        (l) =>
          l.modelId ===
          selectedFilters.modelId /* && l.brandId === selectedFilters.brandId */
      )
      .map((l) => ({ label: l.name, value: l.id }));
  }, [selectedFilters.modelId, /* selectedFilters.brandId, */ options?.lines]);

  // Opciones para transmisión y combustible (no dependen de otros filtros en este ejemplo)
  const transmissionOptions = useMemo(
    () =>
      options?.transmissions.map((t) => ({ label: t.name, value: t.id })) || [],
    [options?.transmissions]
  );
  const fuelOptions = useMemo(
    () => options?.fuels.map((f) => ({ label: f.name, value: f.id })) || [],
    [options?.fuels]
  );

  // --- Manejador de Cambios ---
  // Resetea los filtros dependientes cuando cambia uno superior
  const handleFilterChange = (
    filterType: keyof FilterSelection,
    value: string | null
  ) => {
    const updates: Partial<FilterSelection> = { [filterType]: value };

    // Resetear filtros dependientes en cascada
    if (filterType === "brandId") {
      updates.familyId = null;
      updates.modelId = null;
      updates.lineId = null;
    } else if (filterType === "familyId") {
      updates.modelId = null;
      updates.lineId = null;
    } else if (filterType === "modelId") {
      updates.lineId = null;
    }
    // Podrías añadir reseteo para transmission/fuel si dependieran de algo

    setSelectedFilters((prev) => ({ ...prev, ...updates }));
  };

  // --- Manejador de Búsqueda ---
  const handleSearch = () => {
    // Construir los parámetros de búsqueda para la URL /store
    const searchParamsToSend = new URLSearchParams();

    // Añadir filtros de vehículo (usando los nombres de param URL originales: brand, model, etc.)
    if (selectedFilters.brandId)
      searchParamsToSend.append("brand", selectedFilters.brandId);
    if (selectedFilters.familyId)
      searchParamsToSend.append("family", selectedFilters.familyId);
    if (selectedFilters.modelId)
      searchParamsToSend.append("model", selectedFilters.modelId);
    if (selectedFilters.lineId)
      searchParamsToSend.append("line", selectedFilters.lineId);
    if (selectedFilters.transmissionId)
      searchParamsToSend.append("transmission", selectedFilters.transmissionId);
    if (selectedFilters.fuelId)
      searchParamsToSend.append("fuel", selectedFilters.fuelId);

    // Añadir término de búsqueda de texto
    if (searchTerm) searchParamsToSend.append("search", searchTerm);

    // Navegar a la página de la tienda con los parámetros
    navigate({
      pathname: "/store", // O la ruta donde se muestran los productos filtrados
      search: searchParamsToSend.toString(),
    });
  };

  // --- Renderizado ---
  return (
    <div className="">
      {/* Imágenes de fondo (sin cambios) */}
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        {/* ... imágenes ... */}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 py-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Título (sin cambios) */}
          <div className="mb-10">
            {/* ... título y barra de colores ... */}
            <h1 className="text-3xl font-bold text-center mb-4">
              Encuentra la pieza que necesitas para tu vehiculo
            </h1>
            <div className="flex h-1">
              {" "}
              <div className="flex-1 bg-[#6D21A7]" />{" "}
              <div className="flex-1 bg-[#EC0382]" />{" "}
              <div className="flex-1 bg-[#FAB21F]" />{" "}
            </div>
          </div>

          {/* Búsqueda general */}
          <Form.Item label="Búsqueda" className="mb-6">
            <Input
              placeholder="Buscar por nombre, código o categoría..." // Placeholder más específico
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch} // Permitir buscar con Enter
              className="rounded-lg"
              size="large"
              allowClear
            />
          </Form.Item>

          {/* Indicador de carga para filtros */}
          {isLoadingOptions && (
            <div className="flex justify-center my-4">
              <Spin tip="Cargando opciones..." />
            </div>
          )}
          {/* Mensaje de error si falla la carga de opciones */}
          {optionsError && (
            <div className="text-center text-red-500 my-4">
              Error al cargar las opciones de filtro. Intenta de nuevo más
              tarde.
            </div>
          )}

          {/* Formulario de filtros (solo si no está cargando y no hay error) */}
          {!isLoadingOptions && !optionsError && options && (
            <Form layout="vertical">
              {/* Marca */}
              <Form.Item label="Marca" required className="font-bold">
                <Select
                  showSearch // Permitir buscar en el dropdown
                  value={selectedFilters.brandId}
                  options={brandOptions}
                  onChange={(value) => handleFilterChange("brandId", value)}
                  placeholder="Selecciona la marca"
                  className="w-full"
                  filterOption={(
                    input,
                    option // Lógica de búsqueda simple
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear // Permitir deseleccionar
                  onClear={() => handleFilterChange("brandId", null)}
                />
              </Form.Item>

              {/* Familia (depende de Marca) */}
              <Form.Item label="Familia" required className="font-bold">
                <Select
                  showSearch
                  value={selectedFilters.familyId}
                  options={familyOptions}
                  onChange={(value) => handleFilterChange("familyId", value)}
                  disabled={
                    !selectedFilters.brandId || familyOptions.length === 0
                  } // Deshabilitar si no hay marca o no hay opciones
                  placeholder={
                    !selectedFilters.brandId
                      ? "Selecciona una marca primero"
                      : "Selecciona la familia"
                  }
                  className="w-full"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  onClear={() => handleFilterChange("familyId", null)}
                />
              </Form.Item>

              {/* Modelo (depende de Familia) */}
              <Form.Item label="Modelo y Año" required className="font-bold">
                <Select
                  showSearch
                  value={selectedFilters.modelId}
                  options={modelOptions}
                  onChange={(value) => handleFilterChange("modelId", value)}
                  disabled={
                    !selectedFilters.familyId || modelOptions.length === 0
                  }
                  placeholder={
                    !selectedFilters.familyId
                      ? "Selecciona una familia primero"
                      : "Selecciona el modelo y año"
                  }
                  className="w-full"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  onClear={() => handleFilterChange("modelId", null)}
                />
              </Form.Item>

              {/* Línea (depende de Modelo) */}
              <Form.Item label="Linea" required className="font-bold">
                <Select
                  showSearch
                  value={selectedFilters.lineId}
                  options={lineOptions}
                  onChange={(value) => handleFilterChange("lineId", value)}
                  disabled={
                    !selectedFilters.modelId || lineOptions.length === 0
                  }
                  placeholder={
                    !selectedFilters.modelId
                      ? "Selecciona un modelo primero"
                      : "Selecciona la línea"
                  }
                  className="w-full"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  onClear={() => handleFilterChange("lineId", null)}
                />
              </Form.Item>

              {/* Caja de velocidades (Transmisión) */}
              <Form.Item
                label="Caja de velocidades"
                required
                className="font-bold"
              >
                <Select
                  showSearch
                  value={selectedFilters.transmissionId}
                  options={transmissionOptions}
                  onChange={(value) =>
                    handleFilterChange("transmissionId", value)
                  }
                  // disabled={!selectedFilters.lineId} // Quitar dependencia si no aplica
                  placeholder="Selecciona la caja"
                  className="w-full"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  onClear={() => handleFilterChange("transmissionId", null)}
                />
              </Form.Item>

              {/* Tipo de combustible */}
              <Form.Item
                label="Tipo de combustible"
                required
                className="font-bold"
              >
                <Select
                  showSearch
                  value={selectedFilters.fuelId}
                  options={fuelOptions}
                  onChange={(value) => handleFilterChange("fuelId", value)}
                  // disabled={!selectedFilters.transmissionId} // Quitar dependencia si no aplica
                  placeholder="Selecciona el combustible"
                  className="w-full"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                  onClear={() => handleFilterChange("fuelId", null)}
                />
              </Form.Item>

              {/* Botón Buscar */}

              <button
                className={`
                w-full px-4 py-2.5 rounded-lg transition-all duration-300
                flex items-center justify-center gap-2 font-medium
                ${`
                      bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)] text-white 
                      hover:from-[rgb(96,36,170)] hover:to-[rgb(171,71,214)]
                      active:scale-95
                    `}
              `}
                onClick={handleSearch}
              >
                Buscar
              </button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterStore;
