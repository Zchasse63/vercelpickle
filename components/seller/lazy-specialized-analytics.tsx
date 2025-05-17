"use client";

import { lazyWithSkeleton } from "@/lib/utils/lazy-import";
import { SpecializedAnalyticsSkeleton } from "./specialized-analytics-skeleton";

// Dynamically import the SpecializedAnalytics component using the standardized pattern
export const LazySpecializedAnalytics = lazyWithSkeleton(
  () => import("./specialized-analytics").then(mod => ({ default: mod.SpecializedAnalytics })),
  SpecializedAnalyticsSkeleton,
  {
    displayName: "LazySpecializedAnalytics"
  }
);
