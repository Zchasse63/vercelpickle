import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// Define the product data structure from the JSON
interface ProductData {
  name: string;
  category: string;
  subcategory: string;
  specifications: {
    packaging?: string;
    quantity?: string;
    casePack?: string;
    servingSize?: string;
    caloriesPerServing?: string;
    storage?: string;
    dietary?: {
      lactoseFree?: boolean;
      cholesterolFree?: boolean;
      glutenFree?: boolean;
      kosherDairy?: boolean;
      organic?: boolean;
      caffeineFree?: boolean;
    };
    size?: string;
    material?: string;
    handleMaterial?: string;
    construction?: string;
    color?: string;
    certifications?: string[];
    bladeType?: string;
    handleType?: string;
    handleColor?: string;
    slipResistant?: boolean;
    capacity?: string;
    containerMaterial?: string;
    clutch?: string;
    control?: string;
    blades?: string;
    base?: string;
    speed?: string;
    length?: string;
    compatibleWith?: string;
    dishwasherSafe?: boolean;
    weight?: string;
    blade?: string;
    handle?: string;
    style?: string;
    textured?: boolean;
    edgeType?: string;
    diameter?: string;
    pattern?: string;
    features?: string;
    flavor?: string;
    container?: string;
    organic?: boolean;
    caffeineFree?: boolean;
    ecofriendly?: boolean;
    compostable?: boolean;
    shape?: string;
    greaseResistant?: boolean;
    microwavable?: boolean;
    design?: string;
    activeIngredient?: string;
    formType?: string;
    usage?: string;
    dilutionRatio?: string;
    formula?: string;
    concentrate?: boolean;
    scent?: string;
  };
  features: string[];
  price: number;
}

interface ProductsData {
  products: ProductData[];
}

