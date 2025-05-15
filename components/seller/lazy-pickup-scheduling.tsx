"use client";

import dynamic from "next/dynamic";
import { PickupSchedulingSkeleton } from "./pickup-scheduling-skeleton";

// Dynamically import the PickupScheduling component
export const LazyPickupScheduling = dynamic(
  () => import("./pickup-scheduling").then(mod => ({ default: mod.PickupScheduling })),
  {
    loading: () => <PickupSchedulingSkeleton />,
    ssr: false
  }
);
