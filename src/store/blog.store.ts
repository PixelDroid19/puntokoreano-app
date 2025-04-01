import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { BlogFilters } from "../types/blog.types"

interface BlogState {
  blogFilters: BlogFilters
  recentlyViewedPosts: string[] // Array of post IDs
  setBlogFilters: (filters: BlogFilters) => void
  addRecentlyViewedPost: (postId: string) => void
}

export const useBlogStore = create<BlogState>()(
  devtools(
    persist(
      (set) => ({
        blogFilters: {
          page: 1,
          limit: 9,
          search: "",
          category: "",
          tag: "",
          sort: "createdAt",
          sortOrder: "desc",
        },
        recentlyViewedPosts: [],

        setBlogFilters: (filters) => set({ blogFilters: filters }),

        addRecentlyViewedPost: (postId) =>
          set((state) => {
            // Remove the postId if it already exists to avoid duplicates
            const filteredPosts = state.recentlyViewedPosts.filter((id) => id !== postId)

            // Add the postId to the beginning of the array
            const updatedPosts = [postId, ...filteredPosts]

            // Keep only the 10 most recent posts
            return {
              recentlyViewedPosts: updatedPosts.slice(0, 10),
            }
          }),
      }),
      {
        name: "blog-storage",
        partialize: (state) => ({
          recentlyViewedPosts: state.recentlyViewedPosts,
          // Don't persist filters as they should be reset on page refresh
        }),
      },
    ),
  ),
)

