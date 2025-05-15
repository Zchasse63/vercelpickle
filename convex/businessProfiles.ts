import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get all business profiles
 * @returns List of all business profiles
 */
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("businessProfiles").collect();
  },
});

/**
 * Get a business profile by ID
 * @param id - Business profile ID
 * @returns Business profile or null if not found
 */
export const getById = query({
  args: { id: v.id("businessProfiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get a business profile by user ID
 * @param userId - User ID
 * @returns Business profile or null if not found
 */
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("businessProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return profiles.length > 0 ? profiles[0] : null;
  },
});

/**
 * Create a new business profile
 * @param data - Business profile data
 * @returns ID of the created business profile
 */
export const create = mutation({
  args: {
    userId: v.id("users"),
    businessName: v.string(),
    description: v.string(), // Changed from optional to required
    businessType: v.union(
      v.literal("distributor"),
      v.literal("restaurant"),
      v.literal("retailer"),
      v.literal("manufacturer"),
      v.literal("other")
    ),
    industry: v.string(),
    email: v.string(),
    taxId: v.optional(v.string()),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("rejected")
    ),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // Check if user already has a business profile
    const existingProfile = await ctx.db
      .query("businessProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingProfile) {
      throw new Error(`User with ID ${args.userId} already has a business profile`);
    }

    // Create the business profile
    const profileId = await ctx.db.insert("businessProfiles", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return profileId;
  },
});

/**
 * Update a business profile
 * @param id - Business profile ID
 * @param data - Updated business profile data
 * @returns ID of the updated business profile
 */
export const update = mutation({
  args: {
    id: v.id("businessProfiles"),
    businessName: v.optional(v.string()),
    description: v.optional(v.string()),
    businessType: v.optional(
      v.union(
        v.literal("distributor"),
        v.literal("restaurant"),
        v.literal("retailer"),
        v.literal("manufacturer"),
        v.literal("other")
      )
    ),
    industry: v.optional(v.string()),
    email: v.optional(v.string()),
    taxId: v.optional(v.string()),
    verificationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
      )
    ),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        country: v.string(),
      })
    ),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Check if business profile exists
    const existingProfile = await ctx.db.get(id);
    if (!existingProfile) {
      throw new Error(`Business profile with ID ${id} not found`);
    }

    // Update the business profile
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Create a default business profile for admin if needed
 * @param userId - Admin user ID
 * @returns Created business profile ID or existing one
 */
export const createDefaultForAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // Check if user already has a business profile
    const existingProfile = await ctx.db
      .query("businessProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingProfile) {
      return { profileId: existingProfile._id, created: false };
    }

    // Create a default business profile for the admin
    const profileId = await ctx.db.insert("businessProfiles", {
      userId: args.userId,
      businessName: "Pickle Admin Store",
      description: "Default store for system administration",
      businessType: "distributor",
      industry: "Food Distribution",
      email: "admin@pickle.com",
      verificationStatus: "verified",
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { profileId, created: true };
  },
});
