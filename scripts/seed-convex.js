#!/usr/bin/env node

/**
 * Script to seed the Convex database with initial data
 * 
 * Usage: node scripts/seed-convex.js
 */

const { ConvexClient } = require("convex/browser");

// Sample product data
const products = [
  {
    name: "Organic Carrots",
    description: "Fresh organic carrots, perfect for salads and cooking. Our carrots are grown using sustainable farming practices without synthetic pesticides or fertilizers.",
    price: 2.99,
    sellerId: "user_1", // This will be replaced with a real user ID
    category: "Fruits & Vegetables",
    subcategory: "Root Vegetables",
    images: ["/bunch-of-carrots.png", "/carrots-close-up.png", "/carrots-in-field.png"],
    inventory: 50,
    unit: "bunch",
    minimumOrder: 1,
    isOrganic: true,
    isLocal: true,
    nutritionFacts: "Rich in vitamin A and fiber",
    allergens: [],
    storageInstructions: "Store in refrigerator for up to 2 weeks",
    certifications: ["Organic", "Non-GMO"],
  },
  {
    name: "Fresh Milk",
    description: "Creamy fresh milk from grass-fed cows.",
    price: 3.49,
    sellerId: "user_2", // This will be replaced with a real user ID
    category: "Dairy",
    subcategory: "Milk",
    images: ["/glass-of-milk.png"],
    inventory: 30,
    unit: "gallon",
    minimumOrder: 1,
    isOrganic: false,
    isLocal: true,
    nutritionFacts: "Rich in calcium and protein",
    allergens: ["Milk"],
    storageInstructions: "Keep refrigerated",
    certifications: ["Grass-Fed"],
  },
  {
    name: "Artisan Bread",
    description: "Handcrafted sourdough bread made with organic flour.",
    price: 4.99,
    sellerId: "user_3", // This will be replaced with a real user ID
    category: "Bakery",
    subcategory: "Bread",
    images: ["/assorted-breads.png"],
    inventory: 20,
    unit: "loaf",
    minimumOrder: 1,
    isOrganic: true,
    isLocal: true,
    nutritionFacts: "Good source of complex carbohydrates",
    allergens: ["Wheat", "Gluten"],
    storageInstructions: "Store in a cool, dry place",
    certifications: ["Artisan"],
  },
  {
    name: "Fresh Spinach",
    description: "Tender spinach leaves, washed and ready to use.",
    price: 2.49,
    sellerId: "user_1", // This will be replaced with a real user ID
    category: "Fruits & Vegetables",
    subcategory: "Leafy Greens",
    images: ["/fresh-spinach.png"],
    inventory: 40,
    unit: "bunch",
    minimumOrder: 1,
    isOrganic: true,
    isLocal: true,
    nutritionFacts: "Rich in iron and vitamin K",
    allergens: [],
    storageInstructions: "Store in refrigerator for up to 1 week",
    certifications: ["Organic"],
  },
  {
    name: "Russet Potatoes",
    description: "Premium russet potatoes, perfect for baking and frying.",
    price: 3.99,
    sellerId: "user_4", // This will be replaced with a real user ID
    category: "Fruits & Vegetables",
    subcategory: "Root Vegetables",
    images: ["/pile-of-potatoes.png"],
    inventory: 100,
    unit: "5 lb bag",
    minimumOrder: 1,
    isOrganic: false,
    isLocal: true,
    nutritionFacts: "Good source of potassium and vitamin C",
    allergens: [],
    storageInstructions: "Store in a cool, dark place",
    certifications: ["Local"],
  },
];

// Sample user data
const users = [
  {
    name: "Green Farms",
    email: "contact@greenfarms.com",
    role: "seller",
    image: "/green-farms-logo.png",
  },
  {
    name: "Dairy Delights",
    email: "info@dairydelights.com",
    role: "seller",
    image: "/dairy-delights-logo.png",
  },
  {
    name: "Baker's Haven",
    email: "hello@bakershaven.com",
    role: "seller",
    image: "/bakers-haven-logo.png",
  },
  {
    name: "Farm Fresh Produce",
    email: "sales@farmfreshproduce.com",
    role: "seller",
    image: "/farm-fresh-logo.png",
  },
  {
    name: "Admin User",
    email: "admin@pickle.com",
    role: "admin",
    image: "/admin-avatar.png",
  },
  {
    name: "Buyer User",
    email: "buyer@example.com",
    role: "buyer",
    image: "/buyer-avatar.png",
  },
];

async function seedDatabase() {
  // Initialize Convex client
  const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  
  console.log("Seeding Convex database...");
  
  try {
    // Create users
    console.log("Creating users...");
    const userIds = [];
    for (const user of users) {
      const userId = await convex.mutation("users:create", {
        ...user,
      });
      userIds.push(userId);
      console.log(`Created user: ${user.name} (${userId})`);
    }
    
    // Create products
    console.log("Creating products...");
    for (const product of products) {
      // Assign a random seller ID from the created users
      const sellerIndex = Math.floor(Math.random() * 4); // Only use the first 4 users (sellers)
      const sellerId = userIds[sellerIndex];
      
      const productId = await convex.mutation("products:create", {
        ...product,
        sellerId,
      });
      console.log(`Created product: ${product.name} (${productId})`);
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
