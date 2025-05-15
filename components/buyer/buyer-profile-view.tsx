"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Import from our Data Access Layer
import { useCurrentUser, useUserProfile } from "@/lib/data/exports"

// Import from our Profile components
import { 
  ProfileAvatar, 
  ProfileSection, 
  ProfileField, 
  ProfileLinkField 
} from "@/components/profile"

interface BuyerProfileViewProps {
  onEdit?: () => void
  testId?: string
}

export function BuyerProfileView({ onEdit, testId }: BuyerProfileViewProps) {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser()
  
  // Fetch the user profile using our data access layer
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile(userId)
  
  // Show loading state while profile is loading
  if (isLoadingProfile) {
    return (
      <div className="animate-pulse space-y-4" data-testid={`${testId}-loading`}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
  
  // Get initials for avatar
  const getInitials = () => {
    if (!profile?.name) return ""
    return profile.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
  }
  
  // Split name into first and last name
  const nameParts = profile?.name?.split(" ") || ["", ""]
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""
  
  return (
    <div className="space-y-6" data-testid={testId}>
      <div className="flex flex-col gap-6 md:flex-row">
        <ProfileAvatar
          initials={getInitials()}
          testId={`${testId}-avatar`}
        />
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ProfileField
              label="First Name"
              value={firstName}
              testId={`${testId}-first-name`}
            />
            <ProfileField
              label="Last Name"
              value={lastName}
              testId={`${testId}-last-name`}
            />
          </div>
          
          <ProfileField
            label="Email"
            value={profile?.email}
            testId={`${testId}-email`}
          />
          
          <ProfileField
            label="Phone"
            value={profile?.phone}
            testId={`${testId}-phone`}
          />
        </div>
      </div>

      <Separator />

      <ProfileSection title="Company Information">
        <ProfileField
          label="Company Name"
          value={profile?.businessName}
          testId={`${testId}-company-name`}
        />
        
        {profile?.location && (
          <ProfileLinkField
            label="Company Website"
            value={profile.location}
            href={profile.location}
            testId={`${testId}-company-website`}
          />
        )}
        
        <ProfileField
          label="Company Description"
          value={profile?.description}
          testId={`${testId}-company-description`}
        />
      </ProfileSection>

      {onEdit && (
        <div className="flex justify-end">
          <Button 
            onClick={onEdit} 
            data-testid={`${testId}-edit-button`}
          >
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  )
}
