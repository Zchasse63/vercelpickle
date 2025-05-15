import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminGeneralSettings } from "@/components/admin/admin-general-settings"
import { AdminNotificationSettings } from "@/components/admin/admin-notification-settings"
import { AdminSecuritySettings } from "@/components/admin/admin-security-settings"
import { AdminApiSettings } from "@/components/admin/admin-api-settings"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your admin account and platform settings.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <AdminGeneralSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <AdminNotificationSettings />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <AdminSecuritySettings />
        </TabsContent>
        <TabsContent value="api" className="space-y-4">
          <AdminApiSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
