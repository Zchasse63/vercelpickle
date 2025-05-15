import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get cart items for a user
 * @param userId - User ID
 * @returns List of cart items for the user
 */
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get cart items for the user
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // If no cart items, return empty array
    if (cartItems.length === 0) {
      return [];
    }

    // Get product details for each cart item
    const cartItemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return cartItemsWithProducts;
  },
});

/**
 * Get cart items for a user (simplified version)
 * @param userId - User ID
 * @returns List of cart items for the user
 */
export const getItems = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get cart items for the user
    return await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Add an item to the cart
 * @param userId - User ID
 * @param productId - Product ID
 * @param quantity - Quantity to add
 * @returns ID of the created cart item
 */
export const addItem = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if the product exists
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error(`Product with ID ${args.productId} not found`);
    }

    // Check if the user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // Check if the product is already in the cart
    const existingCartItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingCartItem) {
      // Update the quantity
      await ctx.db.patch(existingCartItem._id, {
        quantity: existingCartItem.quantity + args.quantity,
        updatedAt: Date.now(),
      });

      return existingCartItem._id;
    }

    // Add the product to the cart
    const cartItemId = await ctx.db.insert("cartItems", {
      userId: args.userId,
      productId: args.productId,
      quantity: args.quantity,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return cartItemId;
  },
});

/**
 * Update the quantity of a cart item
 * @param cartItemId - Cart item ID
 * @param quantity - New quantity
 * @returns ID of the updated cart item
 */
export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if the cart item exists
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item with ID ${args.cartItemId} not found`);
    }

    // If quantity is 0 or less, remove the item from the cart
    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
      return args.cartItemId;
    }

    // Update the quantity
    await ctx.db.patch(args.cartItemId, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return args.cartItemId;
  },
});

/**
 * Remove an item from the cart
 * @param cartItemId - Cart item ID
 * @returns ID of the removed cart item
 */
export const removeItem = mutation({
  args: {
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, args) => {
    // Check if the cart item exists
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item with ID ${args.cartItemId} not found`);
    }

    // Remove the item from the cart
    await ctx.db.delete(args.cartItemId);

    return args.cartItemId;
  },
});

/**
 * Clear the cart for a user
 * @param userId - User ID
 * @returns Number of items removed
 */
export const clearCart = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all cart items for the user
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Remove all items from the cart
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return cartItems.length;
  },
});
