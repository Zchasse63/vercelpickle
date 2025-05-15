"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook for working with products in the marketplace
 * @returns Product-related functions and data
 */
export function useProducts() {
  // Fetch all products
  const products = useQuery(api.products.getAll, {});

  // Fetch a product by ID
  const getProductById = (id: Id<"products">) => useQuery(api.products.getById, { id });

  // Fetch products by category
  const getProductsByCategory = (category: string) =>
    useQuery(api.products.getByCategory, { category });

  // Fetch products by seller
  const getProductsBySeller = (sellerId: Id<"users">) =>
    useQuery(api.products.getBySeller, { sellerId });

  // Create a new product
  const createProduct = useMutation(api.products.create);

  // Update a product
  const updateProduct = useMutation(api.products.update);

  // Delete a product
  const deleteProduct = useMutation(api.products.remove);

  // Add a product to cart (this would be implemented in a cart.ts file in Convex)
  // const addToCart = useMutation(api.cart.addItem);

  return {
    products,
    getProductById,
    getProductsByCategory,
    getProductsBySeller,
    createProduct,
    updateProduct,
    deleteProduct,
    // addToCart,

    // Helper function to transform Convex product data to the format expected by components
    transformProductData: (product: any) => {
      if (!product) return null;

      return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        image: product.images[0] || "/placeholder.svg",
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        isOrganic: product.isOrganic,
        isLocal: product.isLocal,
        seller: {
          id: product.sellerId,
          name: "Seller Name", // This would come from a join with the users table
        },
        badge: product.isOrganic ? "Organic" : product.isLocal ? "Local" : "",
        badgeColor: product.isOrganic
          ? "bg-green-100 text-green-800"
          : product.isLocal
            ? "bg-purple-100 text-purple-800"
            : "",
        rating: 4.5, // This would come from a join with the reviews table
        reviews: 100, // This would come from a join with the reviews table
      };
    }
  };
}
