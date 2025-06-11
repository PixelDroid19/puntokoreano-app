// hooks/useProductReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Review,
  ReviewStats,
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

  // Debug logging
  console.log("useProductReviews initialized:", {
    productId,
    isAuthenticated,
    hasToken: !!token,
  });

  // Obtener reseñas y estadísticas usando el servicio
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery<ApiResponse<ReviewsData>>({
    queryKey: ["productReviews", productId],
    queryFn: async () => {
      console.log("Fetching reviews for product:", productId);
      return await reviewService.getProductReviewsData(productId);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });

  // Verificar si el usuario puede escribir reseña
  const canReviewQuery = useQuery<ApiResponse<CanReviewData>>({
    queryKey: ["canReview", productId],
    queryFn: async () => {
      try {
        console.log("Checking can review for:", { productId, isAuthenticated, hasToken: !!token });

        if (!token) {
          console.log("No token available, returning cannot review");
          return {
            success: true,
            data: {
              canReview: false,
              hasOrdered: false,
              hasReviewed: false,
              reason: "User not authenticated",
            },
          };
        }

        console.log("Making API call to check review eligibility");
        const result = await reviewService.canUserReview(productId);
        console.log("API response for canUserReview:", result);
        return result;
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
    enabled: Boolean(productId && isAuthenticated),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount} for canReview query:`, error);
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  // Debug logging para la respuesta de canReviewQuery
  console.log("canReviewQuery state:", {
    isLoading: canReviewQuery.isLoading,
    error: canReviewQuery.error?.message,
    data: canReviewQuery.data,
    isEnabled: Boolean(productId && isAuthenticated),
  });

  // Extraer los valores con seguridad null
  const canReviewStatus = canReviewQuery.data?.data || {
    canReview: false,
    hasOrdered: false,
    hasReviewed: false,
    orderInfo: undefined,
    reason: canReviewQuery.error ? String(canReviewQuery.error) : undefined,
  };

  // Crear reseña usando el servicio
  const createReviewMutation = useMutation<
    ApiResponse<Review>,
    Error,
    ReviewFormData
  >({
    mutationFn: (reviewData) => {
      console.log("Creating review with data:", reviewData);
      return reviewService.createReview(productId, reviewData);
    },
    onSuccess: (data) => {
      console.log("Review created successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["canReview", productId],
      });
    },
    onError: (error) => {
      console.error("Error creating review:", error);
    },
  });

  // Votar reseña usando el servicio
  const voteReviewMutation = useMutation<
    ApiResponse<Review>,
    Error,
    { reviewId: string; vote: "up" | "down" }
  >({
    mutationFn: ({ reviewId, vote }) =>
      reviewService.voteReview(reviewId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  // Reportar reseña usando el servicio
  const reportReviewMutation = useMutation<
    ApiResponse<void>,
    Error,
    { reviewId: string; reason: string; details?: string }
  >({
    mutationFn: ({ reviewId, ...reportData }) =>
      reviewService.reportReview(reviewId, reportData as ReportData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  const finalResult = {
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

  // Debug final result
  console.log("useProductReviews final result:", {
    canReview: finalResult.canReview,
    hasOrdered: finalResult.hasOrdered,
    hasReviewed: finalResult.hasReviewed,
    reviewRestrictionReason: finalResult.reviewRestrictionReason,
    isCheckingPermission: finalResult.isCheckingPermission,
  });

  return finalResult;
};
