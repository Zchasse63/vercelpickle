"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  Box,
  Calendar,
  ClipboardList,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Home,
  LifeBuoy,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Split,
  Store,
  Truck,
  Warehouse,
  Search,
  User,
  ChevronDown,
  LogOut
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SellerSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  // Helper function to create menu items
  const MenuItem = ({ href, icon: Icon, label, badgeCount, badgeColor = "bg-gray-100" }: {
    href: string;
    icon: React.ElementType;
    label: string;
    badgeCount?: number;
    badgeColor?: string;
  }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    const testId = `menu-item-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <li className="group/menu-item relative" data-testid={testId}>
        <Link
          href={href}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
            isActive
              ? "bg-[#5A9A3D]/10 text-[#194D33]"
              : "text-muted-foreground hover:bg-[#5A9A3D]/5 hover:text-[#194D33]"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
          {badgeCount !== undefined && (
            <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full ${badgeColor} text-xs font-medium`} data-testid={`badge-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {badgeCount}
            </span>
          )}
        </Link>
      </li>
    )
  }

  // Filter menu items based on search query
  const filterItems = (label: string) => {
    if (!searchQuery) return true
    return label.toLowerCase().includes(searchQuery.toLowerCase())
  }

  return (
    <div className="border-r border-[#5A9A3D]/20 w-64 flex flex-col h-screen" data-testid="seller-sidebar">
      <SidebarHeader className="sidebar-header border-b border-[#5A9A3D]/20 p-4">
        <div className="flex items-center justify-between">
          <Link href="/seller" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/pickle-logo.png" alt="Pickle Logo" className="object-contain w-full h-full" />
            </div>
            <span className="text-lg font-bold text-[#194D33]">Pickle Seller</span>
          </Link>
          <SidebarTrigger />
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
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="relative flex items-center">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    7
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="h-[calc(100vh-13rem)] overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Dashboard") && (
                  <MenuItem href="/seller" icon={Home} label="Dashboard" />
                )}
                {filterItems("Analytics") && (
                  <MenuItem href="/seller/analytics" icon={BarChart3} label="Analytics" />
                )}
                {filterItems("Financial Reports") && (
                  <MenuItem href="/seller/financial-reports" icon={DollarSign} label="Financial Reports" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Products</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Products") && (
                  <MenuItem href="/seller/products" icon={Package} label="Products" />
                )}
                {filterItems("Inventory") && (
                  <MenuItem href="/seller/inventory" icon={Box} label="Inventory" badgeCount={3} badgeColor="bg-amber-100" />
                )}
                {filterItems("Bulk Listings") && (
                  <MenuItem href="/seller/bulk-listings" icon={FileSpreadsheet} label="Bulk Listings" />
                )}
                {filterItems("Time-Sensitive Deals") && (
                  <MenuItem href="/seller/time-deals" icon={Clock} label="Time-Sensitive Deals" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Orders</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Orders") && (
                  <MenuItem href="/seller/orders" icon={ClipboardList} label="Orders" badgeCount={12} badgeColor="bg-blue-100" />
                )}
                {filterItems("Negotiations") && (
                  <MenuItem href="/seller/negotiations" icon={MessageSquare} label="Negotiations" badgeCount={2} badgeColor="bg-green-100" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Shipping</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Shipping") && (
                  <MenuItem href="/seller/shipping" icon={Truck} label="Shipping" />
                )}
                {filterItems("Freight Arrangements") && (
                  <MenuItem href="/seller/freight" icon={Truck} label="Freight Arrangements" />
                )}
                {filterItems("Pickup Scheduling") && (
                  <MenuItem href="/seller/pickup-scheduling" icon={Calendar} label="Pickup Scheduling" />
                )}
                {filterItems("Split Shipments") && (
                  <MenuItem href="/seller/split-shipments" icon={Split} label="Split Shipments" />
                )}
                {filterItems("Dock Requirements") && (
                  <MenuItem href="/seller/dock-requirements" icon={Warehouse} label="Dock Requirements" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Communication</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Messages") && (
                  <MenuItem href="/seller/messages" icon={MessageSquare} label="Messages" badgeCount={5} badgeColor="bg-blue-100" />
                )}
                {filterItems("Notifications") && (
                  <MenuItem href="/seller/notifications" icon={Bell} label="Notifications" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Store Profile") && (
                  <MenuItem href="/seller/store" icon={Store} label="Store Profile" />
                )}
                {filterItems("Anonymity Settings") && (
                  <MenuItem href="/seller/anonymity" icon={Shield} label="Anonymity Settings" />
                )}
                {filterItems("Settings") && (
                  <MenuItem href="/seller/settings" icon={Settings} label="Settings" />
                )}
                {filterItems("Support") && (
                  <MenuItem href="/seller/support" icon={LifeBuoy} label="Support" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Advanced</SidebarGroupLabel>
            <SidebarGroupContent>
              <ul className="space-y-1">
                {filterItems("Specialized Analytics") && (
                  <MenuItem href="/seller/specialized-analytics" icon={BarChart3} label="Specialized Analytics" />
                )}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#5A9A3D]/20 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex w-full items-center justify-between p-0 hover:bg-transparent">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/avatars/02.png" alt="Farm Supplier" />
                  <AvatarFallback>FS</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">Farm Supplier</p>
                  <p className="text-xs text-muted-foreground">farm.supplier@example.com</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center">
                <Store className="mr-2 h-4 w-4" />
                <span>Store Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </div>
  )
}
