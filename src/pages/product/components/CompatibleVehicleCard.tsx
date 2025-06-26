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
  
  // Función para truncar texto con tooltip
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="vehicle-card p-2 w-full sm:w-[300px] md:w-[320px] lg:w-[280px] xl:w-[300px]">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative min-w-0">
        
        {/* Color Bar - Igual que CardProducts */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#E8832F]" />
          <div className="flex-1 bg-[#302582]" />
          <div className="flex-1 bg-[#9C089F]" />
        </div>

        {/* Content Area - Mismo padding y estructura que CardProducts */}
        <div className="p-4 flex flex-col flex-grow min-w-0">
          
          {hasCompleteInfo ? (
            // Mostrar información completa cuando está disponible
            <>
              <div className="space-y-2 min-w-0 mb-4">
                <p 
                  className="text-sm text-gray-500 font-medium text-truncate-ellipsis"
                  title={vehicle.model?.family?.brand?.name}
                >
                  {vehicle.model?.family?.brand?.name}
                </p>
                <h3 
                  className="font-bold text-lg line-clamp-2 min-h-[30px] text-gray-800"
                  title={getDisplayName()}
                >
                  {getDisplayName()}
                </h3>
                <p 
                  className="text-gray-600 text-sm font-medium text-truncate-ellipsis"
                  title={`Modelo: ${vehicle.model?.name}`}
                >
                  Modelo: {vehicle.model?.name}
                </p>
                {vehicle.model?.year && (
                  <p className="text-gray-600 text-sm font-medium">
                    Año: {vehicle.model.year}
                  </p>
                )}
              </div>
            </>
          ) : (
            // Mostrar información básica cuando no tenemos datos completos
            <>
              <div className="space-y-2 min-w-0 mb-4">
                <h3 
                  className="font-bold text-lg line-clamp-2 min-h-[30px] text-gray-800"
                  title={getDisplayName()}
                >
                  {getDisplayName()}
                </h3>
                <p 
                  className="text-sm text-gray-500 text-truncate-ellipsis"
                  title={`ID: ${vehicle._id}`}
                >
                  ID: {truncateText(vehicle._id, 20)}
                </p>
              </div>
            </>
          )}

          {/* Información técnica - Grid de 2 columnas como CardProducts */}
          <div className="grid grid-cols-1 gap-3 mt-auto pt-4 border-t border-gray-100 min-w-0">
            {vehicle.transmission_id && (
              <div className="flex items-center gap-2 min-w-0">
                <Settings className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-gray-500">Transmisión</span>
                  <p 
                    className="text-sm font-medium text-gray-800 text-truncate-ellipsis"
                    title={vehicle.transmission_id.name}
                  >
                    {vehicle.transmission_id.name}
                  </p>
                </div>
              </div>
            )}
            
            {vehicle.fuel_id && (
              <div className="flex items-center gap-2 min-w-0">
                <Fuel className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-gray-500">Combustible</span>
                  <p 
                    className="text-sm font-medium text-gray-800 text-truncate-ellipsis"
                    title={vehicle.fuel_id.name}
                  >
                    {vehicle.fuel_id.name}
                  </p>
                </div>
              </div>
            )}
            
            {vehicle.color && (
              <div className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: vehicle.color.toLowerCase() }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-gray-500">Color</span>
                  <p 
                    className="text-sm font-medium text-gray-800 text-truncate-ellipsis"
                    title={vehicle.color}
                  >
                    {vehicle.color}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibleVehicleCard;
