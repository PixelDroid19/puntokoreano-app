// hooks/useProductReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ENDPOINTS from "@/api";
import {
  Review,
  ReviewStats,
  ReviewVote,
  ReportData,
  ReviewFormData,
} from "@/types/review.types";
import { useAuth } from "@/hooks/useAuth";
import { reviewService } from "@/services/reviewService";

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ReviewsData {
  reviews: Review[];
  stats: ReviewStats;
}

interface OrderInfo {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
}

interface CanReviewData {
  canReview: boolean;
  hasOrdered: boolean;
  hasReviewed: boolean;
  orderInfo?: OrderInfo;
  reason?: string;
}

export const useProductReviews = (productId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useAuth();

  // Obtener reseñas y estadísticas
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery<ApiResponse<ReviewsData>>({
    queryKey: ["productReviews", productId],
    queryFn: async () => {
      const [reviews, stats] = await Promise.all([
        axios.get<ApiResponse<Review[]>>(
          ENDPOINTS.REVIEWS.GET_PRODUCT_REVIEWS.url.replace(
            ":productId",
            productId
          )
        ),
        axios.get<ApiResponse<ReviewStats>>(
          ENDPOINTS.REVIEWS.GET_REVIEW_STATS.url.replace(
            ":productId",
            productId
          )
        ),
      ]);

      return {
        success: true,
        data: {
          reviews: reviews.data.data,
          stats: stats.data.data,
        },
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  // Verificar si el usuario puede escribir reseña
  const canReviewQuery = useQuery<ApiResponse<CanReviewData>>({
    queryKey: ["canReview", productId],
    queryFn: async () => {
      try {
        // Validar token antes de hacer la petición
        if (!token) {
          return {
            success: false,
            data: {
              canReview: false,
              hasOrdered: false,
              hasReviewed: false,
              reason: "User not authenticated",
            },
          };
        }

        const response = await axios.get<ApiResponse<CanReviewData>>(
          ENDPOINTS.REVIEWS.CHECK_CAN_REVIEW.url.replace(
            ":productId",
            productId
          ),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Validar la respuesta
        if (!response.data || !response.data.success) {
          throw new Error(
            response.data?.message || "Error checking review permission"
          );
        }

        return response.data;
      } catch (error) {
        console.error("Error checking can review status:", error);
        return {
          success: false,
          data: {
            canReview: false,
            hasOrdered: false,
            hasReviewed: false,
            reason:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        };
      }
    },
    enabled: Boolean(productId) && isAuthenticated && Boolean(token),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2, // Intentar 2 veces en caso de fallo
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
  });

  // Extraer los valores con seguridad null
  const canReviewStatus = canReviewQuery.data?.data || {
    canReview: false,
    hasOrdered: false,
    hasReviewed: false,
    orderInfo: undefined,
    reason: canReviewQuery.error ? String(canReviewQuery.error) : undefined,
  };

  // Crear reseña
  const createReviewMutation = useMutation<
    ApiResponse<Review>,
    Error,
    ReviewFormData
  >({
    mutationFn: (reviewData) =>
      reviewService.createReview(productId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["canReview", productId],
      });
    },
  });

  // Votar reseña
  const voteReviewMutation = useMutation<
    ApiResponse<Review>,
    Error,
    ReviewVote
  >({
    mutationFn: ({ reviewId, vote }) =>
      axios.post(
        ENDPOINTS.REVIEWS.VOTE_REVIEW.url.replace(":reviewId", reviewId),
        { vote }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  // Reportar reseña
  const reportReviewMutation = useMutation<
    ApiResponse<void>,
    Error,
    ReportData
  >({
    mutationFn: ({ reviewId, reason, details }) =>
      axios.post(
        ENDPOINTS.REVIEWS.REPORT_REVIEW.url.replace(":reviewId", reviewId),
        { reason, details }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  return {
    reviews: reviewsData?.data.reviews || [],
    stats: reviewsData?.data.stats || {
      avgRating: 0,
      totalReviews: 0,
      verifiedPurchases: 0,
      ratingDistribution: [],
    },
    isLoading,
    error,

    canReview: canReviewStatus.canReview,
    orderInfo: canReviewStatus.orderInfo,
    hasOrdered: canReviewStatus.hasOrdered,
    hasReviewed: canReviewStatus.hasReviewed,
    reviewRestrictionReason: canReviewStatus.reason,
    isCheckingPermission: canReviewQuery.isLoading,
    checkPermissionError: canReviewQuery.error,

    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    createError: createReviewMutation.error,

    voteReview: voteReviewMutation.mutate,
    isVoting: voteReviewMutation.isPending,
    voteError: voteReviewMutation.error,

    reportReview: reportReviewMutation.mutate,
    isReporting: reportReviewMutation.isPending,
    reportError: reportReviewMutation.error,
  };
};
