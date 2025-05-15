"use client";

import dynamic from "next/dynamic";
import { FreightArrangementsSkeleton } from "./freight-arrangements-skeleton";

// Dynamically import the FreightArrangements component
export const LazyFreightArrangements = dynamic(
  () => import("./freight-arrangements").then(mod => ({ default: mod.FreightArrangements })),
  {
    loading: () => <FreightArrangementsSkeleton />,
    ssr: false
  }
);
