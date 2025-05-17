/**
 * Cart Data Access Layer
 *
 * This module provides hooks and utilities for interacting with cart data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching cart items with various filters
 * - Hooks for adding, updating, and removing cart items
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
  invalidateQueries,
  fetchFromServer,
  prefetchQuery
} from "./index";
import { useMemo } from "react";

/**
 * Cart item data structure
 */
export interface CartItem {
  id: Id<"cartItems">;
  userId: Id<"users">;
  productId: Id<"products">;
  quantity: number;
  product?: {
    id: Id<"products">;
    name: string;
    price: number;
    images: string[];
    sellerId: Id<"users">;
    sellerName?: string;
    inventory: number;
    unit: string;
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * Cart filter parameters
 */
export interface CartFilterParams {
  userId?: Id<"users">;
  productId?: Id<"products">;
  sellerId?: Id<"users">;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'quantity';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Hook for fetching cart items by user with caching
 */
export function useCart(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.cart.getByUser,
    userId ? { userId } : "skip",
    {
      // Cache for 5 minutes
      cacheTime: 5 * 60 * 1000,
      // Consider stale after 30 seconds (cart data changes frequently)
      staleTime: 30 * 1000,
      // Enable automatic retry
      retry: true,
      retryCount: 3,
    }
  );
}

/**
 * Hook for fetching cart item by ID
 */
export function useCartItem(cartItemId: Id<"cartItems"> | null | undefined) {
  return useQuery(
    api.cart.getById,
    cartItemId ? { id: cartItemId } : "skip",
    {
      // Cache for 5 minutes
      cacheTime: 5 * 60 * 1000,
      // Consider stale after 30 seconds
      staleTime: 30 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Hook for adding an item to the cart with optimistic updates
 */
export function useAddToCart() {
  const mutation = useMutation(api.cart.addItem, {
    onSuccess: () => {
      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["cart.getByUser"],
    optimisticUpdate: [
      {
        queryKey: "cart.getByUser",
        updateFn: (currentData, args) => {
          if (!currentData || !Array.isArray(currentData)) return currentData;

          // Check if the product is already in the cart
          const existingItemIndex = currentData.findIndex(
            item => item.productId === args.productId
          );

          if (existingItemIndex >= 0) {
            // Update the existing item
            const updatedItems = [...currentData];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + args.quantity,
              updatedAt: Date.now()
            };
            return updatedItems;
          } else {
            // Add a new item
            return [
              ...currentData,
              {
                id: `temp-${Date.now()}` as Id<"cartItems">, // Temporary ID
                userId: args.userId,
                productId: args.productId,
                quantity: args.quantity,
                createdAt: Date.now(),
                updatedAt: Date.now()
              }
            ];
          }
        }
      }
    ]
  });

  return {
    addToCart: async (userId: Id<"users">, productId: Id<"products">, quantity: number) => {
      // Invalidate the specific cart query
      invalidateQueries(`cart.getByUser:${JSON.stringify({ userId })}`);

      return await mutation.execute({ userId, productId, quantity });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for updating a cart item quantity with optimistic updates
 */
export function useUpdateCartItem() {
  const mutation = useMutation(api.cart.updateItem, {
    onSuccess: () => {
      toast({
        title: "Cart updated",
        description: "Your cart has been updated.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["cart.getByUser", "cart.getById"],
    optimisticUpdate: [
      {
        queryKey: "cart.getById",
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          return {
            ...currentData,
            quantity: args.quantity,
            updatedAt: Date.now()
          };
        }
      },
      {
        queryKey: "cart.getByUser",
        updateFn: (currentData, args) => {
          if (!currentData || !Array.isArray(currentData)) return currentData;

          // Find and update the item in the cart
          return currentData.map(item =>
            item.id === args.id
              ? { ...item, quantity: args.quantity, updatedAt: Date.now() }
              : item
          );
        }
      }
    ]
  });

  return {
    updateCartItem: async (id: Id<"cartItems">, quantity: number, userId?: Id<"users">) => {
      // Invalidate the specific cart item query
      invalidateQueries(`cart.getById:${JSON.stringify({ id })}`);

      // If userId is provided, invalidate the user's cart query
      if (userId) {
        invalidateQueries(`cart.getByUser:${JSON.stringify({ userId })}`);
      }

      return await mutation.execute({ id, quantity });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for removing an item from the cart with optimistic updates
 */
export function useRemoveFromCart() {
  const mutation = useMutation(api.cart.removeItem, {
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["cart.getByUser"],
    optimisticUpdate: [
      {
        queryKey: "cart.getByUser",
        updateFn: (currentData, args) => {
          if (!currentData || !Array.isArray(currentData)) return currentData;

          // Remove the item from the cart
          return currentData.filter(item => item.id !== args.id);
        }
      }
    ]
  });

  return {
    removeFromCart: async (id: Id<"cartItems">, userId?: Id<"users">) => {
      // If userId is provided, invalidate the user's cart query
      if (userId) {
        invalidateQueries(`cart.getByUser:${JSON.stringify({ userId })}`);
      }

      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for clearing the cart with optimistic updates
 */
export function useClearCart() {
  const mutation = useMutation(api.cart.clearCart, {
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["cart.getByUser"],
    optimisticUpdate: [
      {
        queryKey: "cart.getByUser",
        updateFn: (currentData, args) => {
          // Return an empty array to clear the cart
          return [];
        }
      }
    ]
  });

  return {
    clearCart: async (userId: Id<"users">) => {
      // Invalidate the user's cart query
      invalidateQueries(`cart.getByUser:${JSON.stringify({ userId })}`);

      return await mutation.execute({ userId });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for getting cart count
 */
export function useCartCount(userId: Id<"users"> | null | undefined) {
  const cart = useCart(userId);

  // Calculate the total number of items in the cart
  const count = useMemo(() => {
    if (!cart.data || !Array.isArray(cart.data)) return 0;

    return cart.data.reduce((total, item) => total + item.quantity, 0);
  }, [cart.data]);

  return {
    count,
    isLoading: cart.isLoading,
    error: cart.error,
    isError: cart.isError,
  };
}

/**
 * Server-side functions for fetching cart data
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch cart items by user on the server side
 */
export async function getCartByUser(userId: Id<"users">) {
  return await fetchFromServer("cart.getByUser", { userId });
}

/**
 * Fetch a cart item by ID on the server side
 */
export async function getCartItemById(cartItemId: Id<"cartItems">) {
  return await fetchFromServer("cart.getById", { id: cartItemId });
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  // Apply tax rate (e.g., 8.5%)
  const taxRate = 0.085;
  const tax = subtotal * taxRate;

  // Calculate shipping (simplified)
  const shipping = subtotal > 0 ? 10 : 0;

  // Calculate total
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
}
