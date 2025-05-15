"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGlobalCart } from "@/hooks/use-global-cart"
import { useRouter } from "next/navigation"

interface CheckoutLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  showBackButton?: boolean
  backButtonHref?: string
  backButtonText?: string
  testId?: string
}

/**
 * CheckoutLayout component
 * 
 * A layout component for checkout pages with a consistent header and empty cart handling.
 */
export function CheckoutLayout({
  children,
  title,
  description,
  showBackButton = true,
  backButtonHref = "/marketplace",
  backButtonText = "Continue Shopping",
  testId,
}: CheckoutLayoutProps) {
  const { items: cartItems, isEmpty } = useGlobalCart()
  const router = useRouter()
  
  // If cart is empty, show empty cart message
  if (isEmpty) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12" data-testid={`${testId}-empty`}>
        <Card className="mx-auto max-w-2xl p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button 
              onClick={() => router.push("/marketplace")}
              data-testid="browse-products-button"
            >
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12" data-testid={testId}>
      <div className="mb-6" data-testid={`${testId}-header`}>
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-2"
            data-testid={`${testId}-back-button`}
          >
            <Link href={backButtonHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButtonText}
            </Link>
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {children}
    </div>
  )
}
