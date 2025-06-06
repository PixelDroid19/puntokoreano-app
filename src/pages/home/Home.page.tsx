import { useEffect } from "react";
import { Spin } from "antd";
import HomeCarousel from "./components/HomeCarousel.component";
import Services from "./components/Services.component";
import Sections from "./components/Sections.component";
import Banner from "./components/Banner.component";
import { usePrefetchHomeData, useHomeData } from "@/hooks/useHomeData";

export const Home = () => {
  const { prefetchHomeData } = usePrefetchHomeData();
  const { isLoading: isInitialLoading } = useHomeData();

  // Prefetch de datos al montar el componente
  useEffect(() => {
    const initializeHomeData = async () => {
      try {
        await prefetchHomeData();
      } catch (error) {
        console.warn("Error en la inicialización de datos de inicio:", error);
      }
    };

    initializeHomeData();
  }, [prefetchHomeData]);

  // Mostrar spinner inicial solo si no hay datos en caché
  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Cargando página de inicio..." />
      </div>
    );
  }

  return (
    <div>
      <HomeCarousel />
      <Banner />
      <Services />
      <Sections />
    </div>
  );
};

export default Home;
