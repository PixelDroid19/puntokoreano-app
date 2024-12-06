// components/reviews/ReviewUser.tsx
import { Avatar, Rate, Space, Tag, Tooltip } from "antd";
import { ThumbsUp, ThumbsDown, Flag, User } from "lucide-react";
import { useProductReviews } from "@/hooks/useProductReviews";

interface ReviewProps {
  review: {
    _id: string;
    user: any;
    title: string;
    content: string;
    rating: number;
    createdAt: string;
    purchase_verified: boolean;
    helpful_votes: {
      positive: number;
      negative: number;
    };
  };
}

const ReviewUser: React.FC<ReviewProps> = ({ review }) => {
  const { voteReview, reportReview } = useProductReviews(review._id);

  const handleVote = async (voteType: boolean) => {
    try {
      await voteReview({
        reviewId: review._id,
        vote: voteType ? "positive" : "negative",
      });
    } catch (error) {
      console.error("Error voting review:", error);
    }
  };

  const handleReport = async () => {
    try {
      await reportReview({
        reviewId: review._id,
        reason: "inappropriate",
      });
    } catch (error) {
      console.error("Error reporting review:", error);
    }
  };

  return (
    <section className="border-b border-b-gray-300 pb-4 mt-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <Avatar
            size={64}
            icon={<User />}
            className="flex-shrink-0 bg-gray-200"
          >
            {/* Usuario anónimo ya que user puede ser null */}
          </Avatar>
          <div>
            <h4 className="text-lg font-semibold">Usuario</h4>
            <Rate disabled value={review.rating} className="text-[#E2060F]" />
            {review.purchase_verified && (
              <Tag color="green" className="ml-2">
                Compra verificada
              </Tag>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="ml-[80px]">
        <h5 className="font-semibold mb-2">{review.title}</h5>
        <p className="text-base mb-4">{review.content}</p>

        <div className="flex items-center justify-between">
          <Space size="large">
            <Tooltip title="Útil">
              <button
                onClick={() => handleVote(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#E2060F]"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful_votes.positive}</span>
              </button>
            </Tooltip>

            <Tooltip title="No útil">
              <button
                onClick={() => handleVote(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#E2060F]"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{review.helpful_votes.negative}</span>
              </button>
            </Tooltip>
          </Space>

          <Tooltip title="Reportar">
            <button
              onClick={handleReport}
              className="text-gray-400 hover:text-[#E2060F]"
            >
              <Flag className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </section>
  );
};

export default ReviewUser;
