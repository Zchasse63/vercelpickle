import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all reviews
 * @returns List of all reviews
 */
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

/**
 * Get reviews by product
 * @param productId - Product ID
 * @returns List of reviews for the product
 */
export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

/**
 * Get reviews by user
 * @param userId - User ID
 * @returns List of reviews by the user
 */
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Create a new review
 * @param productId - Product ID
 * @param userId - User ID
 * @param rating - Rating (1-5)
 * @param title - Review title
 * @param content - Review content
 * @returns ID of the created review
 */
export const create = mutation({
  args: {
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Create the review
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      helpfulCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return reviewId;
  },
});

/**
 * Update a review
 * @param id - Review ID
 * @param rating - Rating (1-5)
 * @param title - Review title
 * @param content - Review content
 * @returns ID of the updated review
 */
export const update = mutation({
  args: {
    id: v.id("reviews"),
    rating: v.optional(v.number()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Get the existing review
    const existingReview = await ctx.db.get(id);
    if (!existingReview) {
      throw new Error(`Review with ID ${id} not found`);
    }

    // Validate rating if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Update the review
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Delete a review
 * @param id - Review ID
 * @returns ID of the deleted review
 */
export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    // Get the existing review
    const existingReview = await ctx.db.get(args.id);
    if (!existingReview) {
      throw new Error(`Review with ID ${args.id} not found`);
    }

    // Delete the review
    await ctx.db.delete(args.id);

    return args.id;
  },
});

/**
 * Mark a review as helpful
 * @param id - Review ID
 * @returns ID of the updated review
 */
export const markHelpful = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    // Get the existing review
    const existingReview = await ctx.db.get(args.id);
    if (!existingReview) {
      throw new Error(`Review with ID ${args.id} not found`);
    }

    // Increment the helpful count
    await ctx.db.patch(args.id, {
      helpfulCount: (existingReview.helpfulCount || 0) + 1,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});
