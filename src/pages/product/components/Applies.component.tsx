import { FC, useState } from 'react';
import { Button, Tabs, Spin, Empty } from 'antd';
import { Car, Users, ChevronDown } from 'lucide-react';
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
  compatibleVehicles: CompatibleVehicle[];
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

const GroupVehicles: FC<{ productId: string; group: ApplicabilityGroup }> = ({ 
  productId, 
  group 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const { 
    vehicles, 
    isLoading, 
    loadMore, 
    hasMore, 
    pagination 
  } = useVehicleCompatibility({
    productId,
    enabled: expanded,
    type: 'groups',
    groupId: group?._id,
    limit: 12
  });

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-gray-800">{group?.name}</h4>
            <p className="text-sm text-gray-500">
              {group?.estimatedVehicleCount} vehículos estimados
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {group?.description && (
        <p className="text-sm text-gray-600 mt-2">{group?.description}</p>
      )}

      {expanded && (
        <div className="mt-4">
          <VehicleGrid vehicles={vehicles} isLoading={isLoading} />
          
          {hasMore && !isLoading && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={loadMore}
                type="default"
                size="large"
              >
                Cargar más vehículos
                {pagination && ` (${vehicles.length} de ${pagination.total})`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Applies: FC<AppliesProps> = ({ 
  productId,
  compatibleVehicles, 
  applicabilityGroups,
  vehicleCompatibility 
}) => {
  const hasDirectVehicles = compatibleVehicles && compatibleVehicles.length > 0;
  const hasGroups = applicabilityGroups && applicabilityGroups.length > 0;
  const totalVehicles = vehicleCompatibility?.totalVehicles || 0;

  // Cargar vehículos directos completos si no los tenemos
  const { vehicles: directVehicles, isLoading: loadingDirect } = useVehicleCompatibility({
    productId,
    enabled: hasDirectVehicles && compatibleVehicles.length === 0, // Solo si no tenemos los datos
    type: 'direct',
    limit: 50
  });

  const vehiclesToShow = compatibleVehicles.length > 0 ? compatibleVehicles : directVehicles;

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

  const tabItems = [
    ...(hasDirectVehicles ? [{
      key: 'direct',
      label: (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          <span>Vehículos Directos</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {vehicleCompatibility?.directVehicles || 0}
          </span>
        </div>
      ),
      children: (
        <div className="py-4">
          <VehicleGrid vehicles={vehiclesToShow} isLoading={loadingDirect} />
        </div>
      )
    }] : []),
    
    ...(hasGroups ? [{
      key: 'groups',
      label: (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Grupos de Aplicabilidad</span>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
            {applicabilityGroups.length}
          </span>
        </div>
      ),
      children: (
        <div className="py-4">
          {applicabilityGroups.map(group => (
            <GroupVehicles 
              key={group?._id} 
              productId={productId}
              group={group} 
            />
          ))}
        </div>
      )
    }] : [])
  ];

  // Si solo hay un tipo, no mostrar tabs
  if (tabItems.length === 1) {
    return (
      <div className="max-w-7xl mx-auto px-0 py-6 md:px-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Vehículos Compatibles
          </h3>
          <p className="text-gray-600">
            Total: {totalVehicles} vehículos compatibles
          </p>
        </div>
        {tabItems[0].children}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-0 py-6 md:px-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Vehículos Compatibles
        </h3>
        <p className="text-gray-600">
          Total: {totalVehicles} vehículos compatibles en {tabItems.length} categorías
        </p>
      </div>

      <Tabs
        defaultActiveKey={tabItems[0]?.key}
        items={tabItems}
        className="vehicle-compatibility-tabs"
      />
    </div>
  );
};

export default Applies;