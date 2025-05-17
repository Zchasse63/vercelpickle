"use client";

import dynamic from "next/dynamic";
import { SellerSettingsSkeleton } from "./seller-settings-skeleton";

// Dynamically import the SellerNotificationSettings component
export const LazySellerNotificationSettings = dynamic(
  () => import("./seller-notification-settings").then(mod => ({ default: mod.SellerNotificationSettings })),
  {
    loading: () => <SellerSettingsSkeleton type="notifications" />,
    ssr: false
  }
);
