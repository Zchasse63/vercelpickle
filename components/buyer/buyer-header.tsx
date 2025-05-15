"use client"

import { useState } from "react"
import { SafeLink } from "@/components/ui/safe-link"
import { Bell, Menu, Search, ShoppingCart, X } from "lucide-react"
import { SafeButton } from "@/components/ui/safe-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BuyerSidebar } from "./buyer-sidebar"

export function BuyerHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6" data-testid="buyer-header">
      <SafeButton
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setShowMobileMenu(true)}
        data-testid="mobile-menu-button"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SafeButton>
      <div className="w-full flex-1 md:grow-0">
        <form className="relative" data-testid="header-search-form">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-lg bg-gray-100 pl-8 md:w-[300px] lg:w-[400px]"
            data-testid="header-search-input"
          />
        </form>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <SafeButton variant="outline" size="icon" className="relative" asChild>
          <SafeLink href="/marketplace/cart" data-testid="cart-button">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-medium text-white" data-testid="cart-count">
              3
            </span>
          </SafeLink>
        </SafeButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SafeButton variant="outline" size="icon" className="relative" data-testid="header-notifications-button">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white" data-testid="notifications-count">
                5
              </span>
            </SafeButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]" data-testid="notifications-dropdown">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-start" data-testid="notification-item">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Order #1234 shipped</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-start" data-testid="notification-item">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">New product available</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-start" data-testid="notification-item">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Payment successful</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center" asChild>
              <SafeLink href="/buyer/notifications" className="text-sm font-medium" data-testid="view-all-notifications-link">
                View all notifications
              </SafeLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SafeButton variant="outline" size="sm" className="gap-2" data-testid="header-user-menu-button">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline" data-testid="header-user-name">John Doe</span>
            </SafeButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-testid="user-dropdown">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SafeLink href="/buyer/profile" className="flex w-full" data-testid="header-profile-link">
                Profile
              </SafeLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <SafeLink href="/buyer/settings" className="flex w-full" data-testid="header-settings-link">
                Settings
              </SafeLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center" data-testid="header-logout-button">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-white md:hidden" data-testid="mobile-menu">
          <div className="flex h-16 items-center gap-4 border-b bg-white px-4">
            <SafeButton
              variant="outline"
              size="icon"
              onClick={() => setShowMobileMenu(false)}
              data-testid="close-mobile-menu-button"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </SafeButton>
            <div className="flex-1">
              <SafeLink href="/buyer" className="flex items-center gap-2" data-testid="mobile-logo-link">
                <div className="relative h-8 w-8">
                  <img src="/pickle-logo.png" alt="Pickle Logo" className="object-contain w-full h-full" data-testid="mobile-logo" />
                </div>
                <span className="text-xl font-bold text-[#194D33]">Pickle</span>
              </SafeLink>
            </div>
          </div>
          <div className="p-4" data-testid="mobile-sidebar-container">
            <BuyerSidebar />
          </div>
        </div>
      )}
    </header>
  )
}
