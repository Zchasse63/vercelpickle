"use client";

import dynamic from "next/dynamic";
import { SellerSettingsSkeleton } from "./seller-settings-skeleton";

// Dynamically import the SellerProfileSettings component
export const LazySellerProfileSettings = dynamic(
  () => import("./seller-profile-settings").then(mod => ({ default: mod.SellerProfileSettings })),
  {
    loading: () => <SellerSettingsSkeleton type="profile" />,
    ssr: false
  }
);
