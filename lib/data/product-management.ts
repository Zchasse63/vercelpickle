/**
 * Product Management Data Access Layer
 *
 * This module provides enhanced hooks and utilities for managing products in the Pickle B2B Marketplace.
 * It extends the basic product DAL with advanced features for product management.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import {
  useQuery,
  useMutation,
  usePaginatedQuery,
  useBatchQuery,
  fetchFromServer,
  invalidateQueries,
  prefetchQuery
} from "./index";
import { useMemo } from "react";
import { Product } from "@/types/product";

/**
 * Product variant data structure
 */
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
  specifications?: Record<string, any>;
  images?: string[];
}

/**
 * Product import data structure
 */
export interface ProductImportData {
  products: Omit<Product, "id" | "createdAt" | "updatedAt">[];
}

/**
 * Product export options
 */
export interface ProductExportOptions {
  format: "csv" | "json";
  includeVariants: boolean;
  includeSpecifications: boolean;
}

/**
 * Hook for batch creating products
 */
export function useBatchCreateProducts() {
  const mutation = useMutation(api.products.batchCreate, {
    onSuccess: (result) => {
      const count = result?.length || 0;
      toast({
        title: "Products created",
        description: `Successfully created ${count} products.`,
      });

      // Invalidate product queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");
    },
    retry: true,
    retryCount: 3,
  });

  return {
    batchCreateProducts: async (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => {
      return await mutation.execute({ products });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for batch updating products
 */
export function useBatchUpdateProducts() {
  const mutation = useMutation(api.products.batchUpdate, {
    onSuccess: (result) => {
      const count = result?.length || 0;
      toast({
        title: "Products updated",
        description: `Successfully updated ${count} products.`,
      });

      // Invalidate product queries to refresh the data
      invalidateQueries("products.getAll");
      invalidateQueries("products.getFeatured");
    },
    retry: true,
    retryCount: 3,
  });

  return {
    batchUpdateProducts: async (products: (Partial<Product> & { id: Id<"products"> })[]) => {
      return await mutation.execute({ products });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for importing products from CSV or JSON
 */
export function useImportProducts() {
  const { batchCreateProducts, isLoading, error, retry } = useBatchCreateProducts();

  const importProducts = async (file: File, sellerId: Id<"users">, sellerName?: string) => {
    try {
      const fileContent = await readFileContent(file);
      const products = parseImportData(fileContent, file.name, sellerId, sellerName);
      return await batchCreateProducts(products);
    } catch (error) {
      console.error("Error importing products:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    importProducts,
    isLoading,
    error,
    retry,
  };
}

/**
 * Read file content as text
 */
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Parse import data from CSV or JSON
 */
function parseImportData(
  content: string,
  fileName: string,
  sellerId: Id<"users">,
  sellerName?: string
): Omit<Product, "id" | "createdAt" | "updatedAt">[] {
  if (fileName.endsWith(".json")) {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map((item) => ({
          ...item,
          sellerId,
          sellerName: sellerName || item.sellerName,
        }));
      } else if (data.products && Array.isArray(data.products)) {
        return data.products.map((item) => ({
          ...item,
          sellerId,
          sellerName: sellerName || item.sellerName,
        }));
      }
      throw new Error("Invalid JSON format. Expected an array or an object with a 'products' array.");
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  } else if (fileName.endsWith(".csv")) {
    try {
      // Simple CSV parsing - in a real app, use a proper CSV parser
      const lines = content.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(",").map((v) => v.trim());
        const product: any = { sellerId, sellerName: sellerName || "" };
        
        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            // Handle special cases
            if (header === "price" || header === "inventory" || header === "minimumOrder") {
              product[header] = parseFloat(values[index]);
            } else if (header === "images" || header === "tags" || header === "certifications") {
              product[header] = values[index].split(";").filter(Boolean);
            } else if (header === "isOrganic" || header === "isLocal") {
              product[header] = values[index].toLowerCase() === "true";
            } else {
              product[header] = values[index];
            }
          }
        });
        
        products.push(product);
      }
      
      return products;
    } catch (error) {
      throw new Error("Invalid CSV format: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }
  
  throw new Error("Unsupported file format. Please use CSV or JSON.");
}

/**
 * Hook for exporting products
 */
export function useExportProducts() {
  const exportProducts = async (products: Product[], options: ProductExportOptions) => {
    try {
      let content: string;
      let mimeType: string;
      let fileExtension: string;
      
      if (options.format === "json") {
        content = generateJsonExport(products, options);
        mimeType = "application/json";
        fileExtension = "json";
      } else {
        content = generateCsvExport(products, options);
        mimeType = "text/csv";
        fileExtension = "csv";
      }
      
      // Create a blob and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split("T")[0]}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `Successfully exported ${products.length} products.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error exporting products:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export products",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { exportProducts };
}

/**
 * Generate JSON export
 */
function generateJsonExport(products: Product[], options: ProductExportOptions): string {
  const exportProducts = products.map(product => {
    const exportProduct: any = { ...product };
    
    if (!options.includeVariants) {
      delete exportProduct.variants;
    }
    
    if (!options.includeSpecifications) {
      delete exportProduct.specifications;
    }
    
    return exportProduct;
  });
  
  return JSON.stringify({ products: exportProducts }, null, 2);
}

/**
 * Generate CSV export
 */
function generateCsvExport(products: Product[], options: ProductExportOptions): string {
  // Determine all possible headers from the products
  const headers = new Set<string>();
  products.forEach(product => {
    Object.keys(product).forEach(key => {
      // Skip complex objects if not including them
      if (key === "variants" && !options.includeVariants) return;
      if (key === "specifications" && !options.includeSpecifications) return;
      
      // Skip internal IDs
      if (key === "_id" || key === "id") return;
      
      headers.add(key);
    });
  });
  
  // Convert headers to array and create CSV header row
  const headerRow = Array.from(headers).join(",");
  
  // Create CSV rows for each product
  const rows = products.map(product => {
    return Array.from(headers).map(header => {
      const value = (product as any)[header];
      
      if (value === undefined || value === null) {
        return "";
      } else if (Array.isArray(value)) {
        return `"${value.join(";")}"`;
      } else if (typeof value === "object") {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      } else {
        return `"${String(value).replace(/"/g, '""')}"`;
      }
    }).join(",");
  });
  
  // Combine header and rows
  return [headerRow, ...rows].join("\n");
}

/**
 * Hook for managing product variants
 */
export function useProductVariants(productId: Id<"products"> | null | undefined) {
  const { data: product, isLoading } = useQuery(
    api.products.getById,
    productId ? { id: productId } : "skip",
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 60 * 1000,
      retry: true,
    }
  );
  
  const variants = useMemo(() => product?.variants || [], [product]);
  
  return {
    variants,
    isLoading,
    product,
  };
}

/**
 * Hook for adding a product variant
 */
export function useAddProductVariant() {
  const { updateProduct, isLoading, error, retry } = useUpdateProduct();
  
  const addVariant = async (
    productId: Id<"products">,
    variant: Omit<ProductVariant, "id">
  ) => {
    try {
      // Get the current product
      const product = await fetchFromServer("products.getById", { id: productId });
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Create a new variant with a unique ID
      const newVariant: ProductVariant = {
        ...variant,
        id: `variant_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };
      
      // Add the variant to the product
      const variants = [...(product.variants || []), newVariant];
      
      // Update the product
      await updateProduct({
        id: productId,
        variants,
      });
      
      toast({
        title: "Variant added",
        description: "Product variant has been added successfully.",
      });
      
      return newVariant;
    } catch (error) {
      console.error("Error adding product variant:", error);
      toast({
        title: "Failed to add variant",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    addVariant,
    isLoading,
    error,
    retry,
  };
}

/**
 * Hook for updating a product variant
 */
export function useUpdateProductVariant() {
  const { updateProduct, isLoading, error, retry } = useUpdateProduct();
  
  const updateVariant = async (
    productId: Id<"products">,
    variantId: string,
    updates: Partial<Omit<ProductVariant, "id">>
  ) => {
    try {
      // Get the current product
      const product = await fetchFromServer("products.getById", { id: productId });
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Find the variant
      const variants = [...(product.variants || [])];
      const variantIndex = variants.findIndex(v => v.id === variantId);
      
      if (variantIndex === -1) {
        throw new Error("Variant not found");
      }
      
      // Update the variant
      variants[variantIndex] = {
        ...variants[variantIndex],
        ...updates,
      };
      
      // Update the product
      await updateProduct({
        id: productId,
        variants,
      });
      
      toast({
        title: "Variant updated",
        description: "Product variant has been updated successfully.",
      });
      
      return variants[variantIndex];
    } catch (error) {
      console.error("Error updating product variant:", error);
      toast({
        title: "Failed to update variant",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    updateVariant,
    isLoading,
    error,
    retry,
  };
}

/**
 * Hook for removing a product variant
 */
export function useRemoveProductVariant() {
  const { updateProduct, isLoading, error, retry } = useUpdateProduct();
  
  const removeVariant = async (
    productId: Id<"products">,
    variantId: string
  ) => {
    try {
      // Get the current product
      const product = await fetchFromServer("products.getById", { id: productId });
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Filter out the variant
      const variants = (product.variants || []).filter(v => v.id !== variantId);
      
      // Update the product
      await updateProduct({
        id: productId,
        variants,
      });
      
      toast({
        title: "Variant removed",
        description: "Product variant has been removed successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error removing product variant:", error);
      toast({
        title: "Failed to remove variant",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    removeVariant,
    isLoading,
    error,
    retry,
  };
}

// Re-export from products.ts
export { useProduct, useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "./products";
