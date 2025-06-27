// types/review.types.ts

export interface Review {
  _id: string;
  product: string;
  user: {
      _id: string;
      name: string;
      avatar?: string;
  };
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  purchase_verified: boolean;
  helpful_votes: {
      positive: number;
      negative: number;
      users: Array<{ user: string; vote: boolean }>;
  };
  reported: {
      count: number;
      reasons: Array<{ user: string; reason: string; date: Date }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  verifiedPurchases: number;
  ratingDistribution: number[];
}

export interface ReviewData {
  rating: number;
  content: string;
}

export interface ReviewVote {
  reviewId: string;
  vote: 'positive' | 'negative';
}

export interface ReportData {
  reviewId: string;
  reason: string;
  details?: string;
}

export interface ReviewEligibilityResponse {
  success: boolean;
  data: {
    canReview: boolean;
    hasOrdered: boolean;
    hasReviewed: boolean;
    orderInfo?: {
      orderNumber: string;
    };
  };
}

export interface ReviewFormData {
  rating: number;
  content: string;
  images?: File[];
  orderId?: number | string
}