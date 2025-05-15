import { internalMutation } from "./_generated/server";
import { seedUsers, seedBusinessProfiles, seedProducts, seedOrders, seedCartItems } from "./seedData";

/**
 * Seed the database with test data
 * This is an internal mutation that can be called from the Convex dashboard or CLI
 */
export const seed = internalMutation({
  handler: async (ctx) => {
    console.log("Starting database seeding...");

    // Seed users (buyers and sellers)
    const userIds = await seedUsers(ctx.db);

    // Seed business profiles
    await seedBusinessProfiles(ctx.db, userIds);

    // Seed products
    const productIds = await seedProducts(ctx.db, userIds.sellerIds);

    // Seed orders
    await seedOrders(ctx.db, userIds, productIds);

    // Seed cart items
    await seedCartItems(ctx.db, userIds, productIds);

    console.log("Database seeding completed successfully!");

    return {
      success: true,
      message: "Database seeded successfully",
      data: {
        userIds,
        productIds,
      },
    };
  },
});

/**
 * Clear all data from the database
 * This is an internal mutation that can be called from the Convex dashboard or CLI
 * USE WITH CAUTION: This will delete all data in the database
 */
export const clearAll = internalMutation({
  handler: async (ctx) => {
    console.log("Clearing all data from the database...");

    // Delete all cart items
    const cartItems = await ctx.db.query("cartItems").collect();
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    // Delete all orders
    const orders = await ctx.db.query("orders").collect();
    for (const order of orders) {
      await ctx.db.delete(order._id);
    }

    // Delete all products
    const products = await ctx.db.query("products").collect();
    for (const product of products) {
      await ctx.db.delete(product._id);
    }

    // Delete all business profiles
    const businessProfiles = await ctx.db.query("businessProfiles").collect();
    for (const profile of businessProfiles) {
      await ctx.db.delete(profile._id);
    }

    // Delete all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }

    console.log("All data cleared from the database!");

    return {
      success: true,
      message: "All data cleared from the database",
    };
  },
});
