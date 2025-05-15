/**
 * Seed script for enhanced products
 * 
 * This script seeds the database with enhanced product data
 * from the enhanced-products.json file.
 * 
 * Usage:
 * npx convex run scripts/seed-enhanced-products.js
 */

import { products } from "../data/enhanced-products.json";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Main function to seed the database with enhanced products
 */
export default async function seedEnhancedProducts({ db, scheduler }) {
  console.log("Starting to seed enhanced products...");
  
  // Get all existing sellers
  const sellers = await db.query("users").filter(q => 
    q.eq(q.field("role"), "seller")
  ).collect();
  
  if (sellers.length === 0) {
    console.log("No sellers found. Please seed sellers first.");
    return;
  }
  
  // Randomly select a seller for each product
  const getRandomSeller = () => {
    const randomIndex = Math.floor(Math.random() * sellers.length);
    return sellers[randomIndex];
  };
  
  // Process each product
  for (const product of products) {
    try {
      // Select a random seller
      const seller = getRandomSeller();
      
      // Create the product
      const productId = await db.insert("products", {
        ...product,
        sellerId: seller._id,
        sellerName: seller.businessName || seller.name,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      
      console.log(`Created product: ${product.name} (${productId})`);
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }
  
  console.log("Finished seeding enhanced products.");
}
