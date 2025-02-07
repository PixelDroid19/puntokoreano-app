// components/VehiclesBrand.tsx
import { useVehiclesByBrand } from "@/hooks/useBlog";
import { VehicleModel } from "@/types/blog";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const VehiclesBrand = ({ applies = false }: { applies?: boolean }) => {
  const { brand } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useVehiclesByBrand(brand || "");

  const formatModelForUrl = (model: string) => {
    return model.toLowerCase().replace(/ /g, "-");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingOutlined className="text-2xl" />
      </div>
    );
  }

  const brandData = response?.data?.brand;
  const vehicles = response?.data?.models || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!applies && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {brandData?.logo && (
              <img
                src={brandData.logo.url}
                alt={brandData.logo.alt}
                className="h-12 w-auto object-contain"
              />
            )}
            <h2 className="text-2xl font-bold">
              Modelos {brandData?.display_name}
            </h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: VehicleModel, idx) => {
          const modelUrl = formatModelForUrl(vehicle.model);
          return (
            <div
              key={`${vehicle.model}-${idx}`}
              onClick={() => navigate(`/blog/${brand}/${modelUrl}/articles`)}
              className="cursor-pointer hover:shadow-lg transition-shadow p-4 rounded-lg border"
            >
              <div className="space-y-2">
                <img
                  src={vehicle.image.url}
                  alt={vehicle.image.alt}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="font-semibold">{vehicle.engine}</h3>
                <p className="text-lg">{vehicle.model}</p>
                <p className="text-gray-600">
                  {vehicle.year_range.start} - {vehicle.year_range.end}
                </p>
                <p className="text-sm text-gray-500">
                  {vehicle.articleCount} artículo
                  {vehicle.articleCount !== 1 && "s"} • {vehicle.totalViews}{" "}
                  visita{vehicle.totalViews !== 1 && "s"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehiclesBrand;
