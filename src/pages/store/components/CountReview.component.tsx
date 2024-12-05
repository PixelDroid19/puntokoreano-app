// components/reviews/CountReview.tsx
import { Rate } from "antd";
import { useParams } from "react-router-dom";
import { useProductReviews } from "@/hooks/useProductReviews";

interface CountReviewProps {
  userRating?: boolean;
  rating?: number;
  onChange?: (value: number) => void;
}

const CountReview: React.FC<CountReviewProps> = ({
  userRating = false,
  rating,
  onChange,
}) => {
  const { id: productId } = useParams();
  const { stats } = useProductReviews(productId || "");

  // Si es para calificación de usuario, mostrar estrellas interactivas
  if (userRating) {
    return (
      <Rate value={rating} onChange={onChange} className="text-[#E2060F]" />
    );
  }

  // Si no, mostrar el promedio de calificaciones
  return (
    <div className="flex items-center gap-2">
      <Rate
        disabled
        value={stats?.avgRating || 0}
        allowHalf
        className="text-[#E2060F]"
      />
      <span className="text-sm text-gray-500">
        ({stats?.totalReviews || 0} reseñas)
      </span>
    </div>
  );
};

export default CountReview;
