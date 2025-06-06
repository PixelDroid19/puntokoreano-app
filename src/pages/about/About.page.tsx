// components/About.tsx
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Parallax } from "react-parallax";
import { Spin } from "antd";
import ConsultantCard from "./components/ConsultantCard";
import { usePrefetchAboutData, useAboutData } from "@/hooks/useAboutData";
import "./styles/About.page.css";
import SectionHeader from "./components/SectionHeader";

const About = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const { prefetchAboutData } = usePrefetchAboutData();
  
  // Usar hook optimizado en lugar de estado local
  const {
    settings,
    consultants,
    socialMission,
    location,
    isLoading,
    isError,
    error,
    hasConsultants,
    hasSocialMission,
    hasLocation,
  } = useAboutData();

  // Prefetch de datos al montar el componente
  useEffect(() => {
    const initializeAboutData = async () => {
      try {
        await prefetchAboutData();
      } catch (error) {
        console.warn("Error en la inicialización de datos de About:", error);
      }
    };

    initializeAboutData();
  }, [prefetchAboutData]);

  // Mostrar spinner inicial solo si no hay datos en caché
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Cargando información de la empresa..." />
      </div>
    );
  }

  // Mostrar error solo si es crítico y no hay datos de fallback
  if (isError && !settings) {
    console.error("Error loading about data:", error?.message);
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error al cargar la información de la empresa.</p>
        <p>Por favor, intente recargar la página.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header section with full width gradient background */}
      <div className="w-full bg-gradient-to-r from-secondary_1 via-secondary_2 to-secondary_1">
        <div className="max-w-[1320px] mx-auto px-4">
          <h2 className="text-2xl text-center text-white font-bold py-4 uppercase lg:text-4xl font-glegoo">
            ¿Quienes somos?
          </h2>
        </div>
      </div>

      {/* Mission statement with parallax effect */}
      {hasSocialMission && (
        <div className="relative">
          <Parallax
            bgImage={socialMission.backgroundImage}
            strength={500}
            bgImageStyle={{ objectFit: "cover" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="relative z-20 px-4 py-16 lg:py-24">
              <div className="max-w-[1320px] mx-auto text-center">
                <h1 className="text-3xl text-white font-medium font-glegoo mb-8">
                  Objeto Social
                </h1>
                <p className="text-xl text-white max-w-3xl mx-auto">
                  {socialMission.text}
                </p>
              </div>
            </div>
          </Parallax>
        </div>
      )}

      {/* Consultants section */}
      {hasConsultants && (
        <div className="max-w-[1320px] mx-auto px-4 mt-8">
          <SectionHeader title="Nuestros asesores" />

          {/* Consultant cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {consultants.map((consultant) => (
              <ConsultantCard
                key={consultant._id || consultant.name}
                consultant={consultant}
                isDesktop={isDesktop}
              />
            ))}
          </div>
        </div>
      )}

      {/* Location section */}
      <div className="max-w-[1320px] mx-auto px-4 mb-20">
        <div className="pb-4">
          <SectionHeader title="Donde nos ubicamos" />
        </div>

        <div className="map-container rounded-lg overflow-hidden shadow-lg">
          {hasLocation && location.mapUrl ? (
            <iframe
              src={location.mapUrl}
              className="w-full h-[450px] border-0"
              loading="lazy"
              allowFullScreen
              allow="geolocation"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Punto Koreano"
            />
          ) : (
            <div className="w-full h-[450px] flex items-center justify-center bg-gray-100">
              <p>Ubicación no disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
