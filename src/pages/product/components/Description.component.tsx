import { FC } from "react";
import { Typography, Divider } from "antd";
import { Box, Hammer, Car } from "lucide-react";
import VehiclesCompatibilityTable from "./VehiclesCompatibilityTable.component";

const { Title, Text } = Typography;

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

interface DescriptionProductProps {
  name: string | undefined;
  long_description: string;
  group?: string;
  subgroup?: string;
  productId?: string;
  vehicleCompatibility?: VehicleCompatibility;
}

const DescriptionProduct: FC<DescriptionProductProps> = ({
  name,
  long_description,
  group,
  subgroup,
  productId,
  vehicleCompatibility,
}) => {
  const totalVehicles = vehicleCompatibility?.totalVehicles || 0;
  const hasCompatibleVehicles = totalVehicles > 0;

  return (
    <div className="flex flex-col gap-4 mb-4 bg-white p-6 rounded-xl shadow-sm">
      <div className="space-y-4">
        <Title level={2} className="!mb-2">
          {name}
        </Title>
        {(group || subgroup) && (
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Box className="w-4 h-4" />
            <Text>
              {group} {subgroup && `› ${subgroup}`}
            </Text>
          </div>
        )}
        <div className="space-y-6">
          {long_description && (
            <div>
              <Title level={4} className="flex items-center gap-2 !mb-1">
                <Hammer className="w-5 h-5" />
                Descripción Detallada
              </Title>
              <Divider className="!mt-2 !mb-4" />
              <div
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: long_description }}
              />
            </div>
          )}

          {/* Aplicaciones Compatibles */}
          {hasCompatibleVehicles && productId && (
            <div className="mt-6">
              <Title level={4} className="flex items-center gap-2 !mb-1">
                <Car className="w-5 h-5" />
                Aplicaciones Compatibles
                <span className="text-sm text-gray-500 font-normal">
                  ({totalVehicles} vehículos)
                </span>
              </Title>
              <Divider className="!mt-2 !mb-4" />
              <VehiclesCompatibilityTable 
                productId={productId}
                totalVehicles={totalVehicles}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionProduct;
