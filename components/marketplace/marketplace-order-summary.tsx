"use client"

import Image from "next/image"
import { useAuth } from "@/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeLink } from "@/components/ui/safe-link"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loading } from "@/components/ui/loading"

export function MarketplaceOrderSummary() {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { cartItems, cartTotals, isLoading } = useCart(user?.id || null);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6" data-testid="order-summary-loading">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 flex items-center justify-center py-8">
          <Loading size="md" text="Loading cart..." />
        </div>
      </div>
    );
  }

  // If no cart items, show empty state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6" data-testid="order-summary-empty">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 py-8 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
          <SafeButton asChild className="mt-4" data-testid="continue-shopping-button">
            <SafeLink href="/marketplace">Continue Shopping</SafeLink>
          </SafeButton>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6" data-testid="order-summary">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="mt-4 space-y-4" data-testid="order-items">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex gap-4" data-testid="order-item" data-product-id={item.productId}>
            <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
              <Image
                src={item.product?.images?.[0] || "/placeholder.svg"}
                alt={item.product?.name || "Product"}
                fill
                className="object-cover"
                data-testid="order-item-image"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <SafeLink
                  href={`/marketplace/products/${item.productId}`}
                  className="font-medium hover:underline"
                  data-testid="order-item-name"
                >
                  {item.product?.name}
                </SafeLink>
                <div className="font-medium" data-testid="order-item-total">
                  {formatPrice((item.product?.price || 0) * item.quantity)}
                </div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <span data-testid="order-item-quantity">Qty: {item.quantity}</span>
                <span className="mx-2">•</span>
                <span data-testid="order-item-price">{formatPrice(item.product?.price || 0)} each</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-1.5" data-testid="order-totals">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span data-testid="order-subtotal">{formatPrice(cartTotals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span data-testid="order-shipping">{formatPrice(cartTotals.shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span data-testid="order-tax">{formatPrice(cartTotals.tax)}</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span data-testid="order-total">{formatPrice(cartTotals.total)}</span>
      </div>
      <div className="mt-6 flex items-center gap-2" data-testid="discount-section">
        <Input placeholder="Discount code" data-testid="discount-input" />
        <Button variant="outline" data-testid="apply-discount-button">Apply</Button>
      </div>
    </div>
  )
}
