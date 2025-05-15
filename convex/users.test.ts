import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

describe("User API Tests", () => {
  test("creating and fetching users", async () => {
    const t = convexTest(schema);

    // Create test users
    const buyerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Test Buyer",
        email: "buyer@example.com",
        role: "buyer",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const sellerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Test Seller",
        email: "seller@example.com",
        role: "seller",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Test getting all users
    const allUsers = await t.query(api.users.getAll, {});
    expect(allUsers.length).toBeGreaterThanOrEqual(2);

    // Test getting user by ID
    const buyer = await t.query(api.users.getById, { id: buyerId });
    expect(buyer).not.toBeNull();
    expect(buyer?.name).toBe("Test Buyer");
    expect(buyer?.role).toBe("buyer");

    // Test getting user by email
    const seller = await t.query(api.users.getByEmail, { email: "seller@example.com" });
    expect(seller).not.toBeNull();
    expect(seller?.name).toBe("Test Seller");
    expect(seller?.role).toBe("seller");

    // Test filtering users by role
    const buyers = await t.query(api.users.getByRole, { role: "buyer" });
    expect(buyers.length).toBeGreaterThan(0);
    expect(buyers.some(user => user.email === "buyer@example.com")).toBe(true);

    const sellers = await t.query(api.users.getByRole, { role: "seller" });
    expect(sellers.length).toBeGreaterThan(0);
    expect(sellers.some(user => user.email === "seller@example.com")).toBe(true);
  });

  test("updating user profiles", async () => {
    const t = convexTest(schema);

    // Create a test user
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Update Test User",
        email: "update-test@example.com",
        role: "buyer",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Test updating user name
    await t.mutation(api.users.update, {
      id: userId,
      name: "Updated Name"
    });

    // Verify name was updated
    const updatedUser = await t.query(api.users.getById, { id: userId });
    expect(updatedUser?.name).toBe("Updated Name");

    // Test updating multiple fields
    await t.mutation(api.users.update, {
      id: userId,
      name: "Fully Updated User",
      email: "fully-updated@example.com",
      role: "seller"
    });

    // Verify multiple fields were updated
    const fullyUpdatedUser = await t.query(api.users.getById, { id: userId });
    expect(fullyUpdatedUser?.name).toBe("Fully Updated User");
    expect(fullyUpdatedUser?.email).toBe("fully-updated@example.com");
    expect(fullyUpdatedUser?.role).toBe("seller");
  });

  test("user authentication", async () => {
    const t = convexTest(schema);

    // Create a test user with password (simulating registration)
    const email = "auth-test@example.com";
    const password = "password123"; // In a real app, this would be properly hashed

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Auth Test User",
        email: email,
        role: "buyer",
        password: password, // Using the password field from the schema
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // In a real test, we would test login functionality
    // For now, we'll just check the user exists
    const user = await t.query(api.users.getByEmail, { email: email });
    expect(user).not.toBeNull();
    expect(user?.email).toBe(email);
    expect(user?.password).toBe(password);
  });
});
