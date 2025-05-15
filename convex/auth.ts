import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Authenticate a user with email and password
 * @param email - User email
 * @param password - User password (this is a simplified version, in production use proper auth)
 * @returns User data if authentication is successful, null otherwise
 */
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real app, you would use a proper authentication system
    // This is a simplified version for demonstration purposes
    
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }
    
    // In a real app, you would verify the password hash
    // For this demo, we'll just check if the password is "password"
    if (args.password !== "password") {
      return { success: false, message: "Invalid email or password" };
    }
    
    // Return the user data
    return { 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      } 
    };
  },
});

/**
 * Register a new user
 * @param name - User name
 * @param email - User email
 * @param password - User password (this is a simplified version, in production use proper auth)
 * @param role - User role (buyer, seller, admin)
 * @returns User data if registration is successful, null otherwise
 */
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the email is already in use
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUser) {
      return { success: false, message: "Email already in use" };
    }
    
    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      // In a real app, you would hash the password
      // For this demo, we'll just store it as is
      password: args.password,
      role: args.role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Return the user data
    return { 
      success: true, 
      user: {
        id: userId,
        name: args.name,
        email: args.email,
        role: args.role,
      } 
    };
  },
});

/**
 * Get the current user
 * @param userId - User ID
 * @returns User data if found, null otherwise
 */
export const me = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return null;
    }
    
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };
  },
});
