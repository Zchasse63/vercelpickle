import { Id } from "@/convex/_generated/dataModel";
import { Address } from "./user";
import { PaymentMethod } from "./payment";

/**
 * Order status type
 */
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

/**
 * Payment status type
 */
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

/**
 * Order item interface
 */
export interface OrderItem {
  productId: Id<"products"> | string;
  quantity: number;
  price: number;
  name?: string;
  sellerId?: Id<"users"> | string;
}

/**
 * Order interface
 */
export interface Order {
  id: Id<"orders"> | string;
  buyerId: Id<"users"> | string;
  sellerId: Id<"users"> | string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  deliveryDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Order creation data interface
 */
export interface OrderCreationData {
  buyerId: Id<"users"> | string;
  sellerId: Id<"users"> | string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
}

/**
 * Checkout state interface
 */
export interface CheckoutState {
  step: 'shipping' | 'payment' | 'review' | 'confirmation';
  shippingAddressId: string | null;
  billingAddressId: string | null;
  paymentMethodId: string | null;
  shippingMethod: 'standard' | 'express' | 'overnight';
  notes: string;
}

/**
 * Order statistics interface
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}
