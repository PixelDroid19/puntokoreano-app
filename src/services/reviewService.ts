// services/reviewService.ts
import axios from "axios";
import { ReviewFormData } from "../types/review.types";
import ENDPOINTS from "@/api";

class ReviewService {
  private readonly endpoints = ENDPOINTS.REVIEWS;

  async getProductReviews(productId: string) {
    const response = await axios.request({
      // Aquí está el problema: necesitas usar :productId, no productId
      url: this.endpoints.GET_PRODUCT_REVIEWS.url.replace(
        ":productId",
        productId
      ),
      method: this.endpoints.GET_PRODUCT_REVIEWS.method,
    });
    return response.data;
  }

  async canUserReview(productId: string) {
    const response = await axios.request({
      url: this.endpoints.CHECK_CAN_REVIEW.url.replace(":productId", productId),
      method: this.endpoints.CHECK_CAN_REVIEW.method,
    });
    return response.data;
  }

  async createReview(productId: string, reviewData: ReviewFormData) {
    try {
    /*   const formData = new FormData();
      formData.append("rating", reviewData.rating.toString());
      formData.append("title", reviewData.title);
      formData.append("content", reviewData.content);

      if (reviewData.images && reviewData.images.length > 0) {
        reviewData.images.forEach((image) => {
          formData.append(`images`, image);
        });
      } */

      const response = await axios.request({
        url: this.endpoints.CREATE_REVIEW.url.replace(":productId", productId),
        method: this.endpoints.CREATE_REVIEW.method,
        data: reviewData,
        headers: {
          "Content-Type": "application/json",	
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Error creating review:", error);
      throw error.response?.data || error;
    }
  }

  async getProductStats(productId: string) {
    const response = await axios.request({
      url: this.endpoints.GET_REVIEW_STATS.url.replace(":productId", productId),
      method: this.endpoints.GET_REVIEW_STATS.method,
    });
    return response.data;
  }

  async voteReview(reviewId: string, vote: boolean) {
    const response = await axios.request({
      url: this.endpoints.VOTE_REVIEW.url.replace(":reviewId", reviewId),
      method: this.endpoints.VOTE_REVIEW.method,
      data: { vote },
    });
    return response.data;
  }

  async reportReview(reviewId: string, reason: string) {
    const response = await axios.request({
      url: this.endpoints.REPORT_REVIEW.url.replace(":reviewId", reviewId),
      method: this.endpoints.REPORT_REVIEW.method,
      data: { reason },
    });
    return response.data;
  }
}

export const reviewService = new ReviewService();
