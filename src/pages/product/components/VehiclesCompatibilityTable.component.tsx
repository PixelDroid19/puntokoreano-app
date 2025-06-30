import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Empty,
  Spin,
  Pagination,
  Space,
} from "antd";
import {
  SearchOutlined,
  CarOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useVehicleCompatibility } from "@/hooks/useVehicleCompatibility";
import { useDebounce } from "use-debounce";

interface Vehicle {
  _id: string;
  model: {
    _id: string;
    name: string;
    year: number | number[];
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

interface VehiclesCompatibilityTableProps {
  productId: string;
  totalVehicles: number;
}

const VehiclesCompatibilityTable: React.FC<VehiclesCompatibilityTableProps> = ({
  productId,
  totalVehicles,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce del término de búsqueda
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  
  // Hook para obtener vehículos compatibles
  const { vehicles, isLoading, refetch } = useVehicleCompatibility({
    productId,
    enabled: true,
    limit: 100, // Cargar más vehículos para filtrado local
  });

  // Filtrar vehículos localmente si hay término de búsqueda
  const filteredVehicles = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return vehicles;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return vehicles.filter((vehicle) => {
      const brand = vehicle.model?.family?.brand?.name?.toLowerCase() || '';
      const family = vehicle.model?.family?.name?.toLowerCase() || '';
      const transmission = vehicle.transmission_id?.name?.toLowerCase() || '';
      const fuel = vehicle.fuel_id?.name?.toLowerCase() || '';
      const year = vehicle.model?.year?.toString() || '';
      const displayName = vehicle.displayName?.toLowerCase() || '';
      
      return (
        brand.includes(searchLower) ||
        family.includes(searchLower) ||
        transmission.includes(searchLower) ||
        fuel.includes(searchLower) ||
        year.includes(searchLower) ||
        displayName.includes(searchLower)
      );
    });
  }, [vehicles, debouncedSearchTerm]);

  // Paginación manual para los resultados filtrados
  const paginatedVehicles = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredVehicles.slice(startIndex, endIndex);
  }, [filteredVehicles, page, pageSize]);

  // Manejar cambio de página
  const handlePageChange = useCallback((newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  }, [pageSize]);

  // Limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setPage(1);
  }, []);

  // Columnas para la tabla
  const columns = [
    {
      title: "Marca",
      dataIndex: ["model", "family", "brand", "name"],
      key: "brand",
      render: (text: string) => (
        <span className="font-medium text-blue-600">
          {text || "N/A"}
        </span>
      ),
      sorter: false,
    },
    {
      title: "Familia",
      dataIndex: ["model", "family", "name"],
      key: "family",
      render: (text: string) => text || "N/A",
      sorter: false,
    },
    {
      title: "Modelo",
      key: "model",
      render: (_: any, record: any) => {
        const familyName = record.model?.family?.name || "N/A";
        const years = record.model?.year;
        const yearText = Array.isArray(years) && years.length > 0 
          ? ` (${years.join(", ")})` 
          : "";

        return (
          <span>
            {yearText && <span className="text-gray-500 text-sm">{yearText}</span>}
          </span>
        );
      },
    },
    {
      title: "Transmisión",
      dataIndex: ["transmission_id", "name"],
      key: "transmission",
      render: (text: string) => (
        <Tag color="blue">{text || "N/A"}</Tag>
      ),
    },
    {
      title: "Combustible",
      dataIndex: ["fuel_id", "name"],
      key: "fuel",
      render: (text: string) => (
        <Tag color="orange">{text || "N/A"}</Tag>
      ),
    },
  ];

  const isSearchActive = debouncedSearchTerm.trim().length > 0;

  if (totalVehicles === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CarOutlined className="text-4xl text-gray-300" />
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Sin aplicaciones específicas
          </h3>
          <p className="text-gray-500">
            No se especificaron aplicaciones compatibles para este producto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Buscar por marca, modelo, año, transmisión, combustible..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined />}
          suffix={
            searchTerm && (
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                onClick={handleClearSearch}
                disabled={isLoading}
              />
            )
          }
          className="flex-1"
          disabled={isLoading}
          allowClear={false}
        />

        <Button
          onClick={() => refetch()}
          loading={isLoading}
          disabled={isLoading}
        >
          Actualizar
        </Button>
      </div>

      {/* Indicador de búsqueda activa */}
      {isSearchActive && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <SearchOutlined className="text-blue-600" />
            <span className="text-blue-800">
              Búsqueda activa: <strong>"{debouncedSearchTerm}"</strong>
            </span>
            <Tag color="blue">
              {filteredVehicles.length} resultado{filteredVehicles.length !== 1 ? 's' : ''}
            </Tag>
          </div>
          <Button 
            size="small" 
            onClick={handleClearSearch}
            disabled={isLoading}
          >
            Limpiar búsqueda
          </Button>
        </div>
      )}

      {/* Tabla de resultados */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin 
            size="large" 
            tip="Cargando vehículos compatibles..." 
          />
        </div>
      ) : paginatedVehicles.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={paginatedVehicles}
            rowKey={(record) => record._id}
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
            loading={isLoading}
            className="border border-gray-200 rounded-lg"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredVehicles.length)} de {filteredVehicles.length} vehículos
            </div>
            
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredVehicles.length}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} de ${total} vehículos`
              }
              disabled={isLoading}
              pageSizeOptions={['5', '10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" className="text-center">
              <span>
                {isSearchActive 
                  ? `No se encontraron vehículos que coincidan con "${debouncedSearchTerm}"`
                  : "No se encontraron vehículos compatibles con este producto"
                }
              </span>
              {isSearchActive && (
                <Button type="link" onClick={handleClearSearch}>
                  Ver todos los vehículos
                </Button>
              )}
            </Space>
          }
        >
          <div className="flex justify-center">
            <Tag icon={<CarOutlined />} color="blue">
              {isSearchActive 
                ? "Intenta con otros términos de búsqueda"
                : "Este producto no tiene vehículos compatibles"
              }
            </Tag>
          </div>
        </Empty>
      )}
    </div>
  );
};

export default VehiclesCompatibilityTable; 