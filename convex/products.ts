import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Get all products with comprehensive filtering, sorting, and pagination
 * @returns Paginated list of filtered and sorted products
 */
export const getAll = query({
  args: {
    // Pagination parameters
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),

    // Sorting parameters
    sortBy: v.optional(v.string()),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),

    // Filtering parameters
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    sellerId: v.optional(v.id("users")),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    isOrganic: v.optional(v.boolean()),
    isLocal: v.optional(v.boolean()),
    status: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Set default values
      const limit = args.limit || 20;
      const sortBy = args.sortBy || "createdAt";
      const sortDirection = args.sortDirection || "desc";

      // Start building the query
      let productsQuery = ctx.db.query("products");

      // Apply filters
      if (args.category) {
        productsQuery = productsQuery.withIndex("by_category", q =>
          q.eq("category", args.category)
        );
      }

      if (args.subcategory) {
        productsQuery = productsQuery.withIndex("by_subcategory", q =>
          q.eq("subcategory", args.subcategory)
        );
      }

      if (args.sellerId) {
        productsQuery = productsQuery.withIndex("by_seller", q =>
          q.eq("sellerId", args.sellerId)
        );
      }

      if (args.status) {
        productsQuery = productsQuery.withIndex("by_status", q =>
          q.eq("status", args.status)
        );
      }

      // Apply additional filters that don't have indexes
      // These will be applied after the initial query
      let filterFn = (q: any) => q;

      if (args.minPrice !== undefined || args.maxPrice !== undefined) {
        filterFn = (q: any) => {
          let filter = q;
          if (args.minPrice !== undefined) {
            filter = filter.gte(q.field("price"), args.minPrice);
          }
          if (args.maxPrice !== undefined) {
            filter = filter.lte(q.field("price"), args.maxPrice);
          }
          return filter;
        };
      }

      if (args.isOrganic !== undefined) {
        const prevFilterFn = filterFn;
        filterFn = (q: any) => {
          return prevFilterFn(q).eq(q.field("isOrganic"), args.isOrganic);
        };
      }

      if (args.isLocal !== undefined) {
        const prevFilterFn = filterFn;
        filterFn = (q: any) => {
          return prevFilterFn(q).eq(q.field("isLocal"), args.isLocal);
        };
      }

      // Apply the filter function
      productsQuery = productsQuery.filter(filterFn);

      // Apply sorting
      if (sortDirection === "asc") {
        productsQuery = productsQuery.order("asc");
      } else {
        productsQuery = productsQuery.order("desc");
      }

      // Apply pagination
      if (args.cursor) {
        const cursorObj = JSON.parse(args.cursor);
        productsQuery = productsQuery.paginate(cursorObj);
      }

      // Execute the query with pagination
      const paginationResult = await productsQuery.paginate({ limit: limit + 1 });
      const { page, continueCursor } = paginationResult;

      // Check if there are more results
      const hasMore = page.length > limit;
      const items = hasMore ? page.slice(0, limit) : page;

      // Apply text search if provided (client-side filtering)
      let filteredItems = items;
      if (args.search) {
        const searchLower = args.search.toLowerCase();
        filteredItems = items.filter(product => {
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          );
        });
      }

      // Return the paginated result
      return {
        items: filteredItems,
        nextCursor: hasMore ? JSON.stringify(continueCursor) : undefined,
        hasMore,
      };
    } catch (error) {
      console.error("Error in getAll query:", error);
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

/**
 * Get a product by ID
 * @param id - Product ID
 * @returns Product or null if not found
 */
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    try {
      return await ctx.db.get(args.id);
    } catch (error) {
      console.error("Error in getById query:", error);
      return null;
    }
  },
});

/**
 * Get products by category with pagination
 * @param category - Category name
 * @returns Paginated list of products in the category
 */
