import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

describe("Product API Tests", () => {
  test("fetching products", async () => {
    const t = convexTest(schema);

    // Create test users first
    const seller1Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Seller One",
        email: "seller1@example.com",
        role: "seller",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const seller2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Seller Two",
        email: "seller2@example.com",
        role: "seller",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Set up test product data
    await t.run(async (ctx) => {
      await ctx.db.insert("products", {
        name: "Organic Apples",
        description: "Fresh organic apples from local farms",
        price: 24.99,
        unit: "case",
        category: "Fresh Produce",
        inventory: 100,
        sellerId: seller1Id,
        images: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await ctx.db.insert("products", {
        name: "Artisan Sourdough",
        description: "Handcrafted artisan sourdough bread",
        price: 5.99,
        unit: "loaf",
        category: "Bakery",
        inventory: 50,
        sellerId: seller2Id,
        images: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Test listing all products
    const allProducts = await t.query(api.products.getAll, {});
    expect(allProducts).toHaveLength(2);

    // Test filtering by category
    const bakeryProducts = await t.query(api.products.getByCategory, { category: "Bakery" });
    expect(bakeryProducts).toHaveLength(1);
    expect(bakeryProducts[0].name).toBe("Artisan Sourdough");

    // Test getting product by ID
    const productId = allProducts[0]._id;
    const product = await t.query(api.products.getById, { id: productId });
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Organic Apples");

    // Test filtering products (instead of search, which doesn't exist)
    const filteredProducts = await t.query(api.products.getByCategory, { category: "Fresh Produce" });
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(filteredProducts[0].name).toContain("Organic");
  });

  test("creating and updating products", async () => {
    const t = convexTest(schema);

    // Create a test seller
    const sellerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Test Seller",
        email: "testseller@example.com",
        role: "seller",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Test creating a product
    const productId = await t.mutation(api.products.create, {
      name: "Organic Carrots",
      description: "Fresh organic carrots from local farms",
      price: 12.99,
      unit: "kg",
      category: "Fresh Produce",
      inventory: 75,
      sellerId: sellerId,
      images: []
    });

    // Verify product was created
    const product = await t.query(api.products.getById, { id: productId });
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Organic Carrots");
    expect(product?.price).toBe(12.99);

    // Test updating a product
    await t.mutation(api.products.update, {
      id: productId,
      price: 14.99
    });

    // Verify product was updated
    const updatedProduct = await t.query(api.products.getById, { id: productId });
    expect(updatedProduct?.price).toBe(14.99);

    // Test updating multiple fields
    await t.mutation(api.products.update, {
      id: productId,
      name: "Premium Organic Carrots",
      description: "Premium organic carrots from local sustainable farms",
      inventory: 50
    });

    // Verify multiple fields were updated
    const multiUpdatedProduct = await t.query(api.products.getById, { id: productId });
    expect(multiUpdatedProduct?.name).toBe("Premium Organic Carrots");
    expect(multiUpdatedProduct?.description).toContain("sustainable");
    expect(multiUpdatedProduct?.inventory).toBe(50);
  });

  test("deleting products", async () => {
    const t = convexTest(schema);

    // Create a test seller
    const sellerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Delete Test Seller",
        email: "delete-test@example.com",
        role: "seller",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Create a test product
    const productId = await t.mutation(api.products.create, {
      name: "Product To Delete",
      description: "This product will be deleted",
      price: 9.99,
      unit: "each",
      category: "Test",
      inventory: 10,
      sellerId: sellerId,
      images: []
    });

    // Verify product exists
    const product = await t.query(api.products.getById, { id: productId });
    expect(product).not.toBeNull();

    // Delete the product
    await t.mutation(api.products.remove, { id: productId });

    // Verify product was deleted
    const deletedProduct = await t.query(api.products.getById, { id: productId });
    expect(deletedProduct).toBeNull();
  });
});
