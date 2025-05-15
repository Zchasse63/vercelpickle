/**
 * Products Data Access Layer
 *
 * This module provides hooks and utilities for interacting with product data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
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
  invalidateQueries
} from "./index";
import { useMemo } from "react";

/**
 * Product data structure
 */
export interface Product {
  id: Id<"products">;
  name: string;
  description: string;
  price: number;
  sellerId: Id<"users">;
  sellerName?: string;
  category: string;
  subcategory?: string;
  images: string[];
  inventory: number;
  unit: string;
  minimumOrder?: number;
  status?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  isOrganic?: boolean;
  isLocal?: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Product filter parameters
 */
export interface ProductFilterParams extends PaginationParams {
  category?: string;
  subcategory?: string;
  sellerId?: Id<"users">;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  isLocal?: boolean;
  status?: string;
  search?: string;
}

/**
 * Hook for fetching all products with pagination and filtering
 */
export function useProducts(filters?: ProductFilterParams) {
  // Set default values
  const defaultFilters: ProductFilterParams = {
    limit: 20,
    sortBy: "createdAt",
    sortDirection: "desc",
  };

  // Merge default filters with provided filters
  const mergedFilters = { ...defaultFilters, ...filters };

  // Use the paginated query hook
  return usePaginatedQuery(
    api.products.getAll,
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
 * Hook for fetching a product by ID with caching
 */
export function useProduct(productId: Id<"products"> | null | undefined) {
  return useQuery(
    api.products.getById,
    productId ? { id: productId } : "skip",
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
 * Hook for fetching products by category with pagination
 */
export function useProductsByCategory(
  category: string | null | undefined,
  options?: {
    limit?: number;
    sortDirection?: "asc" | "desc";
  }
) {
  const args = useMemo(() => {
    if (!category) return "skip";

    return {
      category,
      limit: options?.limit || 20,
      sortDirection: options?.sortDirection || "desc",
    };
  }, [category, options?.limit, options?.sortDirection]);

  return usePaginatedQuery(
    api.products.getByCategory,
    args,
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
 * Hook for fetching products by seller with pagination
 */
export function useProductsBySeller(
  sellerId: Id<"users"> | null | undefined,
  options?: {
    limit?: number;
    sortDirection?: "asc" | "desc";
    status?: string;
  }
) {
  const args = useMemo(() => {
    if (!sellerId) return "skip";

    return {
      sellerId,
      limit: options?.limit || 20,
      sortDirection: options?.sortDirection || "desc",
      status: options?.status,
    };
  }, [sellerId, options?.limit, options?.sortDirection, options?.status]);

  return usePaginatedQuery(
    api.products.getBySeller,
    args,
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
 * Hook for fetching featured products with pagination
 */
export function useFeaturedProducts(
  options?: {
    limit?: number;
    category?: string;
  }
) {
  const args = useMemo(() => {
    return {
      limit: options?.limit || 8,
      category: options?.category,
    };
  }, [options?.limit, options?.category]);

  return usePaginatedQuery(
    api.products.getFeatured,
    args,
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
 * Hook for batch fetching multiple product-related data
 */
export function useProductBatch(
  productId: Id<"products"> | null | undefined
) {
  const queries = useMemo(() => {
    if (!productId) return [];

    return [
      {
        query: api.products.getById,
        args: { id: productId },
        key: "product",
      },
      {
        query: api.reviews.getByProduct,
        args: { productId },
        key: "reviews",
      },
      {
        query: api.products.getRelated,
        args: { productId, limit: 4 },
        key: "relatedProducts",
      },
    ];
  }, [productId]);

  return useBatchQuery(
    queries,
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
 * Product creation data
 */
export interface ProductCreationData {
  name: string;
  description: string;
  price: number;
  sellerId: Id<"users">;
  sellerName?: string;
  category: string;
  subcategory?: string;
  images: string[];
  inventory: number;
  unit: string;
  minimumOrder?: number;
  status?: string;
  tags?: string[];
  specifications?: Record<string, any>;
}

/**
 * Hook for creating a product
 */
export function useCreateProduct() {
  const mutation = useMutation(api.products.create, {
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "Your product has been created successfully.",
      });

      // Invalidate product queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: [
      "products.getAll",
      "products.getFeatured"
    ]
  });

  return {
    createProduct: async (data: ProductCreationData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Product update data
 */
export interface ProductUpdateData {
  id: Id<"products">;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  subcategory?: string;
  images?: string[];
  inventory?: number;
  unit?: string;
  minimumOrder?: number;
  status?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  isOrganic?: boolean;
  isLocal?: boolean;
}

/**
 * Hook for updating a product
 */
export function useUpdateProduct() {
  const mutation = useMutation(api.products.update, {
    onSuccess: (result) => {
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");
      invalidateQueries(`products.getById:${JSON.stringify({ id: result })}`);
    },
    retry: true,
    retryCount: 3,
  });

  return {
    updateProduct: async (data: ProductUpdateData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for deleting a product
 */
export function useDeleteProduct() {
  const mutation = useMutation(api.products.remove, {
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
      });

      // Invalidate product queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: [
      "products.getAll",
      "products.getFeatured"
    ]
  });

  return {
    deleteProduct: async (id: Id<"products">) => {
      // Invalidate the specific product query
      invalidateQueries(`products.getById:${JSON.stringify({ id })}`);

      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for searching products
 */
export function useSearchProducts(query: string | null | undefined) {
  // Use the enhanced products hook with search parameter
  return useProducts({
    search: query || undefined,
    limit: 50, // Increase limit for search results
  });
}

/**
 * Hook for filtering products
 */
export function useFilteredProducts(filters: ProductFilterParams) {
  return useProducts(filters);
}
