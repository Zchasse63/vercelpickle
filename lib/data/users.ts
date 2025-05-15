/**
 * User Data Access Layer
 *
 * This module provides hooks and utilities for interacting with user data in Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for fetching user profiles with various filters
 * - Hooks for creating, updating, and managing user data
 * - Optimistic updates for better user experience
 * - Server-side data fetching for SSR and SSG
 * - Caching with automatic invalidation
 * - Error handling with retry capability
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import {
  useQuery,
  useMutation,
  usePaginatedQuery,
  useBatchQuery,
  PaginationParams,
  invalidateQueries,
  fetchFromServer,
  prefetchQuery
} from "./index";
import { useMemo } from "react";

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
 * User filter parameters
 */
export interface UserFilterParams extends PaginationParams {
  role?: string;
  search?: string;
  status?: string;
  location?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'role';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Hook for fetching a user profile by ID with caching
 */
export function useUserProfile(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.users.getById,
    userId ? { id: userId } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
      retryCount: 3,
      onSuccess: (data) => {
        // Optional success handling
      },
    }
  );
}

/**
 * Hook for fetching all users with pagination and filtering
 */
export function useUsers(filters?: UserFilterParams) {
  // Set default values
  const defaultFilters: UserFilterParams = {
    limit: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };

  // Merge default filters with provided filters
  const mergedFilters = { ...defaultFilters, ...filters };

  // Use the paginated query hook
  return usePaginatedQuery(
    api.users.getAll,
    mergedFilters,
    {
      // Cache for 5 minutes
      cacheTime: 5 * 60 * 1000,
      // Consider stale after 1 minute
      staleTime: 60 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Hook for updating a user profile with optimistic updates
 */
export function useUpdateUserProfile() {
  const mutation = useMutation(api.users.update, {
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["users.getById", "users.getAll"],
    optimisticUpdate: [
      {
        queryKey: "users.getById",
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          return {
            ...currentData,
            ...args,
            updatedAt: Date.now(),
          };
        }
      }
    ]
  });

  return {
    updateProfile: async (id: Id<"users">, data: UserProfileUpdate) => {
      // Invalidate the specific user query
      invalidateQueries(`users.getById:${JSON.stringify({ id })}`);

      return await mutation.execute({
        id,
        ...data,
      });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  const mutation = useMutation(api.users.create, {
    onSuccess: () => {
      toast({
        title: "User created",
        description: "The user has been created successfully.",
      });
    },
    retry: true,
    retryCount: 3,
    invalidateQueries: ["users.getAll"]
  });

  return {
    createUser: async (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for fetching business profile by user ID with caching
 */
export function useBusinessProfile(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.users.getBusinessProfileByUserId,
    userId ? { userId } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
      retryCount: 3,
    }
  );
}

/**
 * Hook for searching users
 */
export function useSearchUsers(query: string | null | undefined) {
  // Use the enhanced users hook with search parameter
  return useUsers({
    search: query || undefined,
    limit: 50, // Increase limit for search results
  });
}

/**
 * Hook for filtering users by role
 */
export function useUsersByRole(role: string | null | undefined) {
  // Use the enhanced users hook with role parameter
  return useUsers({
    role: role || undefined,
    limit: 50, // Increase limit for role filtering
  });
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

/**
 * Server-side functions for fetching users
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch a user by ID on the server side
 */
export async function getUserById(userId: Id<"users">) {
  return await fetchFromServer("users.getById", { id: userId });
}

/**
 * Fetch all users on the server side with pagination and filtering
 */
export async function getAllUsers(filters?: UserFilterParams) {
  const defaultFilters: UserFilterParams = {
    limit: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  return await fetchFromServer("users.getAll", mergedFilters);
}

/**
 * Fetch a business profile by user ID on the server side
 */
export async function getBusinessProfileByUserId(userId: Id<"users">) {
  return await fetchFromServer("users.getBusinessProfileByUserId", { userId });
}
