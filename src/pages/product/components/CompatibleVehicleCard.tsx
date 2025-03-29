import { FC } from "react";
import { Car } from "lucide-react";

interface Model {
  _id: string;
  name: string;
  year: number;
}
interface Line {
  _id: string;
  name: string;
  model_id: Model;
}
interface CompatibleVehicle {
  _id: string;
  line_id: Line;
}

interface CompatibleVehicleCardProps {
  vehicle: CompatibleVehicle;
}

const CompatibleVehicleCard: FC<CompatibleVehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm h-full flex flex-col">
      <div className="space-y-2 flex-grow">
        <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center mb-3">
          <Car className="w-16 h-16 text-gray-400" />
        </div>

        <p className="text-sm text-gray-500 font-medium">
          {vehicle.line_id.name}
        </p>

        <h3 className="font-semibold text-lg leading-tight">
          {vehicle.line_id.model_id.name}
        </h3>

        <p className="text-gray-700 font-medium">
          Año: {vehicle.line_id.model_id.year}
        </p>
      </div>
    </div>
  );
};

export default CompatibleVehicleCard;
