// hooks/useProductReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ENDPOINTS from "@/api";
import {
  Review,
  ReviewStats,
  ReviewData,
  ReviewVote,
  ReportData,
  ReviewFormData,
} from "@/types/review.types";
import { useAuth } from "@/hooks/useAuth";
import { reviewService } from "@/services/reviewService";

interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    stats: ReviewStats;
  };
}

interface CanReviewResponse {
  success: boolean;
  data: {
    canReview: boolean;
    reason?: string;
  };
}

export const useProductReviews = (productId: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, token } = useAuth();

  // Obtener reseñas y estadísticas
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery<ReviewsResponse>({
    queryKey: ["productReviews", productId],
    queryFn: async () => {
      const [reviews, stats] = await Promise.all([
        axios.get(
          ENDPOINTS.REVIEWS.GET_PRODUCT_REVIEWS.url.replace(
            ":productId",
            productId
          )
        ),
        axios.get(
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
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Verificar si el usuario puede escribir reseña
  const { data: canReviewData } = useQuery<CanReviewResponse>({
    queryKey: ["canReview", productId],
    queryFn: () =>
      axios
        .get(
          ENDPOINTS.REVIEWS.CHECK_CAN_REVIEW.url.replace(
            ":productId",
            productId
          ),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => res.data),
    enabled: !!productId && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Crear reseña
  const createReviewMutation = useMutation({
    mutationFn: (reviewData: ReviewFormData) =>
      reviewService.createReview(productId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(["productReviews", productId]);
      queryClient.invalidateQueries(["canReview", productId]);
    },
  });

  // Votar reseña
  const voteReviewMutation = useMutation({
    mutationFn: ({ reviewId, vote }: ReviewVote) =>
      axios.post(
        ENDPOINTS.REVIEWS.VOTE_REVIEW.url.replace(":reviewId", reviewId),
        {
          vote,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["productReviews", productId]);
    },
  });

  // Reportar reseña
  const reportReviewMutation = useMutation({
    mutationFn: ({ reviewId, reason, details }: ReportData) =>
      axios.post(
        ENDPOINTS.REVIEWS.REPORT_REVIEW.url.replace(":reviewId", reviewId),
        {
          reason,
          details,
        }
      ),
    onSuccess: () => {
      // Opcional: Mostrar notificación de éxito
      queryClient.invalidateQueries(["productReviews", productId]);
    },
  });

  // Eliminar reseña
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) =>
      axios.delete(
        ENDPOINTS.REVIEWS.DELETE_REVIEW.url.replace(":id", reviewId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["productReviews", productId]);
      queryClient.invalidateQueries(["canReview", productId]);
    },
  });

  return {
    // Datos principales
    reviews: reviewsData?.data.reviews || [],
    stats: reviewsData?.data.stats || {
      avgRating: 0,
      totalReviews: 0,
      verifiedPurchases: 0,
      ratingDistribution: [],
    },
    isLoading,
    error,

    // Estado de permisos
    canReview: canReviewData?.data.canReview || false,
    reviewRestrictionReason: canReviewData?.data.reason,

    // Mutaciones
    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isLoading,
    createError: createReviewMutation.error,

    voteReview: voteReviewMutation.mutate,
    isVoting: voteReviewMutation.isLoading,
    voteError: voteReviewMutation.error,

    reportReview: reportReviewMutation.mutate,
    isReporting: reportReviewMutation.isLoading,
    reportError: reportReviewMutation.error,

    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isLoading,
    deleteError: deleteReviewMutation.error,
  };
};
