"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Import from our Form State Management system
import {
  useZodForm,
  Form,
  FormSwitch,
  FormSelect,
} from "@/lib/forms/exports"

// Import from our Profile components
import { ProfileSection } from "@/components/profile"

// Define notification settings schema
const notificationSchema = z.object({
  // Email notifications
  orderUpdatesEmail: z.boolean().default(true),
  promotionsEmail: z.boolean().default(true),
  newsletterEmail: z.boolean().default(false),
  productUpdatesEmail: z.boolean().default(true),

  // In-app notifications
  orderUpdatesApp: z.boolean().default(true),
  messagesApp: z.boolean().default(true),
  promotionsApp: z.boolean().default(false),

  // Frequency
  emailFrequency: z.enum(["immediate", "daily", "weekly"]).default("immediate"),
})

type NotificationFormData = z.infer<typeof notificationSchema>

export function BuyerNotificationSettings({ testId }: { testId?: string }) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Create form with Zod validation
  const form = useZodForm(notificationSchema, {
    defaultValues: {
      orderUpdatesEmail: true,
      promotionsEmail: true,
      newsletterEmail: false,
      productUpdatesEmail: true,
      orderUpdatesApp: true,
      messagesApp: true,
      promotionsApp: false,
      emailFrequency: "immediate",
    },
    onSubmit: async (data) => {
      setFormStatus('submitting')

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Success handling
        setFormStatus('success')
      } catch (error) {
        // Error handling
        setFormStatus('error')
      }
    }
  })

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={formStatus}
      successMessage="Notification preferences saved successfully!"
      errorMessage="Failed to save notification preferences. Please try again."
      testId={testId}
      className="space-y-6"
    >
      <ProfileSection title="Email Notifications" description="Manage how you receive email notifications.">
        <div className="space-y-4">
          <FormSwitch
            name="orderUpdatesEmail"
            label="Order Updates"
            description="Receive emails about your order status changes."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-order-updates-email`}
          />

          <FormSwitch
            name="promotionsEmail"
            label="Promotions"
            description="Receive emails about promotions and discounts."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-promotions-email`}
          />

          <FormSwitch
            name="newsletterEmail"
            label="Newsletter"
            description="Receive our weekly newsletter with industry news."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-newsletter-email`}
          />

          <FormSwitch
            name="productUpdatesEmail"
            label="Product Updates"
            description="Receive emails when products you follow are updated."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-product-updates-email`}
          />
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="In-App Notifications" description="Manage how you receive in-app notifications.">
        <div className="space-y-4">
          <FormSwitch
            name="orderUpdatesApp"
            label="Order Updates"
            description="Receive notifications about your order status changes."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-order-updates-app`}
          />

          <FormSwitch
            name="messagesApp"
            label="Messages"
            description="Receive notifications when you get new messages."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-messages-app`}
          />

          <FormSwitch
            name="promotionsApp"
            label="Promotions"
            description="Receive notifications about promotions and discounts."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-promotions-app`}
          />
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Notification Frequency" description="Control how often you receive notifications.">
        <FormSelect
          name="emailFrequency"
          label="Email Frequency"
          options={[
            { value: "immediate", label: "Immediate" },
            { value: "daily", label: "Daily Digest" },
            { value: "weekly", label: "Weekly Digest" },
          ]}
          disabled={formStatus === 'submitting'}
          testId={`${testId}-email-frequency`}
        />
      </ProfileSection>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={formStatus === 'submitting'}
          data-testid={`${testId}-save-button`}
        >
          {formStatus === 'submitting' ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </Form>
  )
}
