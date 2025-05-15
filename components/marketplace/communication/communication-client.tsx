"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bell, Info } from "lucide-react"
import { DirectMessaging } from "@/components/marketplace/communication/direct-messaging"
import { NotificationCenter } from "@/components/marketplace/communication/notification-center"

export function CommunicationClient() {
  const [activeTab, setActiveTab] = useState("messages")

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-2 animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight">Communication Center</h1>
        <p className="text-muted-foreground">
          Communicate with sellers, manage notifications, and stay updated on your orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 animate-fade-up">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="hover-scale">
            <MessageSquare className="mr-2 h-4 w-4" />
            Direct Messages
          </TabsTrigger>
          <TabsTrigger value="notifications" className="hover-scale">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="mt-6 animate-fade-up">
          <DirectMessaging />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Messaging Tips</CardTitle>
              <CardDescription>
                Get the most out of your communication with sellers
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-medium">Be Specific</h3>
                <p className="text-sm text-muted-foreground">
                  Clearly state your requirements, including quantity, quality standards, and delivery preferences.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Ask for Samples</h3>
                <p className="text-sm text-muted-foreground">
                  Don't hesitate to request product samples before placing large orders.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Discuss Terms</h3>
                <p className="text-sm text-muted-foreground">
                  Use messaging to negotiate prices, payment terms, and delivery schedules.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 animate-fade-up">
          <NotificationCenter />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-medium">Notification Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="orders" className="text-sm">Order Updates</label>
                    <input
                      type="checkbox"
                      id="orders"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="messages" className="text-sm">New Messages</label>
                    <input
                      type="checkbox"
                      id="messages"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="shipping" className="text-sm">Shipping Updates</label>
                    <input
                      type="checkbox"
                      id="shipping"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="price-alerts" className="text-sm">Price Alerts</label>
                    <input
                      type="checkbox"
                      id="price-alerts"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="system" className="text-sm">System Announcements</label>
                    <input
                      type="checkbox"
                      id="system"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Delivery Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="in-app" className="text-sm">In-App Notifications</label>
                    <input
                      type="checkbox"
                      id="in-app"
                      defaultChecked
                      disabled
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="text-sm">Email Notifications</label>
                    <input
                      type="checkbox"
                      id="email"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="push" className="text-sm">Push Notifications</label>
                    <input
                      type="checkbox"
                      id="push"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="sms" className="text-sm">SMS Notifications</label>
                    <input
                      type="checkbox"
                      id="sms"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
