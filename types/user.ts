import { Id } from "@/convex/_generated/dataModel";

/**
 * User role type
 */
export type UserRole = "admin" | "seller" | "buyer";

/**
 * User status type
 */
export type UserStatus = "active" | "inactive" | "pending";

/**
 * User interface
 */
export interface User {
  id: Id<"users"> | string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
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
 * Address interface
 */
export interface Address {
  id?: string;
  name?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  zip?: string; // For backward compatibility
  country: string;
  phone?: string;
  isDefault?: boolean;
}

/**
 * Buyer profile interface
 */
export interface BuyerProfile extends User {
  company?: string;
  phone?: string;
  shippingAddresses?: Address[];
  billingAddresses?: Address[];
  paymentMethods?: string[];
  preferences?: {
    newsletter?: boolean;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
}

/**
 * Seller profile interface
 */
export interface SellerProfile extends User {
  company: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  businessAddress?: Address;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  bankInfo?: {
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
    bankName?: string;
  };
  taxInfo?: {
    taxId?: string;
    taxType?: string;
  };
}
