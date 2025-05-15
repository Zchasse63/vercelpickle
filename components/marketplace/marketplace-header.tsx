"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingCart } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"

import { Button } from "@/components/ui/button"
import { SafeButton } from "@/components/ui/safe-button"
import { SafeLink } from "@/components/ui/safe-link"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MarketplaceNavigation } from "@/components/marketplace/marketplace-navigation"
import { MarketplaceCartSheet } from "@/components/marketplace/marketplace-cart-sheet"
import { UserProfile } from "@/components/shared/user-profile"

export function MarketplaceHeader() {
  const pathname = usePathname()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user } = useAuth()

  // Use useMemo to memoize the userId to ensure consistent hook dependencies
  const userId = useMemo(() => user?.id || null, [user?.id])

  // Use the memoized userId in the useCart hook
  const { cartTotals } = useCart(userId)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background" data-testid="marketplace-header">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 lg:gap-6">
          <Sheet>
            <SheetTrigger>
              <SafeButton variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SafeButton>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="grid gap-6 text-lg font-medium" data-testid="mobile-navigation">
                <MarketplaceNavigation className="flex flex-col gap-4" />
              </nav>
            </SheetContent>
          </Sheet>
          <SafeLink href="/home" className="flex items-center gap-2" data-testid="home-link">
            <div className="relative h-8 w-8">
              <Image src="/pickle-logo.png" alt="Pickle" fill sizes="32px" className="object-contain" />
            </div>
            <span className="text-xl font-bold text-[#194D33]">Pickle</span>
          </SafeLink>
          <nav className="hidden gap-6 text-sm font-medium lg:flex" data-testid="main-navigation">
            <MarketplaceNavigation className="flex items-center gap-6" />
          </nav>
        </div>
        <div className="hidden flex-1 px-4 md:flex md:px-6 lg:px-8 justify-center">
          {/* Search bar removed */}
        </div>
        <div className="flex items-center gap-4">
          {/* Mobile search button removed */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger>
              <SafeButton variant="ghost" size="icon" className="relative" data-testid="cart-button">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground" data-testid="cart-count">
                  {cartTotals && cartTotals.itemCount > 0 ? (cartTotals.itemCount > 99 ? "99+" : cartTotals.itemCount) : "0"}
                </span>
              </SafeButton>
            </SheetTrigger>
            <MarketplaceCartSheet setIsOpen={setIsCartOpen} />
          </Sheet>
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
