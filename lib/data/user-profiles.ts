/**
 * User Profiles Data Access Layer
 *
 * This module provides hooks and utilities for managing user profiles in the Pickle B2B Marketplace.
 * It implements consistent patterns for data fetching, error handling, and state management.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import {
  useQuery,
  useMutation,
  usePaginatedQuery,
  fetchFromServer,
  invalidateQueries,
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
 * Business profile data structure
 */
export interface BusinessProfile {
  id: Id<"businessProfiles">;
  userId: Id<"users">;
  businessName: string;
  businessType: string;
  industry: string;
  description: string;
  website?: string;
  phone?: string;
  email: string;
  verificationStatus?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  certifications?: string[];
  createdAt: number;
  updatedAt: number;
}

/**
 * User settings data structure
 */
export interface UserSettings {
  id: Id<"users">;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  displayPreferences?: {
    theme: string;
    language: string;
    currency: string;
  };
  privacySettings?: {
    profileVisibility: string;
    contactInfoVisibility: string;
  };
}

/**
 * Hook for fetching the current user's profile
 */
export function useCurrentUserProfile() {
  return useQuery(
    api.users.getCurrentUser,
    {},
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
 * Hook for fetching a user profile by ID
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
    }
  );
}

/**
 * Hook for fetching multiple user profiles
 */
export function useUserProfiles(userIds: Id<"users">[]) {
  const args = useMemo(() => {
    if (!userIds || userIds.length === 0) return "skip";
    return { ids: userIds };
  }, [userIds]);

  return useQuery(
    api.users.getByIds,
    args,
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
 * Hook for fetching users by role
 */
export function useUsersByRole(
  role: string,
  options?: {
    limit?: number;
    sortDirection?: "asc" | "desc";
  }
) {
  const args = useMemo(() => {
    if (!role) return "skip";
    return {
      role,
      limit: options?.limit || 20,
      sortDirection: options?.sortDirection || "desc",
    };
  }, [role, options?.limit, options?.sortDirection]);

  return usePaginatedQuery(
    api.users.getByRole,
    args,
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
 * User profile update data
 */
export interface UserProfileUpdateData {
  id: Id<"users">;
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
  location?: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
}

/**
 * Hook for updating a user profile
 */
export function useUpdateUserProfile() {
  const mutation = useMutation(api.users.update, {
    onSuccess: (result) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("users.getCurrentUser");
      invalidateQueries(`users.getById:${JSON.stringify({ id: result })}`);
    },
    retry: true,
    retryCount: 3,
    optimisticUpdate: [
      {
        // Optimistically update the current user
        queryKey: "users.getCurrentUser",
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          // Create an optimistically updated user
          return {
            ...currentData,
            ...args,
            updatedAt: Date.now(),
          };
        }
      },
      {
        // Optimistically update the specific user
        queryKey: (args) => `users.getById:${JSON.stringify({ id: args.id })}`,
        updateFn: (currentData, args) => {
          if (!currentData) return currentData;

          // Create an optimistically updated user
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
    updateUserProfile: async (data: UserProfileUpdateData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Business profile creation data
 */
export interface BusinessProfileCreationData {
  businessName: string;
  businessType: string;
  industry: string;
  description: string;
  website?: string;
  phone?: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  certifications?: string[];
}

/**
 * Hook for creating a business profile
 */
export function useCreateBusinessProfile() {
  const mutation = useMutation(api.businessProfiles.create, {
    onSuccess: (result) => {
      toast({
        title: "Business profile created",
        description: "Your business profile has been created successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("businessProfiles.getByUser");
      invalidateQueries("users.getCurrentUser");
    },
    retry: true,
    retryCount: 3,
  });

  return {
    createBusinessProfile: async (data: BusinessProfileCreationData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Hook for fetching a business profile by user ID
 */
export function useBusinessProfile(userId: Id<"users"> | null | undefined) {
  return useQuery(
    api.businessProfiles.getByUser,
    userId ? { userId } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
    }
  );
}

/**
 * Business profile update data
 */
export interface BusinessProfileUpdateData {
  id: Id<"businessProfiles">;
  businessName?: string;
  businessType?: string;
  industry?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  certifications?: string[];
}

/**
 * Hook for updating a business profile
 */
export function useUpdateBusinessProfile() {
  const mutation = useMutation(api.businessProfiles.update, {
    onSuccess: (result) => {
      toast({
        title: "Business profile updated",
        description: "Your business profile has been updated successfully.",
      });

      // Invalidate specific queries to refresh the data
      invalidateQueries("businessProfiles.getByUser");
    },
    retry: true,
    retryCount: 3,
  });

  return {
    updateBusinessProfile: async (data: BusinessProfileUpdateData) => {
      return await mutation.execute(data);
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
    retry: mutation.retry,
  };
}

/**
 * Server-side functions for fetching user profiles
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch a user profile by ID on the server side
 */
export async function getUserProfileById(userId: Id<"users">) {
  return await fetchFromServer("users.getById", { id: userId });
}

/**
 * Fetch the current user's profile on the server side
 */
export async function getCurrentUserProfile() {
  return await fetchFromServer("users.getCurrentUser", {});
}

/**
 * Fetch a business profile by user ID on the server side
 */
export async function getBusinessProfileByUserId(userId: Id<"users">) {
  return await fetchFromServer("businessProfiles.getByUser", { userId });
}
