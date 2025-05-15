/**
 * Orders Data Access Layer
 * 
 * This module provides hooks and utilities for interacting with order data in Convex.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, PaginationParams } from "./index";

/**
 * Order item data structure
 */
export interface OrderItem {
  productId: Id<"products">;
  quantity: number;
  price: number;
  name?: string;
  sellerId?: Id<"users">;
}

/**
 * Address data structure for orders
 */
export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Order data structure
 */
export interface Order {
  id: Id<"orders">;
  buyerId: Id<"users">;
  sellerId: Id<"users">;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  deliveryDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

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
 */
export interface OrderCreationData {
  buyerId: Id<"users">;
  sellerId: Id<"users">;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  notes?: string;
}

/**
 * Hook for creating an order
 */
export function useCreateOrder() {
  const mutation = useMutation(api.orders.create, {
    onSuccess: () => {
      toast({
        title: "Order created",
        description: "Your order has been placed successfully.",
      });
    },
  });

  return {
    createOrder: async (data: OrderCreationData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Order update data
 */
export interface OrderUpdateData {
  id: Id<"orders">;
  status?: string;
  paymentStatus?: string;
  deliveryDate?: number;
  notes?: string;
}

/**
 * Hook for updating an order
 */
export function useUpdateOrder() {
  const mutation = useMutation(api.orders.update, {
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "The order has been updated successfully.",
      });
    },
  });

  return {
    updateOrder: async (data: OrderUpdateData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for cancelling an order
 */
export function useCancelOrder() {
  const mutation = useMutation(api.orders.cancel, {
    onSuccess: () => {
      toast({
        title: "Order cancelled",
        description: "The order has been cancelled successfully.",
      });
    },
  });

  return {
    cancelOrder: async (id: Id<"orders">) => {
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}
