/**
 * Analytics Data Access Layer
 *
 * This module provides hooks and utilities for analytics data in the Pickle B2B Marketplace.
 * It implements consistent patterns for data fetching, error handling, and state management.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
 * Sales data structure
 */
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

/**
 * User activity data structure
 */
export interface UserActivityData {
  date: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  averageSessionDuration: number;
}

/**
 * Product performance data structure
 */
export interface ProductPerformanceData {
  productId: Id<"products">;
  productName: string;
  revenue: number;
  unitsSold: number;
  viewCount: number;
  conversionRate: number;
}

/**
 * Dashboard summary data structure
 */
export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
}

/**
 * Time period for analytics data
 */
export type TimePeriod = "day" | "week" | "month" | "year" | "all";

/**
 * Hook for fetching dashboard summary data
 */
export function useDashboardSummary(
  role: "admin" | "seller" | "buyer",
  userId?: Id<"users">
) {
  const args = useMemo(() => {
    if (role === "seller" && !userId) return "skip";
    return { role, userId };
  }, [role, userId]);

  return useQuery(
    api.analytics.getDashboardSummary,
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
 * Hook for fetching sales data
 */
export function useSalesData(
  period: TimePeriod = "month",
  role: "admin" | "seller" = "admin",
  userId?: Id<"users">
) {
  const args = useMemo(() => {
    if (role === "seller" && !userId) return "skip";
    return { period, role, userId };
  }, [period, role, userId]);

  return useQuery(
    api.analytics.getSalesData,
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
 * Hook for fetching user activity data
 */
export function useUserActivityData(period: TimePeriod = "month") {
  return useQuery(
    api.analytics.getUserActivityData,
    { period },
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
 * Hook for fetching product performance data
 */
export function useProductPerformanceData(
  period: TimePeriod = "month",
  role: "admin" | "seller" = "admin",
  userId?: Id<"users">,
  limit: number = 10
) {
  const args = useMemo(() => {
    if (role === "seller" && !userId) return "skip";
    return { period, role, userId, limit };
  }, [period, role, userId, limit]);

  return useQuery(
    api.analytics.getProductPerformanceData,
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
 * Hook for fetching category performance data
 */
export function useCategoryPerformanceData(
  period: TimePeriod = "month",
  role: "admin" | "seller" = "admin",
  userId?: Id<"users">
) {
  const args = useMemo(() => {
    if (role === "seller" && !userId) return "skip";
    return { period, role, userId };
  }, [period, role, userId]);

  return useQuery(
    api.analytics.getCategoryPerformanceData,
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
 * Hook for fetching user acquisition data
 */
export function useUserAcquisitionData(period: TimePeriod = "month") {
  return useQuery(
    api.analytics.getUserAcquisitionData,
    { period },
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
 * Hook for fetching order status data
 */
export function useOrderStatusData(
  period: TimePeriod = "month",
  role: "admin" | "seller" | "buyer" = "admin",
  userId?: Id<"users">
) {
  const args = useMemo(() => {
    if ((role === "seller" || role === "buyer") && !userId) return "skip";
    return { period, role, userId };
  }, [period, role, userId]);

  return useQuery(
    api.analytics.getOrderStatusData,
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
 * Hook for tracking a product view
 */
export function useTrackProductView() {
  const mutation = useMutation(api.analytics.trackProductView);

  return {
    trackProductView: async (productId: Id<"products">) => {
      return await mutation.execute({ productId });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for tracking a user action
 */
export function useTrackUserAction() {
  const mutation = useMutation(api.analytics.trackUserAction);

  return {
    trackUserAction: async (action: string, metadata?: Record<string, any>) => {
      return await mutation.execute({ action, metadata });
    },
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Server-side functions for fetching analytics data
 * These can be used in Server Components or in getServerSideProps
 */

/**
 * Fetch dashboard summary data on the server side
 */
export async function getDashboardSummary(
  role: "admin" | "seller" | "buyer",
  userId?: Id<"users">
) {
  return await fetchFromServer("analytics.getDashboardSummary", { role, userId });
}

/**
 * Fetch sales data on the server side
 */
export async function getSalesData(
  period: TimePeriod = "month",
  role: "admin" | "seller" = "admin",
  userId?: Id<"users">
) {
  return await fetchFromServer("analytics.getSalesData", { period, role, userId });
}

/**
 * Fetch product performance data on the server side
 */
export async function getProductPerformanceData(
  period: TimePeriod = "month",
  role: "admin" | "seller" = "admin",
  userId?: Id<"users">,
  limit: number = 10
) {
  return await fetchFromServer("analytics.getProductPerformanceData", { period, role, userId, limit });
}
