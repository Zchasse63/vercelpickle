"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { 
  ShoppingCart, 
  User, 
  Package, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Sample activity data
const activityData = [
  {
    id: "act-1",
    type: "order",
    title: "New order placed",
    description: "Order #12345 for $45.97 has been placed",
    user: {
      name: "John Doe",
      avatar: "/images/avatars/01.png",
      initials: "JD"
    },
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: "success",
    icon: ShoppingCart
  },
  {
    id: "act-2",
    type: "user",
    title: "New seller registered",
    description: "Green Farms has registered as a new seller",
    user: {
      name: "Green Farms",
      avatar: "/images/avatars/02.png",
      initials: "GF"
    },
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "success",
    icon: User
  },
  {
    id: "act-3",
    type: "product",
    title: "Product inventory updated",
    description: "Organic Carrots (5lb) inventory updated to 150 units",
    user: {
      name: "Admin User",
      avatar: "/images/avatars/admin.png",
      initials: "AU"
    },
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "info",
    icon: Package
  },
  {
    id: "act-4",
    type: "payment",
    title: "Payment processed",
    description: "Payment of $32.50 processed for order #12346",
    user: {
      name: "Payment System",
      avatar: "",
      initials: "PS"
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "success",
    icon: CreditCard
  },
  {
    id: "act-5",
    type: "order",
    title: "Order status updated",
    description: "Order #12344 status changed to Shipped",
    user: {
      name: "Admin User",
      avatar: "/images/avatars/admin.png",
      initials: "AU"
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: "info",
    icon: ShoppingCart
  },
  {
    id: "act-6",
    type: "system",
    title: "System alert",
    description: "Low inventory alert for 3 products",
    user: {
      name: "System",
      avatar: "",
      initials: "SY"
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: "warning",
    icon: AlertCircle
  },
  {
    id: "act-7",
    type: "order",
    title: "Order fulfilled",
    description: "Order #12343 has been fulfilled and shipped",
    user: {
      name: "Fulfillment Team",
      avatar: "",
      initials: "FT"
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    status: "success",
    icon: CheckCircle
  },
  {
    id: "act-8",
    type: "system",
    title: "Scheduled maintenance",
    description: "System maintenance scheduled for tonight at 2 AM",
    user: {
      name: "System",
      avatar: "",
      initials: "SY"
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: "info",
    icon: Clock
  }
]

export function AdminRecentActivity() {
  const [filter, setFilter] = useState("all")
  const [expanded, setExpanded] = useState(false)
  
  // Filter activities based on selected filter
  const filteredActivities = activityData.filter(activity => {
    if (filter === "all") return true
    return activity.type === filter
  })
  
  // Limit displayed activities unless expanded
  const displayedActivities = expanded 
    ? filteredActivities 
    : filteredActivities.slice(0, 5)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
      default:
        return "bg-blue-100 text-blue-800"
    }
  }
  
  return (
    <div className="space-y-4" data-testid="recent-activity">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="order">Orders</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ScrollArea className={expanded ? "h-[400px]" : "h-auto"}>
        <div className="space-y-4">
          {displayedActivities.length > 0 ? (
            displayedActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 rounded-lg border p-4 hover:bg-gray-50"
                data-testid="activity-item"
              >
                <div className={`rounded-full p-2 ${getStatusColor(activity.status)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.time, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4 text-muted-foreground">
              No activities found
            </div>
          )}
        </div>
      </ScrollArea>
      
      {filteredActivities.length > 5 && (
        <Button 
          variant="ghost" 
          className="w-full text-xs" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show More ({filteredActivities.length - 5} more)
            </>
          )}
        </Button>
      )}
      
      <div className="flex items-center justify-center">
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Activity
        </Button>
      </div>
    </div>
  )
}
