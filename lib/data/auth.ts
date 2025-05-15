/**
 * Auth Data Access Layer
 *
 * This module provides hooks and utilities for authentication with Convex.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Hooks for authentication operations (login, register, logout)
 * - Caching with automatic invalidation
 * - Optimistic updates for better user experience
 * - Server-side data fetching for SSR and SSG
 * - Error handling with retry capability
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import {
  useQuery,
  useMutation,
  handleError,
  ErrorCategory,
  invalidateQueries,
  fetchFromServer,
  prefetchQuery
} from "./index";
import { useCallback, useEffect, useState } from "react";

/**
 * User data structure
 */
export interface User {
  id: Id<"users">;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  image?: string;
}

/**
 * Hook for getting the current user with caching
 */
export function useCurrentUser() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  // Load userId from localStorage on mount
  useEffect(() => {
    const storedUserId = typeof window !== 'undefined'
      ? localStorage.getItem("userId")
      : null;

    if (storedUserId) {
      setUserId(storedUserId as Id<"users">);
    }
  }, []);

  // Fetch user data from Convex with caching
  const { data, isLoading, error, isError } = useQuery(
    api.auth.me,
    userId ? { userId } : "skip",
    {
      // Cache for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Consider stale after 2 minutes
      staleTime: 2 * 60 * 1000,
      // Enable automatic retry
      retry: true,
      retryCount: 3,
      onError: (err) => {
        handleError(err, {
          customMessage: "Failed to fetch user profile",
          category: ErrorCategory.AUTHENTICATION,
          retry: () => invalidateQueries(`auth.me:${JSON.stringify({ userId })}`),
          retryLabel: "Retry"
        });
      }
    }
  );

  return {
    user: data as User | null,
    userId,
    isLoading,
    error,
    isError,
    isAuthenticated: !!data,
    refetch: () => invalidateQueries(`auth.me:${JSON.stringify({ userId })}`),
  };
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Hook for logging in with optimistic updates and retry capability
 */
export function useLogin() {
  const mutation = useMutation(api.auth.login, {
    retry: true,
    retryCount: 3,
    invalidateQueries: ["auth.me"],
    onSuccess: (result) => {
      if (result.success) {
        // Store userId in localStorage
        localStorage.setItem("userId", result.user.id);

        // Prefetch data for post-login navigation
        prefetchPostAuthData(result.user);

        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.name}!`,
        });
      }
    },
    onError: (error) => {
      handleError(error, {
        customMessage: "Login failed",
        category: ErrorCategory.AUTHENTICATION,
      });
    }
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await mutation.execute(credentials);

        if (result.success) {
          return {
            success: true,
            user: result.user as User,
          };
        } else {
          toast({
            title: "Login failed",
            description: result.message || "Invalid email or password",
            variant: "destructive",
          });

          return {
            success: false,
            message: result.message,
          };
        }
      } catch (error) {
        // Error is already handled by the mutation's onError callback
        return {
          success: false,
          message: error instanceof Error ? error.message : "An unexpected error occurred",
        };
      }
    },
    [mutation]
  );

  return {
    login,
    isLoading: mutation.isLoading,
    error: mutation.error,
    isError: mutation.isError,
    retry: mutation.retry,
  };
}

/**
 * Registration data
 */
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Hook for registering a new user with optimistic updates and retry capability
 */
export function useRegister() {
  const mutation = useMutation(api.auth.register, {
    retry: true,
    retryCount: 3,
    invalidateQueries: ["auth.me"],
    onSuccess: (result) => {
      if (result.success) {
        // Store userId in localStorage
        localStorage.setItem("userId", result.user.id);

        // Prefetch data for post-registration navigation
        prefetchPostAuthData(result.user);

        toast({
          title: "Registration successful",
          description: `Welcome, ${result.user.name}!`,
        });
      }
    },
    onError: (error) => {
      handleError(error, {
        customMessage: "Registration failed",
        category: ErrorCategory.AUTHENTICATION,
      });
    }
  });

  const register = useCallback(
    async (data: RegistrationData) => {
      try {
        const result = await mutation.execute(data);

        if (result.success) {
          return {
            success: true,
            user: result.user as User,
          };
        } else {
          toast({
            title: "Registration failed",
            description: result.message || "Could not create account",
            variant: "destructive",
          });

          return {
            success: false,
            message: result.message,
          };
        }
      } catch (error) {
        // Error is already handled by the mutation's onError callback
        return {
          success: false,
          message: error instanceof Error ? error.message : "An unexpected error occurred",
        };
      }
    },
    [mutation]
  );

  return {
    register,
    isLoading: mutation.isLoading,
    error: mutation.error,
    isError: mutation.isError,
    retry: mutation.retry,
  };
}

/**
 * Hook for logging out with cache invalidation
 */
export function useLogout() {
  const logout = useCallback(() => {
    try {
      // Remove userId from localStorage
      localStorage.removeItem("userId");

      // Invalidate all auth-related queries
      invalidateQueries("auth");

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });

      // Reload the page to clear any state
      window.location.href = "/";
    } catch (error) {
      handleError(error, {
        customMessage: "Failed to log out",
        category: ErrorCategory.AUTHENTICATION,
      });
    }
  }, []);

  return { logout };
}

/**
 * Server-side functions for authentication
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch the current user on the server side
 */
export async function getCurrentUser(userId: Id<"users">) {
  if (!userId) return null;
  return await fetchFromServer("auth.me", { userId });
}

/**
 * Prefetch the current user data to warm up the cache
 */
export async function prefetchCurrentUser(userId: Id<"users">) {
  if (!userId) return;
  await prefetchQuery("auth.me", { userId }, { cacheTime: 10 * 60 * 1000 });
}

/**
 * Prefetch data for post-authentication navigation based on user role
 * This function prefetches data that will be needed after login/registration
 */
export async function prefetchPostAuthData(user: User) {
  if (!user) return;

  try {
    // Common data for all users
    await prefetchQuery("auth.me", { userId: user.id }, { cacheTime: 10 * 60 * 1000 });

    // Role-specific data
    switch (user.role) {
      case "buyer":
        // Prefetch buyer dashboard data
        await prefetchQuery("orders.getRecentOrdersByBuyer", { buyerId: user.id, limit: 5 });
        await prefetchQuery("products.getFeaturedProducts", { limit: 8 });
        await prefetchQuery("cart.getCart", { userId: user.id });
        break;

      case "seller":
        // Prefetch seller dashboard data
        await prefetchQuery("orders.getRecentOrdersBySeller", { sellerId: user.id, limit: 5 });
        await prefetchQuery("products.getProductsBySeller", { sellerId: user.id, limit: 10 });
        break;

      case "admin":
        // Prefetch admin dashboard data
        await prefetchQuery("orders.getRecentOrders", { limit: 10 });
        await prefetchQuery("users.getRecentUsers", { limit: 10 });
        break;
    }
  } catch (error) {
    console.error("Error prefetching post-auth data:", error);
    // Don't throw - prefetching failures shouldn't block the main flow
  }
}
