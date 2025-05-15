/**
 * User Data Access Layer
 * 
 * This module provides hooks and utilities for interacting with user data in Convex.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "./index";

/**
 * User profile data structure
 */
export interface UserProfile {
  id: Id<"users">;
  name: string;
  email: string;
  role: string;
  businessName?: string;
  location?: string;
  description?: string;
  profileImage?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  name?: string;
  email?: string;
  businessName?: string;
  location?: string;
  description?: string;
  profileImage?: string;
  phone?: string;
}

/**
 * Hook for fetching a user profile by ID
 */
export function useUserProfile(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.users.getById,
    userId ? { id: userId } : "skip",
    {
      onSuccess: (data) => {
        // Optional success handling
      },
    }
  );
}

/**
 * Hook for updating a user profile
 */
export function useUpdateUserProfile() {
  const mutation = useMutation(api.users.update, {
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
  });

  return {
    updateProfile: async (id: Id<"users">, data: UserProfileUpdate) => {
      return await mutation.execute({
        id,
        ...data,
      });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for fetching business profile by user ID
 */
export function useBusinessProfile(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.users.getBusinessProfileByUserId,
    userId ? { userId } : "skip"
  );
}

/**
 * Address data structure
 */
export interface Address {
  id: string;
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

/**
 * Hook for fetching user addresses
 * Note: This is a mock implementation until we have a proper addresses table in Convex
 */
export function useUserAddresses(userId: Id<"users"> | null | undefined) {
  // This would normally fetch from Convex, but we're mocking it for now
  const mockAddresses: Address[] = [
    {
      id: "addr-1",
      name: "Office",
      street: "123 Business St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
      phone: "(555) 123-4567",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Warehouse",
      street: "456 Storage Ave",
      city: "Oakland",
      state: "CA",
      zip: "94612",
      country: "US",
      phone: "(555) 987-6543",
      isDefault: false,
    },
  ];

  // Return a mock query result
  return {
    data: userId ? mockAddresses : [],
    isLoading: false,
    error: null,
    isError: false,
  };
}

/**
 * Payment method data structure
 */
export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

/**
 * Hook for fetching user payment methods
 * Note: This is a mock implementation until we have a proper payment methods table in Convex
 */
export function useUserPaymentMethods(userId: Id<"users"> | null | undefined) {
  // This would normally fetch from Convex, but we're mocking it for now
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: "pm-1",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
    {
      id: "pm-2",
      brand: "mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2024,
      isDefault: false,
    },
  ];

  // Return a mock query result
  return {
    data: userId ? mockPaymentMethods : [],
    isLoading: false,
    error: null,
    isError: false,
  };
}
