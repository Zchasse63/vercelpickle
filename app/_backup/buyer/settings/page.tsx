import { BuyerProfile } from "@/components/buyer/buyer-profile"
import { BuyerNotificationSettings } from "@/components/buyer/buyer-notification-settings"
import { BuyerSecuritySettings } from "@/components/buyer/buyer-security-settings"
import { BuyerPreferenceSettings } from "@/components/buyer/buyer-preference-settings"

// Import from our Profile components
import { ProfileTabs, ProfileTab } from "@/components/profile"

export default function SettingsPage() {
  // Define tabs for the settings page
  const tabs: ProfileTab[] = [
    {
      id: "profile",
      label: "Profile",
      content: <BuyerProfile testId="profile-form" />,
      testId: "profile-tab"
    },
    {
      id: "notifications",
      label: "Notifications",
      content: <BuyerNotificationSettings testId="notifications-form" />,
      testId: "notifications-tab"
    },
    {
      id: "security",
      label: "Security",
      content: <BuyerSecuritySettings testId="security-form" />,
      testId: "security-tab"
    },
    {
      id: "preferences",
      label: "Preferences",
      content: <BuyerPreferenceSettings testId="preferences-form" />,
      testId: "preferences-tab"
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <ProfileTabs
        tabs={tabs}
        defaultTab="profile"
        testId="settings-tabs"
      />
    </div>
  )
}
