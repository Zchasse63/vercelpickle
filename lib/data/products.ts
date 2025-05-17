/**
 * Products Data Access Layer
 *
 * This module provides hooks and utilities for interacting with product data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching products with various filters and pagination
 * - Hooks for creating, updating, and deleting products
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
import { Product as ProductType } from "@/types/product";

/**
 * Product data structure
 * Re-export the Product type from types/product.ts
 */
export type Product = ProductType;

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
 * Hook for creating a product with optimistic updates
 */
export function useCreateProduct() {
  const mutation = useMutation(api.products.create, {
    onSuccess: (productId) => {
      toast({
        title: "Product created",
        description: "Your product has been created successfully.",
      });

      // Invalidate product queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");

      if (productId) {
        // Prefetch the new product to ensure it's in the cache
        prefetchQuery("products.getById", { id: productId });
      }
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: [
      "products.getAll",
      "products.getFeatured"
    ],
    optimisticUpdate: [
      {
        // Optimistically update the products list
        queryKey: "products.getAll",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Create a temporary ID for the optimistic product
          const tempId = `temp_${Date.now()}` as any;

          // Create an optimistic product
          const optimisticProduct: Product = {
            id: tempId,
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: args.status || "active",
          };

          // Add the optimistic product to the list
          return {
            ...currentData,
            items: [optimisticProduct, ...currentData.items],
          };
        }
      }
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
 * Hook for updating a product with optimistic updates
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
    optimisticUpdate: [
      {
        // Optimistically update the specific product
        queryKey: (args) => `products.getById:${JSON.stringify({ id: args.id })}`,
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          // Create an optimistically updated product
          return {
            ...currentData,
            ...args,
            updatedAt: Date.now(),
          };
        }
      },
      {
        // Optimistically update the products list
        queryKey: "products.getAll",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Find and update the product in the list
          const updatedItems = currentData.items.map(item =>
            item.id === args.id
              ? { ...item, ...args, updatedAt: Date.now() }
              : item
          );

          return {
            ...currentData,
            items: updatedItems,
          };
        }
      }
    ]
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
 * Hook for deleting a product with optimistic updates
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
    ],
    optimisticUpdate: [
      {
        // Optimistically update the products list
        queryKey: "products.getAll",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Remove the product from the list
          const updatedItems = currentData.items.filter(item => item.id !== args.id);

          return {
            ...currentData,
            items: updatedItems,
          };
        }
      },
      {
        // Optimistically update the featured products list
        queryKey: "products.getFeatured",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Remove the product from the list
          const updatedItems = currentData.items.filter(item => item.id !== args.id);

          return {
            ...currentData,
            items: updatedItems,
          };
        }
      }
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

/**
 * Server-side functions for fetching products
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch a product by ID on the server side
 */
export async function getProductById(productId: Id<"products">) {
  return await fetchFromServer("products.getById", { id: productId });
}

/**
 * Fetch all products on the server side with pagination and filtering
 */
export async function getAllProducts(filters?: ProductFilterParams) {
  const defaultFilters: ProductFilterParams = {
    limit: 20,
    sortBy: "createdAt",
    sortDirection: "desc",
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  return await fetchFromServer("products.getAll", mergedFilters);
}

/**
 * Fetch featured products on the server side
 */
export async function getFeaturedProducts(options?: {
  limit?: number;
  category?: string;
}) {
  const args = {
    limit: options?.limit || 8,
    category: options?.category,
  };

  return await fetchFromServer("products.getFeatured", args);
}

/**
 * Fetch products by category on the server side
 */
export async function getProductsByCategory(
  category: string,
  options?: {
    limit?: number;
    sortDirection?: "asc" | "desc";
  }
) {
  const args = {
    category,
    limit: options?.limit || 20,
    sortDirection: options?.sortDirection || "desc",
  };

  return await fetchFromServer("products.getByCategory", args);
}
