"use client"

import type React from "react"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SellerInventoryAlertProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SellerInventoryAlert({ className, ...props }: SellerInventoryAlertProps) {
  // This would typically come from your data fetching logic
  const lowStockItems = [
    {
      id: 1,
      name: "Organic Spinach (1lb)",
      image: "/fresh-spinach.png",
      stock: 8,
      threshold: 20,
      percentage: 40,
    },
    {
      id: 2,
      name: "Artisan Bread Loaf",
      image: "/assorted-breads.png",
      stock: 5,
      threshold: 25,
      percentage: 20,
    },
    {
      id: 3,
      name: "Fresh Milk (1 Gallon)",
      image: "/glass-of-milk.png",
      stock: 12,
      threshold: 50,
      percentage: 24,
    },
  ]

  return (
    <Card className={className} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Low Stock Alert</CardTitle>
          <CardDescription>Products that need restocking soon</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-md">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium leading-none">{item.name}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.stock}/{item.threshold}
                    </p>
                  </div>
                  <Progress value={item.percentage} className="mt-2 h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
