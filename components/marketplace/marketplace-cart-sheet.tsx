"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { formatPrice } from "@/lib/utils"

// Define a simple type for IDs
type CartItemId = string;

import { Button } from "@/components/ui/button"
import { SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface MarketplaceCartSheetProps {
  setIsOpen: (open: boolean) => void
}

export function MarketplaceCartSheet({ setIsOpen }: MarketplaceCartSheetProps) {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const {
    cartItems,
    cartTotals,
    updateItem,
    removeItem,
    emptyCart,
    isLoading
  } = useCart(user?.id || null);

  // Handle quantity changes
  const handleDecreaseQuantity = (cartItemId: CartItemId, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItem(cartItemId, currentQuantity - 1);
    } else {
      removeItem(cartItemId);
    }
  };

  const handleIncreaseQuantity = (cartItemId: CartItemId, currentQuantity: number) => {
    updateItem(cartItemId, currentQuantity + 1);
  };

  // Handle item removal
  const handleRemoveItem = (cartItemId: CartItemId) => {
    removeItem(cartItemId);
  };

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg" data-testid="cart-sheet">
      <SheetHeader className="px-1">
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-5 overflow-auto py-4" data-testid="cart-items">
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="grid grid-cols-[80px_1fr] gap-4" data-testid="cart-loading-item">
              <Skeleton className="h-20 w-20" />
              <div className="grid gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-7" />
                </div>
              </div>
            </div>
          ))
        ) : cartItems && cartItems.length > 0 ? (
          // Cart items
          cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[80px_1fr] gap-4" data-testid="cart-item" data-item-id={item.id}>
              <div className="relative aspect-square h-20 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.product?.images?.[0] || "/placeholder.svg"}
                  alt={item.product?.name || "Product"}
                  fill
                  className="absolute object-cover"
                  data-testid="cart-item-image"
                />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold" data-testid="cart-item-name">{item.product?.name}</div>
                  <div data-testid="cart-item-total">{formatPrice((item.product?.price || 0) * item.quantity)}</div>
                </div>
                <div className="text-sm text-muted-foreground" data-testid="cart-item-price">
                  {formatPrice(item.product?.price || 0)} / {item.product?.unit || "each"}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                      data-testid="quantity-decrease"
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-4 text-center" data-testid="item-quantity">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      data-testid="quantity-increase"
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleRemoveItem(item.id)}
                    data-testid="remove-item"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty cart
          <div className="flex flex-col items-center justify-center py-10 text-center" data-testid="empty-cart">
            <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-semibold">Your cart is empty</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add items to your cart to see them here
            </p>
            <Button variant="outline" onClick={() => setIsOpen(false)} data-testid="continue-shopping">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="space-y-4 pr-6" data-testid="cart-summary">
          <Separator />
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span data-testid="cart-subtotal">{formatPrice(cartTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span data-testid="cart-shipping">{formatPrice(cartTotals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span data-testid="cart-tax">{formatPrice(cartTotals.tax)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span data-testid="cart-total">{formatPrice(cartTotals.total)}</span>
            </div>
          </div>
          <SheetFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                window.location.href = "/marketplace/checkout"
              }}
              disabled={cartItems.length === 0}
              data-testid="checkout-button"
            >
              Checkout
            </Button>
          </SheetFooter>
        </div>
      )}
    </SheetContent>
  )
}
