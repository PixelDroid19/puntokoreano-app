import { FC } from "react";
import { Typography, Divider } from "antd";
import { Box, Hammer, Car } from "lucide-react"; // Importamos el icono Car

const { Title, Paragraph, Text } = Typography;

// --- Definiciones de Interfaz (Tipos para los datos) ---
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
  transmission_id: string; // Puedes hacer tipos más específicos si tienes esa info
  fuel_id: string; // Puedes hacer tipos más específicos si tienes esa info
  // Agrega otros campos si los necesitas (color, price, etc.) aunque no se usen aquí
}

// Interfaz para las Props del componente
interface DescriptionProductProps {
  name: string | undefined;
  long_description: string; // Se espera que pueda contener HTML
  short_description: string; // Características separadas (idealmente por \n)
  group?: string;
  subgroup?: string;
  compatibleVehicles?: CompatibleVehicle[]; // Array de vehículos compatibles
}
// --- Fin Definiciones de Interfaz ---

const DescriptionProduct: FC<DescriptionProductProps> = ({
  name,
  long_description,
  short_description,
  group,
  subgroup,
  compatibleVehicles, // Recibimos la prop con los vehículos
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4 bg-white p-6 rounded-xl shadow-sm">
      {/* --- Información Principal del Producto --- */}
      <div className="space-y-4">
        {/* Nombre del Producto */}
        <Title level={2} className="!mb-2">
          {name}
        </Title>
        {/* Categorías (Grupo / Subgrupo) */}
        {(group || subgroup) && (
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            {" "}
            {/* Margen inferior */}
            <Box className="w-4 h-4" />
            <Text>
              {group} {subgroup && `› ${subgroup}`}
            </Text>
          </div>
        )}
        {/* --- Contenido Principal (Descripciones, Aplicaciones, Características) --- */}
        <div className="space-y-6">
          {/* Descripción Detallada */}
          {long_description && ( // Añadido check por si long_description pudiera faltar
            <div>
              <Title level={4} className="flex items-center gap-2 !mb-1">
                <Hammer className="w-5 h-5" />
                Descripción Detallada
              </Title>
              <Divider className="!mt-2 !mb-4" />
              {/* Usamos dangerouslySetInnerHTML para renderizar el HTML de long_description */}
              {/* ¡ADVERTENCIA! Asegúrate de que el HTML proviene de una fuente confiable */}
              <div
                className="text-gray-700 prose prose-sm max-w-none" // Clases de Tailwind Prose para estilos básicos de HTML
                dangerouslySetInnerHTML={{ __html: long_description }}
              />
            </div>
          )}

          {/* Características Principales (basado en short_description) */}
          {short_description && ( // Solo mostrar si hay short_description
            <div className="mt-6">
              <Title level={4} className="!mb-1">
                Características Principales
              </Title>
              <Divider className="!mt-2 !mb-4" />
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                {short_description
                  .split("\n") // Dividir por saltos de línea
                  .map((line) => line.trim()) // Quitar espacios en blanco al inicio/final
                  .filter(Boolean) // Eliminar líneas vacías resultantes
                  .map((feature, index) => (
                    <li key={index}>{feature}</li> // Usar índice como key si no hay ID único por feature
                  ))}
              </ul>
            </div>
          )}
        </div>{" "}
        {/* Fin space-y-6 */}
      </div>{" "}
      {/* Fin space-y-4 */}
    </div> // Fin contenedor principal
  );
};

export default DescriptionProduct;
