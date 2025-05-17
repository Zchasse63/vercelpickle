/**
 * Convex functions for analytics
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get dashboard summary data
 */
export const getDashboardSummary = query({
  args: {
    role: v.union(v.literal("admin"), v.literal("seller"), v.literal("buyer")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { role, userId } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Get all orders
    const orders = await ctx.db.query("orders").collect();
    
    // Filter orders based on role and userId
    const filteredOrders = role === "admin"
      ? orders
      : role === "seller" && userId
        ? orders.filter(order => order.sellerId === userId)
        : role === "buyer" && userId
          ? orders.filter(order => order.buyerId === userId)
          : [];
    
    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Get all products
    const products = await ctx.db.query("products").collect();
    
    // Filter products based on role and userId
    const filteredProducts = role === "admin"
      ? products
      : role === "seller" && userId
        ? products.filter(product => product.sellerId === userId)
        : [];
    
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Calculate changes (mock data for demo)
    const revenueChange = Math.random() * 20 - 10; // -10% to +10%
    const ordersChange = Math.random() * 20 - 10; // -10% to +10%
    const productsChange = Math.random() * 10; // 0% to +10%
    const usersChange = Math.random() * 10; // 0% to +10%
    
    return {
      totalRevenue,
      totalOrders: filteredOrders.length,
      totalProducts: filteredProducts.length,
      totalUsers: users.length,
      revenueChange,
      ordersChange,
      productsChange,
      usersChange,
    };
  },
});

/**
 * Get sales data
 */
export const getSalesData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
    role: v.union(v.literal("admin"), v.literal("seller")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { period, role, userId } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Get all orders
    const orders = await ctx.db.query("orders").collect();
    
    // Filter orders based on role and userId
    const filteredOrders = role === "admin"
      ? orders
      : role === "seller" && userId
        ? orders.filter(order => order.sellerId === userId)
        : [];
    
    // Generate date range based on period
    const now = new Date();
    const dates: string[] = [];
    
    if (period === "day") {
      // Last 24 hours in hourly intervals
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() - 23 + i);
        dates.push(date.toISOString().split("T")[0] + " " + date.getHours() + ":00");
      }
    } else if (period === "week") {
      // Last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - 6 + i);
        dates.push(date.toISOString().split("T")[0]);
      }
    } else if (period === "month") {
      // Last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - 29 + i);
        dates.push(date.toISOString().split("T")[0]);
      }
    } else if (period === "year") {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        dates.push(date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0"));
      }
    } else {
      // All time (last 12 months for demo)
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        dates.push(date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0"));
      }
    }
    
    // Generate mock sales data
    return dates.map(date => {
      const revenue = 1000 + Math.random() * 9000; // $1000 to $10000
      const orders = 10 + Math.floor(Math.random() * 90); // 10 to 100 orders
      
      return {
        date,
        revenue,
        orders,
        averageOrderValue: revenue / orders,
      };
    });
  },
});

/**
 * Get user activity data
 */
export const getUserActivityData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
  },
  handler: async (ctx, args) => {
    const { period } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Generate date range based on period
    const now = new Date();
    const dates: string[] = [];
    
    if (period === "day") {
      // Last 24 hours in hourly intervals
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() - 23 + i);
        dates.push(date.toISOString().split("T")[0] + " " + date.getHours() + ":00");
      }
    } else if (period === "week") {
      // Last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - 6 + i);
        dates.push(date.toISOString().split("T")[0]);
      }
    } else if (period === "month") {
      // Last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - 29 + i);
        dates.push(date.toISOString().split("T")[0]);
      }
    } else if (period === "year") {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        dates.push(date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0"));
      }
    } else {
      // All time (last 12 months for demo)
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        dates.push(date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0"));
      }
    }
    
    // Generate mock user activity data
    return dates.map(date => {
      const activeUsers = 50 + Math.floor(Math.random() * 150); // 50 to 200 active users
      const newUsers = 5 + Math.floor(Math.random() * 15); // 5 to 20 new users
      const sessions = activeUsers * (1 + Math.random()); // 1 to 2 sessions per active user
      const averageSessionDuration = 60 + Math.random() * 240; // 1 to 5 minutes
      
      return {
        date,
        activeUsers,
        newUsers,
        sessions: Math.floor(sessions),
        averageSessionDuration,
      };
    });
  },
});

/**
 * Get product performance data
 */
