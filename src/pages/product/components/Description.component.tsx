import { FC } from "react";
import { Typography, Divider } from "antd";
import { Box, Hammer } from "lucide-react";

const { Title, Text } = Typography;

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
}

interface DescriptionProductProps {
  name: string | undefined;
  long_description: string;
  short_description: string;
  group?: string;
  subgroup?: string;
  compatibleVehicles?: CompatibleVehicle[];
}

const DescriptionProduct: FC<DescriptionProductProps> = ({
  name,
  long_description,
  short_description,
  group,
  subgroup,
}) => {
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

          {short_description && (
            <div className="mt-6">
              <Title level={4} className="!mb-1">
                Características Principales
              </Title>
              <Divider className="!mt-2 !mb-4" />
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                {short_description
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionProduct;
