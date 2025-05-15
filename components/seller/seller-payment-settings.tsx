"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export function SellerPaymentSettings() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  return (
    <form onSubmit={handleUpdatePayment}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Manage your payment methods and payout preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Payment Methods</Label>
            <RadioGroup defaultValue="bank" className="space-y-4">
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                  <div className="font-medium">Bank Account (ACH)</div>
                  <div className="text-sm text-muted-foreground">**** **** **** 1234</div>
                </Label>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="font-medium">Credit Card</div>
                  <div className="text-sm text-muted-foreground">Visa ending in 5678</div>
                </Label>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-dashed p-4">
                <div className="flex-1">
                  <Button variant="ghost" className="h-auto p-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <div className="space-y-4">
            <Label>Payout Schedule</Label>
            <RadioGroup defaultValue="weekly" className="space-y-4">
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                  <div className="font-medium">Weekly</div>
                  <div className="text-sm text-muted-foreground">Payments are processed every Monday</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly" className="flex-1 cursor-pointer">
                  <div className="font-medium">Bi-weekly</div>
                  <div className="text-sm text-muted-foreground">Payments are processed every other Monday</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                  <div className="font-medium">Monthly</div>
                  <div className="text-sm text-muted-foreground">Payments are processed on the 1st of each month</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID (EIN/SSN)</Label>
            <Input
              id="taxId"
              defaultValue="XX-XXXXXXX"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">Required for tax reporting purposes</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Payment Settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
