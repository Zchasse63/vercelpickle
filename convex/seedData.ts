import { DatabaseWriter } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Seed data for the database
 * This file contains functions to seed the database with test data
 */

// Seed users (buyers and sellers)
export async function seedUsers(db: DatabaseWriter) {
  console.log("Seeding users...");

  // Create seller profiles
  const sellerIds = [];

  const seller1Id = await db.insert("users", {
    name: "Green Farms",
    email: "contact@greenfarms.com",
    role: "seller",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    businessName: "Green Farms Organic Produce",
    location: "Sonoma County, CA",
    description: "Organic produce from sustainable farming practices.",
    profileImage: "/seller-green-farms.jpg",
    coverImage: "/farm-landscape.jpg",
    verified: true,
    rating: 4.8,
    reviewCount: 324,
  });
  sellerIds.push(seller1Id);

  const seller2Id = await db.insert("users", {
    name: "Dairy Delights",
    email: "info@dairydelights.com",
    role: "seller",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    businessName: "Dairy Delights Co.",
    location: "Wisconsin",
    description: "Premium dairy products from grass-fed cows.",
    profileImage: "/seller-dairy-delights.jpg",
    coverImage: "/dairy-farm.jpg",
    verified: true,
    rating: 4.7,
    reviewCount: 198,
  });
  sellerIds.push(seller2Id);

  const seller3Id = await db.insert("users", {
    name: "Baker's Haven",
    email: "hello@bakershaven.com",
    role: "seller",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    businessName: "Baker's Haven Artisan Bakery",
    location: "Portland, OR",
    description: "Artisan breads and pastries made with organic flour.",
    profileImage: "/seller-bakers-haven.jpg",
    coverImage: "/bakery.jpg",
    verified: true,
    rating: 4.9,
    reviewCount: 156,
  });
  sellerIds.push(seller3Id);

  // Create buyer profiles
  const buyerIds = [];

  const buyer1Id = await db.insert("users", {
    name: "Metro Grocery",
    email: "purchasing@metrogrocery.com",
    role: "buyer",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    businessName: "Metro Grocery Chain",
    location: "Seattle, WA",
    description: "Regional grocery chain focused on quality local products.",
    profileImage: "/buyer-metro-grocery.jpg",
    verified: true,
  });
  buyerIds.push(buyer1Id);

  const buyer2Id = await db.insert("users", {
    name: "Sunshine Catering",
    email: "orders@sunshinecatering.com",
    role: "buyer",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    businessName: "Sunshine Catering Services",
    location: "San Francisco, CA",
    description: "Farm-to-table catering service for corporate and private events.",
    profileImage: "/buyer-sunshine-catering.jpg",
    verified: true,
  });
  buyerIds.push(buyer2Id);

  console.log(`Created ${sellerIds.length} sellers and ${buyerIds.length} buyers`);

  return { sellerIds, buyerIds };
}

