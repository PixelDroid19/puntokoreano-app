// services/about.service.ts

import { PublicAboutSettings, PublicConsultant, ApiResponse } from "@/types/about.types";
import { apiGet, ENDPOINTS } from "@/api/apiClient";

// Query Keys para mejor gestión de caché
export const aboutQueryKeys = {
  all: ['about'] as const,
  settings: () => [...aboutQueryKeys.all, 'settings'] as const,
  consultants: () => [...aboutQueryKeys.all, 'consultants'] as const,
  socialMission: () => [...aboutQueryKeys.all, 'socialMission'] as const,
  location: () => [...aboutQueryKeys.all, 'location'] as const,
};

// Servicios optimizados
export const AboutService = {
  // Obtener configuración completa de About
  async getPublicAboutSettings(): Promise<PublicAboutSettings> {
    try {
      const response = await apiGet<ApiResponse<PublicAboutSettings>>(
        ENDPOINTS.SETTINGS.GET_PUBLIC_ABOUT
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch about settings");
      }

      // Procesar consultores para asegurar orden correcto
      const processedSettings = {
        ...response.data,
        consultants: response.data.consultants
          .filter(consultant => consultant.active !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      };

      return processedSettings;
    } catch (error) {
      console.error("Error fetching about settings:", error);
      throw error;
    }
  },

  // Obtener solo consultores activos
  async getActiveConsultants(): Promise<PublicConsultant[]> {
    try {
      const settings = await this.getPublicAboutSettings();
      return settings.consultants
        .filter(consultant => consultant.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error("Error fetching consultants:", error);
      throw error;
    }
  },

  // Validar URL de imagen
  validateImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Procesar consultor con validaciones
  processConsultant(consultant: PublicConsultant): PublicConsultant {
    return {
      ...consultant,
      image: this.validateImageUrl(consultant.image) 
        ? consultant.image 
        : "/placeholder.svg",
      headerImage: consultant.headerImage && this.validateImageUrl(consultant.headerImage)
        ? consultant.headerImage
        : undefined,
    };
  }
};

// Datos de fallback para About
export const fallbackAboutSettings: PublicAboutSettings = {
  consultants: [
    {
      _id: "fallback-1",
      name: "Asesor Comercial",
      position: "Especialista en Repuestos",
      image: "/placeholder.svg",
      phone: "+57 300 000 0000",
      whatsapp: "+57 300 000 0000",
      email: "ventas@puntokoreano.com",
      description: "Especialista en repuestos y accesorios para vehículos Ssangyong-KGM",
      order: 1,
      active: true,
    }
  ],
  socialMission: {
    text: "Somos una empresa dedicada a la comercialización de repuestos y accesorios para vehículos, comprometidos con la calidad y el servicio al cliente.",
    backgroundImage: "https://via.placeholder.com/1920x800/4F46E5/FFFFFF?text=Punto+Koreano"
  },
  location: {
    address: "Dirección no disponible",
    mapUrl: "",
    coordinates: {
      lat: 4.7110,
      lng: -74.0721
    }
  }
};

// Clase singleton mantenida para compatibilidad
class AboutServiceSingleton {
  private static instance: AboutServiceSingleton;

  private constructor() { }

  public static getInstance(): AboutServiceSingleton {
    if (!AboutServiceSingleton.instance) {
      AboutServiceSingleton.instance = new AboutServiceSingleton();
    }
    return AboutServiceSingleton.instance;
  }

  async getPublicAboutSettings(): Promise<PublicAboutSettings> {
    return AboutService.getPublicAboutSettings();
  }
}

export default AboutServiceSingleton.getInstance();
