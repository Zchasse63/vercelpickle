import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Define the product data structure from the JSON
interface ProductData {
  name: string;
  category: string;
  subcategory?: string;
  specifications?: {
    packaging?: string;
    quantity?: string;
    casePack?: string;
    servingSize?: string;
    caloriesPerServing?: string;
    storage?: string;
    size?: string;
    diameter?: string;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    color?: string;
    material?: string;
    handleMaterial?: string;
    handleColor?: string;
    shape?: string;
    design?: string;
    pattern?: string;
    style?: string;
    flavor?: string;
    scent?: string;
    container?: string;
    bladeType?: string;
    handleType?: string;
    edgeType?: string;
    textured?: boolean;
    slipResistant?: boolean;
    greaseResistant?: boolean;
    microwavable?: boolean;
    dishwasherSafe?: boolean;
    capacity?: string;
    speed?: string;
    power?: string;
    clutch?: string;
    control?: string;
    blades?: string;
    base?: string;
    compatibleWith?: string;
    activeIngredient?: string;
    formType?: string;
    usage?: string;
    dilutionRatio?: string;
    formula?: string;
    concentrate?: boolean;
    dietary?: {
      organic?: boolean;
      glutenFree?: boolean;
      lactoseFree?: boolean;
      vegan?: boolean;
      vegetarian?: boolean;
      kosher?: boolean;
      kosherDairy?: boolean;
      halal?: boolean;
      nonGMO?: boolean;
      cholesterolFree?: boolean;
      sugarFree?: boolean;
      caffeineFree?: boolean;
    };
    ecofriendly?: boolean;
    compostable?: boolean;
    biodegradable?: boolean;
    recyclable?: boolean;
    certifications?: string[];
  };
  features?: string[];
  price: number;
}

interface ProductsJson {
  products: ProductData[];
}

/**
 * Import products from the JSON file
 * @param sellerId - ID of the seller to assign products to
 * @returns Array of created product IDs
 */
export const importFromJson = action({
  args: {
    sellerId: v.id("users"),
    jsonPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the seller information
    const seller = await ctx.runQuery(api.users.getById, { id: args.sellerId });
    if (!seller) {
      throw new Error(`Seller with ID ${args.sellerId} not found`);
    }

    // Default path is the root Pickleproducts.json file
    const jsonPath = args.jsonPath || "Pickleproducts.json";

    try {
      // In a real implementation, we would read the file from the filesystem
      // For this example, we'll use a hardcoded path and fetch it
      const response = await fetch(`https://raw.githubusercontent.com/Zchasse63/vercelpickle/main/${jsonPath}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
      }

      const data: ProductsJson = await response.json();
      const products = data.products;

      console.log(`Importing ${products.length} products for seller ${seller.name}`);

      // Create products in batches to avoid rate limiting
      const batchSize = 10;
      const productIds: Id<"products">[] = [];

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const batchPromises = batch.map(async (productData) => {
          try {
            // Fetch images from Pexels API based on product name and category
            const images = await fetchProductImages(ctx, productData.name, productData.category);

            // Create the product
            const productId = await ctx.runMutation(api.products.create, {
              name: productData.name,
              description: generateDescription(productData),
              price: productData.price,
              sellerId: args.sellerId,
              sellerName: seller.businessName || seller.name,
              category: productData.category,
              subcategory: productData.subcategory,
              images: images,
              inventory: Math.floor(Math.random() * 100) + 20, // Random inventory between 20 and 120
              unit: determineUnit(productData),
              status: "active",
              tags: generateTags(productData),
              isOrganic: productData.specifications?.dietary?.organic || false,
              isLocal: Math.random() > 0.5, // 50% chance of being local
              features: productData.features || [],
              specifications: productData.specifications || {},
              nutritionFacts: generateNutritionFacts(productData),
              allergens: generateAllergens(productData),
              storageInstructions: productData.specifications?.storage || "Store in a cool, dry place.",
              certifications: generateCertifications(productData),
              origin: {
                country: "United States",
                region: generateRegion(),
              },
            });

            return productId;
          } catch (error) {
            console.error(`Error creating product ${productData.name}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        productIds.push(...batchResults.filter(Boolean) as Id<"products">[]);
      }

      return {
        success: true,
        count: productIds.length,
        productIds,
      };
    } catch (error) {
      console.error("Error importing products:", error);
      throw new Error(`Failed to import products: ${error}`);
    }
  },
});

