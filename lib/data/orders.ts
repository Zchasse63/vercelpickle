/**
 * Orders Data Access Layer
 *
 * This module provides hooks and utilities for interacting with order data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching orders with various filters and pagination
 * - Hooks for creating, updating, and canceling orders
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
import { Order as OrderType, OrderCreationData, OrderItem, OrderStatus, PaymentStatus } from "@/types/order";

/**
 * Order item data structure
 * Re-export the OrderItem type from types/order.ts
 */
export type { OrderItem };

/**
 * Order data structure
 * Re-export the Order type from types/order.ts
 */
export type Order = OrderType;

/**
 * Hook for fetching an order by ID
 */
export function useOrder(orderId: Id<"orders"> | null | undefined) {
  return useQuery(
    api.orders.getById,
    orderId ? { id: orderId } : "skip"
  );
}

/**
 * Hook for fetching orders by buyer
 */
export function useBuyerOrders(buyerId: Id<"users"> | null | undefined) {
  return useQuery(
    api.orders.getByBuyer,
    buyerId ? { buyerId } : "skip"
  );
}

/**
 * Hook for fetching orders by seller
 */
export function useSellerOrders(sellerId: Id<"users"> | null | undefined) {
  return useQuery(
    api.orders.getBySeller,
    sellerId ? { sellerId } : "skip"
  );
}

/**
 * Hook for fetching order history with pagination
 */
export function useOrderHistory(
  buyerId: Id<"users"> | null | undefined,
  pagination?: PaginationParams
) {
  return useQuery(
    api.orders.getHistory,
    buyerId ? {
      buyerId,
      limit: pagination?.limit || 10
    } : "skip"
  );
}

/**
 * Order creation data
 * Re-export the OrderCreationData type from types/order.ts
 */
export type { OrderCreationData };

/**
 * Hook for creating an order with optimistic updates
 */
export function useCreateOrder() {
  const mutation = useMutation(api.orders.create, {
    onSuccess: (orderId) => {
      toast({
        title: "Order created",
        description: "Your order has been placed successfully.",
      });

      // Invalidate order queries to refresh the data
      invalidateQueries("orders.getAll");
      invalidateQueries("orders.getByBuyer");
      invalidateQueries("orders.getBySeller");

      if (orderId) {
        // Prefetch the new order to ensure it's in the cache
        prefetchQuery("orders.getById", { id: orderId });
      }
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: [
      "orders.getAll",
      "orders.getByBuyer",
      "orders.getBySeller"
    ]
  });

  return {
    createOrder: async (data: OrderCreationData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Order update data
 */
export interface OrderUpdateData {
  id: Id<"orders">;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryDate?: number;
  notes?: string;
}

/**
 * Hook for updating an order with optimistic updates
 */
export function useUpdateOrder() {
  const mutation = useMutation(api.orders.update, {
    onSuccess: (result) => {
      toast({
        title: "Order updated",
        description: "The order has been updated successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("orders.getAll");
      invalidateQueries("orders.getByBuyer");
      invalidateQueries("orders.getBySeller");
      invalidateQueries(`orders.getById:${JSON.stringify({ id: result })}`);
    },
    retry: true,
    retryCount: 3,
    optimisticUpdate: [
      {
        // Optimistically update the specific order
        queryKey: (args) => `orders.getById:${JSON.stringify({ id: args.id })}`,
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          // Create an optimistically updated order
          return {
            ...currentData,
            ...args,
            updatedAt: Date.now(),
          };
        }
      },
      {
        // Optimistically update the orders list
        queryKey: "orders.getAll",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Find and update the order in the list
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
    updateOrder: async (data: OrderUpdateData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for canceling an order with optimistic updates
 */
export function useCancelOrder() {
  const mutation = useMutation(api.orders.cancel, {
    onSuccess: (result) => {
      toast({
        title: "Order canceled",
        description: "The order has been canceled successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("orders.getAll");
      invalidateQueries("orders.getByBuyer");
      invalidateQueries("orders.getBySeller");
      invalidateQueries(`orders.getById:${JSON.stringify({ id: result })}`);
    },
    retry: true,
    retryCount: 3,
    optimisticUpdate: [
      {
        // Optimistically update the specific order
        queryKey: (args) => `orders.getById:${JSON.stringify({ id: args.id })}`,
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          // Create an optimistically updated order
          return {
            ...currentData,
            status: "cancelled" as OrderStatus,
            updatedAt: Date.now(),
          };
        }
      },
      {
        // Optimistically update the orders list
        queryKey: "orders.getAll",
        updateFn: (currentData, args) => {
          if (!currentData || !currentData.items) return currentData;

          // Find and update the order in the list
          const updatedItems = currentData.items.map(item =>
            item.id === args.id
              ? { ...item, status: "cancelled", updatedAt: Date.now() }
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
    cancelOrder: async (id: Id<"orders">) => {
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Order filter parameters
 */
export interface OrderFilterParams extends PaginationParams {
  buyerId?: Id<"users">;
  sellerId?: Id<"users">;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: number;
  endDate?: number;
  search?: string;
}

/**
 * Hook for fetching all orders with pagination and filtering
 */
export function useOrders(filters?: OrderFilterParams) {
  // Set default values
  const defaultFilters: OrderFilterParams = {
    limit: 20,
    sortBy: "createdAt",
    sortDirection: "desc",
  };

  // Merge default filters with provided filters
  const mergedFilters = { ...defaultFilters, ...filters };

  // Use the paginated query hook
  return usePaginatedQuery(
    api.orders.getAll,
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
 * Hook for batch fetching multiple order-related data
 */
export function useOrderBatch(
  orderId: Id<"orders"> | null | undefined
) {
  const queries = useMemo(() => {
    if (!orderId) return [];

    return [
      {
        query: api.orders.getById,
        args: { id: orderId },
        key: "order",
      },
      {
        query: api.orders.getItems,
        args: { orderId },
        key: "items",
      },
      {
        query: api.orders.getHistory,
        args: { orderId },
        key: "history",
      },
    ];
  }, [orderId]);

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
 * Server-side functions for fetching orders
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch an order by ID on the server side
 */
export async function getOrderById(orderId: Id<"orders">) {
  return await fetchFromServer("orders.getById", { id: orderId });
}

/**
 * Fetch all orders on the server side with pagination and filtering
 */
export async function getAllOrders(filters?: OrderFilterParams) {
  const defaultFilters: OrderFilterParams = {
    limit: 20,
    sortBy: "createdAt",
    sortDirection: "desc",
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  return await fetchFromServer("orders.getAll", mergedFilters);
}

/**
 * Fetch orders by buyer on the server side
 */
export async function getOrdersByBuyer(
  buyerId: Id<"users">,
  options?: {
    limit?: number;
    status?: OrderStatus;
    sortDirection?: "asc" | "desc";
  }
) {
  const args = {
    buyerId,
    limit: options?.limit || 20,
    status: options?.status,
    sortDirection: options?.sortDirection || "desc",
  };

  return await fetchFromServer("orders.getByBuyer", args);
}

/**
 * Fetch orders by seller on the server side
 */
export async function getOrdersBySeller(
  sellerId: Id<"users">,
  options?: {
    limit?: number;
    status?: OrderStatus;
    sortDirection?: "asc" | "desc";
  }
) {
  const args = {
    sellerId,
    limit: options?.limit || 20,
    status: options?.status,
    sortDirection: options?.sortDirection || "desc",
  };

  return await fetchFromServer("orders.getBySeller", args);
}
