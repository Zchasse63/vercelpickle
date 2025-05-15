"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Check, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeLink } from "@/components/ui/safe-link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Product type
interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
  seller: {
    name: string
    rating: number
  }
  rating: number
  reviews: number
  stock: number
  organic: boolean
  nonGMO: boolean
  locallySourced: boolean
  freeShipping: boolean
  bulkDiscount: boolean
  description: string
  // Enhanced specifications
  specifications?: {
    dietary?: {
      organic?: boolean
      glutenFree?: boolean
      lactoseFree?: boolean
      vegan?: boolean
      vegetarian?: boolean
      nonGMO?: boolean
      [key: string]: boolean | undefined
    }
    environmental?: {
      ecofriendly?: boolean
      compostable?: boolean
      biodegradable?: boolean
      recyclable?: boolean
      [key: string]: boolean | undefined
    }
    [key: string]: any
  }
  origin?: {
    country?: string
    region?: string
    [key: string]: string | undefined
  }
  certifications?: string[]
}

interface MarketplaceProductComparisonProps {
  products: Product[]
  onRemoveProduct: (productId: string) => void
  onAddToCart: (productId: string) => void
  className?: string
}

// Helper function to get nested property value
function getNestedProperty(obj: any, path: string): any {
  const keys = path.split('.');
  return keys.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
}

export function MarketplaceProductComparison({
  products,
  onRemoveProduct,
  onAddToCart,
  className,
}: MarketplaceProductComparisonProps) {
  if (products.length === 0) {
    return (
      <Card className={cn("w-full border-dill-green/20 shadow-md", className)}>
        <CardHeader className="bg-gradient-to-r from-dill-green/5 to-dill-green/10 border-b border-dill-green/15">
          <CardTitle className="text-dill-green flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Product Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="bg-dill-green/5 p-6 rounded-lg border border-dill-green/20 inline-block mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-dill-green/60">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <p className="text-dill-green font-medium">No products selected for comparison</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Add products to compare by clicking the "Compare" button on product cards.
              You can compare up to 4 products side by side.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Features to compare
  const features = [
    { id: "price", label: "Price" },
    { id: "seller", label: "Seller" },
    { id: "rating", label: "Rating" },
    { id: "stock", label: "Availability" },
    { id: "origin", label: "Origin" },

    // Dietary specifications
    { id: "organic", label: "Organic" },
    { id: "glutenFree", label: "Gluten-Free", path: "specifications.dietary.glutenFree" },
    { id: "vegan", label: "Vegan", path: "specifications.dietary.vegan" },
    { id: "vegetarian", label: "Vegetarian", path: "specifications.dietary.vegetarian" },
    { id: "nonGMO", label: "Non-GMO" },

    // Environmental specifications
    { id: "ecofriendly", label: "Eco-Friendly", path: "specifications.environmental.ecofriendly" },
    { id: "compostable", label: "Compostable", path: "specifications.environmental.compostable" },
    { id: "biodegradable", label: "Biodegradable", path: "specifications.environmental.biodegradable" },
    { id: "recyclable", label: "Recyclable", path: "specifications.environmental.recyclable" },

    // Legacy features
    { id: "locallySourced", label: "Locally Sourced" },
    { id: "freeShipping", label: "Free Shipping" },
    { id: "bulkDiscount", label: "Bulk Discount" },
  ]

  return (
    <Card className={cn("w-full overflow-auto border-dill-green/20 shadow-md", className)}>
      <CardHeader className="bg-gradient-to-r from-dill-green/5 to-dill-green/10 border-b border-dill-green/15">
        <CardTitle className="text-dill-green flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Product Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="min-w-[600px]">
          {/* Product headers */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))]">
            <div className="p-4 font-medium bg-dill-green/5 text-dill-green">Features</div>
            {products.map((product) => (
              <div key={product.id} className="p-4 border-l relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                  onClick={() => onRemoveProduct(product.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 mb-2 border border-dill-green/10 rounded-md overflow-hidden bg-white shadow-sm">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <SafeLink href={`/marketplace/products/${product.id}`} className="font-medium hover:underline hover:text-dill-green transition-colors">
                    {product.name}
                  </SafeLink>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Feature rows */}
          {features.map((feature, index) => (
            <div key={feature.id} className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))]">
              <div className={`p-4 font-medium ${index % 2 === 0 ? 'bg-dill-green/5' : 'bg-white'} text-dill-green`}>
                {feature.label}
              </div>
              {products.map((product) => (
                <div key={`${product.id}-${feature.id}`} className={`p-4 border-l ${index % 2 === 0 ? 'bg-dill-green/5' : 'bg-white'} hover:bg-dill-green/10 transition-colors`}>
                  {feature.id === "price" && (
                    <div className="text-center font-medium text-dill-green">
                      ${product.price.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/ {product.unit}</span>
                    </div>
                  )}
                  {feature.id === "seller" && (
                    <div className="text-center">
                      <span className="font-medium">{product.seller.name}</span>
                      <div className="text-sm text-amber-500 font-medium">
                        {product.seller.rating} ★
                      </div>
                    </div>
                  )}
                  {feature.id === "rating" && (
                    <div className="text-center">
                      <span className="text-amber-500 font-medium">{product.rating} ★</span>
                      <div className="text-xs text-muted-foreground">
                        ({product.reviews} reviews)
                      </div>
                    </div>
                  )}
                  {feature.id === "stock" && (
                    <div className="text-center">
                      {product.stock > 0 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          In Stock ({product.stock})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  )}
                  {feature.id === "origin" && (
                    <div className="text-center">
                      {product.origin?.country ? (
                        <span>
                          {product.origin.region ? `${product.origin.region}, ` : ''}
                          {product.origin.country}
                        </span>
                      ) : (
                        <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </div>
                  )}

                  {/* Handle features with paths (nested properties) */}
                  {feature.path && (
                    <div className="flex justify-center">
                      {getNestedProperty(product, feature.path) ? (
                        <div className="bg-green-50 text-green-700 rounded-full p-1">
                          <Check className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="bg-muted/30 text-muted-foreground rounded-full p-1">
                          <Minus className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Handle direct boolean properties */}
                  {(feature.id === "organic" ||
                    feature.id === "nonGMO" ||
                    feature.id === "locallySourced" ||
                    feature.id === "freeShipping" ||
                    feature.id === "bulkDiscount") && !feature.path && (
                    <div className="flex justify-center">
                      {product[feature.id as keyof Product] ? (
                        <div className="bg-green-50 text-green-700 rounded-full p-1">
                          <Check className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="bg-muted/30 text-muted-foreground rounded-full p-1">
                          <Minus className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Description row */}
          <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))]">
            <div className="p-4 font-medium bg-dill-green/5 text-dill-green">Description</div>
            {products.map((product) => (
              <div key={`${product.id}-description`} className="p-4 border-l bg-dill-green/5 hover:bg-dill-green/10 transition-colors">
                <p className="text-sm line-clamp-3">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-dill-green/15 p-0 bg-gradient-to-r from-dill-green/5 to-dill-green/10">
        <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))] w-full">
          <div className="p-4 flex items-center justify-center">
            <span className="text-sm text-dill-green font-medium">Add to Cart</span>
          </div>
          {products.map((product) => (
            <div key={`${product.id}-actions`} className="p-4 border-l">
              <Button
                className="w-full bg-mustard hover:bg-mustard/90 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                onClick={() => onAddToCart(product.id)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
