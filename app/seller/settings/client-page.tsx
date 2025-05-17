"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LazySellerProfileSettings } from "@/components/seller/lazy-seller-profile-settings";
import { LazySellerStoreSettings } from "@/components/seller/lazy-seller-store-settings";
import { LazySellerPaymentSettings } from "@/components/seller/lazy-seller-payment-settings";
import { LazySellerNotificationSettings } from "@/components/seller/lazy-seller-notification-settings";
import { SellerSettingsSkeleton } from "@/components/seller/seller-settings-skeleton";

export default function SellerSettingsClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and store settings</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <Suspense fallback={<SellerSettingsSkeleton type="profile" />}>
            <LazySellerProfileSettings />
          </Suspense>
        </TabsContent>
        <TabsContent value="store" className="space-y-6">
          <Suspense fallback={<SellerSettingsSkeleton type="store" />}>
            <LazySellerStoreSettings />
          </Suspense>
        </TabsContent>
        <TabsContent value="payment" className="space-y-6">
          <Suspense fallback={<SellerSettingsSkeleton type="payment" />}>
            <LazySellerPaymentSettings />
          </Suspense>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Suspense fallback={<SellerSettingsSkeleton type="notifications" />}>
            <LazySellerNotificationSettings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
