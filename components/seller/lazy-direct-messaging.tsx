"use client";

import dynamic from "next/dynamic";
import { DirectMessagingSkeleton } from "./direct-messaging-skeleton";

// Dynamically import the DirectMessaging component
export const LazyDirectMessaging = dynamic(
  () => import("./direct-messaging").then(mod => ({ default: mod.DirectMessaging })),
  {
    loading: () => <DirectMessagingSkeleton />,
    ssr: false
  }
);
