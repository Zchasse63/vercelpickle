import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all orders
 * @returns List of all orders
 */
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

/**
 * Get an order by ID
 * @param id - Order ID
 * @returns Order or null if not found
 */
export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get orders by buyer
 * @param buyerId - Buyer ID
 * @returns List of orders placed by the buyer
 */
export const getByBuyer = query({
  args: { buyerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_buyer", (q) => q.eq("buyerId", args.buyerId))
      .collect();
  },
});

/**
 * Get orders by seller
 * @param sellerId - Seller ID
 * @returns List of orders for the seller
 */
export const getBySeller = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.sellerId))
      .collect();
  },
});

/**
 * Get orders by status
 * @param status - Order status
 * @returns List of orders with the specified status
 */
export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
  },
});

/**
 * Create a new order
 * @param data - Order data
 * @returns ID of the created order
 */
export const create = mutation({
  args: {
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.string(),
    paymentStatus: v.string(),
    paymentMethod: v.string(),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    billingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    deliveryDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify that buyer and seller exist
    const buyer = await ctx.db.get(args.buyerId);
    if (!buyer) {
      throw new Error(`Buyer with ID ${args.buyerId} not found`);
    }

    const seller = await ctx.db.get(args.sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${args.sellerId} not found`);
    }

    // Verify that all products exist and update inventory
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Check if there's enough inventory
      if (product.inventory < item.quantity) {
        throw new Error(`Not enough inventory for product ${product.name}`);
      }

      // Update inventory
      await ctx.db.patch(item.productId, {
        inventory: product.inventory - item.quantity,
        updatedAt: Date.now(),
      });
    }

    // Create the order
    const orderId = await ctx.db.insert("orders", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return orderId;
  },
});

/**
 * Update an order's status
 * @param id - Order ID
 * @param status - New order status
 * @returns ID of the updated order
 */
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the existing order
    const existingOrder = await ctx.db.get(args.id);
    if (!existingOrder) {
      throw new Error(`Order with ID ${args.id} not found`);
    }

    // Update the order status
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Update an order's payment status
 * @param id - Order ID
 * @param paymentStatus - New payment status
 * @returns ID of the updated order
 */
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the existing order
    const existingOrder = await ctx.db.get(args.id);
    if (!existingOrder) {
      throw new Error(`Order with ID ${args.id} not found`);
    }

    // Update the payment status
    await ctx.db.patch(args.id, {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Cancel an order
 * @param id - Order ID
 * @returns ID of the cancelled order
 */
export const cancel = mutation({
  args: {
    id: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Get the existing order
    const existingOrder = await ctx.db.get(args.id);
    if (!existingOrder) {
      throw new Error(`Order with ID ${args.id} not found`);
    }

    // Check if the order can be cancelled
    if (existingOrder.status === "delivered") {
      throw new Error("Cannot cancel an order that has already been delivered");
    }

    // Restore inventory for each product
    for (const item of existingOrder.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          inventory: product.inventory + item.quantity,
          updatedAt: Date.now(),
        });
      }
    }

    // Update the order status
    await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

/**
 * Get recent orders
 * @param limit - Maximum number of orders to return
 * @returns List of recent orders
 */
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .collect();

    // Apply limit after collecting
    return orders.slice(0, limit);
  },
});

/**
 * Get order history for a buyer
 * @param buyerId - Buyer ID
 * @param limit - Maximum number of orders to return
 * @returns List of orders for the buyer
 */
export const getHistory = query({
  args: {
    buyerId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_buyer", (q) => q.eq("buyerId", args.buyerId))
      .order("desc")
      .collect();

    // Apply limit after collecting
    return orders.slice(0, limit);
  },
});

/**
 * Get order statistics
 * @returns Order statistics
 */
export const getStats = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Count orders by status
    const ordersByStatus = orders.reduce((acc: Record<string, number>, order) => {
      const status = order.status as string;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
    };
  },
});
