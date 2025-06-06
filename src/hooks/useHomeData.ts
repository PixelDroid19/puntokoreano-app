import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { 
  HomeService, 
  homeQueryKeys, 
  Achievement, 
  HighlightedService,
  fallbackAchievements,
  fallbackServices 
} from "@/services/home.service";

// Hook para prefetch de datos de home
export const usePrefetchHomeData = () => {
  const queryClient = useQueryClient();

  const prefetchHomeData = async () => {
    try {
      // Prefetch en paralelo para mejor rendimiento
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: homeQueryKeys.achievements(),
          queryFn: HomeService.getAchievements,
          staleTime: 10 * 60 * 1000, // 10 minutos para prefetch
        }),
        queryClient.prefetchQuery({
          queryKey: homeQueryKeys.highlightedServices(),
          queryFn: HomeService.getHighlightedServices,
          staleTime: 10 * 60 * 1000, // 10 minutos para prefetch
        }),
      ]);
      console.log("✅ Datos de inicio prefetcheados exitosamente");
    } catch (error) {
      console.warn("⚠️ Error en prefetch de datos de inicio:", error);
    }
  };

  return { prefetchHomeData };
};

// Hook para obtener achievements con fallback
export const useAchievements = () => {
  return useQuery<Achievement[], AxiosError>({
    queryKey: homeQueryKeys.achievements(),
    queryFn: HomeService.getAchievements,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: fallbackAchievements, // Datos inmediatos mientras carga
    select: (data) => data || fallbackAchievements, // Transformación de datos
  });
};

// Hook para obtener servicios destacados con fallback
export const useHighlightedServices = () => {
  return useQuery<HighlightedService[], AxiosError>({
    queryKey: homeQueryKeys.highlightedServices(),
    queryFn: HomeService.getHighlightedServices,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: fallbackServices, // Datos inmediatos mientras carga
    select: (data) => data || fallbackServices, // Transformación de datos
  });
};

// Hook optimizado que obtiene todos los datos de home
export const useHomeData = () => {
  const {
    data: achievements = fallbackAchievements,
    isLoading: isLoadingAchievements,
    isError: isErrorAchievements,
    error: errorAchievements,
  } = useAchievements();

  const {
    data: highlightedServices = fallbackServices,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: errorServices,
  } = useHighlightedServices();

  // Estado consolidado
  const isLoading = isLoadingAchievements || isLoadingServices;
  const hasError = isErrorAchievements || isErrorServices;
  const error = errorAchievements || errorServices;

  // Datos finales con fallbacks
  const achievementsToRender = isErrorAchievements ? fallbackAchievements : achievements;
  const highlightedServicesToRender = isErrorServices ? fallbackServices : highlightedServices;

  return {
    // Datos
    achievements: achievementsToRender,
    highlightedServices: highlightedServicesToRender,
    
    // Estados
    isLoading,
    hasError,
    error,
    
    // Estados individuales para debugging
    isLoadingAchievements,
    isLoadingServices,
    isErrorAchievements,
    isErrorServices,
  };
};

// Hook para invalidar caché de home
export const useInvalidateHomeData = () => {
  const queryClient = useQueryClient();

  const invalidateHomeData = () => {
    queryClient.invalidateQueries({ queryKey: homeQueryKeys.all });
  };

  const refetchHomeData = () => {
    queryClient.refetchQueries({ queryKey: homeQueryKeys.all });
  };

  return { invalidateHomeData, refetchHomeData };
};

export default useHomeData; 