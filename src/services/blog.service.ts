import axios from "axios";
import {
  BlogFilters,
  BlogPostFromBackend,
  BlogListResponse,
  BlogCategory,
  BlogTag,
  BlogPagination,
} from "../types/blog.types";
import ENDPOINTS from "@/api";

interface ApiResponseNested<TData> {
  status: "success" | "fail" | "error";
  message?: string;
  data: TData;
  results?: number;
  pagination?: BlogPagination;
}

interface BlogListApiResponse
  extends ApiResponseNested<{ posts: BlogPostFromBackend[] }> {
  results: number;
  pagination: BlogPagination;
}

interface RefListApiResponse<TItem>
  extends ApiResponseNested<{ [key: string]: TItem[] }> {
  results: number;
}

function replaceParamInUrl(
  url: string,
  paramName: string,
  value: string
): string {
  return url.replace(`:${paramName}`, value);
}

class BlogService {
  static async getPublishedPosts(
    filters: BlogFilters = {}
  ): Promise<BlogListResponse> {
    try {
      const { data } = await axios.get<BlogListApiResponse>(
        ENDPOINTS.BLOG.GET_PUBLISHED.url,
        { params: filters }
      );

      if (data.status !== "success" || !data.data?.posts) {
        throw new Error(data.message || "Failed to fetch published posts");
      }

      return {
        posts: data.data.posts,
        pagination: data.pagination,
        results: data.results,
      };
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      throw error;
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPostFromBackend> {
    try {
      const url = replaceParamInUrl(
        ENDPOINTS.BLOG.GET_BY_SLUG.url,
        "slug",
        slug
      );

      const { data } = await axios.get<
        ApiResponseNested<{ post: BlogPostFromBackend }>
      >(url);

      if (data.status !== "success" || !data.data?.post) {
        throw new Error(data.message || "Failed to fetch post by slug");
      }
      return data.data.post;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw error;
    }
  }

  static async getPublicCategories(): Promise<BlogCategory[]> {
    try {
      const { data } = await axios.get<RefListApiResponse<BlogCategory>>(
        ENDPOINTS.BLOG.GET_CATEGORIES.url
      );

      if (data.status !== "success" || !data.data?.categories) {
        throw new Error(data.message || "Failed to fetch blog categories");
      }
      return data.data.categories;
    } catch (error) {
      console.error("Error fetching public blog categories:", error);
      throw error;
    }
  }

  static async getPublicTags(): Promise<BlogTag[]> {
    try {
      const { data } = await axios.get<RefListApiResponse<BlogTag>>(
        ENDPOINTS.BLOG.GET_TAGS.url
      );

      if (data.status !== "success" || !data.data?.tags) {
        throw new Error(data.message || "Failed to fetch blog tags");
      }
      return data.data.tags;
    } catch (error) {
      console.error("Error fetching public blog tags:", error);
      throw error;
    }
  }

  static async getFeaturedPosts(
    limit: number = 4
  ): Promise<BlogPostFromBackend[]> {
    try {
      const { data } = await axios.get<RefListApiResponse<BlogPostFromBackend>>(
        ENDPOINTS.BLOG.GET_FEATURED.url,
        { params: { limit } }
      );

      if (data.status !== "success" || !data.data?.posts) {
        throw new Error(data.message || "Failed to fetch featured posts");
      }
      return data.data.posts;
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      throw error;
    }
  }

  static async getRelatedPosts(
    blogId: string,
    limit: number = 3
  ): Promise<BlogPostFromBackend[]> {
    try {
      const { data } = await axios.get<RefListApiResponse<BlogPostFromBackend>>(
        ENDPOINTS.BLOG.GET_RELATED.url,
        { params: { blogId, limit } }
      );

      if (data.status !== "success" || !data.data?.posts) {
        throw new Error(data.message || "Failed to fetch related posts");
      }
      return data.data.posts;
    } catch (error) {
      console.error("Error fetching related posts:", error);
      throw error;
    }
  }
}

export default BlogService;
