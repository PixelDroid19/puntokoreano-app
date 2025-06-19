import { FC, useState, useEffect } from 'react';
import { Button, Spin, Empty } from 'antd';
import { Car } from 'lucide-react';
import CompatibleVehicleCard from './CompatibleVehicleCard';
import { useVehicleCompatibility } from '@/hooks/useVehicleCompatibility';
import './Applies.styles.css';

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

interface ApplicabilityGroup {
  _id: string;
  name: string;
  description?: string;
  category: string;
  estimatedVehicleCount: number;
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

interface AppliesProps {
  productId: string;
  compatibleVehicles: string[]; // Solo IDs, usaremos el endpoint para obtener info completa
  applicabilityGroups: ApplicabilityGroup[];
  vehicleCompatibility?: VehicleCompatibility;
}

const VehicleGrid: FC<{ vehicles: CompatibleVehicle[]; isLoading?: boolean }> = ({ 
  vehicles, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Empty
        description="No se encontraron vehículos compatibles"
        className="py-8"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {vehicles.map((vehicle) => (
        <CompatibleVehicleCard
          key={vehicle._id}
          vehicle={vehicle}
        />
      ))}
    </div>
  );
};

const Applies: FC<AppliesProps> = ({ 
  productId,
  compatibleVehicles, 
  applicabilityGroups,
  vehicleCompatibility 
}) => {
  const [allVehicles, setAllVehicles] = useState<CompatibleVehicle[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);

  const hasDirectVehicles = compatibleVehicles && compatibleVehicles.length > 0;
  const hasGroups = applicabilityGroups && applicabilityGroups.length > 0;
  const totalVehicles = vehicleCompatibility?.totalVehicles || 0;

  // Hook para cargar vehículos directos
  const { 
    vehicles: directVehicles, 
    isLoading: loadingDirect,
    pagination: directPagination 
  } = useVehicleCompatibility({
    productId,
    enabled: hasDirectVehicles,
    type: 'direct',
    limit: 50
  });

  // Hook para cargar todos los vehículos de grupos (sin límite por grupo)
  const { 
    vehicles: groupVehicles, 
    isLoading: loadingGroups,
    loadMore: loadMoreGroups,
    hasMore: hasMoreGroups,
    pagination: groupPagination
  } = useVehicleCompatibility({
    productId,
    enabled: hasGroups,
    type: 'groups',
    limit: 20 // Cargar de a 20 vehículos de grupos
  });

  // Combinar vehículos cuando se cargan
  useEffect(() => {
    const uniqueVehicles = new Map<string, CompatibleVehicle>();
    
    // Agregar vehículos directos
    directVehicles.forEach(vehicle => {
      uniqueVehicles.set(vehicle._id, vehicle);
    });
    
    // Agregar vehículos de grupos (evitando duplicados)
    groupVehicles.forEach(vehicle => {
      uniqueVehicles.set(vehicle._id, vehicle);
    });
    
    setAllVehicles(Array.from(uniqueVehicles.values()));
    setTotalLoaded(uniqueVehicles.size);
  }, [directVehicles, groupVehicles]);

  // Determinar estado de carga
  useEffect(() => {
    setIsLoadingAll(loadingDirect || loadingGroups);
    setCanLoadMore(hasMoreGroups && !loadingGroups);
  }, [loadingDirect, loadingGroups, hasMoreGroups]);

  const handleLoadMore = () => {
    if (canLoadMore) {
      loadMoreGroups();
    }
  };

  if (totalVehicles === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Car className="w-16 h-16 text-gray-300" />
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
    <div className="max-w-7xl mx-auto px-0 py-6 md:px-4">
      <div className="py-4">
        <VehicleGrid vehicles={allVehicles} isLoading={isLoadingAll && allVehicles.length === 0} />
        
        {canLoadMore && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleLoadMore}
              type="default"
              size="large"
              loading={loadingGroups}
            >
              Cargar más vehículos
              {groupPagination && ` (${totalLoaded} de ${totalVehicles})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applies;