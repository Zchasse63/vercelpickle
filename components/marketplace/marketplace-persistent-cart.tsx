"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, X } from "lucide-react"
import { useGlobalCart } from "@/hooks/use-global-cart"
import { formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeLink } from "@/components/ui/safe-link"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarketplacePersistentCartProps {
  className?: string;
}

export function MarketplacePersistentCart({ className }: MarketplacePersistentCartProps) {
  // Use the global cart hook
  const {
    items: cartItems,
    totals: cartTotals,
    updateCartItem,
    removeCartItem,
    emptyCart,
    isLoading
  } = useGlobalCart();

  // Handle quantity changes
  const handleDecreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem(cartItemId, currentQuantity - 1);
    } else {
      removeCartItem(cartItemId);
    }
  };

  const handleIncreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    updateCartItem(cartItemId, currentQuantity + 1);
  };

  // Handle item removal
  const handleRemoveItem = (cartItemId: string) => {
    removeCartItem(cartItemId);
  };

  return (
    <Card className={`h-full flex flex-col border border-dill-green/20 shadow-md rounded-lg transition-all duration-300 ${className}`} data-testid="cart">
      <CardHeader className="pb-3 pt-4 border-b border-dill-green/15 bg-gradient-to-r from-dill-green/5 to-dill-green/10">
        <CardTitle className="flex items-center text-dill-green">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Your Cart
          {cartTotals && cartTotals.itemCount > 0 && (
            <span className="ml-2 rounded-full bg-dill-green px-2 py-0.5 text-xs text-white animate-pulse-subtle" data-testid="cart-count">
              {cartTotals.itemCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 px-5 py-2">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            // Loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex gap-4 py-3 animate-pulse">
                <Skeleton className="h-16 w-16 flex-shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))
          ) : cartItems && cartItems.length > 0 ? (
            // Cart items
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-3 border-b border-dill-green/15 last:border-0 hover:bg-dill-green/5 transition-colors duration-200 rounded-md px-2 group"
                data-testid="cart-item"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white border border-dill-green/10 shadow-sm">
                  <Image
                    src={item.product?.images?.[0] || "/placeholder.svg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <SafeLink
                    href={`/marketplace/products/${item.product?._id}`}
                    className="line-clamp-1 font-medium text-sm hover:text-dill-green hover:underline transition-colors"
                  >
                    {item.product?.name}
                  </SafeLink>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(item.product?.price || 0)} / {item.product?.unit || "each"}
                    </div>
                    <div className="text-sm font-medium text-dill-green">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1.5">
                    <div className="flex items-center bg-white rounded-md border border-dill-green/20 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-l-md p-0 hover:bg-dill-green/10 hover:text-dill-green transition-colors"
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-r-md p-0 hover:bg-dill-green/10 hover:text-dill-green transition-colors"
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty cart
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-dill-green/5 p-4 rounded-full mb-3">
                <ShoppingCart className="h-10 w-10 text-dill-green/60" />
              </div>
              <h3 className="text-sm font-medium text-dill-green">Your cart is empty</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-[200px] mx-auto">
                Add items to your cart to see them here and proceed to checkout
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {cartItems && cartItems.length > 0 && (
        <CardFooter className="flex flex-col gap-4 border-t border-dill-green/15 p-5 bg-gradient-to-r from-dill-green/5 to-dill-green/10">
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(cartTotals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(cartTotals.tax)}</span>
            </div>
            <Separator className="my-2 bg-dill-green/20" />
            <div className="flex justify-between font-medium text-base">
              <span>Total</span>
              <span className="text-dill-green">{formatPrice(cartTotals.total)}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 mt-1">
            <SafeButton
              className="w-full bg-dill-green hover:bg-dill-green/90 shadow-sm transition-all duration-200 hover:shadow-md"
              asChild
              data-testid="view-cart-button"
            >
              <SafeLink href="/cart">
                View Cart
              </SafeLink>
            </SafeButton>
            <SafeButton
              className="w-full bg-mustard hover:bg-mustard/90 shadow-sm transition-all duration-200 hover:shadow-md"
              asChild
              data-testid="checkout-button"
            >
              <SafeLink href="/checkout">
                Checkout
              </SafeLink>
            </SafeButton>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
