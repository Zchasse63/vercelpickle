"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BuyerRecentActivity() {
  // Mock data - in a real app, this would come from the database
  const activities = [
    {
      id: "activity1",
      type: "order",
      description: "You placed an order for 2 cases of Organic Apples",
      timestamp: "2 hours ago",
      icon: "🛒"
    },
    {
      id: "activity2",
      type: "review",
      description: "You left a review for Artisan Sourdough Bread",
      timestamp: "1 day ago",
      icon: "⭐"
    },
    {
      id: "activity3",
      type: "save",
      description: "You saved Premium Olive Oil to your favorites",
      timestamp: "2 days ago",
      icon: "❤️"
    },
    {
      id: "activity4",
      type: "login",
      description: "You logged in from a new device",
      timestamp: "3 days ago",
      icon: "🔐"
    },
    {
      id: "activity5",
      type: "profile",
      description: "You updated your shipping address",
      timestamp: "1 week ago",
      icon: "📝"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{activity.icon}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
