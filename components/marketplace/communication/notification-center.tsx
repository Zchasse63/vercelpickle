"use client"

import { useState } from "react"
import { Bell, ShoppingCart, MessageSquare, TruckIcon, AlertCircle, CheckCircle, Clock, Package, DollarSign, Calendar, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface NotificationCenterProps {
  className?: string
}

interface Notification {
  id: string
  type: "order" | "message" | "shipping" | "price" | "system"
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  priority?: "low" | "medium" | "high"
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Order Confirmed",
      description: "Your order #12345 has been confirmed and is being processed.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionUrl: "/marketplace/orders/12345",
      actionLabel: "View Order"
    },
    {
      id: "2",
      type: "shipping",
      title: "Shipment Update",
      description: "Your order #12345 has been shipped and is on its way.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: "/marketplace/orders/12345/tracking",
      actionLabel: "Track Shipment",
      priority: "medium"
    },
    {
      id: "3",
      type: "message",
      title: "New Message from Green Farms",
      description: "Sarah Johnson: I can offer a 10% discount if you order 50 units or more.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      actionUrl: "/marketplace/messages",
      actionLabel: "Reply"
    },
    {
      id: "4",
      type: "price",
      title: "Price Drop Alert",
      description: "The price of Organic Apples has dropped by 15%. Now is a good time to stock up!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionUrl: "/marketplace/products/organic-apples",
      actionLabel: "View Product"
    },
    {
      id: "5",
      type: "system",
      title: "System Maintenance",
      description: "The system will be undergoing maintenance on Sunday, May 15 from 2:00 AM to 4:00 AM EST.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true
    },
    {
      id: "6",
      type: "order",
      title: "Order Ready for Pickup",
      description: "Your order #12346 is ready for pickup at the designated location.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
      actionUrl: "/marketplace/orders/12346",
      actionLabel: "View Details"
    },
    {
      id: "7",
      type: "shipping",
      title: "Delivery Exception",
      description: "There's a delay with your order #12347 due to weather conditions.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      read: true,
      actionUrl: "/marketplace/orders/12347",
      actionLabel: "View Details",
      priority: "high"
    }
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [notificationSettings, setNotificationSettings] = useState({
    orders: true,
    messages: true,
    shipping: true,
    priceAlerts: true,
    system: false,
    email: true,
    push: true,
    sms: false
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    )
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleSettingChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5" />
      case "message":
        return <MessageSquare className="h-5 w-5" />
      case "shipping":
        return <TruckIcon className="h-5 w-5" />
      case "price":
        return <DollarSign className="h-5 w-5" />
      case "system":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: Notification["type"], priority?: Notification["priority"]) => {
    if (priority === "high") return "text-red-500 bg-red-50"
    if (priority === "medium") return "text-amber-500 bg-amber-50"
    
    switch (type) {
      case "order":
        return "text-green-500 bg-green-50"
      case "message":
        return "text-blue-500 bg-blue-50"
      case "shipping":
        return "text-purple-500 bg-purple-50"
      case "price":
        return "text-amber-500 bg-amber-50"
      case "system":
        return "text-gray-500 bg-gray-50"
      default:
        return "text-primary bg-primary/10"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2">{unreadCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="hover-scale">
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="hover-scale">
              Clear all
            </Button>
          </div>
        </div>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 hover-scale">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 hover-scale">Unread</TabsTrigger>
            <TabsTrigger value="order" className="flex-1 hover-scale">Orders</TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1 hover-scale">Shipping</TabsTrigger>
            <TabsTrigger value="message" className="flex-1 hover-scale">Messages</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="m-0">
          <ScrollArea className="h-[400px]">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-accent transition-colors",
                      !notification.read && "bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex-shrink-0 rounded-full p-2",
                        getNotificationColor(notification.type, notification.priority)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "font-medium",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        {notification.actionUrl && (
                          <div className="pt-2">
                            <Link href={notification.actionUrl}>
                              <Button size="sm" variant="outline" className="hover-scale">
                                {notification.actionLabel}
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div className="space-y-2">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! No new notifications to display.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button variant="outline" size="sm" className="hover-scale">
          Refresh
        </Button>
        <Button variant="outline" size="sm" className="hover-scale">
          Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
