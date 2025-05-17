"use client";

import { Suspense } from "react";
import { LazyPickupScheduling } from "@/components/seller/lazy-pickup-scheduling";
import { PickupSchedulingSkeleton } from "@/components/seller/pickup-scheduling-skeleton";

export default function PickupSchedulingClientPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PickupSchedulingSkeleton />}>
        <LazyPickupScheduling />
      </Suspense>
    </div>
  );
}
