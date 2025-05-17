"use client";

import dynamic from "next/dynamic";
import { SellerSettingsSkeleton } from "./seller-settings-skeleton";

// Dynamically import the SellerPaymentSettings component
export const LazySellerPaymentSettings = dynamic(
  () => import("./seller-payment-settings").then(mod => ({ default: mod.SellerPaymentSettings })),
  {
    loading: () => <SellerSettingsSkeleton type="payment" />,
    ssr: false
  }
);
