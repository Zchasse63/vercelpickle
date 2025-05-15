# Enhanced Product Schema Documentation

This document provides information about the enhanced product schema in the Pickle B2B Marketplace platform.

## Overview

The enhanced product schema provides a comprehensive structure for storing detailed product information, including:

- Basic product details (name, description, price, etc.)
- Categorization (category, subcategory, tags)
- Detailed specifications (dietary, environmental, physical properties, etc.)
- Origin information (country, region, farm, producer)
- Certifications and compliance
- Product features and benefits
- Nutritional information
- Storage and handling instructions

## Schema Structure

The product schema is defined in `convex/schema.ts` and includes the following main sections:

### Basic Product Information

```typescript
{
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
}
```

### Legacy Fields (for backward compatibility)

```typescript
{
  isOrganic: v.optional(v.boolean()),
  isLocal: v.optional(v.boolean()),
}
```

### Enhanced Product Data

```typescript
{
  features: v.optional(v.array(v.string())),
  specifications: v.optional(
    v.object({
      // General specifications
      packaging: v.optional(v.string()),
      casePack: v.optional(v.string()),
      quantity: v.optional(v.string()),
      size: v.optional(v.string()),
      // ... more specifications ...
      
      // Dietary information
      dietary: v.optional(
        v.object({
          organic: v.optional(v.boolean()),
          glutenFree: v.optional(v.boolean()),
          lactoseFree: v.optional(v.boolean()),
          // ... more dietary options ...
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
          grade: v.optional(v.string()),
          inspectionDate: v.optional(v.number()),
          shelfLife: v.optional(
            v.object({
              value: v.optional(v.number()),
              unit: v.optional(v.string()),
            })
          ),
        })
      ),
    })
  ),
  
  // Origin information
  origin: v.optional(
    v.object({
      country: v.optional(v.string()),
      region: v.optional(v.string()),
      farm: v.optional(v.string()),
      producer: v.optional(v.string()),
    })
  ),
  
  // Certifications
  certifications: v.optional(v.array(v.string())),
}
```

## Using the Enhanced Schema

### Creating Products

When creating products, you can include the enhanced specifications to provide more detailed information:

```javascript
const productId = await ctx.db.insert("products", {
  name: "Organic Heirloom Tomatoes",
  description: "Juicy, flavorful organic heirloom tomatoes.",
  price: 4.99,
  category: "Fruits & Vegetables",
  subcategory: "Vegetables",
  unit: "lb",
  inventory: 150,
  images: ["/images/products/tomatoes.jpg"],
  
  // Enhanced data
  features: [
    "Grown without synthetic pesticides",
    "Harvested at peak ripeness",
    "Multiple varieties with unique colors and flavors"
  ],
  specifications: {
    dietary: {
      organic: true,
      vegan: true,
      vegetarian: true,
      nonGMO: true
    },
    environmental: {
      ecofriendly: true,
      compostable: true
    }
  },
  origin: {
    country: "USA",
    region: "California",
    farm: "Sunshine Organic Farm"
  },
  certifications: ["USDA Organic", "Non-GMO Project Verified"],
  
  // Standard fields
  sellerId: sellerId,
  sellerName: sellerName,
  status: "active",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Querying Products with Filters

The enhanced schema supports advanced filtering capabilities:

```javascript
// Query products with dietary filters
const organicProducts = await ctx.db
  .query("products")
  .filter(q => 
    q.or(
      q.eq(q.field("isOrganic"), true),
      q.eq(q.field("specifications.dietary.organic"), true)
    )
  )
  .collect();

// Query products with environmental filters
const ecofriendlyProducts = await ctx.db
  .query("products")
  .filter(q => q.eq(q.field("specifications.ecofriendly"), true))
  .collect();

// Query products by origin
const californiaProducts = await ctx.db
  .query("products")
  .filter(q => q.eq(q.field("origin.region"), "California"))
  .collect();
```

## Frontend Integration

The frontend components have been updated to support the enhanced product schema:

1. **Product Card**: Displays badges for dietary and environmental attributes
2. **Product Detail Page**: Shows comprehensive specifications in organized sections
3. **Product Filters**: Allows filtering by dietary preferences, environmental attributes, origin, and more

## Seeding Enhanced Products

Two scripts are provided to help populate the database with enhanced product data:

1. **seed-enhanced-products.js**: Seeds new products with enhanced specifications
   ```
   npx convex run scripts/seed-enhanced-products.js
   ```

2. **enhance-existing-products.js**: Updates existing products with enhanced specifications
   ```
   npx convex run scripts/enhance-existing-products.js
   ```

## Best Practices

1. **Backward Compatibility**: Always check for both legacy fields and enhanced fields when querying
2. **Graceful Degradation**: Handle missing fields gracefully in the UI
3. **Consistent Structure**: Follow the established schema structure when adding new products
4. **Performance**: Use appropriate indexes for frequently filtered fields

## Future Enhancements

Potential future enhancements to the product schema:

1. **Nutritional Analysis**: More detailed nutritional information
2. **Allergen Warnings**: Standardized allergen information
3. **Sustainability Metrics**: Carbon footprint, water usage, etc.
4. **Supply Chain Tracking**: Farm-to-table traceability
5. **Seasonal Availability**: Information about seasonal availability