// Import products action
export const importProducts = action({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    message: string;
    results: Array<{
      id?: string;
      name: string;
      success: boolean;
      error?: string;
    }>;
  }> => {
    // This would normally come from a file, but for this example we'll hardcode the JSON
    const productsData: ProductsData = {
      "products": [
        {
          "name": "Nestle Coffee Mate Coffee Creamer Variety Pack",
          "category": "Beverages",
          "subcategory": "Creamers",
          "specifications": {
            "packaging": "Single-serve pack",
            "quantity": "50 counts per pack",
            "casePack": "3 packs per case",
            "servingSize": "1 tub (11 ml)",
            "caloriesPerServing": "10",
            "storage": "Shelf stable, no refrigeration needed",
            "dietary": {
              "lactoseFree": true,
              "cholesterolFree": true,
              "glutenFree": true,
              "kosherDairy": true
            }
          },
          "features": [
            "Adds a rich and creamy texture",
            "Convenient single-serve packaging",
            "Variety pack provides different flavor options",
            "Perfect for office and foodservice establishments"
          ],
          "price": 29.95
        },
        {
          "name": "Clean Quick Chlorine Sanitizer Concentrate Powder",
          "category": "Janitorial Supplies",
          "subcategory": "Cleaning Chemicals",
          "specifications": {
            "packaging": "1-ounce packets",
            "casePack": "100 packets per case",
            "activeIngredient": "Chlorine",
            "formType": "Powder concentrate",
            "usage": "Food processing equipment and utensils",
            "dilutionRatio": "1 packet per gallon of water"
          },
          "features": [
            "Effective sanitizing for food contact surfaces",
            "Concentrated formula for economical use",
            "Convenient pre-measured packets eliminate measuring errors",
            "Ideal for restaurants, cafes, and food processing facilities"
          ],
          "price": 27.95
        },
        {
          "name": "Simple Green Industrial Cleaner and Degreaser",
          "category": "Janitorial Supplies",
          "subcategory": "Degreasers",
          "specifications": {
            "size": "1 Gallon Bottle",
            "casePack": "6 bottles per case",
            "formula": "Non-toxic, biodegradable",
            "concentrate": true,
            "dilutionRatio": "Variable depending on application",
            "scent": "Original"
          },
          "features": [
            "Non-toxic formula safe for use around food preparation areas",
            "Cost-effective concentrate can be diluted for various cleaning tasks",
            "Removes grease, oil, and stubborn stains",
            "Multi-purpose cleaner for various surfaces"
          ],
          "price": 89.95
        },
        {
          "name": "AJM Packaging Round White Paper Plate",
          "category": "Disposables",
          "subcategory": "Paper Plates",
          "specifications": {
            "shape": "Round",
            "color": "White",
            "material": "Coated paper",
            "greaseResistant": true,
            "casePack": "500 plates per case",
            "microwavable": true
          },
          "features": [
            "Heavy duty, coated paper plates maintain shape when full",
            "Premium quality plates suitable for parties and events",
            "Grease resistant coating prevents leaks and soak-through",
            "Disposable for easy cleanup"
          ],
          "price": 45.99
        },
        {
          "name": "Dixie Ultra 10.125 inch Heavy Weight Paper Plate",
          "category": "Disposables",
          "subcategory": "Paper Plates",
          "specifications": {
            "diameter": "10.125 inches",
            "color": "White",
            "material": "Heavy-weight paper",
            "design": "Multi-layered",
            "microwavable": true,
            "casePack": "500 plates per case"
          },
          "features": [
            "Heavy-weight construction provides durability for serving meals",
            "Multi-layered design adds strength and prevents soak-through",
            "Resistant to cuts and tears even with heavier foods",
            "Perfect for catering, events, and food service settings"
          ],
          "price": 79.95
        },
        {
          "name": "Mercer Culinary Ultimate White Chef's Knife",
          "category": "Kitchen Smallware",
          "subcategory": "Kitchen Knives",
          "specifications": {
            "size": "10 inch (25.4 cm)",
            "material": "High-carbon Japanese Steel",
            "handleMaterial": "Polypropylene",
            "construction": "Stamped",
            "color": "White",
            "certifications": ["NSF"]
          },
          "features": [
            "High-carbon Japanese steel blade offers superior sharpness",
            "Ergonomic polypropylene handle provides comfortable grip",
            "NSF certified for food safety and sanitation",
            "Ideal for professional kitchens and culinary environments"
          ],
          "price": 29.95
        },
        {
          "name": "Winco SofTek Soft Grip Handle Chef Knife",
          "category": "Kitchen Smallware",
          "subcategory": "Kitchen Knives",
          "specifications": {
            "size": "8 inch length",
            "bladeType": "Chef knife",
            "handleType": "Soft-grip",
            "material": "Stainless steel",
            "handleColor": "Black",
            "slipResistant": true
          },
          "features": [
            "Durable construction built for busy commercial kitchens",
            "Slip-resistant, soft-grip handle for comfortable and secure hold",
            "Precision cutting edge for various food preparation tasks",
            "Balance of weight and control for professional food preparation"
          ],
          "price": 19.95
        },
        {
          "name": "Skyfood Stainless Steel Bar Blender",
          "category": "Kitchen Equipment",
          "subcategory": "Blenders",
          "specifications": {
            "capacity": "64 ounce",
            "containerMaterial": "Stainless steel",
            "clutch": "Reinforced",
            "control": "On/off pulse switch",
            "blades": "Double welded stainless steel",
            "base": "Screw off stainless steel",
            "speed": "18000 rpm"
          },
          "features": [
            "64 oz. stainless steel container for durability",
            "Reinforced clutch ensures reliable performance",
            "On/off pulse switch for precise control",
            "Double welded stainless steel blades for effective blending",
            "Screw off stainless steel base for easy cleaning"
          ],
          "price": 299.95
        },
        {
          "name": "Waring Immersion Blender Shaft",
          "category": "Kitchen Equipment",
          "subcategory": "Blender Parts",
          "specifications": {
            "length": "21 inch",
            "material": "Stainless steel",
            "compatibleWith": "Waring immersion blenders",
            "dishwasherSafe": true,
            "weight": "3.5 lbs"
          },
          "features": [
            "Replacement shaft for Waring immersion blenders",
            "Durable stainless steel construction",
            "Extended length ideal for deep pots and containers",
            "Commercial-grade quality for foodservice applications"
          ],
          "price": 199.95
        },
        {
          "name": "World Tableware Slim European Style Steak Knife",
          "category": "Dinnerware",
          "subcategory": "Flatware",
          "specifications": {
            "length": "9 1/8 inch (23.16 cm)",
            "blade": "Stainless steel",
            "handle": "ABS",
            "style": "European",
            "casePack": "12 knives per case",
            "dishwasherSafe": true
          },
          "features": [
            "Stainless steel blade for strength and durability",
            "Lightweight yet tough ABS handle",
            "Designed for steaks and firm food",
            "European style design adds elegance to table settings"
          ],
          "price": 39.95
        },
        {
          "name": "Dexter Russell Sani Safe Paring Knife",
          "category": "Kitchen Smallware",
          "subcategory": "Paring Knives",
          "specifications": {
            "blade": "Stain-free, high-carbon steel",
            "handle": "High impact 'Grip-Tex' polypropylene",
            "textured": true,
            "casePack": "3 knives per case",
            "edgeType": "Hand ground and honed"
          },
          "features": [
            "Quality stain-free, high-carbon steel with ultimate edges",
            "Hand ground and honed for precision cutting",
            "High impact 'Grip-Tex' handles provide secure grip",
            "Textured and formed for comfort and control"
          ],
          "price": 32.95
        },
        {
          "name": "Dixie Pathways Mediumweight Paper Plates",
          "category": "Disposables",
          "subcategory": "Patterned Paper Plates",
          "specifications": {
            "diameter": "6 7/8 inch",
            "style": "WiseSize",
            "pattern": "Green/Burgundy",
            "weight": "Medium-weight",
            "casePack": "500 plates per carton",
            "features": "Soak-Proof Shield"
          },
          "features": [
            "Medium-weight paper plates ideal for appetizers, desserts, and light meals",
            "Features a Soak-Proof Shield to prevent moisture and grease from leaking through",
            "Decorative Green/Burgundy pattern adds a touch of elegance",
            "Perfect for catering, cafeterias, and food service establishments"
          ],
          "price": 52.95
        },
        {
          "name": "Tractor Beverage Co Strawberry Dragon Fruit",
          "category": "Beverages",
          "subcategory": "Juices",
          "specifications": {
            "size": "12 Fluid Ounce",
            "casePack": "12 bottles per case",
            "flavor": "Strawberry Dragon Fruit",
            "container": "Bottle",
            "organic": true,
            "caffeineFree": true
          },
          "features": [
            "Refreshing strawberry and dragon fruit flavor",
            "Made with organic ingredients",
            "No artificial flavors or preservatives",
            "Perfect for retail or food service offerings"
          ],
          "price": 25.95
        },
        {
          "name": "Hefty White Bagasse Super Strong Paper Plate",
          "category": "Disposables",
          "subcategory": "Eco-Friendly Plates",
          "specifications": {
            "diameter": "10 1/8 inch",
            "material": "Bagasse (sugarcane byproduct)",
            "color": "White",
            "casePack": "16 per pack, 12 packs per case",
            "ecofriendly": true,
            "compostable": true
          },
          "features": [
            "Made from natural byproduct of sugarcane processing",
            "Strong rim definition adds stability and minimizes food displacement",
            "Environmentally friendly alternative to plastic or foam plates",
            "Suitable for hot and cold foods"
          ],
          "price": 64.99
        }
      ]
    };

    // Get the first admin user to use as the product owner
    const adminUser = await ctx.runQuery(api.users.getFirstAdmin);

    if (!adminUser) {
      throw new Error("No admin user found. Please create an admin user first.");
    }

    // Get the user by ID to ensure we have the correct ID type
    const adminUserDetails = await ctx.runQuery(api.users.getById, { id: adminUser._id });
    if (!adminUserDetails) {
      throw new Error("Failed to get admin user details");
    }
    const adminId = adminUserDetails._id;

    // Import each product
    const results = [];
    for (const product of productsData.products) {
      try {
        // Map the product data to our schema
        const productData: {
          name: string;
          description: string;
          price: number;
          sellerId: string;
          category: string;
          subcategory?: string;
          images: string[];
          inventory: number;
          unit: string;
          minimumOrder?: number;
          isOrganic?: boolean;
          isLocal?: boolean;
          features?: string[];
          specifications?: any;
          nutritionFacts?: string;
          allergens?: string[];
          storageInstructions?: string;
          certifications?: string[];
        } = {
          name: product.name,
          description: product.features.join(" "),
          price: product.price,
          sellerId: adminId,
          category: product.category,
          subcategory: product.subcategory,
          images: ["/placeholder-product.jpg"], // Will be updated with Pexels images later
          inventory: 100,
          unit: "each",
          minimumOrder: 1,
          isOrganic: product.specifications.dietary?.organic || false,
          isLocal: false,
          features: product.features,
          specifications: mapSpecifications(product.specifications),
          nutritionFacts: product.specifications.servingSize ?
            `Serving Size: ${product.specifications.servingSize}, Calories: ${product.specifications.caloriesPerServing || "0"}` :
            "Not applicable",
          allergens: [],
          storageInstructions: product.specifications.storage || "No special storage instructions",
          certifications: product.specifications.certifications || [],
        };

        // Create the product - we need to use a different approach to ensure the ID type is correct
        const productId = await ctx.runMutation(api.products.create, {
          name: product.name,
          description: product.features.join(" "),
          price: product.price,
          sellerId: adminId,
          category: product.category,
          subcategory: product.subcategory,
          images: ["/placeholder-product.jpg"], // Will be updated with Pexels images later
          inventory: 100,
          unit: "each",
          minimumOrder: 1,
          isOrganic: product.specifications.dietary?.organic || false,
          isLocal: false,
          features: product.features,
          specifications: mapSpecifications(product.specifications),
          nutritionFacts: product.specifications.servingSize ?
            `Serving Size: ${product.specifications.servingSize}, Calories: ${product.specifications.caloriesPerServing || "0"}` :
            "Not applicable",
          allergens: [],
          storageInstructions: product.specifications.storage || "No special storage instructions",
          certifications: product.specifications.certifications || [],
        });
        results.push({ id: productId, name: product.name, success: true });
      } catch (error) {
        results.push({ name: product.name, success: false, error: (error as Error).message });
      }
    }

    // Update all product images with Pexels images
    try {
      await ctx.runAction(api.pexels.updateAllProductImages);
    } catch (error) {
      console.error("Error updating product images:", error);
      // Continue even if image update fails
    }

    return {
      success: true,
      message: `Imported ${results.filter(r => r.success).length} of ${productsData.products.length} products and updated images with Pexels API`,
      results
    };
  },
});

