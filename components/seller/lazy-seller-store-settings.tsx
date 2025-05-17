"use client";

import dynamic from "next/dynamic";
import { SellerSettingsSkeleton } from "./seller-settings-skeleton";

// Dynamically import the SellerStoreSettings component
export const LazySellerStoreSettings = dynamic(
  () => import("./seller-store-settings").then(mod => ({ default: mod.SellerStoreSettings })),
  {
    loading: () => <SellerSettingsSkeleton type="store" />,
    ssr: false
  }
);
