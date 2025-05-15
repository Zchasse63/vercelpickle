"use client"

import { useState } from "react"
import { X, Bell, CheckCircle, AlertCircle, Info, Package, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"

// Sample notification data
const notifications = [
  {
    id: "1",
    title: "New order received",
    description: "Order #12345 has been placed by John Doe",
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: "order",
    icon: ShoppingCart,
  },
  {
    id: "2",
    title: "Low inventory alert",
    description: "Organic Carrots (5lb) is running low on stock",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: "inventory",
    icon: Package,
  },
  {
    id: "3",
    title: "New seller registration",
    description: "Green Farms has registered as a new seller",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: "user",
    icon: User,
  },
]

export function AdminNotifications({ id = "main" }: { id?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsList, setNotificationsList] = useState(notifications)

  const unreadCount = notificationsList.filter(n => !n.read).length

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const markAsRead = (id: string) => {
    setNotificationsList(
      notificationsList.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map(notification => ({ ...notification, read: true }))
    )
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-500"
      case "inventory":
        return "text-amber-500"
      case "user":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={toggleNotifications}
        data-testid={`notifications-button-${id}`}
      >
        <Bell className="h-4 w-4" />
        <span
          className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full ${unreadCount > 0 ? 'bg-red-500' : 'bg-transparent'} text-[10px] text-white`}
          data-testid={`notifications-badge-${id}`}
        >
          {unreadCount > 0 ? unreadCount : ''}
        </span>
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 top-10 z-50 w-80 rounded-md border bg-white shadow-lg"
          data-testid={`notifications-panel-${id}`}
        >
          <div className="flex items-center justify-between p-4">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
                data-testid={`close-notifications-${id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[300px]">
            {notificationsList.length > 0 ? (
              <div className="flex flex-col">
                {notificationsList.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 ${notification.read ? 'opacity-60' : ''}`}
                    data-testid={`notification-item-${id}-${notification.id}`}
                  >
                    <div className={`mt-0.5 ${getIconColor(notification.type)}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">{notification.description}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDistanceToNow(notification.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Info className="h-8 w-8 text-gray-300" />
                <p className="mt-2 text-center text-sm text-gray-500">No notifications</p>
              </div>
            )}
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <Button variant="outline" className="w-full text-xs" size="sm">
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
