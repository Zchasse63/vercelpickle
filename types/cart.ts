import { Id } from "@/convex/_generated/dataModel";
import { Product } from "./product";

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  productId: Id<"products"> | string;
  product?: Product;
  quantity: number;
  userId?: Id<"users"> | string | null;
  sellerId?: Id<"users"> | string;
  sellerName?: string;
  price?: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Cart totals interface
 */
export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

/**
 * Cart interface
 */
export interface Cart {
  id?: string;
  userId?: Id<"users"> | string | null;
  items: CartItem[];
  totals: CartTotals;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Cart methods interface
 */
export interface CartMethods {
  addItem: (productId: Id<"products"> | string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<Cart | null>;
  applyDiscount: (code: string) => Promise<boolean>;
  removeDiscount: () => Promise<void>;
}

/**
 * Discount interface
 */
export interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: number;
  validTo: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}