export const getProductPerformanceData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
    role: v.union(v.literal("admin"), v.literal("seller")),
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { period, role, userId, limit = 10 } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Get all products
    const products = await ctx.db.query("products").collect();
    
    // Filter products based on role and userId
    const filteredProducts = role === "admin"
      ? products
      : role === "seller" && userId
        ? products.filter(product => product.sellerId === userId)
        : [];
    
    // Generate mock product performance data
    const productPerformance = filteredProducts.map(product => {
      const revenue = 100 + Math.random() * 9900; // $100 to $10000
      const unitsSold = 5 + Math.floor(Math.random() * 95); // 5 to 100 units
      const viewCount = 50 + Math.floor(Math.random() * 950); // 50 to 1000 views
      const conversionRate = unitsSold / viewCount * 100; // Conversion rate as percentage
      
      return {
        productId: product._id,
        productName: product.name,
        revenue,
        unitsSold,
        viewCount,
        conversionRate,
      };
    });
    
    // Sort by revenue (descending) and limit the results
    return productPerformance
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  },
});

/**
 * Get category performance data
 */
export const getCategoryPerformanceData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
    role: v.union(v.literal("admin"), v.literal("seller")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { period, role, userId } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Get all products
    const products = await ctx.db.query("products").collect();
    
    // Filter products based on role and userId
    const filteredProducts = role === "admin"
      ? products
      : role === "seller" && userId
        ? products.filter(product => product.sellerId === userId)
        : [];
    
    // Get unique categories
    const categories = Array.from(new Set(filteredProducts.map(product => product.category)));
    
    // Generate mock category performance data
    return categories.map(category => {
      const revenue = 1000 + Math.random() * 9000; // $1000 to $10000
      const unitsSold = 50 + Math.floor(Math.random() * 150); // 50 to 200 units
      const productCount = filteredProducts.filter(product => product.category === category).length;
      
      return {
        category,
        revenue,
        unitsSold,
        productCount,
        averageRevenuePerProduct: revenue / productCount,
      };
    });
  },
});

/**
 * Get user acquisition data
 */
export const getUserAcquisitionData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
  },
  handler: async (ctx, args) => {
    const { period } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Generate mock user acquisition data
    return [
      { source: "Direct", users: 100 + Math.floor(Math.random() * 200) },
      { source: "Organic Search", users: 150 + Math.floor(Math.random() * 250) },
      { source: "Referral", users: 80 + Math.floor(Math.random() * 120) },
      { source: "Social Media", users: 60 + Math.floor(Math.random() * 140) },
      { source: "Email", users: 40 + Math.floor(Math.random() * 60) },
    ];
  },
});

/**
 * Get order status data
 */
export const getOrderStatusData = query({
  args: {
    period: v.union(
      v.literal("day"),
      v.literal("week"),
      v.literal("month"),
      v.literal("year"),
      v.literal("all")
    ),
    role: v.union(v.literal("admin"), v.literal("seller"), v.literal("buyer")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { period, role, userId } = args;
    
    // For demo purposes, we'll generate mock data
    // In a real app, this would query actual data from the database
    
    // Get all orders
    const orders = await ctx.db.query("orders").collect();
    
    // Filter orders based on role and userId
    const filteredOrders = role === "admin"
      ? orders
      : role === "seller" && userId
        ? orders.filter(order => order.sellerId === userId)
        : role === "buyer" && userId
          ? orders.filter(order => order.buyerId === userId)
          : [];
    
    // Count orders by status
    const statusCounts: Record<string, number> = {
      "pending": 0,
      "processing": 0,
      "shipped": 0,
      "delivered": 0,
      "cancelled": 0,
    };
    
    filteredOrders.forEach(order => {
      const status = order.status || "pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Convert to array format
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  },
});

/**
 * Track a product view
 */
export const trackProductView = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { productId } = args;
    
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // For demo purposes, we'll just log the view
    // In a real app, this would store the view in the database
    console.log(`Product view: ${productId} by user ${userId || "anonymous"}`);
    
    // Return success
    return true;
  },
});

/**
 * Track a user action
 */
export const trackUserAction = mutation({
  args: {
    action: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { action, metadata } = args;
    
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // For demo purposes, we'll just log the action
    // In a real app, this would store the action in the database
    console.log(`User action: ${action} by user ${userId || "anonymous"}`, metadata);
    
    // Return success
    return true;
  },
});
