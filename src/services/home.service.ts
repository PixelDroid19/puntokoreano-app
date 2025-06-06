import { apiGet, ENDPOINTS } from "@/api/apiClient";

// Interfaces
export interface Achievement {
  icon_url: string;
  value: string;
  title: string;
  active: boolean;
  order: number;
  _id: string;
}

export interface StatData {
  icon?: string;
  value?: string;
}

export interface HighlightedService {
  title: string;
  description: string;
  image: string;
  stats: StatData[];
  _id: string;
  identifier: string;
  active: boolean;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}

// Query Keys para mejor gestión de caché
export const homeQueryKeys = {
  all: ['home'] as const,
  achievements: () => [...homeQueryKeys.all, 'achievements'] as const,
  highlightedServices: () => [...homeQueryKeys.all, 'highlightedServices'] as const,
  homeData: () => [...homeQueryKeys.all, 'homeData'] as const,
};

// Servicios individuales
export const HomeService = {
  // Obtener achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiGet<ApiResponse<Achievement>>(
        ENDPOINTS.SETTINGS.GET_ACHIEVEMENTS
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch achievements");
      }
      return response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  },

  // Obtener servicios destacados
  async getHighlightedServices(): Promise<HighlightedService[]> {
    try {
      const response = await apiGet<ApiResponse<HighlightedService>>(
        ENDPOINTS.SETTINGS.GET_HIGHLIGHTED_SERVICES
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch highlighted services");
      }
      return response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Error fetching highlighted services:", error);
      throw error;
    }
  },

  // Obtener todos los datos de la página de inicio en paralelo
  async getHomeData(): Promise<{
    achievements: Achievement[];
    highlightedServices: HighlightedService[];
  }> {
    try {
      const [achievements, highlightedServices] = await Promise.all([
        this.getAchievements(),
        this.getHighlightedServices(),
      ]);

      return {
        achievements,
        highlightedServices,
      };
    } catch (error) {
      console.error("Error fetching home data:", error);
      throw error;
    }
  },
};

// Datos de fallback
export const fallbackAchievements: Achievement[] = [
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

export const fallbackServices: HighlightedService[] = [
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

export default HomeService; 