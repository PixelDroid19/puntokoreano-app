import { FC } from 'react';
import CompatibleVehicleCard from './CompatibleVehicleCard';

interface CompatibleVehicle { /* ... */ }

interface AppliesProps {
  compatibleVehicles: CompatibleVehicle[];
}

const Applies: FC<AppliesProps> = ({ compatibleVehicles }) => {

  if (!compatibleVehicles || compatibleVehicles.length === 0) {
    return (
      <div className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl xl:px-10 xl:py-6 text-gray-500">
        No se especificaron aplicaciones compatibles para este producto.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-0 py-6 md:px-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 px-4 md:px-0">
            Vehículos Compatibles
        </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {compatibleVehicles.map((vehicle) => (
          <CompatibleVehicleCard
            key={vehicle._id}
            vehicle={vehicle}
          />
        ))}
      </div>
    </div>
  );
};

export default Applies;