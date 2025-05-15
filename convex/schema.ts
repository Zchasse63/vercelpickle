import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for the Pickle B2B Marketplace
 *
 * This schema defines the database tables and their relationships
 * for the Pickle B2B Marketplace platform.
 */
export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()), // Added password field
    role: v.string(), // "admin", "seller", "buyer"
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    // Additional fields for user profiles
    businessName: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Products table
  products: defineTable({
    // Basic product information
    name: v.string(),
    description: v.string(),
    price: v.number(),
    sellerId: v.id("users"),
    sellerName: v.optional(v.string()), // Added for easier frontend display
    category: v.string(),
    subcategory: v.optional(v.string()),
    images: v.array(v.string()),
    inventory: v.number(),
    unit: v.string(), // e.g., "lb", "kg", "each"
    minimumOrder: v.optional(v.number()),
    status: v.optional(v.string()), // "active", "inactive", "out_of_stock"
    tags: v.optional(v.array(v.string())), // For additional categorization

    // Legacy fields (keeping for backward compatibility)
    isOrganic: v.optional(v.boolean()),
    isLocal: v.optional(v.boolean()),

    // Enhanced product data
    features: v.optional(v.array(v.string())),
    specifications: v.optional(
      v.object({
        // General specifications
        packaging: v.optional(v.string()),
        casePack: v.optional(v.string()),
        quantity: v.optional(v.string()),
        size: v.optional(v.string()),
        diameter: v.optional(v.string()),
        length: v.optional(v.string()),
        width: v.optional(v.string()),
        height: v.optional(v.string()),
        weight: v.optional(v.string()),
        color: v.optional(v.string()),
        material: v.optional(v.string()),
        handleMaterial: v.optional(v.string()), // Added for knife specifications
        handleColor: v.optional(v.string()),

        // Product-specific specifications
        shape: v.optional(v.string()),
        design: v.optional(v.string()),
        pattern: v.optional(v.string()),
        style: v.optional(v.string()),
        flavor: v.optional(v.string()),
        scent: v.optional(v.string()),
        container: v.optional(v.string()),

        // Physical properties
        bladeType: v.optional(v.string()),
        handleType: v.optional(v.string()),
        edgeType: v.optional(v.string()),
        textured: v.optional(v.boolean()),
        slipResistant: v.optional(v.boolean()),
        greaseResistant: v.optional(v.boolean()),
        microwavable: v.optional(v.boolean()),
        dishwasherSafe: v.optional(v.boolean()),

        // Food-specific specifications
        servingSize: v.optional(v.string()),
        caloriesPerServing: v.optional(v.string()),
        storage: v.optional(v.string()),

        // Equipment specifications
        capacity: v.optional(v.string()),
        speed: v.optional(v.string()),
        power: v.optional(v.string()),
        clutch: v.optional(v.string()),
        control: v.optional(v.string()),
        blades: v.optional(v.string()),
        base: v.optional(v.string()),
        compatibleWith: v.optional(v.string()),

        // Chemical specifications
        activeIngredient: v.optional(v.string()),
        formType: v.optional(v.string()),
        usage: v.optional(v.string()),
        dilutionRatio: v.optional(v.string()),
        formula: v.optional(v.string()),
        concentrate: v.optional(v.boolean()),

        // Dietary information
        dietary: v.optional(
          v.object({
            organic: v.optional(v.boolean()),
            glutenFree: v.optional(v.boolean()),
            lactoseFree: v.optional(v.boolean()),
            vegan: v.optional(v.boolean()),
            vegetarian: v.optional(v.boolean()),
            kosher: v.optional(v.boolean()),
            kosherDairy: v.optional(v.boolean()),
            halal: v.optional(v.boolean()),
            nonGMO: v.optional(v.boolean()),
            cholesterolFree: v.optional(v.boolean()),
            sugarFree: v.optional(v.boolean()),
            caffeineFree: v.optional(v.boolean()),
          })
        ),

        // Environmental specifications
        ecofriendly: v.optional(v.boolean()),
        compostable: v.optional(v.boolean()),
        biodegradable: v.optional(v.boolean()),
        recyclable: v.optional(v.boolean()),

        // Quality grading
        quality: v.optional(
          v.object({
            grade: v.optional(v.string()), // "A", "B", "C", "Premium", "Standard", etc.
            inspectionDate: v.optional(v.number()),
            shelfLife: v.optional(
              v.object({
                value: v.optional(v.number()),
                unit: v.optional(v.string()), // "days", "months", etc.
              })
            ),
          })
        ),

        // Certifications
        certifications: v.optional(v.array(v.string())),
      })
    ),

    // Nutritional information
    nutritionFacts: v.optional(v.string()),
    allergens: v.optional(v.array(v.string())),
    storageInstructions: v.optional(v.string()),

    // Certifications at the product level
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
          specifications: v.optional(v.any()), // Same structure as above, but specific to variant
          images: v.optional(v.array(v.string())),
        })
      )
    ),

    // Timestamps (standardized to number)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_price", ["price"])
    .index("by_status", ["status"]),

  // Orders table
  orders: defineTable({
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
        name: v.optional(v.string()),
        sellerId: v.optional(v.id("users")),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.string(), // "pending", "processing", "shipped", "delivered", "cancelled"
    paymentStatus: v.string(), // "pending", "paid", "refunded", "failed"
    paymentMethod: v.string(),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      zip: v.optional(v.string()), // For backward compatibility
      country: v.string(),
    }),
    billingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      zip: v.optional(v.string()), // For backward compatibility
      country: v.string(),
    }),
    deliveryDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"]),

  // Reviews table
  reviews: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    helpfulCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  // Categories table
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Business profiles table
  businessProfiles: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    businessType: v.string(),
    industry: v.string(),
    description: v.string(),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.string(),
    verificationStatus: v.optional(v.string()), // "pending", "verified", "rejected"
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      zip: v.optional(v.string()), // For backward compatibility
      country: v.string(),
    }),
    socialMedia: v.optional(
      v.object({
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        twitter: v.optional(v.string()),
        linkedin: v.optional(v.string()),
      })
    ),
    certifications: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Cart items table
  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_user_product", ["userId", "productId"]),

  // Support tickets table
  supportTickets: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    description: v.string(),
    status: v.string(), // "open", "in_progress", "resolved", "closed"
    priority: v.string(), // "low", "medium", "high", "urgent"
    assignedTo: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Support ticket messages table
  supportMessages: defineTable({
    ticketId: v.id("supportTickets"),
    userId: v.id("users"),
    message: v.string(),
    createdAt: v.number(),
  }).index("by_ticket", ["ticketId"]),

  // Favorites table
  favorites: defineTable({
    userId: v.id("users"),
    itemId: v.id("products"),
    type: v.string(), // "product" or "seller"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_item", ["itemId"])
    .index("by_user_item", ["userId", "itemId"])
    .index("by_user_type", ["userId", "type"]),
});