/**
 * Fetch product images from Pexels API
 * @param ctx - Convex context
 * @param productName - Name of the product
 * @param category - Category of the product
 * @returns Array of image URLs
 */
async function fetchProductImages(ctx: any, productName: string, category: string): Promise<string[]> {
  try {
    // Use our Pexels API integration
    const images = await ctx.runAction(api.pexelsApi.getProductImages, {
      productName,
      category,
    });

    // If we got images, return them
    if (images && images.length > 0) {
      return images;
    }

    // Otherwise, return placeholder images
    return [
      "/placeholder-product.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg",
    ];
  } catch (error) {
    console.error(`Error fetching images for ${productName}:`, error);
    // Return placeholder images on error
    return [
      "/placeholder-product.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg",
    ];
  }
}

/**
 * Generate a description for a product
 * @param product - Product data
 * @returns Generated description
 */
function generateDescription(product: ProductData): string {
  let description = `${product.name} - A high-quality product for your business needs.`;

  if (product.features && product.features.length > 0) {
    description += "\n\n" + product.features.join("\n");
  }

  return description;
}

/**
 * Determine the unit for a product
 * @param product - Product data
 * @returns Unit string
 */
function determineUnit(product: ProductData): string {
  if (product.specifications?.casePack) {
    return "case";
  }

  if (product.category === "Beverages") {
    return "bottle";
  }

  if (product.category === "Disposables") {
    return "pack";
  }

  return "each";
}

/**
 * Generate tags for a product
 * @param product - Product data
 * @returns Array of tags
 */
function generateTags(product: ProductData): string[] {
  const tags: string[] = [product.category];

  if (product.subcategory) {
    tags.push(product.subcategory);
  }

  if (product.specifications?.dietary?.organic) {
    tags.push("Organic");
  }

  if (product.specifications?.ecofriendly) {
    tags.push("Eco-Friendly");
  }

  return tags;
}

/**
 * Generate nutrition facts for a product
 * @param product - Product data
 * @returns Nutrition facts string
 */
function generateNutritionFacts(product: ProductData): string | undefined {
  if (product.category === "Beverages" || product.category === "Fruits & Vegetables") {
    return `Serving Size: ${product.specifications?.servingSize || "1 serving"}\nCalories: ${product.specifications?.caloriesPerServing || "100"}\nTotal Fat: 0g\nSodium: 0mg\nTotal Carbohydrate: 10g\nSugars: 5g\nProtein: 0g`;
  }

  return undefined;
}

/**
 * Generate allergens for a product
 * @param product - Product data
 * @returns Array of allergens
 */
function generateAllergens(product: ProductData): string[] {
  if (product.category === "Beverages") {
    return [];
  }

  if (product.category === "Bakery") {
    return ["Wheat", "Gluten"];
  }

  return [];
}

/**
 * Generate certifications for a product
 * @param product - Product data
 * @returns Array of certifications
 */
function generateCertifications(product: ProductData): string[] {
  const certifications: string[] = [];

  if (product.specifications?.dietary?.organic) {
    certifications.push("USDA Organic");
  }

  if (product.specifications?.dietary?.nonGMO) {
    certifications.push("Non-GMO Project Verified");
  }

  if (product.specifications?.certifications) {
    certifications.push(...product.specifications.certifications);
  }

  return certifications;
}

/**
 * Generate a random region
 * @returns Random region string
 */
function generateRegion(): string {
  const regions = [
    "California",
    "New York",
    "Texas",
    "Florida",
    "Washington",
    "Oregon",
    "Colorado",
    "Illinois",
  ];

  return regions[Math.floor(Math.random() * regions.length)];
}
