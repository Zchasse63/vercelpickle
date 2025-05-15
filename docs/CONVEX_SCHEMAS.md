# Convex Schema Definitions for Pickle B2B Marketplace

**Last Updated:** `2023-05-17`

This file contains all the schema definitions for the Convex database used in the Pickle B2B Marketplace platform. We've completed the implementation of the enhanced product schema with comprehensive specifications, supporting a wide range of product attributes and filtering capabilities.

## Convex Setup Info
- **Dashboard URL:** https://dashboard.convex.dev/t/zchasse63/vo-pickle/avid-dove-899
- **Setup Command:** `npx convex dev --configure=existing --team zchasse63 --project vo-pickle`

## Implementation Status

| Schema | Status | Notes |
|--------|--------|-------|
| Users | ✅ Complete | Basic user schema implemented |
| Products | ✅ Complete | Enhanced with comprehensive specifications |
| Orders | ✅ Complete | Order schema implemented |
| Support Tickets | ✅ Complete | Support ticket schema implemented |
| Categories | ✅ Complete | Category schema implemented |
| Reviews | ✅ Complete | Review schema implemented |
| Cart Items | ✅ Complete | Cart item schema implemented |
| Transactions | ✅ Complete | Transaction schema implemented |
| Notifications | ✅ Complete | Notification schema implemented |

## Product Schema Enhancements

We've successfully implemented a comprehensive product schema with the following enhancements:

1. **Basic Product Information**:
   - Name, description, price, category, subcategory
   - Images, inventory, unit, minimum order
   - Status, tags, seller information

2. **Detailed Specifications**:
   - General specifications (packaging, size, dimensions, etc.)
   - Product-specific specifications (shape, design, pattern, etc.)
   - Physical properties (texture, resistance, compatibility, etc.)
   - Equipment specifications (capacity, speed, power, etc.)
   - Chemical specifications (ingredients, formulas, usage, etc.)

3. **Dietary Information**:
   - Organic, gluten-free, lactose-free, vegan, vegetarian
   - Kosher, halal, non-GMO, cholesterol-free, sugar-free, caffeine-free

4. **Environmental Specifications**:
   - Eco-friendly, compostable, biodegradable, recyclable

5. **Quality Grading**:
   - Grade, inspection date, shelf life

6. **Origin Information**:
   - Country, region, farm, producer

7. **Product Variants**:
   - Support for multiple variants with different prices, inventory, and specifications

## Advanced Query Functions

We've implemented several advanced query functions to support the enhanced product schema:

1. **Comprehensive Filtering**:
   - Filter by category, subcategory, price range, seller, status, tags
   - Filter by dietary specifications (organic, gluten-free, etc.)
   - Filter by environmental specifications (eco-friendly, compostable, etc.)
   - Filter by origin (country, region)
   - Filter by inventory status

2. **Advanced Sorting**:
   - Sort by price, name, creation date
   - Support for ascending and descending order

3. **Product Recommendations**:
   - Related products based on category, tags, and specifications
   - Personalized recommendations based on user browsing and purchase history
   - Featured products for new users

4. **Search Capabilities**:
   - Full-text search across product name, description, category, and subcategory
   - Relevance scoring for search results

5. **Data Import**:
   - Import products from JSON data with comprehensive specifications
   - Integration with Pexels API for product images

## Complete Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(), // "buyer", "seller", "admin"
    status: v.string(), // "active", "inactive", "pending"
    createdAt: v.number(),
    updatedAt: v.number(),

    // Buyer-specific fields
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    shippingAddresses: v.optional(v.array(v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
      isDefault: v.boolean(),
    }))),

    // Seller-specific fields
    businessName: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    businessLogo: v.optional(v.string()),
    businessAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    })),
    taxId: v.optional(v.string()),
    bankInfo: v.optional(v.object({
      accountName: v.string(),
      accountNumber: v.string(),
      routingNumber: v.string(),
    })),
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
        handleMaterial: v.optional(v.string()),
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

    // Timestamps
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
    orderNumber: v.string(),
    buyerId: v.id("users"),
    buyerName: v.string(),
    buyerEmail: v.string(),
    sellerId: v.id("users"),
    sellerName: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      variantId: v.optional(v.string()),
      variantName: v.optional(v.string()),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    status: v.string(), // "pending", "processing", "shipped", "delivered", "cancelled"
    paymentStatus: v.string(), // "pending", "paid", "refunded", "failed"
    paymentMethod: v.string(),
    paymentId: v.optional(v.string()),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    billingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    notes: v.optional(v.string()),
    timeline: v.array(v.object({
      status: v.string(),
      date: v.number(),
      description: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_buyer", ["buyerId"]).index("by_seller", ["sellerId"]),

  // Support tickets table
  supportTickets: defineTable({
    ticketNumber: v.string(),
    subject: v.string(),
    description: v.string(),
    userId: v.id("users"),
    userName: v.string(),
    userEmail: v.string(),
    userRole: v.string(), // "buyer", "seller"
    status: v.string(), // "open", "in_progress", "closed"
    priority: v.string(), // "low", "medium", "high"
    category: v.string(),
    assignedTo: v.optional(v.string()),
    relatedOrderId: v.optional(v.id("orders")),
    messages: v.array(v.object({
      id: v.string(),
      sender: v.string(),
      senderType: v.string(), // "customer", "agent"
      message: v.string(),
      date: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Categories table
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    order: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Reviews table
  reviews: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_product", ["productId"]).index("by_user", ["userId"]),

  // Cart items table
  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    productName: v.string(),
    variantId: v.optional(v.string()),
    variantName: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
    image: v.optional(v.string()),
    sellerId: v.id("users"),
    sellerName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Transactions table
  transactions: defineTable({
    orderId: v.id("orders"),
    orderNumber: v.string(),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    amount: v.number(),
    fee: v.number(),
    net: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    paymentId: v.string(),
    status: v.string(), // "succeeded", "pending", "failed", "refunded"
    type: v.string(), // "payment", "refund", "payout"
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
  }).index("by_order", ["orderId"]).index("by_buyer", ["buyerId"]).index("by_seller", ["sellerId"]),

  // Notifications table
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "order", "payment", "system", etc.
    relatedId: v.optional(v.string()), // ID of related entity (order, product, etc.)
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
