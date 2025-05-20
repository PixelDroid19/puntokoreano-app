import { useQuery } from "@tanstack/react-query";
import BlogService from "../services/blog.service";
import type { BlogFilters } from "../types/blog.types";

export const blogKeys = {
  publicAll: ["publicBlogs"] as const,
  publicLists: () => [...blogKeys.publicAll, "list"] as const,
  publicList: (filters: BlogFilters) =>
    [...blogKeys.publicLists(), filters] as const,
  publicDetails: () => [...blogKeys.publicAll, "detail"] as const,
  publicDetailBySlug: (slug: string) =>
    [...blogKeys.publicDetails(), slug] as const,
  publicFeatured: (limit?: number) =>
    [...blogKeys.publicAll, "featured", limit || "default"] as const,
  publicRelated: (blogId: string, limit?: number) =>
    [...blogKeys.publicAll, "related", blogId, limit || "default"] as const,

  publicCategories: ["publicBlogCategories"] as const,
  publicCategoriesList: () => [...blogKeys.publicCategories, "list"] as const,

  publicTags: ["publicBlogTags"] as const,
  publicTagsList: () => [...blogKeys.publicTags, "list"] as const,
};

export function usePublishedBlogs(filters: BlogFilters = {}) {
  return useQuery({
    queryKey: blogKeys.publicList(filters),
    queryFn: () => BlogService.getPublishedPosts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: blogKeys.publicDetailBySlug(slug),
    queryFn: () => BlogService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicBlogCategories() {
  return useQuery({
    queryKey: blogKeys.publicCategoriesList(),
    queryFn: () => BlogService.getPublicCategories(),
    staleTime: 30 * 60 * 1000,
  });
}

export function usePublicBlogTags() {
  return useQuery({
    queryKey: blogKeys.publicTagsList(),
    queryFn: () => BlogService.getPublicTags(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useFeaturedBlogs(limit?: number) {
  return useQuery({
    queryKey: blogKeys.publicFeatured(limit),
    queryFn: () => BlogService.getFeaturedPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedBlogs(blogId: string, limit?: number) {
  return useQuery({
    queryKey: blogKeys.publicRelated(blogId, limit),
    queryFn: () => BlogService.getRelatedPosts(blogId, limit),
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
  });
}