export const getByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    try {
      // Set default values
      const limit = args.limit || 20;
      const sortDirection = args.sortDirection || "desc";

      // Build the query
      let productsQuery = ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category));

      // Apply sorting
      if (sortDirection === "asc") {
        productsQuery = productsQuery.order("asc");
      } else {
        productsQuery = productsQuery.order("desc");
      }

      // Apply pagination
      if (args.cursor) {
        const cursorObj = JSON.parse(args.cursor);
        productsQuery = productsQuery.paginate(cursorObj);
      }

      // Execute the query with pagination
      const paginationResult = await productsQuery.paginate({ limit: limit + 1 });
      const { page, continueCursor } = paginationResult;

      // Check if there are more results
      const hasMore = page.length > limit;
      const items = hasMore ? page.slice(0, limit) : page;

      // Return the paginated result
      return {
        items,
        nextCursor: hasMore ? JSON.stringify(continueCursor) : undefined,
        hasMore,
      };
    } catch (error) {
      console.error("Error in getByCategory query:", error);
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

/**
 * Get products by seller with pagination
 * @param sellerId - Seller ID
 * @returns Paginated list of products by the seller
 */
export const getBySeller = query({
  args: {
    sellerId: v.id("users"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Set default values
      const limit = args.limit || 20;
      const sortDirection = args.sortDirection || "desc";

      // Build the query
      let productsQuery = ctx.db
        .query("products")
        .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId));

      // Apply status filter if provided
      if (args.status) {
        productsQuery = productsQuery.filter(q => q.eq(q.field("status"), args.status));
      }

      // Apply sorting
      if (sortDirection === "asc") {
        productsQuery = productsQuery.order("asc");
      } else {
        productsQuery = productsQuery.order("desc");
      }

      // Apply pagination
      if (args.cursor) {
        const cursorObj = JSON.parse(args.cursor);
        productsQuery = productsQuery.paginate(cursorObj);
      }

      // Execute the query with pagination
      const paginationResult = await productsQuery.paginate({ limit: limit + 1 });
      const { page, continueCursor } = paginationResult;

      // Check if there are more results
      const hasMore = page.length > limit;
      const items = hasMore ? page.slice(0, limit) : page;

      // Return the paginated result
      return {
        items,
        nextCursor: hasMore ? JSON.stringify(continueCursor) : undefined,
        hasMore,
      };
    } catch (error) {
      console.error("Error in getBySeller query:", error);
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

/**
 * Create a new product with comprehensive specifications
 * @param data - Product data
 * @returns ID of the created product
 */
export const create = mutation({
  args: {
    // Basic product information
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

    // Legacy fields (keeping for backward compatibility)
    isOrganic: v.optional(v.boolean()),
    isLocal: v.optional(v.boolean()),

    // Enhanced product data
    features: v.optional(v.array(v.string())),
    specifications: v.optional(v.any()),
    nutritionFacts: v.optional(v.string()),
    allergens: v.optional(v.array(v.string())),
    storageInstructions: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),

    // Origin information
    origin: v.optional(
      v.object({
        country: v.optional(v.string()),
        region: v.optional(v.string()),
        farm: v.optional(v.string()),
        producer: v.optional(v.string()),
      })
    ),

    // Product variants
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
  },
  handler: async (ctx, args) => {
    // Get seller information if sellerName is not provided
    let sellerName = args.sellerName;
    if (!sellerName && args.sellerId) {
      const seller = await ctx.db.get(args.sellerId);
      if (seller) {
        sellerName = seller.businessName || seller.name;
      }
    }

    // Set default status if not provided
    const status = args.status || "active";

    // Insert the product
    const productId = await ctx.db.insert("products", {
      ...args,
      sellerName,
      status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return productId;
  },
});

/**
 * Update a product with comprehensive specifications
 * @param id - Product ID
 * @param data - Updated product data
 * @returns ID of the updated product
 */
export const update = mutation({
  args: {
    id: v.id("products"),

    // Basic product information
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    sellerId: v.optional(v.id("users")),
    sellerName: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    inventory: v.optional(v.number()),
    unit: v.optional(v.string()),
    minimumOrder: v.optional(v.number()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    // Legacy fields (keeping for backward compatibility)
    isOrganic: v.optional(v.boolean()),
    isLocal: v.optional(v.boolean()),

    // Enhanced product data
    features: v.optional(v.array(v.string())),
    specifications: v.optional(v.any()),
    nutritionFacts: v.optional(v.string()),
    allergens: v.optional(v.array(v.string())),
    storageInstructions: v.optional(v.string()),
    certifications: v.optional(v.array(v.string())),

    // Origin information
    origin: v.optional(
      v.object({
        country: v.optional(v.string()),
        region: v.optional(v.string()),
        farm: v.optional(v.string()),
        producer: v.optional(v.string()),
      })
    ),

    // Product variants
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // Get the existing product
    const existingProduct = await ctx.db.get(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // If sellerId is changing, update sellerName
    let updateData = { ...data };
    if (data.sellerId && data.sellerId !== existingProduct.sellerId && !data.sellerName) {
      const seller = await ctx.db.get(data.sellerId);
      if (seller) {
        updateData.sellerName = seller.businessName || seller.name;
      }
    }

    // Handle specifications updates
    if (data.specifications) {
      // Merge specifications rather than replacing them
      updateData.specifications = {
        ...existingProduct.specifications,
        ...data.specifications,
      };
    }

    // Update the product
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Delete a product
 * @param id - Product ID
 * @returns ID of the deleted product
 */
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    // Get the existing product
    const existingProduct = await ctx.db.get(args.id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${args.id} not found`);
    }

    // Delete the product
    await ctx.db.delete(args.id);

    return args.id;
  },
});

/**
 * Get all categories
 * @returns List of all unique categories
 */
export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();
      const categories = new Set<string>();

      products.forEach(product => {
        categories.add(product.category);
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error("Error in getAllCategories query:", error);
      return [];
    }
  },
});

/**
 * Get all subcategories for a category
 * @param category - Category name
 * @returns List of all unique subcategories for the category
 */
export const getSubcategoriesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    try {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .collect();

      const subcategories = new Set<string>();

      products.forEach(product => {
        if (product.subcategory) {
          subcategories.add(product.subcategory);
        }
      });

      return Array.from(subcategories).sort();
    } catch (error) {
      console.error("Error in getSubcategoriesByCategory query:", error);
      return [];
    }
  },
});

/**
 * Get all subcategories
 * @returns List of all unique subcategories
 */
export const getAllSubcategories = query({
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();
      const subcategories = new Set<string>();

      products.forEach(product => {
        if (product.subcategory) {
          subcategories.add(product.subcategory);
        }
      });

      return Array.from(subcategories).sort();
    } catch (error) {
      console.error("Error in getAllSubcategories query:", error);
      return [];
    }
  },
});

/**
 * Get all certifications
 * @returns List of all unique certifications
 */
export const getAllCertifications = query({
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();
      const certifications = new Set<string>();

      products.forEach(product => {
        // Check top-level certifications
        if (product.certifications && Array.isArray(product.certifications)) {
          product.certifications.forEach((cert: string) => certifications.add(cert));
        }

        // Check certifications in specifications
        if (product.specifications?.certifications && Array.isArray(product.specifications.certifications)) {
          product.specifications.certifications.forEach((cert: string) => certifications.add(cert));
        }
      });

      // Add some default certifications if none are found
      if (certifications.size === 0) {
        ['Organic', 'Non-GMO', 'Fair Trade', 'Gluten-Free', 'Vegan', 'Kosher', 'Halal'].forEach(cert =>
          certifications.add(cert)
        );
      }

      return Array.from(certifications).sort();
    } catch (error) {
      console.error("Error in getAllCertifications query:", error);
      return [];
    }
  },
});

/**
 * Get all origins (countries and regions)
 * @returns List of all unique origins
 */
export const getAllOrigins = query({
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();
      const origins = new Set<string>();

      products.forEach(product => {
        if (product.origin) {
          if (product.origin.country) {
            origins.add(product.origin.country);
          }
          if (product.origin.region) {
            origins.add(product.origin.region);
          }
          if (product.origin.farm) {
            origins.add(product.origin.farm);
          }
        }

        // Check if product is marked as local
        if (product.isLocal) {
          origins.add('Local');
        }
      });

      // Add some default origins if none are found
      if (origins.size === 0) {
        ['USA', 'Local', 'Imported', 'California', 'New York', 'Florida', 'Mexico', 'Canada'].forEach(origin =>
          origins.add(origin)
        );
      }

      return Array.from(origins).sort();
    } catch (error) {
      console.error("Error in getAllOrigins query:", error);
      return [];
    }
  },
});

/**
 * Get featured products with pagination
 * @returns Paginated list of featured products
 */
export const getFeatured = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Set default values
      const limit = args.limit || 8;

      // Build the query
      let productsQuery = ctx.db.query("products")
        .filter((q) => q.eq(q.field("status"), "active"));

      // Apply category filter if provided
      if (args.category) {
        productsQuery = ctx.db.query("products")
          .withIndex("by_category", (q) => q.eq("category", args.category))
          .filter((q) => q.eq(q.field("status"), "active"));
      }

      // Apply sorting - most recent first
      productsQuery = productsQuery.order("desc");

      // Apply pagination
      if (args.cursor) {
        const cursorObj = JSON.parse(args.cursor);
        productsQuery = productsQuery.paginate(cursorObj);
      }

      // Execute the query with pagination
      const paginationResult = await productsQuery.paginate({ limit: limit + 1 });
      const { page, continueCursor } = paginationResult;

      // Check if there are more results
      const hasMore = page.length > limit;
      const items = hasMore ? page.slice(0, limit) : page;

      // Return the paginated result
      return {
        items,
        nextCursor: hasMore ? JSON.stringify(continueCursor) : undefined,
        hasMore,
      };
    } catch (error) {
      console.error("Error in getFeatured query:", error);
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

/**
 * Get related products based on category, tags, and specifications
 * @param productId - Product ID to find related products for
 * @param category - Category to find related products in
 * @param tags - Tags to match
 * @returns List of related products
 */
export const getRelated = query({
  args: {
    productId: v.id("products"),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit || 8;

      // Get the source product
      const sourceProduct = await ctx.db.get(args.productId);
      if (!sourceProduct) {
        return [];
      }

      // Get all products
      const allProducts = await ctx.db.query("products").collect();

      // Filter products
      let relatedProducts = allProducts.filter(product => {
        // Exclude the current product
        if (product._id === args.productId) return false;

        // Only include active products
        if (product.status !== "active") return false;

        // Filter by category if provided, otherwise use the source product's category
        const category = args.category || sourceProduct.category;
        if (category && product.category !== category) return false;

        return true;
      });

    // Apply additional filtering based on tags and specifications
    if (relatedProducts.length > limit) {
      // Score products based on similarity
      const scoredProducts = relatedProducts.map(product => {
        let score = 0;

        // Score based on matching subcategory
        if (product.subcategory && product.subcategory === sourceProduct.subcategory) {
          score += 5;
        }

        // Score based on matching tags
        const sourceTags = sourceProduct.tags || [];
        const productTags = product.tags || [];
        const matchingTags = sourceTags.filter(tag => productTags.includes(tag));
        score += matchingTags.length * 2;

        // Score based on matching specifications
        if (sourceProduct.specifications && product.specifications) {
          // Check dietary specifications
          if (sourceProduct.specifications.dietary && product.specifications.dietary) {
            const sourceDietary = Object.entries(sourceProduct.specifications.dietary)
              .filter(([_, value]) => value === true)
              .map(([key, _]) => key);

            const productDietary = Object.entries(product.specifications.dietary)
              .filter(([_, value]) => value === true)
              .map(([key, _]) => key);

            const matchingDietary = sourceDietary.filter(item => productDietary.includes(item));
            score += matchingDietary.length;
          }

          // Check environmental specifications
          if (sourceProduct.isOrganic && product.isOrganic) {
            score += 1;
          }

          if (sourceProduct.isLocal && product.isLocal) {
            score += 1;
          }
        }

        // Score based on seller
        if (product.sellerId === sourceProduct.sellerId) {
          score += 3;
        }

        return { product, score };
      });

      // Sort by score (highest first) and take the top results
      scoredProducts.sort((a, b) => b.score - a.score);
      relatedProducts = scoredProducts.slice(0, limit).map(item => item.product);
    }

      return relatedProducts;
    } catch (error) {
      console.error("Error in getRelated query:", error);
      return [];
    }
  },
});

/**
 * Get recommended products based on user preferences and browsing history
 * @param userId - User ID to get recommendations for
 * @returns List of recommended products
 */
export const getRecommended = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit || 8;

      // Simple implementation - just get active products
      const products = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect();

      // Apply limit
      return products.slice(0, limit);
    } catch (error) {
      console.error("Error in getRecommended query:", error);
      return [];
    }
  },
});

/**
 * Get product counts by seller
 * @returns List of seller IDs with their product counts
 */
export const getProductCountsBySeller = query({
  handler: async (ctx) => {
    try {
      const products = await ctx.db.query("products").collect();

      // Count products by seller
      const sellerCounts = new Map<string, number>();

      products.forEach(product => {
        const sellerId = product.sellerId;
        sellerCounts.set(sellerId, (sellerCounts.get(sellerId) || 0) + 1);
      });

      // Convert to array of objects
      return Array.from(sellerCounts.entries()).map(([sellerId, count]) => ({
        sellerId,
        count
      }));
    } catch (error) {
      console.error("Error in getProductCountsBySeller query:", error);
      return [];
    }
  },
});

/**
 * Get products by seller
 * @param sellerId - Seller ID
 * @returns List of products by the seller
 */
export const getBySellerV2 = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("products")
        .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
        .collect();
    } catch (error) {
      console.error("Error in getBySellerV2 query:", error);
      return [];
    }
  },
});