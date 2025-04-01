// src/types/blog.types.ts

// Represents the populated author structure from the API
interface BlogAuthor {
    _id: string;
    name: string;
    // Add other fields if needed
  }
  
  // Represents the populated category/tag structure from the API
  interface BlogRef {
    _id: string;
    name: string;
    slug: string;
  }
  
  // Represents an associated item (Vehicle/Product)
  interface AssociatedItemRef {
    itemType: "Vehicle" | "Product";
    itemId: {
      _id: string;
      name: string;
      slug: string;
      mainImage?: string; // Make optional if not always present
    };
  }
  
  // Represents a single blog post received from the ECOMMERCE API
  export interface BlogPostFromBackend {
    _id: string;
    title: string;
    slug: string;
    content?: string; // Optional as it's excluded in lists
    excerpt: string;
    featuredImage: string | null;
    author: BlogAuthor; // Populated
    status: "draft" | "published" | "scheduled";
    categories: BlogRef[]; // Populated array
    tags: BlogRef[]; // Populated array
    associatedItems?: AssociatedItemRef[]; // Optional, only in detail view
    metaTitle?: string;
    metaDescription?: string;
    publishedAt: string; // ISO Date string
    scheduledAt?: string; // ISO Date string
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  
  // Type for the pagination object returned by GET /blog
  export interface BlogPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  }
  
  // Type for the response of GET /blog
  export interface BlogListResponse {
    posts: BlogPostFromBackend[];
    pagination: BlogPagination;
    results: number; // Results on the current page
  }
  
  // Type for filters used with GET /blog
  export interface BlogFilters {
    category?: string; // Category ID
    tag?: string; // Tag ID
    search?: string;
    page?: number;
    limit?: number;
    sort?: string; // e.g., 'publishedAt', 'title'
    sortOrder?: "asc" | "desc";
  }
  
  // Represents Blog Category from ECOMMERCE API (GET /blog/categories)
  export interface BlogCategory {
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Represents Blog Tag from ECOMMERCE API (GET /blog/tags)
  export interface BlogTag {
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // --- Dashboard/Admin Specific Types ---
  
  // Data structure for CREATING/UPDATING posts (sent TO backend)
  // May differ slightly from BlogPostFromBackend (e.g., categories/tags as array of IDs)
  export interface BlogPostDataToSend {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: "draft" | "published" | "scheduled";
    categories?: string[]; // Array of Category IDs
    tags?: string[]; // Array of Tag IDs
    featuredImage?: string | null; // URL or null
    scheduledAt?: string | null; // ISO Date string or null
    // Add metaTitle, metaDescription, associatedItems if they are editable
  }
  
  // Type for the response of the DASHBOARD GET_ALL endpoint (adjust if needed)
  export interface DashboardBlogResponse {
    posts: BlogPostFromBackend[]; // Or a slightly different DashboardBlogPost type
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }