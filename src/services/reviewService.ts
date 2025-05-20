// services/reviewService.ts
import { apiGet, apiPost, ENDPOINTS } from "@/api/apiClient";
import {
  Review,
  ReviewStats,
  ReviewFormData,
  ReportData
} from "../types/review.types";


interface CanReviewData {
  canReview: boolean;
  hasOrdered: boolean;
  hasReviewed: boolean;
  orderInfo?: {
    orderId: string;
    orderNumber: string;
    orderStatus: string;
  };
  reason?: string;
}


interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ReviewsData {
  reviews: Review[];
  stats: ReviewStats;
}

class ReviewService {
  private readonly endpoints = ENDPOINTS.REVIEWS;

  /**
   * Obtiene las reseñas de un producto
   */
  async getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
    return await apiGet(
      this.endpoints.GET_PRODUCT_REVIEWS,
      { productId }
    );
  }

  /**
   * Obtiene las estadísticas de reseñas de un producto
   */
  async getReviewStats(productId: string): Promise<ApiResponse<ReviewStats>> {
    return await apiGet(
      this.endpoints.GET_REVIEW_STATS,
      { productId }
    );
  }

  /**
   * Verifica si un usuario puede reseñar un producto
   */
  async canUserReview(productId: string): Promise<ApiResponse<CanReviewData>> {
    return await apiGet(
      this.endpoints.CHECK_CAN_REVIEW,
      { productId }
    );
  }

  /**
   * Obtiene reseñas y estadísticas de un producto en una sola llamada
   */
  async getProductReviewsData(productId: string): Promise<ApiResponse<ReviewsData>> {
    try {
      // Realizar ambas peticiones en paralelo
      const [reviews, stats] = await Promise.all([
        this.getProductReviews(productId),
        this.getReviewStats(productId)
      ]);

      // Combinar los resultados
      return {
        success: true,
        data: {
          reviews: reviews.data,
          stats: stats.data,
        },
      };
    } catch (error) {
      console.error("Error fetching product review data:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva reseña para un producto
   */
  async createReview(productId: string, reviewData: ReviewFormData): Promise<ApiResponse<Review>> {
    try {
      return await apiPost(
        this.endpoints.CREATE_REVIEW,
        reviewData,
        { productId }
      );
    } catch (error: any) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  /**
   * Vota por una reseña (positivo o negativo)
   */
  async voteReview(reviewId: string, vote: "up" | "down"): Promise<ApiResponse<Review>> {
    return await apiPost(
      this.endpoints.VOTE_REVIEW,
      { vote },
      { reviewId }
    );
  }

  /**
   * Reporta una reseña inapropiada
   */
  async reportReview(reviewId: string, reportData: ReportData): Promise<ApiResponse<void>> {
    return await apiPost(
      this.endpoints.REPORT_REVIEW,
      reportData,
      { reviewId }
    );
  }
}

export const reviewService = new ReviewService();
