/**
 * Categories Data Access Layer
 *
 * This module provides hooks and utilities for interacting with category data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching categories with various filters
 * - Hooks for creating, updating, and deleting categories
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
 * Category data structure
 */
export interface Category {
  id: Id<"categories">;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: Id<"categories">;
  order?: number;
  isActive: boolean;
  productCount?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Category creation data
 */
export interface CategoryCreationData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: Id<"categories">;
  order?: number;
  isActive?: boolean;
}

/**
 * Category update data
 */
export interface CategoryUpdateData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: Id<"categories">;
  order?: number;
  isActive?: boolean;
}

/**
 * Category filter parameters
 */
export interface CategoryFilterParams extends PaginationParams {
  parentId?: Id<"categories">;
  isActive?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'order';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Hook for fetching a category by ID with caching
 */
export function useCategory(categoryId: Id<"categories"> | null | undefined) {
  return useQuery(
    api.categories.getById,
    categoryId ? { id: categoryId } : "skip",
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
 * Hook for fetching a category by slug with caching
 */
export function useCategoryBySlug(slug: string | null | undefined) {
  return useQuery(
    api.categories.getBySlug,
    slug ? { slug } : "skip",
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
 * Hook for fetching all categories with pagination and filtering
 */
export function useCategories(filters?: CategoryFilterParams) {
  // Set default values
  const defaultFilters: CategoryFilterParams = {
    limit: 50, // Higher limit for categories as there are usually fewer
    sortBy: 'order',
    sortDirection: 'asc',
    isActive: true,
  };

  // Merge default filters with provided filters
  const mergedFilters = { ...defaultFilters, ...filters };

  // Use the paginated query hook
  return usePaginatedQuery(
    api.categories.getAll,
    mergedFilters,
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
 * Hook for fetching top-level categories (no parent)
 */
export function useTopLevelCategories() {
  return useCategories({
    parentId: undefined,
    isActive: true,
    sortBy: 'order',
    sortDirection: 'asc',
  });
}

/**
 * Hook for fetching subcategories of a parent category
 */
export function useSubcategories(parentId: Id<"categories"> | null | undefined) {
  return useQuery(
    api.categories.getByParent,
    parentId ? { parentId } : "skip",
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
 * Hook for creating a category
 */
export function useCreateCategory() {
  const mutation = useMutation(api.categories.create, {
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["categories.getAll", "categories.getByParent"],
  });

  return {
    createCategory: async (data: CategoryCreationData) => {
      // If parentId is provided, invalidate the parent's subcategories query
      if (data.parentId) {
        invalidateQueries(`categories.getByParent:${JSON.stringify({ parentId: data.parentId })}`);
      }
      
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for updating a category with optimistic updates
 */
export function useUpdateCategory() {
  const mutation = useMutation(api.categories.update, {
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["categories.getById", "categories.getBySlug", "categories.getAll", "categories.getByParent"],
    optimisticUpdate: [
      {
        queryKey: "categories.getById",
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
    updateCategory: async (id: Id<"categories">, data: CategoryUpdateData) => {
      // Invalidate the specific category queries
      invalidateQueries(`categories.getById:${JSON.stringify({ id })}`);
      if (data.slug) {
        invalidateQueries(`categories.getBySlug:${JSON.stringify({ slug: data.slug })}`);
      }
      
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
 * Hook for deleting a category
 */
export function useDeleteCategory() {
  const mutation = useMutation(api.categories.delete, {
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["categories.getAll", "categories.getByParent"],
  });

  return {
    deleteCategory: async (id: Id<"categories">) => {
      // Invalidate the specific category query
      invalidateQueries(`categories.getById:${JSON.stringify({ id })}`);
      
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Server-side functions for fetching categories
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch a category by ID on the server side
 */
export async function getCategoryById(categoryId: Id<"categories">) {
  return await fetchFromServer("categories.getById", { id: categoryId });
}

/**
 * Fetch a category by slug on the server side
 */
export async function getCategoryBySlug(slug: string) {
  return await fetchFromServer("categories.getBySlug", { slug });
}

/**
 * Fetch all categories on the server side with pagination and filtering
 */
export async function getAllCategories(filters?: CategoryFilterParams) {
  const defaultFilters: CategoryFilterParams = {
    limit: 50,
    sortBy: 'order',
    sortDirection: 'asc',
    isActive: true,
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  return await fetchFromServer("categories.getAll", mergedFilters);
}

/**
 * Fetch subcategories of a parent category on the server side
 */
export async function getSubcategories(parentId: Id<"categories">) {
  return await fetchFromServer("categories.getByParent", { parentId });
}
