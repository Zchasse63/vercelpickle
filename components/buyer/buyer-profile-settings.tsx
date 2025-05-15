"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { z } from "zod"

// Import from our Data Access Layer
import { useCurrentUser, useUserProfile, useUpdateUserProfile } from "@/lib/data/exports"

// Import from our Form State Management system
import {
  useZodForm,
  Form,
  FormInput,
  FormTextarea,
  FormSection,
  FormRow,
  FormPhoneInput,
  ProfileFormData
} from "@/lib/forms/exports"

// Define profile schema for validation
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  companyDescription: z.string().optional()
});

export function BuyerProfileSettings() {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser();

  // Fetch the user profile using our data access layer
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId);

  // Get the update profile mutation from our data access layer
  const { updateProfile, isLoading: isUpdating } = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Create form with Zod validation
  const form = useZodForm(profileSchema, {
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      companyDescription: ""
    },
    onSubmit: async (data) => {
      if (!userId) return;

      setFormStatus('submitting');

      try {
        // Use our data access layer to update the profile
        await updateProfile(userId, {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          businessName: data.companyName,
          location: data.companyWebsite, // Using location field for website
          description: data.companyDescription
        });

        // Success handling
        setFormStatus('success');

        // Exit edit mode
        setIsEditing(false);
      } catch (error) {
        // Error handling
        setFormStatus('error');
      }
    }
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      // Split the name into first and last name (assuming the name is in "First Last" format)
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Reset form with profile data
      form.reset({
        firstName,
        lastName,
        email: profile.email || '',
        phone: profile.phone || '',
        companyName: profile.businessName || '',
        companyWebsite: profile.location || '', // Using location field for website
        companyDescription: profile.description || ''
      });
    }
  }, [profile, form]);

  // Show loading state while profile is loading
  if (isLoadingProfile) {
    return (
      <div className="space-y-6 p-4" data-testid="profile-form-loading">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="profile-form">
      {!isEditing ? (
        // View mode
        <>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@user" />
                <AvatarFallback>
                  {form.getValues().firstName?.[0] || ''}{form.getValues().lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">First Name</p>
                  <p className="text-base" data-testid="profile-name-display">{form.getValues().firstName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Last Name</p>
                  <p className="text-base">{form.getValues().lastName}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base" data-testid="profile-email-display">{form.getValues().email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base" data-testid="profile-phone-display">{form.getValues().phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Company Name</p>
              <p className="text-base" data-testid="profile-company-display">{form.getValues().companyName}</p>
            </div>
            {form.getValues().companyWebsite && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Company Website</p>
                <p className="text-base">
                  <a href={form.getValues().companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {form.getValues().companyWebsite}
                  </a>
                </p>
              </div>
            )}
            {form.getValues().companyDescription && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Company Description</p>
                <p className="text-base">{form.getValues().companyDescription}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setIsEditing(true)}
              data-testid="edit-profile-button"
            >
              Edit Profile
            </Button>
          </div>
        </>
      ) : (
        // Edit mode
        <Form
          form={form}
          onSubmit={form.handleSubmit}
          status={formStatus}
          successMessage="Profile updated successfully!"
          errorMessage="Failed to update profile. Please try again."
        >
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@user" />
                <AvatarFallback>
                  {form.getValues().firstName?.[0] || ''}{form.getValues().lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" type="button">
                Change Avatar
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <FormRow>
                <FormInput
                  name="firstName"
                  label="First Name"
                  required
                  disabled={formStatus === 'submitting'}
                  testId="profile-name-input"
                />
                <FormInput
                  name="lastName"
                  label="Last Name"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </FormRow>
              <FormInput
                name="email"
                label="Email"
                type="email"
                required
                disabled={formStatus === 'submitting'}
                testId="profile-email-input"
              />
              <FormPhoneInput
                name="phone"
                label="Phone"
                required
                disabled={formStatus === 'submitting'}
                testId="profile-phone-input"
              />
            </div>
          </div>

          <Separator className="my-6" />

          <FormSection title="Company Information">
            <FormInput
              name="companyName"
              label="Company Name"
              required
              disabled={formStatus === 'submitting'}
              testId="profile-company-input"
            />
            <FormInput
              name="companyWebsite"
              label="Company Website"
              disabled={formStatus === 'submitting'}
            />
            <FormTextarea
              name="companyDescription"
              label="Company Description"
              disabled={formStatus === 'submitting'}
              rows={4}
            />
          </FormSection>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={formStatus === 'submitting'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="save-profile-button"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      )}
    </div>
  )
}
