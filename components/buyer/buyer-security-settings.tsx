"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// Import from our Form State Management system
import {
  useZodForm,
  Form,
  FormInput,
  FormSection,
} from "@/lib/forms/exports"

// Import from our Profile components
import { ProfileSection } from "@/components/profile"

// Define password schema for validation
const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export function BuyerSecuritySettings({ testId }: { testId?: string }) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Create form with Zod validation
  const form = useZodForm(passwordSchema, {
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (data) => {
      setFormStatus('submitting')

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Success handling
        setFormStatus('success')

        // Reset form
        form.reset()
      } catch (error) {
        // Error handling
        setFormStatus('error')
      }
    }
  })

  return (
    <div className="space-y-6" data-testid={testId}>
      <ProfileSection title="Change Password" description="Update your password to keep your account secure.">
        <Form
          form={form}
          onSubmit={form.handleSubmit}
          status={formStatus}
          successMessage="Password updated successfully!"
          errorMessage="Failed to update password. Please try again."
          testId={`${testId}-password-form`}
        >
          <div className="space-y-4">
            <FormInput
              name="currentPassword"
              label="Current Password"
              type="password"
              required
              disabled={formStatus === 'submitting'}
              testId={`${testId}-current-password`}
            />

            <FormInput
              name="newPassword"
              label="New Password"
              type="password"
              required
              disabled={formStatus === 'submitting'}
              testId={`${testId}-new-password`}
            />

            <FormInput
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              required
              disabled={formStatus === 'submitting'}
              testId={`${testId}-confirm-password`}
            />
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              disabled={formStatus === 'submitting'}
              data-testid={`${testId}-update-password`}
            >
              {formStatus === 'submitting' ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </Form>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-medium">Enable Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">Receive a code via SMS when signing in.</p>
          </div>
          <Switch id="two-factor" data-testid={`${testId}-two-factor`} />
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Login Sessions" description="Manage your active sessions.">
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-500">San Francisco, CA, USA • Chrome on macOS</p>
                <p className="text-sm text-gray-500">Started 2 hours ago</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-500">Active</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            data-testid={`${testId}-sign-out-all`}
          >
            Sign Out of All Sessions
          </Button>
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Account Deletion" description="Permanently delete your account and all associated data.">
        <p className="text-sm text-gray-500 mb-4">
          This action cannot be undone. All your data will be permanently removed.
        </p>
        <Button
          variant="destructive"
          data-testid={`${testId}-delete-account`}
        >
          Delete Account
        </Button>
      </ProfileSection>
    </div>
  )
}
