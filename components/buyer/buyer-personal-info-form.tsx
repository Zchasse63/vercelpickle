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
  FormPhoneInput,
  FormRow,
} from "@/lib/forms/exports"

// Import from our Profile components
import { ProfileAvatar } from "@/components/profile"

// Define personal info schema for validation
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

interface BuyerPersonalInfoFormProps {
  onSuccess?: () => void
  testId?: string
}

export function BuyerPersonalInfoForm({ onSuccess, testId }: BuyerPersonalInfoFormProps) {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser()
  
  // Fetch the user profile using our data access layer
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId)
  
  // Get the update profile mutation from our data access layer
  const { updateProfile, isLoading: isUpdating } = useUpdateUserProfile()
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  // Create form with Zod validation
  const form = useZodForm(personalInfoSchema, {
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    onSubmit: async (data) => {
      if (!userId) return
      
      setFormStatus('submitting')
      
      try {
        // Use our data access layer to update the profile
        await updateProfile(userId, {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
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
      // Split the name into first and last name (assuming the name is in "First Last" format)
      const nameParts = profile.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      // Reset form with profile data
      form.reset({
        firstName,
        lastName,
        email: profile.email || '',
        phone: profile.phone || '',
      })
    }
  }, [profile, form])
  
  // Show loading state while profile is loading
  if (isLoadingProfile) {
    return (
      <div className="animate-pulse space-y-4" data-testid={`${testId}-loading`}>
        <div className="h-24 bg-gray-200 rounded-full w-24 mx-auto"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }
  
  // Get initials for avatar
  const getInitials = () => {
    const { firstName, lastName } = form.getValues()
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`
  }
  
  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit}
      status={formStatus}
      successMessage="Personal information updated successfully!"
      errorMessage="Failed to update personal information. Please try again."
      testId={testId}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileAvatar
          initials={getInitials()}
          onChangeAvatar={() => {
            // Handle avatar change
            console.log("Change avatar")
          }}
          testId={`${testId}-avatar`}
        />
        
        <div className="flex-1 space-y-4">
          <FormRow>
            <FormInput
              name="firstName"
              label="First Name"
              required
              disabled={formStatus === 'submitting'}
              testId={`${testId}-first-name`}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              required
              disabled={formStatus === 'submitting'}
              testId={`${testId}-last-name`}
            />
          </FormRow>
          
          <FormInput
            name="email"
            label="Email"
            type="email"
            required
            disabled={formStatus === 'submitting'}
            testId={`${testId}-email`}
          />
          
          <FormPhoneInput
            name="phone"
            label="Phone"
            required
            disabled={formStatus === 'submitting'}
            testId={`${testId}-phone`}
          />
        </div>
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
