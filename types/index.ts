/**
 * Type definitions for the Pickle B2B Marketplace
 */

// User types
export type UserRole = "admin" | "seller" | "buyer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  category: string;
  subcategory?: string;
  images: string[];
  inventory: number;
  unit: string;
  minimumOrder?: number;
  isOrganic: boolean;
  isLocal: boolean;
  nutritionFacts?: string;
  allergens?: string[];
  storageInstructions?: string;
  certifications?: string[];
  createdAt: number;
  updatedAt: number;
}

// Order types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  deliveryDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: number;
  updatedAt: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: number;
  updatedAt: number;
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: number;
  updatedAt: number;
}

// Support ticket types
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  createdAt: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search types
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

// Theme types
export type Theme = "light" | "dark" | "system";
