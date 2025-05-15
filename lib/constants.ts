/**
 * Brand colors for the Pickle B2B Marketplace
 */
export const BRAND_COLORS = {
  DILL_GREEN: "#194D33", // Primary brand color (logo, headings)
  PICKLE_GREEN: "#5A9A3D", // Character and icon accents
  GOLDEN_MUSTARD: "#F3B522", // Call-to-action buttons, highlights
  BRINED_BEIGE: "#F1E5C3", // Backgrounds, subtle fills
  SMOKED_OLIVE: "#A09A84", // Secondary text, borders, shadows
};

/**
 * Application routes
 */
export const ROUTES = {
  // Public routes
  HOME: "/",
  MARKETPLACE: "/marketplace",
  PRODUCTS: "/marketplace/products",
  PRODUCT_DETAILS: (id: string) => `/marketplace/products/${id}`,
  CATEGORIES: "/marketplace/categories",
  CATEGORY_DETAILS: (slug: string) => `/marketplace/categories/${slug}`,
  SELLERS: "/marketplace/sellers",
  SELLER_DETAILS: (id: string) => `/marketplace/sellers/${id}`,
  CART: "/marketplace/cart",
  CHECKOUT: "/marketplace/checkout",
  SEARCH: "/marketplace/search",
  
  // Authentication routes
  LOGIN: "/marketplace/auth/login",
  SIGNUP: "/marketplace/auth/signup",
  FORGOT_PASSWORD: "/marketplace/auth/forgot-password",
  RESET_PASSWORD: "/marketplace/auth/reset-password",
  
  // Buyer routes
  BUYER_DASHBOARD: "/buyer",
  BUYER_ORDERS: "/buyer/orders",
  BUYER_ORDER_DETAILS: (id: string) => `/buyer/orders/${id}`,
  BUYER_FAVORITES: "/buyer/favorites",
  BUYER_PAYMENT_METHODS: "/buyer/payment-methods",
  BUYER_SHIPPING: "/buyer/shipping",
  BUYER_SETTINGS: "/buyer/settings",
  BUYER_SUPPORT: "/buyer/support",
  
  // Seller routes
  SELLER_DASHBOARD: "/seller",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_PRODUCT_DETAILS: (id: string) => `/seller/products/${id}`,
  SELLER_NEW_PRODUCT: "/seller/products/new",
  SELLER_ORDERS: "/seller/orders",
  SELLER_ORDER_DETAILS: (id: string) => `/seller/orders/${id}`,
  SELLER_INVENTORY: "/seller/inventory",
  SELLER_ANALYTICS: "/seller/analytics",
  SELLER_SETTINGS: "/seller/settings",
  SELLER_SUPPORT: "/seller/support",
  
  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER_DETAILS: (id: string) => `/admin/users/${id}`,
  ADMIN_SELLERS: "/admin/sellers",
  ADMIN_SELLER_DETAILS: (id: string) => `/admin/sellers/${id}`,
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_DETAILS: (id: string) => `/admin/products/${id}`,
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAILS: (id: string) => `/admin/orders/${id}`,
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORY_DETAILS: (id: string) => `/admin/categories/${id}`,
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_SUPPORT: "/admin/support",
  ADMIN_SUPPORT_DETAILS: (id: string) => `/admin/support/${id}`,
};

/**
 * API endpoints
 */
export const API_ROUTES = {
  // Auth endpoints
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  
  // User endpoints
  USERS: "/api/users",
  USER: (id: string) => `/api/users/${id}`,
  
  // Product endpoints
  PRODUCTS: "/api/products",
  PRODUCT: (id: string) => `/api/products/${id}`,
  PRODUCT_REVIEWS: (id: string) => `/api/products/${id}/reviews`,
  
  // Order endpoints
  ORDERS: "/api/orders",
  ORDER: (id: string) => `/api/orders/${id}`,
  
  // Category endpoints
  CATEGORIES: "/api/categories",
  CATEGORY: (id: string) => `/api/categories/${id}`,
  
  // Cart endpoints
  CART: "/api/cart",
  CART_ADD: "/api/cart/add",
  CART_REMOVE: "/api/cart/remove",
  CART_UPDATE: "/api/cart/update",
  CART_CLEAR: "/api/cart/clear",
  
  // Checkout endpoints
  CHECKOUT: "/api/checkout",
  CHECKOUT_SESSION: "/api/checkout/session",
  
  // Webhook endpoints
  WEBHOOK_STRIPE: "/api/webhook/stripe",
};

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: "🥦" },
  { id: "meat-poultry", name: "Meat & Poultry", icon: "🥩" },
  { id: "seafood", name: "Seafood", icon: "🐟" },
  { id: "dairy-eggs", name: "Dairy & Eggs", icon: "🧀" },
  { id: "bakery", name: "Bakery", icon: "🍞" },
  { id: "pantry", name: "Pantry & Dry Goods", icon: "🥫" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
  { id: "frozen", name: "Frozen Foods", icon: "❄️" },
  { id: "specialty", name: "Specialty & Gourmet", icon: "🍯" },
  { id: "organic", name: "Organic & Natural", icon: "🌱" },
];

/**
 * Order statuses
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

/**
 * Payment statuses
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
};

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  BUYER: "buyer",
};

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: "Pickle B2B Marketplace",
  DESCRIPTION: "Connect with quality food suppliers for your business",
  KEYWORDS: "B2B, food, marketplace, wholesale, suppliers, buyers, restaurants",
  AUTHOR: "Pickle B2B Marketplace",
  URL: "https://pickle-marketplace.com",
};
