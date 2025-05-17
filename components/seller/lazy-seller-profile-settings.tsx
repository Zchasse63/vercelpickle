"use client";

import { lazyWithSkeleton } from "@/lib/utils/lazy-import";
import { SellerSettingsSkeleton } from "./seller-settings-skeleton";

// Create a skeleton component with the correct props
const ProfileSettingsSkeleton = () => <SellerSettingsSkeleton type="profile" />;

// Dynamically import the SellerProfileSettings component using the standardized pattern
export const LazySellerProfileSettings = lazyWithSkeleton(
  () => import("./seller-profile-settings").then(mod => ({ default: mod.SellerProfileSettings })),
  ProfileSettingsSkeleton,
  {
    displayName: "LazySellerProfileSettings"
  }
);
