"use client";

import { Suspense } from "react";
import { LazyFreightArrangements } from "@/components/seller/lazy-freight-arrangements";
import { FreightArrangementsSkeleton } from "@/components/seller/freight-arrangements-skeleton";

export default function FreightArrangementsClientPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<FreightArrangementsSkeleton />}>
        <LazyFreightArrangements />
      </Suspense>
    </div>
  );
}
