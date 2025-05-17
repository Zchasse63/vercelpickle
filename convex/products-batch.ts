/**
 * Convex functions for batch product operations
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Batch create products
 */
export const batchCreate = mutation({
  args: {
    products: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        sellerId: v.id("users"),
        sellerName: v.optional(v.string()),
        category: v.string(),
        subcategory: v.optional(v.string()),
        images: v.array(v.string()),
        inventory: v.number(),
        unit: v.string(),
        minimumOrder: v.optional(v.number()),
        status: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isOrganic: v.optional(v.boolean()),
        isLocal: v.optional(v.boolean()),
        features: v.optional(v.array(v.string())),
        specifications: v.optional(v.any()),
        nutritionFacts: v.optional(v.string()),
        allergens: v.optional(v.array(v.string())),
        storageInstructions: v.optional(v.string()),
        certifications: v.optional(v.array(v.string())),
        origin: v.optional(
          v.object({
            country: v.optional(v.string()),
            region: v.optional(v.string()),
            farm: v.optional(v.string()),
            producer: v.optional(v.string()),
          })
        ),
        variants: v.optional(
          v.array(
            v.object({
              id: v.string(),
              name: v.string(),
              price: v.number(),
              inventory: v.number(),
              specifications: v.optional(v.any()),
              images: v.optional(v.array(v.string())),
            })
          )
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { products } = args;
    
    // Validate that all products have a valid seller
    for (const product of products) {
      const seller = await ctx.db.get(product.sellerId);
      if (!seller) {
        throw new Error(`Seller with ID ${product.sellerId} not found`);
      }
      
      // If sellerName is not provided, use the seller's name
      if (!product.sellerName) {
        product.sellerName = seller.name;
      }
    }
    
    // Create all products
    const productIds = await Promise.all(
      products.map(async (product) => {
        const now = Date.now();
        return await ctx.db.insert("products", {
          ...product,
          createdAt: now,
          updatedAt: now,
        });
      })
    );
    
    return productIds;
  },
});

/**
 * Batch update products
 */
export const batchUpdate = mutation({
  args: {
    products: v.array(
      v.object({
        id: v.id("products"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        category: v.optional(v.string()),
        subcategory: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        inventory: v.optional(v.number()),
        unit: v.optional(v.string()),
        minimumOrder: v.optional(v.number()),
        status: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isOrganic: v.optional(v.boolean()),
        isLocal: v.optional(v.boolean()),
        features: v.optional(v.array(v.string())),
        specifications: v.optional(v.any()),
        nutritionFacts: v.optional(v.string()),
        allergens: v.optional(v.array(v.string())),
        storageInstructions: v.optional(v.string()),
        certifications: v.optional(v.array(v.string())),
        origin: v.optional(
          v.object({
            country: v.optional(v.string()),
            region: v.optional(v.string()),
            farm: v.optional(v.string()),
            producer: v.optional(v.string()),
          })
        ),
        variants: v.optional(
          v.array(
            v.object({
              id: v.string(),
              name: v.string(),
              price: v.number(),
              inventory: v.number(),
              specifications: v.optional(v.any()),
              images: v.optional(v.array(v.string())),
            })
          )
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { products } = args;
    
    // Update all products
    const productIds = await Promise.all(
      products.map(async (product) => {
        const { id, ...updates } = product;
        
        // Check if the product exists
        const existingProduct = await ctx.db.get(id);
        if (!existingProduct) {
          throw new Error(`Product with ID ${id} not found`);
        }
        
        // Update the product
        await ctx.db.patch(id, {
          ...updates,
          updatedAt: Date.now(),
        });
        
        return id;
      })
    );
    
    return productIds;
  },
});

/**
 * Get products by IDs
 */
export const getByIds = query({
  args: {
    ids: v.array(v.id("products")),
  },
  handler: async (ctx, args) => {
    const { ids } = args;
    
    // Get all products
    const products = await Promise.all(
      ids.map(async (id) => {
        return await ctx.db.get(id);
      })
    );
    
    // Filter out any null values (products that don't exist)
    return products.filter(Boolean);
  },
});

/**
 * Get products with inventory below threshold
 */
export const getLowInventory = query({
  args: {
    threshold: v.number(),
    sellerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { threshold, sellerId } = args;
    
    // Build the query
    let productsQuery = ctx.db
      .query("products")
      .filter((q) => q.lt(q.field("inventory"), threshold));
    
    // Filter by seller if provided
    if (sellerId) {
      productsQuery = productsQuery.filter((q) => q.eq(q.field("sellerId"), sellerId));
    }
    
    // Execute the query
    const products = await productsQuery.collect();
    
    return products;
  },
});

/**
 * Get products that need reordering
 */
export const getNeedReordering = query({
  args: {
    sellerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { sellerId } = args;
    
    // Build the query
    let productsQuery = ctx.db.query("products");
    
    // Filter by seller if provided
    if (sellerId) {
      productsQuery = productsQuery.filter((q) => q.eq(q.field("sellerId"), sellerId));
    }
    
    // Execute the query
    const allProducts = await productsQuery.collect();
    
    // Filter products that need reordering (inventory below 20% of average sales)
    // In a real app, you would calculate this based on actual sales data
    const needReordering = allProducts.filter((product) => {
      // For demo purposes, we'll consider products with inventory < 5 as needing reordering
      return product.inventory < 5;
    });
    
    return needReordering;
  },
});

/**
 * Get product statistics
 */
export const getStatistics = query({
  args: {
    sellerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { sellerId } = args;
    
    // Build the query
    let productsQuery = ctx.db.query("products");
    
    // Filter by seller if provided
    if (sellerId) {
      productsQuery = productsQuery.filter((q) => q.eq(q.field("sellerId"), sellerId));
    }
    
    // Execute the query
    const products = await productsQuery.collect();
    
    // Calculate statistics
    const totalProducts = products.length;
    const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
    const averagePrice = products.length > 0
      ? products.reduce((sum, product) => sum + product.price, 0) / products.length
      : 0;
    
    // Count products by category
    const categoryCounts: Record<string, number> = {};
    products.forEach((product) => {
      const category = product.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Count products by status
    const statusCounts: Record<string, number> = {};
    products.forEach((product) => {
      const status = product.status || "active";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return {
      totalProducts,
      totalInventory,
      averagePrice,
      categoryCounts,
      statusCounts,
    };
  },
});
