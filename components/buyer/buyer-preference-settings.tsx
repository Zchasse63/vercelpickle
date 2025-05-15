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
  FormRadioGroup,
} from "@/lib/forms/exports"

// Import from our Profile components
import { ProfileSection } from "@/components/profile"

// Define preferences schema
const preferencesSchema = z.object({
  // Display preferences
  theme: z.enum(["light", "dark", "system"]).default("system"),
  density: z.enum(["compact", "comfortable", "spacious"]).default("comfortable"),

  // Shopping preferences
  saveCart: z.boolean().default(true),
  quickCheckout: z.boolean().default(false),
  defaultPaymentMethod: z.enum(["card", "bank", "invoice"]).default("card"),

  // Product preferences
  defaultCategory: z.enum(["all", "produce", "dairy", "bakery", "meat"]).default("all"),
  showOutOfStock: z.boolean().default(false),
})

type PreferencesFormData = z.infer<typeof preferencesSchema>

export function BuyerPreferenceSettings({ testId }: { testId?: string }) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Create form with Zod validation
  const form = useZodForm(preferencesSchema, {
    defaultValues: {
      theme: "system",
      density: "comfortable",
      saveCart: true,
      quickCheckout: false,
      defaultPaymentMethod: "card",
      defaultCategory: "all",
      showOutOfStock: false,
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
      successMessage="Preferences saved successfully!"
      errorMessage="Failed to save preferences. Please try again."
      testId={testId}
      className="space-y-6"
    >
      <ProfileSection title="Display Preferences" description="Customize how the application looks.">
        <div className="space-y-4">
          <FormSelect
            name="theme"
            label="Theme"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-theme`}
          />

          <FormSelect
            name="density"
            label="Display Density"
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ]}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-density`}
          />
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Shopping Preferences" description="Customize your shopping experience.">
        <div className="space-y-4">
          <FormSwitch
            name="saveCart"
            label="Save Cart Items"
            description="Save items in your cart for later."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-save-cart`}
          />

          <FormSwitch
            name="quickCheckout"
            label="Quick Checkout"
            description="Skip confirmation step during checkout."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-quick-checkout`}
          />

          <FormRadioGroup
            name="defaultPaymentMethod"
            label="Default Payment Method"
            options={[
              { value: "card", label: "Credit Card" },
              { value: "bank", label: "Bank Transfer" },
              { value: "invoice", label: "Invoice" },
            ]}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-payment-method`}
          />
        </div>
      </ProfileSection>

      <Separator />

      <ProfileSection title="Product Preferences" description="Customize how products are displayed.">
        <div className="space-y-4">
          <FormSelect
            name="defaultCategory"
            label="Default Category"
            options={[
              { value: "all", label: "All Products" },
              { value: "produce", label: "Produce" },
              { value: "dairy", label: "Dairy" },
              { value: "bakery", label: "Bakery" },
              { value: "meat", label: "Meat & Seafood" },
            ]}
            disabled={formStatus === 'submitting'}
            testId={`${testId}-default-category`}
          />

          <FormSwitch
            name="showOutOfStock"
            label="Show Out of Stock Products"
            description="Display products that are currently unavailable."
            disabled={formStatus === 'submitting'}
            testId={`${testId}-show-out-of-stock`}
          />
        </div>
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