// Seed business profiles
export async function seedBusinessProfiles(db: DatabaseWriter, userIds: { sellerIds: Id<"users">[], buyerIds: Id<"users">[] }) {
  console.log("Seeding business profiles...");

  const { sellerIds, buyerIds } = userIds;

  // Create business profiles for sellers
  for (const sellerId of sellerIds) {
    const user = await db.get(sellerId);
    if (!user) continue;

    await db.insert("businessProfiles", {
      userId: sellerId,
      businessName: user.businessName || user.name,
      businessType: "producer",
      industry: "food",
      description: user.description || "",
      website: `https://www.${user.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: "555-123-4567",
      email: user.email,
      verificationStatus: "verified", // Added verification status
      address: {
        street: "123 Farm Road",
        city: user.location?.split(",")?.[0] || "",
        state: user.location?.split(",")?.[1]?.trim() || "",
        zipCode: "12345",
        country: "USA",
      },
      socialMedia: {
        instagram: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        facebook: `${user.name.toLowerCase().replace(/\s+/g, '')}`,
        twitter: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
      },
      certifications: ["Organic", "Non-GMO", "Sustainably Grown"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  // Create business profiles for buyers
  for (const buyerId of buyerIds) {
    const user = await db.get(buyerId);
    if (!user) continue;

    await db.insert("businessProfiles", {
      userId: buyerId,
      businessName: user.businessName || user.name,
      businessType: "retailer",
      industry: "food",
      description: user.description || "",
      website: `https://www.${user.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: "555-987-6543",
      email: user.email,
      verificationStatus: "verified", // Added verification status
      address: {
        street: "456 Market Street",
        city: user.location?.split(",")?.[0] || "",
        state: user.location?.split(",")?.[1]?.trim() || "",
        zipCode: "67890",
        country: "USA",
      },
      socialMedia: {
        instagram: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        facebook: `${user.name.toLowerCase().replace(/\s+/g, '')}`,
        twitter: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  console.log(`Created business profiles for ${sellerIds.length} sellers and ${buyerIds.length} buyers`);
}

// Seed products
export async function seedProducts(db: DatabaseWriter, sellerIds: Id<"users">[]) {
  console.log("Seeding products...");

  const productIds = [];

  // Products for Green Farms (seller1)
  const seller1Id = sellerIds[0];

  const product1Id = await db.insert("products", {
    name: "Organic Carrots",
    description: "Fresh organic carrots, perfect for salads and cooking.",
    price: 2.99,
    unit: "bunch",
    inventory: 500,
    sellerId: seller1Id,
    category: "Fruits & Vegetables",
    subcategory: "Root Vegetables",
    images: ["/bunch-of-carrots.png", "/fresh-spinach.png", "/pile-of-potatoes.png"],
    specifications: {
      dietary: {
        organic: true,
        glutenFree: true,
        lactoseFree: true,
        kosherDairy: false,
        cholesterolFree: true,
        caffeineFree: true,
      },
      ecofriendly: true,
      compostable: true,
      packaging: "Minimal packaging, compostable ties",
      size: "Medium, approximately 6-8 carrots per bunch",
      servingSize: "1 medium carrot (61g)",
      caloriesPerServing: "25",
    },
    features: [
      "Grown without synthetic pesticides or fertilizers",
      "Rich in beta-carotene and antioxidants",
      "Harvested at peak freshness",
      "Perfect for juicing, roasting, or eating raw",
    ],
    nutritionFacts: "Serving Size: 1 medium carrot (61g), Calories: 25, Total Fat: 0.1g, Sodium: 42mg, Total Carbohydrate: 6g, Dietary Fiber: 2g, Sugars: 3g, Protein: 0.6g, Vitamin A: 110%, Vitamin C: 10%, Calcium: 2%, Iron: 1%",
    allergens: [],
    storageInstructions: "Store in the refrigerator for up to 2 weeks. Remove green tops before storing to extend freshness.",
    certifications: ["Organic", "Non-GMO", "Sustainably Grown"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  productIds.push(product1Id);

  const product2Id = await db.insert("products", {
    name: "Organic Spinach",
    description: "Tender spinach leaves, washed and ready to use.",
    price: 2.49,
    unit: "bunch",
    inventory: 300,
    sellerId: seller1Id,
    category: "Fruits & Vegetables",
    subcategory: "Leafy Greens",
    images: ["/fresh-spinach.png", "/bunch-of-carrots.png", "/pile-of-potatoes.png"],
    specifications: {
      dietary: {
        organic: true,
        glutenFree: true,
        lactoseFree: true,
        kosherDairy: false,
        cholesterolFree: true,
        caffeineFree: true,
      },
      ecofriendly: true,
      compostable: true,
      packaging: "Minimal packaging, compostable ties",
      size: "Large bunch, approximately 8oz",
      servingSize: "3 cups (85g)",
      caloriesPerServing: "20",
    },
    features: [
      "Grown without synthetic pesticides or fertilizers",
      "Rich in iron and vitamins",
      "Triple-washed and ready to use",
      "Perfect for salads, smoothies, or cooking",
    ],
    nutritionFacts: "Serving Size: 3 cups (85g), Calories: 20, Total Fat: 0g, Sodium: 65mg, Total Carbohydrate: 3g, Dietary Fiber: 2g, Sugars: 0g, Protein: 3g, Vitamin A: 160%, Vitamin C: 40%, Calcium: 15%, Iron: 15%",
    allergens: [],
    storageInstructions: "Store in the refrigerator for up to 5 days. Keep in original packaging or transfer to a container lined with paper towels.",
    certifications: ["Organic", "Non-GMO", "Sustainably Grown"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  productIds.push(product2Id);

  // Products for Dairy Delights (seller2)
  const seller2Id = sellerIds[1];

  const product3Id = await db.insert("products", {
    name: "Fresh Milk",
    description: "Creamy fresh milk from grass-fed cows.",
    price: 3.49,
    unit: "gallon",
    inventory: 200,
    sellerId: seller2Id,
    category: "Dairy & Eggs",
    subcategory: "Milk",
    images: ["/glass-of-milk.png", "/assorted-dairy-products.png", "/fresh-eggs.png"],
    specifications: {
      dietary: {
        organic: true,
        glutenFree: true,
        lactoseFree: false,
        kosherDairy: true,
        cholesterolFree: false,
        caffeineFree: true,
      },
      ecofriendly: true,
      compostable: false,
      packaging: "Recyclable plastic jug",
      size: "1 gallon (3.78L)",
      servingSize: "1 cup (240ml)",
      caloriesPerServing: "120",
    },
    features: [
      "From grass-fed cows raised without hormones",
      "Pasteurized but not homogenized for better taste",
      "Rich in calcium and vitamin D",
      "Produced on a family-owned farm",
    ],
    nutritionFacts: "Serving Size: 1 cup (240ml), Calories: 120, Total Fat: 4.8g, Sodium: 100mg, Total Carbohydrate: 12g, Sugars: 12g, Protein: 8g, Vitamin A: 10%, Vitamin C: 0%, Calcium: 30%, Iron: 0%",
    allergens: ["Milk"],
    storageInstructions: "Keep refrigerated at all times. Best consumed within 7 days of opening.",
    certifications: ["Organic", "Hormone-Free", "Animal Welfare Approved"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  productIds.push(product3Id);

  // Products for Baker's Haven (seller3)
  const seller3Id = sellerIds[2];

  const product4Id = await db.insert("products", {
    name: "Artisan Bread",
    description: "Handcrafted sourdough bread made with organic flour.",
    price: 4.99,
    unit: "loaf",
    inventory: 100,
    sellerId: seller3Id,
    category: "Bakery",
    subcategory: "Bread",
    images: ["/assorted-breads.png", "/artisan-bread.png", "/fresh-apples.png"],
    specifications: {
      dietary: {
        organic: true,
        glutenFree: false,
        lactoseFree: true,
        kosherDairy: false,
        cholesterolFree: true,
        caffeineFree: true,
      },
      ecofriendly: true,
      compostable: true,
      packaging: "Paper bag, compostable",
      size: "1 loaf (approx. 1lb)",
      servingSize: "1 slice (50g)",
      caloriesPerServing: "130",
    },
    features: [
      "Made with organic flour and natural sourdough starter",
      "No preservatives or artificial ingredients",
      "Slow-fermented for better flavor and digestibility",
      "Baked fresh daily in small batches",
    ],
    nutritionFacts: "Serving Size: 1 slice (50g), Calories: 130, Total Fat: 1.5g, Sodium: 230mg, Total Carbohydrate: 24g, Dietary Fiber: 3g, Sugars: 2g, Protein: 4g, Iron: 8%",
    allergens: ["Wheat"],
    storageInstructions: "Store in a cool, dry place. Best consumed within 3 days of purchase.",
    certifications: ["Organic", "Non-GMO"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  productIds.push(product4Id);

  console.log(`Created ${productIds.length} products`);

  return productIds;
}

// Seed orders
export async function seedOrders(db: DatabaseWriter, userIds: { sellerIds: Id<"users">[], buyerIds: Id<"users">[] }, productIds: Id<"products">[]) {
  console.log("Seeding orders...");

  const { sellerIds, buyerIds } = userIds;
  const orderIds = [];

  // Create orders for buyer1 (Metro Grocery)
  const buyer1Id = buyerIds[0];

  // Order 1: Multiple products from different sellers
  const order1Items = [
    {
      productId: productIds[0], // Organic Carrots
      quantity: 50,
      price: 2.99,
      name: "Organic Carrots",
      sellerId: sellerIds[0],
    },
    {
      productId: productIds[2], // Fresh Milk
      quantity: 30,
      price: 3.49,
      name: "Fresh Milk",
      sellerId: sellerIds[1],
    },
    {
      productId: productIds[3], // Artisan Bread
      quantity: 40,
      price: 4.99,
      name: "Artisan Bread",
      sellerId: sellerIds[2],
    },
  ];

  const order1Total = order1Items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const order1Id = await db.insert("orders", {
    buyerId: buyer1Id,
    sellerId: sellerIds[0], // Using the first seller as the primary seller
    items: order1Items,
    status: "completed",
    paymentStatus: "paid",
    subtotal: order1Total * 0.9, // 90% of total
    tax: order1Total * 0.05, // 5% tax
    shipping: order1Total * 0.05, // 5% shipping
    total: order1Total,
    shippingAddress: {
      street: "789 Market Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    billingAddress: {
      street: "789 Market Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    paymentMethod: "credit_card",
    notes: "Please deliver to loading dock #3",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  });
  orderIds.push(order1Id);

  // Order 2: Single seller order (Green Farms)
  const order2Items = [
    {
      productId: productIds[0], // Organic Carrots
      quantity: 30,
      price: 2.99,
      name: "Organic Carrots",
      sellerId: sellerIds[0],
    },
    {
      productId: productIds[1], // Organic Spinach
      quantity: 25,
      price: 2.49,
      name: "Organic Spinach",
      sellerId: sellerIds[0],
    },
  ];

  const order2Total = order2Items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const order2Id = await db.insert("orders", {
    buyerId: buyer1Id,
    sellerId: sellerIds[0], // Green Farms
    items: order2Items,
    status: "processing",
    paymentStatus: "paid",
    subtotal: order2Total * 0.9, // 90% of total
    tax: order2Total * 0.05, // 5% tax
    shipping: order2Total * 0.05, // 5% shipping
    total: order2Total,
    shippingAddress: {
      street: "789 Market Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    billingAddress: {
      street: "789 Market Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    paymentMethod: "credit_card",
    notes: "Please call 30 minutes before delivery",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
  });
  orderIds.push(order2Id);

  // Create orders for buyer2 (Sunshine Catering)
  const buyer2Id = buyerIds[1];

  // Order 3: Multiple products from different sellers
  const order3Items = [
    {
      productId: productIds[1], // Organic Spinach
      quantity: 20,
      price: 2.49,
      name: "Organic Spinach",
      sellerId: sellerIds[0],
    },
    {
      productId: productIds[3], // Artisan Bread
      quantity: 35,
      price: 4.99,
      name: "Artisan Bread",
      sellerId: sellerIds[2],
    },
  ];

  const order3Total = order3Items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const order3Id = await db.insert("orders", {
    buyerId: buyer2Id,
    sellerId: sellerIds[2], // Baker's Haven
    items: order3Items,
    status: "shipped",
    paymentStatus: "paid",
    subtotal: order3Total * 0.9, // 90% of total
    tax: order3Total * 0.05, // 5% tax
    shipping: order3Total * 0.05, // 5% shipping
    total: order3Total,
    shippingAddress: {
      street: "456 Catering Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      country: "USA",
    },
    billingAddress: {
      street: "456 Catering Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94110",
      country: "USA",
    },
    paymentMethod: "bank_transfer",
    notes: "For event on Saturday, please deliver by Friday afternoon",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  });
  orderIds.push(order3Id);

  console.log(`Created ${orderIds.length} orders`);

  return orderIds;
}

// Seed cart items
export async function seedCartItems(db: DatabaseWriter, userIds: { buyerIds: Id<"users">[] }, productIds: Id<"products">[]) {
  console.log("Seeding cart items...");

  const { buyerIds } = userIds;
  const cartIds = [];

  // Create cart items for buyer1 (Metro Grocery)
  const buyer1Id = buyerIds[0];

  const cart1Id = await db.insert("cartItems", {
    userId: buyer1Id,
    productId: productIds[2], // Fresh Milk
    quantity: 10,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  cartIds.push(cart1Id);

  const cart2Id = await db.insert("cartItems", {
    userId: buyer1Id,
    productId: productIds[3], // Artisan Bread
    quantity: 15,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  cartIds.push(cart2Id);

  // Create cart items for buyer2 (Sunshine Catering)
  const buyer2Id = buyerIds[1];

  const cart3Id = await db.insert("cartItems", {
    userId: buyer2Id,
    productId: productIds[0], // Organic Carrots
    quantity: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  cartIds.push(cart3Id);

  console.log(`Created ${cartIds.length} cart items`);

  return cartIds;
}
