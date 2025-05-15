"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function SellerNotificationSettings() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  return (
    <form onSubmit={handleUpdateNotifications}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Email Notifications</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newOrder">New Order</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a new order is placed</p>
                </div>
                <Switch id="newOrder" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderStatus">Order Status Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when order status changes</p>
                </div>
                <Switch id="orderStatus" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowInventory">Low Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when product inventory is low</p>
                </div>
                <Switch id="lowInventory" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReceived">Payment Received</Label>
                  <p className="text-sm text-muted-foreground">Receive emails when payments are processed</p>
                </div>
                <Switch id="paymentReceived" defaultChecked />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base">SMS Notifications</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNewOrder">New Order</Label>
                  <p className="text-sm text-muted-foreground">Receive a text message when a new order is placed</p>
                </div>
                <Switch id="smsNewOrder" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsLowInventory">Low Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get text alerts when product inventory is low</p>
                </div>
                <Switch id="smsLowInventory" />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <Label className="text-base">In-App Notifications</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="appNewOrder">New Order</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for new orders</p>
                </div>
                <Switch id="appNewOrder" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="appMessages">Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for new customer messages</p>
                </div>
                <Switch id="appMessages" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="appUpdates">Platform Updates</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for platform updates and news</p>
                </div>
                <Switch id="appUpdates" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Notifications"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
