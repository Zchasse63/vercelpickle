"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define types for our implementation
type CartItemId = string;
type ProductId = string;
type UserId = string | null;

// Define product type
type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  images?: string[];
  sellerId: string;
  category: string;
  subcategory?: string;
  inventory: number;
};

// Define cart item type
type CartItem = {
  id: CartItemId;
  productId: ProductId;
  product: Product;
  quantity: number;
  userId: UserId;
};

/**
 * Hook for working with the shopping cart
 * @param userId - User ID
 * @returns Cart-related functions and data
 */
export function useCart(userId: UserId) {
  // Always declare hooks in the same order
  // 1. First all useState hooks
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to track if we've loaded the cart to prevent infinite loops
  const hasLoadedCart = useRef(false);

  // 2. Then all useQuery hooks - but make sure they're always called
  // Define these outside of try/catch to ensure consistent hook order
  const allProductsResult = useQuery(api.products.getAll, {});
  const cartItemsFromDBResult = useQuery(
    api.cart.getItems,
    userId ? { userId: userId as Id<"users"> } : "skip"
  );

  // Now safely access the results
  const allProducts = allProductsResult as Product[] | undefined;
  const cartItemsFromDB = cartItemsFromDBResult as any[] | undefined;

  // Load cart items from backend or localStorage on mount
  useEffect(() => {
    // Skip if we don't have the necessary data yet
    if (!allProducts || (userId && !cartItemsFromDB)) {
      return;
    }

    // Skip if we've already loaded the cart for this data
    if (hasLoadedCart.current) {
      return;
    }

    // Mark that we're loading the cart
    hasLoadedCart.current = true;
    setIsLoading(true);

    try {
      // If we have cart items from the backend, use those
      if (userId && cartItemsFromDB) {
        const items = cartItemsFromDB.map(item => {
          const product = allProducts.find(p => p._id === item.productId);
          if (!product) {
            console.error(`Product ${item.productId} not found`);
            return null;
          }

          return {
            id: item._id,
            productId: item.productId,
            product,
            quantity: item.quantity,
            userId,
          };
        }).filter(Boolean) as CartItem[];

        setCartItems(items);
      } else {
        // If not logged in or no backend cart, try to load from localStorage
        const storageKey = userId ? `cart-${userId}` : `cart-guest`;
        const storedCart = localStorage.getItem(storageKey);

        if (storedCart) {
          try {
            const parsedCart = JSON.parse(storedCart);

            // Validate the cart items
            const validCartItems = parsedCart.filter((item: any) => {
              // Make sure the product exists in allProducts
              const product = allProducts?.find(p => p._id === item.productId);
              return product !== undefined;
            });

            setCartItems(validCartItems);
          } catch (error) {
            console.error("Failed to parse cart from localStorage:", error);
            // Clear invalid cart data
            localStorage.removeItem(storageKey);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Save cart items to localStorage
  useEffect(() => {
    // Save to localStorage when cart items change
    if (cartItems.length > 0) {
      // For logged-in users, use their ID as the key
      // For guest users, use 'guest' as the key
      const storageKey = userId ? `cart-${userId}` : `cart-guest`;
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  // Calculate cart totals
  const cartTotals = calculateCartTotals(cartItems);

  // 3. All useMutation hooks - ensure consistent order
  // Add item to cart mutation
  const addToCartMutation = useMutation(api.cart.addItem);
  const addToCart = addToCartMutation;

  // Add an item to the cart
  const addItem = async (productId: ProductId, quantity: number = 1) => {
    try {
      // Find the product in the fetched products
      const product = allProducts?.find(p => p._id === productId);

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if the item is already in the cart
      const existingItem = cartItems.find(item => item.productId === productId);

      if (existingItem) {
        // Update the quantity in local state
        setCartItems(cartItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));

        // Update the quantity in the backend if user is logged in
        if (userId && addToCart) {
          await addToCart({
            userId: userId as Id<"users">,
            productId: productId as Id<"products">,
            quantity: existingItem.quantity + quantity,
          });
        }
      } else {
        // Add a new item to local state
        const newItem: CartItem = {
          id: `cart-item-${Date.now()}`,
          productId,
          product,
          quantity,
          userId,
        };

        setCartItems([...cartItems, newItem]);

        // Add the item to the backend if user is logged in
        if (userId && addToCart) {
          await addToCart({
            userId: userId as Id<"users">,
            productId: productId as Id<"products">,
            quantity,
          });
        }
      }

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  // Update cart item mutation
  const updateCartItemMutation = useMutation(api.cart.updateQuantity);
  const updateCartItem = updateCartItemMutation;

  // Remove cart item mutation
  const removeCartItemMutation = useMutation(api.cart.removeItem);
  const removeCartItem = removeCartItemMutation;

  // Update the quantity of a cart item
  const updateItem = async (cartItemId: CartItemId, quantity: number) => {
    try {
      if (quantity <= 0) {
        // Remove the item if quantity is 0 or less
        setCartItems(cartItems.filter(item => item.id !== cartItemId));

        // Remove from backend if user is logged in
        if (userId && removeCartItem) {
          await removeCartItem({
            id: cartItemId as Id<"cartItems">,
          });
        }

        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
        });
      } else {
        // Update the quantity in local state
        setCartItems(cartItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity }
            : item
        ));

        // Update in backend if user is logged in
        if (userId && updateCartItem) {
          await updateCartItem({
            id: cartItemId as Id<"cartItems">,
            quantity,
          });
        }

        toast({
          title: "Cart updated",
          description: "Cart has been updated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  // Remove an item from the cart
  const removeItem = async (cartItemId: CartItemId) => {
    try {
      // Remove from local state
      setCartItems(cartItems.filter(item => item.id !== cartItemId));

      // Remove from backend if user is logged in
      if (userId && removeCartItem) {
        await removeCartItem({
          id: cartItemId as Id<"cartItems">,
        });
      }

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  // Clear cart mutation
  const clearCartMutation = useMutation(api.cart.clearCart);
  const clearCart = clearCartMutation;

  // Clear the cart
  const emptyCart = async () => {
    if (!userId) return;

    try {
      // Clear local state
      setCartItems([]);

      // Clear backend cart if user is logged in
      if (userId && clearCart) {
        await clearCart({
          userId: userId as Id<"users">,
        });
      }

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  return {
    cartItems,
    cartTotals,
    addItem,
    updateItem,
    removeItem,
    emptyCart,
    isLoading,
  };
}

/**
 * Calculate cart totals
 * @param cartItems - Cart items
 * @returns Cart totals
 */
function calculateCartTotals(cartItems: CartItem[]) {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Calculate tax (8%)
  const tax = subtotal * 0.08;

  // Calculate shipping (flat rate of $5 for orders under $50, free for orders over $50)
  const shipping = subtotal < 50 ? 5 : 0;

  // Calculate total
  const total = subtotal + tax + shipping;

  // Calculate item count
  const itemCount = cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  };
}
