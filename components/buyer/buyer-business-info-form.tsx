"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

// Import from our Data Access Layer
import { useCurrentUser, useUserProfile, useUpdateUserProfile } from "@/lib/data/exports"

// Import from our Form State Management system
import {
  useZodForm,
  Form,
  FormInput,
  FormTextarea,
} from "@/lib/forms/exports"

// Define business info schema for validation
const businessInfoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  companyDescription: z.string().optional(),
})

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>

interface BuyerBusinessInfoFormProps {
  onSuccess?: () => void
  testId?: string
}

export function BuyerBusinessInfoForm({ onSuccess, testId }: BuyerBusinessInfoFormProps) {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser()
  
  // Fetch the user profile using our data access layer
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId)
  
  // Get the update profile mutation from our data access layer
  const { updateProfile, isLoading: isUpdating } = useUpdateUserProfile()
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  // Create form with Zod validation
  const form = useZodForm(businessInfoSchema, {
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      companyDescription: "",
    },
    onSubmit: async (data) => {
      if (!userId) return
      
      setFormStatus('submitting')
      
      try {
        // Use our data access layer to update the profile
        await updateProfile(userId, {
          businessName: data.companyName,
          location: data.companyWebsite, // Using location field for website
          description: data.companyDescription,
        })
        
        // Success handling
        setFormStatus('success')
        
        // Call onSuccess callback if provided
        onSuccess?.()
      } catch (error) {
        // Error handling
        setFormStatus('error')
      }
    }
  })
  
  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      // Reset form with profile data
      form.reset({
        companyName: profile.businessName || '',
        companyWebsite: profile.location || '', // Using location field for website
        companyDescription: profile.description || '',
      })
    }
  }, [profile, form])
  
  // Show loading state while profile is loading
  if (isLoadingProfile) {
    return (
      <div className="animate-pulse space-y-4" data-testid={`${testId}-loading`}>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    )
  }
  
  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={formStatus}
      successMessage="Business information updated successfully!"
      errorMessage="Failed to update business information. Please try again."
      testId={testId}
    >
      <div className="space-y-4">
        <FormInput
          name="companyName"
          label="Company Name"
          required
          disabled={formStatus === 'submitting'}
          testId={`${testId}-company-name`}
        />
        
        <FormInput
          name="companyWebsite"
          label="Company Website"
          disabled={formStatus === 'submitting'}
          testId={`${testId}-company-website`}
        />
        
        <FormTextarea
          name="companyDescription"
          label="Company Description"
          disabled={formStatus === 'submitting'}
          rows={4}
          testId={`${testId}-company-description`}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
          disabled={formStatus === 'submitting'}
          data-testid={`${testId}-submit`}
        >
          {formStatus === 'submitting' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Form>
  )
}
