"use client";

import { Suspense } from "react";
import { LazyNegotiationProcess } from "@/components/seller/lazy-negotiation-process";
import { NegotiationProcessSkeleton } from "@/components/seller/negotiation-process-skeleton";

export default function NegotiationsClientPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<NegotiationProcessSkeleton />}>
        <LazyNegotiationProcess />
      </Suspense>
    </div>
  );
}
