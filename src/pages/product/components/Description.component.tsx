import { FC } from "react";
import { Typography, Divider } from "antd";
import { Box, Hammer } from "lucide-react"; // Adding icons for better visual hierarchy

const { Title, Paragraph, Text } = Typography;

interface DescriptionProduct {
  name: string | undefined;
  long_description: string;
  short_description: string;
  group?: string;
  subgroup?: string;
}

const DescriptionProduct: FC<DescriptionProduct> = ({
  name,
  long_description,
  short_description,
  group,
  subgroup,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4 bg-white p-6 rounded-xl shadow-sm">
      {/* Main Product Information */}
      <div className="space-y-4">
        <Title level={2} className="!mb-2">
          {name}
        </Title>

        {/* Product Categories */}
        {(group || subgroup) && (
          <div className="flex items-center gap-2 text-gray-600">
            <Box className="w-4 h-4" />
            <Text>
              {group} {subgroup && `› ${subgroup}`}
            </Text>
          </div>
        )}

        {/* Descriptions */}
        <div className="space-y-6">
          {/* Short Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Text strong className="block mb-2">
              Resumen
            </Text>
            <Paragraph className="!mb-0 text-gray-600">
              {short_description}
            </Paragraph>
          </div>

          {/* Long Description */}
          <div>
            <Title level={4} className="flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              Descripción Detallada
            </Title>
            <Divider className="!mt-2 !mb-4" />
            <Paragraph className="text-gray-700 whitespace-pre-line">
              {long_description}
            </Paragraph>
          </div>
        </div>

        {/* Features Section - if we want to add structured features later */}
        <div className="mt-6">
          <Title level={4}>Características Principales</Title>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            {short_description
              .split(".")
              .filter(Boolean)
              .map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
          </ul>
        </div>
      </div>

      {/* Product Images Section - only if additional detail images are provided */}
      <div className="mt-8 space-y-6">
        <Divider className="!mt-8">Imágenes Detalladas</Divider>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* We could map through detail images here if provided by the API */}
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Detalle del producto"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Detalle del producto"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionProduct;
