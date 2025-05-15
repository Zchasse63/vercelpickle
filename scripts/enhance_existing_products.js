/**
 * Script to enhance existing products with additional specifications
 * 
 * This script updates existing products in the database with enhanced
 * specifications, origins, and certifications.
 * 
 * Usage:
 * npx convex run scripts/enhance-existing-products.js
 */

import { v } from "convex/values";
import { internal } from "./_generated/api";

// Sample dietary specifications
const dietaryOptions = [
  { organic: true },
  { glutenFree: true },
  { lactoseFree: true },
  { vegan: true },
  { vegetarian: true },
  { nonGMO: true },
  { organic: true, nonGMO: true },
  { vegan: true, glutenFree: true },
  { vegetarian: true, lactoseFree: true }
];

// Sample environmental specifications
const environmentalOptions = [
  { ecofriendly: true },
  { compostable: true },
  { biodegradable: true },
  { recyclable: true },
  { ecofriendly: true, recyclable: true },
  { compostable: true, biodegradable: true }
];

// Sample origins
const originOptions = [
  { country: "USA", region: "California" },
  { country: "USA", region: "New York" },
  { country: "USA", region: "Florida" },
  { country: "USA", region: "Washington" },
  { country: "Mexico", region: "Oaxaca" },
  { country: "Italy", region: "Tuscany" },
  { country: "France", region: "Provence" },
  { country: "Spain", region: "Andalusia" }
];

// Sample certifications
const certificationOptions = [
  ["USDA Organic"],
  ["Non-GMO Project Verified"],
  ["Fair Trade Certified"],
  ["Certified Humane"],
  ["Rainforest Alliance Certified"],
  ["USDA Organic", "Non-GMO Project Verified"],
  ["Fair Trade Certified", "Rainforest Alliance Certified"]
];

// Sample features
const featuresByCategory = {
  "Fruits & Vegetables": [
    "Grown without synthetic pesticides",
    "Harvested at peak ripeness",
    "Rich in vitamins and antioxidants",
    "Locally sourced when in season"
  ],
  "Dairy & Eggs": [
    "From pasture-raised animals",
    "No antibiotics or hormones",
    "Rich, creamy texture",
    "Produced by small family farms"
  ],
  "Bakery": [
    "Made with organic flour",
    "No artificial preservatives",
    "Baked fresh daily",
    "Traditional recipes"
  ],
  "Meat & Seafood": [
    "Humanely raised animals",
    "No antibiotics or hormones",
    "Sustainable fishing practices",
    "Higher in omega-3 fatty acids"
  ],
  "Beverages": [
    "Made with filtered water",
    "No artificial sweeteners",
    "Cold-pressed for maximum nutrients",
    "Small-batch production"
  ],
  "Pantry": [
    "Minimally processed",
    "No artificial flavors or colors",
    "Sustainably sourced ingredients",
    "Traditional production methods"
  ]
};

// Helper function to get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random features for a category
const getRandomFeatures = (category) => {
  const features = featuresByCategory[category] || featuresByCategory["Pantry"];
  const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4 features
  const selectedFeatures = [];
  
  for (let i = 0; i < numFeatures && i < features.length; i++) {
    selectedFeatures.push(features[i]);
  }
  
  return selectedFeatures;
};

/**
 * Main function to enhance existing products
 */
export default async function enhanceExistingProducts({ db, scheduler }) {
  console.log("Starting to enhance existing products...");
  
  // Get all existing products
  const products = await db.query("products").collect();
  
  console.log(`Found ${products.length} products to enhance.`);
  
  // Process each product
  for (const product of products) {
    try {
      // Skip products that already have enhanced specifications
      if (product.specifications && 
          (product.specifications.dietary || 
           product.specifications.environmental || 
           product.origin || 
           product.features)) {
        console.log(`Skipping already enhanced product: ${product.name}`);
        continue;
      }
      
      // Create enhanced specifications
      const enhancedProduct = {
        specifications: {
          dietary: getRandomItem(dietaryOptions),
          environmental: getRandomItem(environmentalOptions)
        },
        origin: getRandomItem(originOptions),
        certifications: getRandomItem(certificationOptions),
        features: getRandomFeatures(product.category)
      };
      
      // Update the product
      await db.patch(product._id, enhancedProduct);
      
      console.log(`Enhanced product: ${product.name}`);
    } catch (error) {
      console.error(`Error enhancing product ${product.name}:`, error);
    }
  }
  
  console.log("Finished enhancing existing products.");
}
