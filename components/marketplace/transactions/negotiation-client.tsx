"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckCircle, ShoppingCart, ArrowLeft } from "lucide-react"
import { NegotiationProcess } from "@/components/marketplace/transactions/negotiation-process"
import Link from "next/link"
import Image from "next/image"

export function NegotiationClient() {
  const [negotiationComplete, setNegotiationComplete] = useState(false)
  const [negotiationResult, setNegotiationResult] = useState<any>(null)

  // Mock product data
  const mockProduct = {
    id: "prod-123",
    name: "Organic Apples",
    sellerName: "Green Farms",
    initialPrice: 2.99,
    unit: "lb",
    image: "/organic-apples.png"
  }

  const handleNegotiationComplete = (result: any) => {
    console.log("Negotiation completed:", result)
    setNegotiationResult(result)
    setNegotiationComplete(true)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-2 animate-fade-up">
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="mb-2 hover-scale">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Negotiate Purchase</h1>
        <p className="text-muted-foreground">
          Negotiate with sellers on price, quantity, and delivery terms
        </p>
      </div>

      {negotiationComplete ? (
        <Card className="mt-8 animate-fade-up">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Negotiation Successful
            </CardTitle>
            <CardDescription>
              You have successfully negotiated a deal with {mockProduct.sellerName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image
                      src={mockProduct.image}
                      alt={mockProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{mockProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">Seller: {mockProduct.sellerName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Price:</span>
                    <span>${mockProduct.initialPrice.toFixed(2)} / {mockProduct.unit}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Negotiated Price:</span>
                    <span className="text-green-600">${negotiationResult.finalPrice.toFixed(2)} / {mockProduct.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{negotiationResult.quantity} {mockProduct.unit}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Savings:</span>
                    <span className="text-green-600">
                      ${((mockProduct.initialPrice - negotiationResult.finalPrice) * negotiationResult.quantity).toFixed(2)}
                    </span>
                  </div>
                  {negotiationResult.deliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Date:</span>
                      <span>{new Date(negotiationResult.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Next Steps</AlertTitle>
                  <AlertDescription>
                    Your negotiated terms have been saved. You can now proceed to checkout with these terms or continue shopping.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col space-y-2">
                  <Button className="w-full hover-scale">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                  <Link href="/marketplace" className="w-full">
                    <Button variant="outline" className="w-full hover-scale">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-fade-left">
            <NegotiationProcess
              productId={mockProduct.id}
              productName={mockProduct.name}
              sellerName={mockProduct.sellerName}
              initialPrice={mockProduct.initialPrice}
              unit={mockProduct.unit}
              onComplete={handleNegotiationComplete}
            />
          </div>

          <div className="space-y-6 animate-fade-right">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={mockProduct.image}
                    alt={mockProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{mockProduct.name}</h3>
                  <p className="text-muted-foreground">Seller: {mockProduct.sellerName}</p>
                  <p className="text-lg font-bold mt-2">${mockProduct.initialPrice.toFixed(2)} / {mockProduct.unit}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Negotiation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Volume Discounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Sellers are more likely to offer discounts for larger quantities. Consider increasing your order size.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Flexible Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Being flexible with delivery dates can help you negotiate better prices.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Long-term Relationships</h4>
                  <p className="text-sm text-muted-foreground">
                    Mention if you're interested in establishing a long-term relationship with the seller.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
