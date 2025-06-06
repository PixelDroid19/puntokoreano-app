import { useEffect } from "react";
import { Statistic, Spin } from "antd";
import "./styles/Sections.component.css";
import AOS from "aos";
import HighlightedServicesSection from "./highlighted-services";
import { useHomeData } from "@/hooks/useHomeData";

const Sections = () => {
  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      offset: 200,
      duration: 800,
      once: true,
    });
  }, []);

  // Usar el hook optimizado en lugar de consultas individuales
  const {
    achievements,
    highlightedServices,
    isLoading,
    hasError,
    error,
    isErrorAchievements,
    isErrorServices,
  } = useHomeData();

  // Mostrar spinner solo durante la carga inicial
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Cargando..." />
      </div>
    );
  }

  // Logging de errores para debugging
  if (isErrorAchievements && achievements.length === 0) {
    console.error("Error fetching achievements:", error?.message);
  }
  if (isErrorServices && highlightedServices.length === 0) {
    console.error("Error fetching highlighted services:", error?.message);
  }

  // Mostrar error genérico solo si no hay datos de fallback
  const showGenericError =
    hasError && 
    achievements.length === 0 && 
    highlightedServices.length === 0;

  if (showGenericError) {
    const errorMessage = error?.message || "Error al cargar los datos.";
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
        {/* Servicios destacados */}
        {highlightedServices.length > 0 && (
          <HighlightedServicesSection
            highlightedServices={highlightedServices}
          />
        )}

        {/* Logros/Achievements */}
        {achievements.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-12 font-glegoo">
              liderándo el servicio automotriz
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement._id}
                  className="p-4 md:p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-blue-50 text-blue-600 p-1 md:p-2 lg:p-3 rounded-full inline-flex justify-center items-center mb-4 shadow-sm">
                    <img
                      src={achievement.icon_url}
                      alt={achievement.title}
                      className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
                      loading="lazy"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
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

        {/* Sección de autorización */}
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
