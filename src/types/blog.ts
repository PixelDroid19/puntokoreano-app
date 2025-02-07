export interface Vehicle {
  brand: string;
  model: string;
  year: string;
}

export interface BlogArticle {
  title: string;
  slug: string;
  image: string;
  author: string;
  description: string;
  date: string;
  maintenance_type?: string;
  views?: number;
  vehicle: Vehicle;
}

export interface BlogResponse {
  success: boolean;
  data: {
    articles: Array<{
      title: string;
      slug: string;
      image: string;
      description: string;
      date: string;
      maintenance_type: string;
      views: number;
      vehicle: {
        brand: string;
        model: string;
        year: string;
      };
    }>;
    pagination: {
      total: number;
      pages: number;
      page: number;
      limit: number;
    };
    filters: {
      maintenance_types: string[];
      current_maintenance_type: string;
    };
  };
}

export interface VehicleBrandResponse {
  brand: {
    id: string;
    name: string;
    display_name: string;
    logo: {
      url: string;
      alt: string;
    };
    image: {
      url: string;
      alt: string;
    };
  };
  models: VehicleModel[];
}

export interface VehicleModel {
  model: string;
  engine: string;
  year_range: {
    start: number;
    end: number;
  };
  articleCount: number;
  totalViews: number;
  image: {
    url: string;
    alt: string;
  };
}

export interface VehicleResponse {
  brand: string;
  name: string;
  engine: string;
  year: string;
  image: string;
  articleCount: number;
  totalViews: number;
}

export interface ArticleResponse {
  title: string;
  slug: string;
  image: string;
  description: string;
  date: string;
  maintenance_type: string;
  views: number;
  vehicle: {
    brand: string;
    model: string;
    year: string;
  };
  author: string;
}
