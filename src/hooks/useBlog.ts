// src/hooks/useBlog.ts
import ENDPOINTS from "@/api";
import { BlogResponse, VehicleBrandResponse } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Brand {
  name: string;
  image: string;
  marco: string;
  stats: {
    articleCount: number;
    totalViews: number;
    latestArticle: string;
  };
}

interface ArticleDetail {
  title: string;
  content: string;
  author: string;
  date: Date;
  featured_image: {
    url: string;
    alt: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: string;
  };
  maintenance_type: string;
  difficulty_level: string;
  estimated_time: {
    value: number;
    unit: "minutes" | "hours";
  };
  views: number;
}

// Hook para obtener las marcas
export const useBrands = () => {
  return useQuery<{ data: Brand[] }>({
    queryKey: ["brands"],
    queryFn: () =>
      axios.get(ENDPOINTS.BLOG.GET_BRANDS.url).then((res) => res.data),
  });
};

// Hook para obtener los vehículos de una marca
export const useVehiclesByBrand = (brand: string) => {
  return useQuery<{ success: boolean; data: VehicleBrandResponse }>({
    queryKey: ["vehicles", brand],
    queryFn: () =>
      axios
        .get(ENDPOINTS.BLOG.GET_VEHICLES_BY_BRAND.url.replace(":brand", brand))
        .then((res) => res.data),
    enabled: !!brand,
  });
};

// Hook para obtener artículos de un vehículo específico
export const useArticlesByVehicle = (
  brand: string,
  modelId: string, // Changed from model to modelId
  page: number = 1,
  maintenanceType: string = "all"
) => {
  // Extract model number from modelId (e.g., "2.9" from URL)
  const model = modelId?.replace(/-/g, " ");

  return useQuery<BlogResponse>({
    queryKey: ["articles", brand, model, page, maintenanceType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        ...(maintenanceType !== "all" && { maintenance_type: maintenanceType }),
      });

      const url = `${ENDPOINTS.BLOG.GET_ARTICLES_BY_VEHICLE.url}`
        .replace(":brand", encodeURIComponent(brand))
        .replace(":model", encodeURIComponent(model));

      try {
        const response = await axios.get(`${url}?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles");
      }
    },
    enabled: Boolean(brand && model),
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook para obtener el detalle de un artículo
export const useArticleDetail = (slug: string) => {
  return useQuery<{ success: boolean; data: ArticleDetail }>({
    queryKey: ["article", slug],
    queryFn: () =>
      axios
        .get(ENDPOINTS.BLOG.GET_ARTICLE_DETAIL.url.replace(":slug", slug))
        .then((res) => res.data),
    enabled: !!slug,
  });
};