// Helper function to map specifications from the JSON to our schema
function mapSpecifications(specs: ProductData["specifications"]) {
  if (!specs) return undefined;

  return {
    // General specifications
    packaging: specs.packaging,
    casePack: specs.casePack,
    quantity: specs.quantity,
    size: specs.size,
    diameter: specs.diameter,
    length: specs.length,
    weight: specs.weight,
    color: specs.color,
    material: specs.material,
    handleColor: specs.handleColor,

    // Food-specific specifications
    servingSize: specs.servingSize,
    caloriesPerServing: specs.caloriesPerServing,
    storage: specs.storage,

    // Equipment specifications
    capacity: specs.capacity,
    speed: specs.speed,

    // Chemical specifications
    activeIngredient: specs.activeIngredient,
    formType: specs.formType,
    usage: specs.usage,
    dilutionRatio: specs.dilutionRatio,

    // Dietary information
    dietary: specs.dietary ? {
      organic: specs.dietary.organic,
      glutenFree: specs.dietary.glutenFree,
      lactoseFree: specs.dietary.lactoseFree,
      kosherDairy: specs.dietary.kosherDairy,
      cholesterolFree: specs.dietary.cholesterolFree,
      caffeineFree: specs.dietary.caffeineFree,
    } : undefined,

    // Environmental specifications
    ecofriendly: specs.ecofriendly,
    compostable: specs.compostable,

    // Additional specifications
    certifications: specs.certifications,
  };
}
