import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Statistic, Spin } from "antd";
import { AxiosError } from "axios";
import { apiGet, ENDPOINTS } from "@/api/apiClient";
import "./styles/Sections.component.css";
import AOS from "aos";
import HighlightedServicesSection from "./highlighted-services";

interface Achievement {
  icon_url: string;
  value: string;
  title: string;
  active: boolean;
  order: number;
  _id: string;
}

interface StatData {
  icon?: string;
  value?: string;
}

interface HighlightedService {
  title: string;
  description: string;
  image: string;
  stats: StatData[];
  _id: string;
  identifier: string;
  active: boolean;
  order: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}

const fallbackAchievements: Achievement[] = [
  {
    _id: "1",
    value: "20+",
    title: "Años de Experiencia",
    icon_url: "/icons/experience.png",
    active: true,
    order: 1,
  },
  {
    _id: "2",
    value: "10k+",
    title: "Clientes Satisfechos",
    icon_url: "/icons/clients.png",
    active: true,
    order: 2,
  },
  {
    _id: "3",
    value: "5k+",
    title: "Repuestos Disponibles",
    icon_url: "/icons/parts.png",
    active: true,
    order: 3,
  },
  {
    _id: "4",
    value: "100%",
    title: "Garantía de Calidad",
    icon_url: "/icons/quality.png",
    active: true,
    order: 4,
  },
].sort((a, b) => a.order - b.order);

const fallbackServices: HighlightedService[] = [
  {
    _id: "fb1",
    identifier: "service-1741337764259",
    title: "Descuentos de temporada",
    description:
      "Conoce algunos de los descuentos que tenemos en repuestos para tu vehículo.",
    image: "https://via.placeholder.com/400x200/E2060F/FFFFFF?text=Descuentos",
    stats: [],
    active: true,
    order: 0,
  },
  {
    _id: "fb2",
    identifier: "service-1741337935851",
    title: "Comunidad PUNTO KOREANO",
    description:
      "Regístrate y sé parte de la familia PUNTO KOREANO. Recibe información exclusiva sobre descuentos y participa en nuestros eventos",
    image: "https://via.placeholder.com/400x200/6D21A7/FFFFFF?text=Comunidad",
    stats: [],
    active: true,
    order: 1,
  },
  {
    _id: "fb3",
    identifier: "service-1741338000661",
    title: "Políticas, Términos y Condiciones",
    description:
      "En este espacio encontrarás toda la información legal que regula nuestras ventas, garantías y el tratamiento de datos.",
    image: "https://via.placeholder.com/400x200/FAB21F/000000?text=Politicas",
    stats: [],
    active: true,
    order: 2,
  },
].sort((a, b) => a.order - b.order);

const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await apiGet<ApiResponse<Achievement>>(
      ENDPOINTS.SETTINGS.GET_ACHIEVEMENTS
    );
    if (!response.success) {
      console.warn("Fallo al cargar logros:", response.message);
      throw new Error(response.message || "Failed to fetch achievements");
    }
    return response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};

const fetchHighlightedServices = async (): Promise<HighlightedService[]> => {
  try {
    const response = await apiGet<ApiResponse<HighlightedService>>(
      ENDPOINTS.SETTINGS.GET_HIGHLIGHTED_SERVICES
    );
    if (!response.success) {
      console.warn(
        "Fallo al cargar servicios destacados:",
        response.message
      );
      throw new Error(
        response.message || "Failed to fetch highlighted services"
      );
    }
    return response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching highlighted services:", error);
    throw error;
  }
};

const Sections = () => {
  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      offset: 200,
      duration: 800,
      once: true,
    });
  }, []);

  const {
    data: achievements,
    isLoading: isLoadingAchievements,
    isError: isErrorAchievements,
    error: errorAchievements,
  } = useQuery<Achievement[], AxiosError>({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  const {
    data: highlightedServices,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: errorServices,
  } = useQuery<HighlightedService[], AxiosError>({
    queryKey: ["highlightedServices"],
    queryFn: fetchHighlightedServices,
  });

  const achievementsToRender = isErrorAchievements
    ? fallbackAchievements
    : achievements ?? [];
  const highlightedServicesToRender = isErrorServices
    ? fallbackServices
    : highlightedServices ?? [];

  const isLoading = isLoadingAchievements || isLoadingServices;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Cargando..." />
      </div>
    );
  }

  if (isErrorAchievements && achievementsToRender.length === 0) {
    console.error("Error fetching achievements:", errorAchievements?.message);
  }
  if (isErrorServices && highlightedServicesToRender.length === 0) {
    console.error(
      "Error fetching highlighted services:",
      errorServices?.message
    );
  }

  const showGenericError =
    (isErrorAchievements || isErrorServices) &&
    achievementsToRender.length === 0 &&
    highlightedServicesToRender.length === 0;

  if (showGenericError) {
    const errorMessage =
      errorAchievements?.message ||
      errorServices?.message ||
      "Error al cargar los datos.";
    return (
      <div className="text-center text-red-500 py-10">
        <p>{errorMessage}</p>
        <p>Mostrando contenido de ejemplo si es posible, o intente recargar.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {highlightedServicesToRender.length > 0 && (
          <HighlightedServicesSection
            highlightedServices={highlightedServicesToRender}
          />
        )}

        {achievementsToRender.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12 font-glegoo">
              liderándo el servicio automotriz
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {achievementsToRender.map((achievement, index) => (
                <div
                  key={achievement._id}
                  className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-full inline-flex justify-center items-center mb-4">
                    <img
                      src={achievement.icon_url}
                      alt={achievement.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <Statistic
                    value={achievement.value}
                    title={achievement.title}
                    className="font-glegoo"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mt-20 relative overflow-hidden rounded-2xl"
          data-aos="fade-up"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(67,18,136)] to-[rgb(144,45,193)]"></div>
          <div className="relative py-8 md:py-10 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between text-white gap-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-glegoo">
                AUTORIZACIÓN Y RESPALDO
              </h3>
              <p className="text-lg lg:text-xl max-w-2xl mx-auto md:mx-0">
                Somos distribuidores autorizados de la marca Ssangyong-KGM y
                contamos con el conocimiento técnico que garantiza un
                diagnostico de calidad.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href="https://www.kgm.com.co/almacenes-de-repuestosconcesionarios-centros-de-servicios/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver distribuidores autorizados KGM"
              >
                <img
                  src="https://puntokoreano.com/images/mark_water.jpeg"
                  alt="Distribuidores Autorizados KGM Ssangyong"
                  className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover rounded-full shadow-lg hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
