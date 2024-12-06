// components/reviews/ReviewsList.tsx
// @ts-nocheck
import { Empty, Rate, Spin } from "antd";
import { useProductReviews } from "@/hooks/useProductReviews";
import ReviewUser from "./ReviewUser";

interface ReviewsListProps {
  productId: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ productId }) => {
  const { reviews: reviewData, isLoading } = useProductReviews(productId);
  const { reviews, stats } = reviewData || {};

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!reviews?.length) {
    return <Empty description="No hay reseñas todavía" className="py-8" />;
  }

  return (
    <div className="mt-4">
      {/* Resumen de calificaciones */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-[#E2060F]">
              {stats?.avgRating?.toFixed(1) || "0.0"}
            </div>
            <Rate
              disabled
              value={stats?.avgRating}
              allowHalf
              className="text-[#E2060F]"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500">
              Basado en {stats?.totalReviews} reseñas
            </div>
            {/* Distribución de calificaciones */}
            {Object.entries(stats?.ratingDistribution || {})
              .reverse()
              .map(([rating, data]) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span>{rating} estrellas</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-[#E2060F] rounded"
                      style={{
                        width: `${data.percentage}%`,
                      }}
                    />
                  </div>
                  <span>{data.count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewUser key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};
