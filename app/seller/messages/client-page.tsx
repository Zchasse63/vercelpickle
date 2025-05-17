"use client";

import { Suspense } from "react";
import { LazyDirectMessaging } from "@/components/seller/lazy-direct-messaging";
import { DirectMessagingSkeleton } from "@/components/seller/direct-messaging-skeleton";

export default function MessagesClientPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Direct Messages</h2>
      <p className="text-muted-foreground">
        Communicate directly with buyers and partners
      </p>
      <Suspense fallback={<DirectMessagingSkeleton />}>
        <LazyDirectMessaging />
      </Suspense>
    </div>
  );
}
