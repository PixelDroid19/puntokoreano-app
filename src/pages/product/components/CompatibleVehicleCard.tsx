import { FC } from "react";
import { Car, Fuel, Settings, Badge } from "lucide-react";

interface CompatibleVehicle {
  _id: string;
  model?: {
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

interface CompatibleVehicleCardProps {
  vehicle: CompatibleVehicle;
}

const CompatibleVehicleCard: FC<CompatibleVehicleCardProps> = ({ vehicle }) => {
  
  // Verificar si tenemos información completa del vehículo
  const hasCompleteInfo = vehicle.model && vehicle.model.family;
  
  // Usar displayName si está disponible, sino construir uno
  const getDisplayName = () => {
    if (vehicle.displayName) {
      return vehicle.displayName;
    }
    
    if (hasCompleteInfo) {
      const family = vehicle.model?.family?.name || '';
      const fuel = vehicle.fuel_id?.name || '';
      const year = vehicle.model?.year || '';
      return `${family} ${fuel} ${year}`.trim();
    }
    
    return 'Vehículo Compatible';
  };
  
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3 flex-grow">
        <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-3">
          <Car className="w-12 h-12 text-gray-400" />
        </div>
    
        {hasCompleteInfo ? (
          // Mostrar información completa cuando está disponible
          <>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">
                {vehicle.model?.family?.brand?.name}
              </p>
              <h3 className="font-semibold text-lg leading-tight text-gray-800">
                {getDisplayName()}
              </h3>
              <p className="text-gray-600 font-medium">
                Modelo: {vehicle.model?.name}
              </p>
              {vehicle.model?.year && (
                <p className="text-gray-600 font-medium">
                  Año: {vehicle.model.year}
                </p>
              )}
            </div>
          </>
        ) : (
          // Mostrar información básica cuando no tenemos datos completos
          <>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight text-gray-800">
                {getDisplayName()}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {vehicle._id}
              </p>
            </div>
          </>
        )}

        {/* Información técnica siempre disponible */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {vehicle.transmission_id && (
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                <span className="font-medium">Transmisión:</span> {vehicle.transmission_id.name}
              </span>
            </div>
          )}
          
          {vehicle.fuel_id && (
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                <span className="font-medium">Combustible:</span> {vehicle.fuel_id.name}
              </span>
            </div>
          )}
          
          {vehicle.color && (
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: vehicle.color.toLowerCase() }}
              />
              <span className="text-sm text-gray-600">
                <span className="font-medium">Color:</span> {vehicle.color}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompatibleVehicleCard;
