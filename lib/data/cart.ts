/**
 * Cart Data Access Layer
 * 
 * This module provides hooks and utilities for interacting with cart data in Convex.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "./index";

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
 * Hook for fetching cart items by user
 */
export function useCart(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.cart.getByUser,
    userId ? { userId } : "skip"
  );
}

/**
 * Hook for adding an item to the cart
 */
export function useAddToCart() {
  const mutation = useMutation(api.cart.addItem, {
    onSuccess: () => {
      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart.",
      });
    },
  });

  return {
    addToCart: async (userId: Id<"users">, productId: Id<"products">, quantity: number) => {
      return await mutation.execute({ userId, productId, quantity });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for updating a cart item quantity
 */
export function useUpdateCartItem() {
  const mutation = useMutation(api.cart.updateItem, {
    onSuccess: () => {
      toast({
        title: "Cart updated",
        description: "Your cart has been updated.",
      });
    },
  });

  return {
    updateCartItem: async (id: Id<"cartItems">, quantity: number) => {
      return await mutation.execute({ id, quantity });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for removing an item from the cart
 */
export function useRemoveFromCart() {
  const mutation = useMutation(api.cart.removeItem, {
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
  });

  return {
    removeFromCart: async (id: Id<"cartItems">) => {
      return await mutation.execute({ id });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for clearing the cart
 */
export function useClearCart() {
  const mutation = useMutation(api.cart.clearCart, {
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    },
  });

  return {
    clearCart: async (userId: Id<"users">) => {
      return await mutation.execute({ userId });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
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
