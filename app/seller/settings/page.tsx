import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerProfileSettings } from "@/components/seller/seller-profile-settings"
import { SellerStoreSettings } from "@/components/seller/seller-store-settings"
import { SellerPaymentSettings } from "@/components/seller/seller-payment-settings"
import { SellerNotificationSettings } from "@/components/seller/seller-notification-settings"

export default function SellerSettingsPage() {
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
          <SellerProfileSettings />
        </TabsContent>
        <TabsContent value="store" className="space-y-6">
          <SellerStoreSettings />
        </TabsContent>
        <TabsContent value="payment" className="space-y-6">
          <SellerPaymentSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <SellerNotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
