"use client"

import type React from "react"

import { useState } from "react"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { usePreventDefault } from "@/lib/utils/event-handlers"

export function SellerProfileSettings() {
  const [isUpdating, setIsUpdating] = useState(false)

  // Use optimized event handler with usePreventDefault
  const handleUpdateProfile = usePreventDefault(async (e: React.FormEvent) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }, []) // Empty dependency array since this doesn't depend on any props or state

  return (
    <form onSubmit={handleUpdateProfile}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
