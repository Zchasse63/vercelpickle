"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerProductCard } from "@/components/marketplace/server-product-card"

interface BuyerSavedProductsProps {
  limit?: number
}

export default function BuyerSavedProducts({ limit = 4 }: BuyerSavedProductsProps) {
  // Mock data - in a real app, this would come from the database
  const savedProducts = [
    {
      id: "product1",
      name: "Organic Apples",
      price: 24.99,
      image: "/placeholder-product.jpg",
      unit: "case",
      specifications: {
        dietary: {
          organic: true
        }
      }
    },
    {
      id: "product2",
      name: "Artisan Sourdough Bread",
      price: 5.99,
      image: "/placeholder-product.jpg",
      unit: "loaf",
      specifications: {}
    },
    {
      id: "product3",
      name: "Premium Olive Oil",
      price: 18.50,
      image: "/placeholder-product.jpg",
      unit: "bottle",
      specifications: {
        ecofriendly: true
      }
    },
    {
      id: "product4",
      name: "Organic Honey",
      price: 12.99,
      image: "/placeholder-product.jpg",
      unit: "jar",
      specifications: {
        dietary: {
          organic: true
        }
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedProducts.slice(0, limit).map((product) => (
            <ServerProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              unit={product.unit}
              specifications={product.specifications}
              className="h-full"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
