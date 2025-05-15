"use client";

import { Suspense } from "react";
import { LazySpecializedAnalytics } from "@/components/seller/lazy-specialized-analytics";
import { SpecializedAnalyticsSkeleton } from "@/components/seller/specialized-analytics-skeleton";

export default function SpecializedAnalyticsClientPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SpecializedAnalyticsSkeleton />}>
        <LazySpecializedAnalytics />
      </Suspense>
    </div>
  );
}
