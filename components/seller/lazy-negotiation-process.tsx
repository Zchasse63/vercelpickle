"use client";

import dynamic from "next/dynamic";
import { NegotiationProcessSkeleton } from "./negotiation-process-skeleton";

// Dynamically import the NegotiationProcess component
export const LazyNegotiationProcess = dynamic(
  () => import("./negotiation-process").then(mod => ({ default: mod.NegotiationProcess })),
  {
    loading: () => <NegotiationProcessSkeleton />,
    ssr: false
  }
);
