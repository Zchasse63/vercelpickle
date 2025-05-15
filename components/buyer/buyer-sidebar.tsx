"use client"

import { useState } from "react"
import { SafeLink } from "@/components/ui/safe-link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Home,
  Package,
  Heart,
  CreditCard,
  Truck,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  User,
  ChevronDown
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SafeButton } from "@/components/ui/safe-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { name: "Dashboard", href: "/buyer", icon: Home },
  { name: "Orders", href: "/buyer/orders", icon: Package },
  { name: "Favorites", href: "/buyer/favorites", icon: Heart },
  { name: "Payment Methods", href: "/buyer/payment-methods", icon: CreditCard },
  { name: "Shipping Addresses", href: "/buyer/shipping", icon: Truck },
  { name: "Settings", href: "/buyer/settings", icon: Settings },
  { name: "Help & Support", href: "/buyer/support", icon: HelpCircle },
]

export function BuyerSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  // Helper function to create menu items
  const MenuItem = ({ href, icon: Icon, label, badgeCount, badgeColor = "bg-gray-100", ...rest }: {
    href: string;
    icon: React.ElementType;
    label: string;
    badgeCount?: number;
    badgeColor?: string;
    [key: string]: any;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    // Create a testId based on the label
    const testId = `${label.toLowerCase().replace(/\s+/g, '-')}-link`

    return (
      <SidebarMenuItem {...rest} data-testid={testId}>
        <SafeLink href={href} className="w-full" {...rest}>
          <SidebarMenuButton
            isActive={isActive}
            className="data-[active=true]:bg-[#5A9A3D]/10 data-[active=true]:text-[#194D33] data-[active=false]:hover:bg-[#5A9A3D]/5 data-[active=false]:hover:text-[#194D33]"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </SidebarMenuButton>
        </SafeLink>
        {badgeCount !== undefined && (
          <span
            className={`absolute right-2 flex h-5 w-5 items-center justify-center rounded-full ${badgeColor} text-xs font-medium`}
            data-testid={`${testId}-badge`}
          >
            {badgeCount}
          </span>
        )}
      </SidebarMenuItem>
    )
  }

  // Filter menu items based on search query
  const filterItems = (label: string) => {
    if (!searchQuery) return true
    return label.toLowerCase().includes(searchQuery.toLowerCase())
  }

  return (
    <Sidebar className="border-r border-[#5A9A3D]/20">
      <SidebarHeader className="sidebar-header border-b border-[#5A9A3D]/20 p-4" data-testid="buyer-sidebar-header">
        <div className="flex items-center justify-between">
          <SafeLink href="/buyer" className="flex items-center gap-2" data-testid="buyer-dashboard-link">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/pickle-logo.png" alt="Pickle Logo" className="object-contain w-full h-full" data-testid="buyer-logo" />
            </div>
            <span className="text-lg font-bold text-[#194D33]">Pickle</span>
          </SafeLink>
          <SidebarTrigger data-testid="sidebar-toggle" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              data-testid="buyer-search-input"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SafeButton variant="outline" size="icon" className="relative" data-testid="notifications-button">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white" data-testid="notifications-badge">
                    3
                  </span>
                </SafeButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Dashboard") && (
                  <MenuItem href="/buyer" icon={Home} label="Dashboard" />
                )}
                {filterItems("Orders") && (
                  <MenuItem href="/buyer/orders" icon={Package} label="Orders" badgeCount={5} badgeColor="bg-blue-100" />
                )}
                {filterItems("Favorites") && (
                  <MenuItem href="/buyer/favorites" icon={Heart} label="Favorites" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Payment Methods") && (
                  <MenuItem href="/buyer/payment-methods" icon={CreditCard} label="Payment Methods" data-testid="payment-methods-link" />
                )}
                {filterItems("Shipping Addresses") && (
                  <MenuItem href="/buyer/shipping" icon={Truck} label="Shipping Addresses" data-testid="shipping-addresses-link" />
                )}
                {filterItems("Settings") && (
                  <MenuItem href="/buyer/settings" icon={Settings} label="Settings" data-testid="profile-settings-link" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Help & Support") && (
                  <MenuItem href="/buyer/support" icon={HelpCircle} label="Help & Support" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-4" />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Go to Marketplace") && (
                  <MenuItem href="/marketplace" icon={ShoppingCart} label="Go to Marketplace" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#5A9A3D]/20 p-4" data-testid="buyer-sidebar-footer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SafeButton variant="ghost" className="w-full p-0 hover:bg-transparent" data-testid="user-menu-button">
              <span className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/avatars/01.png" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium" data-testid="user-name">John Doe</p>
                    <p className="text-xs text-muted-foreground" data-testid="user-email">john.doe@example.com</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </span>
            </SafeButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem data-testid="profile-menu-item">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="settings-menu-item">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500" data-testid="logout-menu-item">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
