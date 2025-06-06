import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { 
  AboutService, 
  aboutQueryKeys, 
  fallbackAboutSettings 
} from "@/services/about.service";
import { PublicAboutSettings, PublicConsultant } from "@/types/about.types";

// Hook para prefetch de datos de About
export const usePrefetchAboutData = () => {
  const queryClient = useQueryClient();

  const prefetchAboutData = async () => {
    try {
      // Prefetch de datos de About
      await queryClient.prefetchQuery({
        queryKey: aboutQueryKeys.settings(),
        queryFn: AboutService.getPublicAboutSettings,
        staleTime: 10 * 60 * 1000, // 10 minutos para prefetch
      });
      
      console.log("✅ Datos de About prefetcheados exitosamente");
    } catch (error) {
      console.warn("⚠️ Error en prefetch de datos de About:", error);
    }
  };

  return { prefetchAboutData };
};

// Hook principal para obtener configuración de About
export const useAboutSettings = () => {
  return useQuery<PublicAboutSettings, AxiosError>({
    queryKey: aboutQueryKeys.settings(),
    queryFn: AboutService.getPublicAboutSettings,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: fallbackAboutSettings, // Datos inmediatos mientras carga
    select: (data) => data || fallbackAboutSettings, // Transformación de datos
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook específico para consultores activos
export const useActiveConsultants = () => {
  return useQuery<PublicConsultant[], AxiosError>({
    queryKey: aboutQueryKeys.consultants(),
    queryFn: AboutService.getActiveConsultants,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: fallbackAboutSettings.consultants,
    select: (data) => data || fallbackAboutSettings.consultants,
    retry: 3,
  });
};

// Hook consolidado que obtiene todos los datos de About
export const useAboutData = () => {
  const {
    data: settings = fallbackAboutSettings,
    isLoading,
    isError,
    error,
  } = useAboutSettings();

  // Procesar consultores para asegurar orden y validaciones
  const processedConsultants = settings.consultants
    .filter(consultant => consultant.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(consultant => AboutService.processConsultant(consultant));

  // Datos procesados
  const processedSettings = {
    ...settings,
    consultants: processedConsultants,
  };

  return {
    // Datos principales
    settings: processedSettings,
    consultants: processedConsultants,
    socialMission: settings.socialMission,
    location: settings.location,
    
    // Estados
    isLoading,
    isError,
    error,
    
    // Datos específicos para debugging
    hasConsultants: processedConsultants.length > 0,
    hasSocialMission: Boolean(settings.socialMission?.text),
    hasLocation: Boolean(settings.location?.mapUrl),
  };
};

// Hook para invalidar caché de About
export const useInvalidateAboutData = () => {
  const queryClient = useQueryClient();

  const invalidateAboutData = () => {
    queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all });
  };

  const refetchAboutData = () => {
    queryClient.refetchQueries({ queryKey: aboutQueryKeys.all });
  };

  return { invalidateAboutData, refetchAboutData };
};

export default useAboutData; 