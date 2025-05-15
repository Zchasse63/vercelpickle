"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook for working with products in Convex
 * @returns Product-related functions
 */
export function useProducts() {
  // Queries
  const getAllProducts = useQuery(api.products.getAll, {});
  const getProductById = (id: Id<"products">) => useQuery(api.products.getById, { id });
  const getProductsByCategory = (category: string) => useQuery(api.products.getByCategory, { category });
  const getProductsBySeller = (sellerId: Id<"users">) => useQuery(api.products.getBySeller, { sellerId });

  // Mutations
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  return {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySeller,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

/**
 * Hook for working with users in Convex
 * @returns User-related functions
 */
export function useUsers() {
  // Queries
  const getAllUsers = useQuery(api.users.getAll);
  const getUserById = (id: Id<"users">) => useQuery(api.users.getById, { id });
  const getUserByEmail = (email: string) => useQuery(api.users.getByEmail, { email });
  const getUsersByRole = (role: string) => useQuery(api.users.getByRole, { role });

  // Mutations
  const createUser = useMutation(api.users.create);
  const updateUser = useMutation(api.users.update);
  const deleteUser = useMutation(api.users.remove);

  return {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUsersByRole,
    createUser,
    updateUser,
    deleteUser,
  };
}

/**
 * Hook for working with orders in Convex
 * @returns Order-related functions
 */
export function useOrders() {
  // Queries
  const getAllOrders = useQuery(api.orders.getAll);
  const getOrderById = (id: Id<"orders">) => useQuery(api.orders.getById, { id });
  const getOrdersByBuyer = (buyerId: Id<"users">) => useQuery(api.orders.getByBuyer, { buyerId });
  const getOrdersBySeller = (sellerId: Id<"users">) => useQuery(api.orders.getBySeller, { sellerId });
  const getOrdersByStatus = (status: string) => useQuery(api.orders.getByStatus, { status });

  // Mutations
  const createOrder = useMutation(api.orders.create);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
  const cancelOrder = useMutation(api.orders.cancel);

  return {
    getAllOrders,
    getOrderById,
    getOrdersByBuyer,
    getOrdersBySeller,
    getOrdersByStatus,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
  };
}
