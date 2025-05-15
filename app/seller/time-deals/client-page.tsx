"use client";

import { Suspense } from "react";
import { LazyTimeDealsManager } from "@/components/seller/lazy-time-sensitive-deals";
import { TimeDealsManagerSkeleton } from "@/components/seller/time-sensitive-deals-skeleton";

export default function TimeDealsClientPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<TimeDealsManagerSkeleton />}>
        <LazyTimeDealsManager />
      </Suspense>
    </div>
  );
}
