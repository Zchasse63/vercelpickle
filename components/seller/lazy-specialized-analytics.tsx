"use client";

import dynamic from "next/dynamic";
import { SpecializedAnalyticsSkeleton } from "./specialized-analytics-skeleton";

// Dynamically import the SpecializedAnalytics component
export const LazySpecializedAnalytics = dynamic(
  () => import("./specialized-analytics").then(mod => ({ default: mod.SpecializedAnalytics })),
  {
    loading: () => <SpecializedAnalyticsSkeleton />,
    ssr: false
  }
);
