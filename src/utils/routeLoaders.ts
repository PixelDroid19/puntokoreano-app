import { QueryClient } from "@tanstack/react-query";
import { HomeService, homeQueryKeys } from "@/services/home.service";
import { AboutService, aboutQueryKeys } from "@/services/about.service";

// Loader para la página de inicio
export const homeLoader = (queryClient: QueryClient) => async () => {
  try {
    // Verificar si ya tenemos datos frescos en caché
    const achievementsCache = queryClient.getQueryData(homeQueryKeys.achievements());
    const servicesCache = queryClient.getQueryData(homeQueryKeys.highlightedServices());

    // Solo prefetch si no hay datos o están obsoletos
    const promises: Promise<any>[] = [];

    if (!achievementsCache) {
      promises.push(
        queryClient.prefetchQuery({
          queryKey: homeQueryKeys.achievements(),
          queryFn: HomeService.getAchievements,
          staleTime: 10 * 60 * 1000,
        })
      );
    }

    if (!servicesCache) {
      promises.push(
        queryClient.prefetchQuery({
          queryKey: homeQueryKeys.highlightedServices(),
          queryFn: HomeService.getHighlightedServices,
          staleTime: 10 * 60 * 1000,
        })
      );
    }

    // Ejecutar prefetch solo para datos que no están en caché
    if (promises.length > 0) {
      await Promise.all(promises);
      console.log("🚀 Datos de inicio prefetcheados via router loader");
    } else {
      console.log("⚡ Datos de inicio ya disponibles en caché");
    }

    return null; // Los loaders deben retornar algo
  } catch (error) {
    console.warn("⚠️ Error en route loader de inicio:", error);
    return null; // No fallar la navegación por errores de prefetch
  }
};

// Loader para la página About
export const aboutLoader = (queryClient: QueryClient) => async () => {
  try {
    // Verificar si ya tenemos datos frescos en caché
    const aboutSettingsCache = queryClient.getQueryData(aboutQueryKeys.settings());

    // Solo prefetch si no hay datos o están obsoletos
    if (!aboutSettingsCache) {
      await queryClient.prefetchQuery({
        queryKey: aboutQueryKeys.settings(),
        queryFn: AboutService.getPublicAboutSettings,
        staleTime: 10 * 60 * 1000,
      });
      console.log("🚀 Datos de About prefetcheados via router loader");
    } else {
      console.log("⚡ Datos de About ya disponibles en caché");
    }

    return null;
  } catch (error) {
    console.warn("⚠️ Error en route loader de About:", error);
    return null; // No fallar la navegación por errores de prefetch
  }
};

// Loader genérico para limpiar caché obsoleto
export const cacheCleanupLoader = (queryClient: QueryClient) => async () => {
  try {
    // Limpiar queries obsoletas para mantener memoria optimizada
    queryClient.getQueryCache().clear();
    console.log("🧹 Caché limpiado");
    return null;
  } catch (error) {
    console.warn("Error en limpieza de caché:", error);
    return null;
  }
};

export default {
  homeLoader,
  aboutLoader,
  cacheCleanupLoader,
}; 