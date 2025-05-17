"use client";

import dynamic from "next/dynamic";
import { TimeDealsManagerSkeleton } from "./time-sensitive-deals-skeleton";

// Dynamically import the TimeDealsManager component
export const LazyTimeDealsManager = dynamic(
  () => import("./time-sensitive-deals").then(mod => ({ default: mod.TimeDealsManager })),
  {
    loading: () => <TimeDealsManagerSkeleton />,
    ssr: false
  }
);
