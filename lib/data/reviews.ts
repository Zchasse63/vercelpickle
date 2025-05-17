/**
 * Reviews Data Access Layer
 *
 * This module provides hooks and utilities for interacting with review data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching reviews with various filters and pagination
 * - Hooks for creating, updating, and deleting reviews
 * - Optimistic updates for better user experience
 * - Server-side data fetching for SSR and SSG
 * - Caching with automatic invalidation
 * - Error handling with retry capability
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import {
  useQuery,
  useMutation,
  usePaginatedQuery,
  useBatchQuery,
  PaginationParams,
  invalidateQueries,
  fetchFromServer,
  prefetchQuery
} from "./index";
import { useMemo } from "react";

/**
 * Review data structure
 */
export interface Review {
  id: Id<"reviews">;
  userId: Id<"users">;
  productId: Id<"products">;
  orderId?: Id<"orders">;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  user?: {
    id: Id<"users">;
    name: string;
    profileImage?: string;
  };
}

/**
 * Review creation data
 */
export interface ReviewCreationData {
  userId: Id<"users">;
  productId: Id<"products">;
  orderId?: Id<"orders">;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
}

/**
 * Review update data
 */
export interface ReviewUpdateData {
  rating?: number;
  title?: string;
  content?: string;
  images?: string[];
}

/**
 * Review filter parameters
 */
export interface ReviewFilterParams extends PaginationParams {
  userId?: Id<"users">;
  productId?: Id<"products">;
  orderId?: Id<"orders">;
  minRating?: number;
  maxRating?: number;
  verified?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'rating' | 'helpful';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Hook for fetching a review by ID with caching
 */
export function useReview(reviewId: Id<"reviews"> | null | undefined) {
  return useQuery(
    api.reviews.getById,
    reviewId ? { id: reviewId } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
      retryCount: 3,
    }
  );
}

/**
 * Hook for fetching all reviews with pagination and filtering
 */
export function useReviews(filters?: ReviewFilterParams) {
  // Set default values
  const defaultFilters: ReviewFilterParams = {
    limit: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };

  // Merge default filters with provided filters
  const mergedFilters = { ...defaultFilters, ...filters };

  // Use the paginated query hook
  return usePaginatedQuery(
    api.reviews.getAll,
    mergedFilters,
    {
      // Cache for 5 minutes
      cacheTime: 5 * 60 * 1000,
      // Consider stale after 1 minute
      staleTime: 60 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Hook for fetching reviews by product ID
 */
export function useProductReviews(productId: Id<"products"> | null | undefined, limit: number = 10) {
  return useQuery(
    api.reviews.getByProduct,
    productId ? { productId, limit } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Hook for fetching reviews by user ID
 */
export function useUserReviews(userId: Id<"users"> | null | undefined, limit: number = 10) {
  return useQuery(
    api.reviews.getByUser,
    userId ? { userId, limit } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Hook for creating a review with optimistic updates
 */
export function useCreateReview() {
  const mutation = useMutation(api.reviews.create, {
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["reviews.getAll", "reviews.getByProduct", "reviews.getByUser"],
  });

  return {
    createReview: async (data: ReviewCreationData) => {
      // Invalidate relevant queries
      if (data.productId) {
        invalidateQueries(`reviews.getByProduct:${JSON.stringify({ productId: data.productId })}`);
      }
      if (data.userId) {
        invalidateQueries(`reviews.getByUser:${JSON.stringify({ userId: data.userId })}`);
      }
      
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for updating a review with optimistic updates
 */
export function useUpdateReview() {
  const mutation = useMutation(api.reviews.update, {
    onSuccess: () => {
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["reviews.getById", "reviews.getByProduct", "reviews.getByUser"],
    optimisticUpdate: [
      {
        queryKey: "reviews.getById",
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;
          
          return {
            ...currentData,
            ...args,
            updatedAt: Date.now(),
          };
        }
      }
    ]
  });

  return {
    updateReview: async (id: Id<"reviews">, data: ReviewUpdateData) => {
      // Invalidate the specific review query
      invalidateQueries(`reviews.getById:${JSON.stringify({ id })}`);
      
      return await mutation.execute({
        id,
        ...data,
      });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for deleting a review
 */
export function useDeleteReview() {
  const mutation = useMutation(api.reviews.delete, {
    onSuccess: () => {
      toast({
        title: "Review deleted",
        description: "The review has been deleted successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["reviews.getAll", "reviews.getByProduct", "reviews.getByUser"],
  });

  return {
    deleteReview: async (id: Id<"reviews">) => {
      // Invalidate the specific review query
      invalidateQueries(`reviews.getById:${JSON.stringify({ id })}`);
      
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for marking a review as helpful
 */
export function useMarkReviewHelpful() {
  const mutation = useMutation(api.reviews.markHelpful, {
    onSuccess: () => {
      toast({
        title: "Feedback recorded",
        description: "Thank you for your feedback.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["reviews.getById"],
    optimisticUpdate: [
      {
        queryKey: "reviews.getById",
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;
          
          return {
            ...currentData,
            helpful: (currentData.helpful || 0) + 1,
            updatedAt: Date.now(),
          };
        }
      }
    ]
  });

  return {
    markHelpful: async (id: Id<"reviews">) => {
      // Invalidate the specific review query
      invalidateQueries(`reviews.getById:${JSON.stringify({ id })}`);
      
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Server-side functions for fetching reviews
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch a review by ID on the server side
 */
export async function getReviewById(reviewId: Id<"reviews">) {
  return await fetchFromServer("reviews.getById", { id: reviewId });
}

/**
 * Fetch reviews by product ID on the server side
 */
export async function getReviewsByProduct(productId: Id<"products">, limit: number = 10) {
  return await fetchFromServer("reviews.getByProduct", { productId, limit });
}

/**
 * Fetch reviews by user ID on the server side
 */
export async function getReviewsByUser(userId: Id<"users">, limit: number = 10) {
  return await fetchFromServer("reviews.getByUser", { userId, limit });
}

/**
 * Fetch all reviews on the server side with pagination and filtering
 */
export async function getAllReviews(filters?: ReviewFilterParams) {
  const defaultFilters: ReviewFilterParams = {
    limit: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  return await fetchFromServer("reviews.getAll", mergedFilters);
}
