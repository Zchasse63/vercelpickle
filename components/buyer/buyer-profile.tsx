"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import our profile components
import { BuyerProfileView } from "./buyer-profile-view"
import { BuyerPersonalInfoForm } from "./buyer-personal-info-form"
import { BuyerBusinessInfoForm } from "./buyer-business-info-form"

interface BuyerProfileProps {
  testId?: string
}

export function BuyerProfile({ testId }: BuyerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal")
  
  const handleEditClick = () => {
    setIsEditing(true)
  }
  
  const handleSaveSuccess = () => {
    setIsEditing(false)
  }
  
  return (
    <div className="space-y-6" data-testid={testId}>
      {!isEditing ? (
        // View mode
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View your personal and business information.</CardDescription>
          </CardHeader>
          <CardContent>
            <BuyerProfileView 
              onEdit={handleEditClick} 
              testId={`${testId}-view`}
            />
          </CardContent>
        </Card>
      ) : (
        // Edit mode
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal and business information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={(value) => setActiveTab(value as "personal" | "business")}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="personal"
                  data-testid={`${testId}-personal-tab`}
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger 
                  value="business"
                  data-testid={`${testId}-business-tab`}
                >
                  Business Information
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <BuyerPersonalInfoForm 
                  onSuccess={handleSaveSuccess}
                  testId={`${testId}-personal-form`}
                />
              </TabsContent>
              
              <TabsContent value="business">
                <BuyerBusinessInfoForm 
                  onSuccess={handleSaveSuccess}
                  testId={`${testId}-business-form`}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
