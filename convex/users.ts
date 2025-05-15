import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all users
 * @returns List of all users
 */
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

/**
 * Get a user by ID
 * @param id - User ID
 * @returns User or null if not found
 */
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get a user by email
 * @param email - User email
 * @returns User or null if not found
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    return users.length > 0 ? users[0] : null;
  },
});

/**
 * Get users by role
 * @param role - User role
 * @returns List of users with the specified role
 */
export const getByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
  },
});

/**
 * Get the first admin user (for importing products)
 * @returns First admin user or null if none found
 */
export const getFirstAdmin = query({
  args: {},
  handler: async (ctx) => {
    const adminUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    return adminUsers.length > 0 ? adminUsers[0] : null;
  },
});

/**
 * Create a new user
 * @param data - User data
 * @returns ID of the created user
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user with this email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error(`User with email ${args.email} already exists`);
    }

    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

/**
 * Update a user
 * @param id - User ID
 * @param data - Updated user data
 * @returns ID of the updated user
 */
export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Get the existing user
    const existingUser = await ctx.db.get(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    // If email is being updated, check if it's already in use
    if (data.email && data.email !== existingUser.email) {
      const email = data.email as string; // Ensure email is treated as string
      const userWithEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (userWithEmail) {
        throw new Error(`User with email ${data.email} already exists`);
      }
    }

    // Update the user
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Delete a user
 * @param id - User ID
 * @returns ID of the deleted user
 */
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Get the existing user
    const existingUser = await ctx.db.get(args.id);
    if (!existingUser) {
      throw new Error(`User with ID ${args.id} not found`);
    }

    // Delete the user
    await ctx.db.delete(args.id);

    return args.id;
  },
});

/**
 * Get all sellers
 * @returns List of all users with role "seller"
 */
export const getSellers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "seller"))
      .collect();
  },
});

/**
 * Get all buyers
 * @returns List of all users with role "buyer"
 */
export const getBuyers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "buyer"))
      .collect();
  },
});

/**
 * Get user's favorite products
 * @param userId - User ID
 * @returns List of favorite products for the user
 */
export const getFavoriteProducts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get favorite products for the user
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", args.userId).eq("type", "product")
      )
      .collect();

    // If no favorites, return empty array
    if (favorites.length === 0) {
      return [];
    }

    // Get product details for each favorite
    const favoriteProducts = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await ctx.db.get(favorite.itemId);
        return {
          ...favorite,
          product,
        };
      })
    );

    return favoriteProducts;
  },
});

/**
 * Get user's favorite sellers
 * @param userId - User ID
 * @returns List of favorite sellers for the user
 */
export const getFavoriteSellers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get favorite sellers for the user
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user_type", (q) =>
        q.eq("userId", args.userId).eq("type", "seller")
      )
      .collect();

    // If no favorites, return empty array
    if (favorites.length === 0) {
      return [];
    }

    // Get seller details for each favorite
    const favoriteSellers = await Promise.all(
      favorites.map(async (favorite) => {
        const seller = await ctx.db.get(favorite.itemId);
        return {
          ...favorite,
          seller,
        };
      })
    );

    return favoriteSellers;
  },
});

/**
 * Add a favorite
 * @param userId - User ID
 * @param itemId - Item ID (product or seller)
 * @param type - Type of favorite ("product" or "seller")
 * @returns ID of the created favorite
 */
export const addFavorite = mutation({
  args: {
    userId: v.id("users"),
    itemId: v.id("products"),
    type: v.union(v.literal("product"), v.literal("seller")),
  },
  handler: async (ctx, args) => {
    // Check if the user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // Check if the item exists
    if (args.type === "product") {
      const product = await ctx.db.get(args.itemId);
      if (!product) {
        throw new Error(`Product with ID ${args.itemId} not found`);
      }
    } else {
      const seller = await ctx.db.get(args.itemId);
      if (!seller) {
        throw new Error(`Seller with ID ${args.itemId} not found`);
      }
    }

    // Check if the favorite already exists
    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", args.userId).eq("itemId", args.itemId)
      )
      .first();

    if (existingFavorite) {
      return existingFavorite._id;
    }

    // Add the favorite
    const favoriteId = await ctx.db.insert("favorites", {
      userId: args.userId,
      itemId: args.itemId,
      type: args.type,
      createdAt: Date.now(),
    });

    return favoriteId;
  },
});

/**
 * Remove a favorite
 * @param userId - User ID
 * @param itemId - Item ID (product or seller)
 * @returns true if successful
 */
export const removeFavorite = mutation({
  args: {
    userId: v.id("users"),
    itemId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Find the favorite
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", args.userId).eq("itemId", args.itemId)
      )
      .first();

    if (!favorite) {
      throw new Error(`Favorite not found`);
    }

    // Remove the favorite
    await ctx.db.delete(favorite._id);

    return true;
  },
});

/**
 * Get all business profiles
 * @returns List of all business profiles
 */
export const getBusinessProfiles = query({
  handler: async (ctx) => {
    return await ctx.db.query("businessProfiles").collect();
  },
});

/**
 * Get business profile by user ID
 * @param userId - User ID
 * @returns Business profile or null if not found
 */
export const getBusinessProfileByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businessProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
