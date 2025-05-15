"use client"

import type React from "react"

import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SellerTopProductsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SellerTopProducts({ className, ...props }: SellerTopProductsProps) {
  // This would typically come from your data fetching logic
  const products = [
    {
      id: 1,
      name: "Organic Carrots (5lb)",
      image: "/bunch-of-carrots.png",
      sales: 245,
      revenue: "$1,225.00",
    },
    {
      id: 2,
      name: "Fresh Milk (1 Gallon)",
      image: "/glass-of-milk.png",
      sales: 198,
      revenue: "$990.00",
    },
    {
      id: 3,
      name: "Artisan Bread Loaf",
      image: "/assorted-breads.png",
      sales: 156,
      revenue: "$780.00",
    },
    {
      id: 4,
      name: "Organic Spinach (1lb)",
      image: "/fresh-spinach.png",
      sales: 132,
      revenue: "$660.00",
    },
    {
      id: 5,
      name: "Russet Potatoes (10lb)",
      image: "/pile-of-potatoes.png",
      sales: 124,
      revenue: "$620.00",
    },
  ]

  return (
    <Card className={className} {...props} data-testid="top-products">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Your best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4" data-testid="product-performance-item">
              <div className="relative h-12 w-12 overflow-hidden rounded-md">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
              </div>
              <div className="font-medium">{product.revenue}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
