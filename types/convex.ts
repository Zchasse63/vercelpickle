import { Id } from "@/convex/_generated/dataModel";
import { Product } from "./product";
import { Order } from "./order";
import { User } from "./user";

/**
 * Convex query result interface
 */
export interface ConvexQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Convex mutation result interface
 */
export interface ConvexMutationResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
}

/**
 * Convex pagination params interface
 */
export interface ConvexPaginationParams {
  numItems?: number;
  cursor?: string;
}

/**
 * Convex paginated result interface
 */
export interface ConvexPaginatedResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  status: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";
  loadMore: () => void;
  hasMore: boolean;
}

/**
 * Convex batch query result interface
 */
export interface ConvexBatchQueryResult<T> {
  results: Record<string, T | null>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Convex product document interface
 */
export interface ConvexProductDocument {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  description: string;
  price: number;
  sellerId: Id<"users">;
  sellerName?: string;
  category: string;
  subcategory?: string;
  images: string[];
  inventory: number;
  unit: string;
  minimumOrder?: number;
  status?: string;
  tags?: string[];
  isOrganic?: boolean;
  isLocal?: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Convex order document interface
 */
export interface ConvexOrderDocument {
  _id: Id<"orders">;
  _creationTime: number;
  buyerId: Id<"users">;
  sellerId: Id<"users">;
  items: {
    productId: Id<"products">;
    quantity: number;
    price: number;
    name?: string;
    sellerId?: Id<"users">;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryDate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Convex user document interface
 */
export interface ConvexUserDocument {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  role: string;
  image?: string;
  businessName?: string;
  location?: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Convex document to model mapper functions
 */
export const convexMappers = {
  productToModel: (doc: ConvexProductDocument): Product => ({
    id: doc._id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    sellerId: doc.sellerId,
    sellerName: doc.sellerName,
    category: doc.category,
    subcategory: doc.subcategory,
    images: doc.images,
    image: doc.images[0],
    inventory: doc.inventory,
    unit: doc.unit,
    minimumOrder: doc.minimumOrder,
    status: doc.status,
    tags: doc.tags,
    isOrganic: doc.isOrganic,
    isLocal: doc.isLocal,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }),
  
  orderToModel: (doc: ConvexOrderDocument): Order => ({
    id: doc._id,
    buyerId: doc.buyerId,
    sellerId: doc.sellerId,
    items: doc.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      sellerId: item.sellerId
    })),
    subtotal: doc.subtotal,
    tax: doc.tax,
    shipping: doc.shipping,
    total: doc.total,
    status: doc.status as any,
    paymentStatus: doc.paymentStatus as any,
    paymentMethod: doc.paymentMethod,
    shippingAddress: doc.shippingAddress,
    billingAddress: doc.billingAddress,
    deliveryDate: doc.deliveryDate,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }),
  
  userToModel: (doc: ConvexUserDocument): User => ({
    id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role as any,
    image: doc.image,
    businessName: doc.businessName,
    location: doc.location,
    description: doc.description,
    profileImage: doc.profileImage,
    coverImage: doc.coverImage,
    verified: doc.verified,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  })
}
