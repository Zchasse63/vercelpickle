"use client"

import type React from "react"

import { useState } from "react"
import { Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export function SellerStoreSettings() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  return (
    <form onSubmit={handleUpdateStore}>
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Update your store details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Store className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Logo
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="Farm Fresh Foods" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              rows={4}
              defaultValue="We provide the freshest organic produce directly from our farm to your business. Specializing in seasonal vegetables, fruits, and dairy products."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input id="storeEmail" type="email" defaultValue="contact@farmfreshfoods.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input id="storePhone" type="tel" defaultValue="(555) 987-6543" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Address</Label>
            <Input id="storeAddress" defaultValue="123 Farm Road" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="storeCity">City</Label>
              <Input id="storeCity" defaultValue="Farmville" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeState">State</Label>
              <Input id="storeState" defaultValue="CA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeZip">ZIP Code</Label>
              <Input id="storeZip" defaultValue="90210" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Store"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
