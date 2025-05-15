"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Box,
  CreditCard,
  FileText,
  Package,
  Settings,
  ShoppingCart,
  Users,
  AlertCircle,
  Tag,
  Truck,
  MessageSquare,
  LayoutDashboard,
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  HelpCircle,
} from "lucide-react"
import { AdminSearch } from "./admin-search"
import { AdminNotifications } from "./admin-notifications"

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
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AdminSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  // Helper function to create menu items without asChild
  const MenuItem = ({ href, icon: Icon, label, badgeCount, badgeColor = "bg-gray-100" }: {
    href: string;
    icon: React.ElementType;
    label: string;
    badgeCount?: number;
    badgeColor?: string;
  }) => {
    const testId = `menu-item-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <li className="group/menu-item relative" data-testid={testId}>
        <SidebarMenuItem className="relative" data-testid={testId}>
          <Link href={href} className="w-full">
            <SidebarMenuButton
              isActive={isActive(href)}
              className="data-[active=true]:bg-[#5A9A3D]/10 data-[active=true]:text-[#194D33] data-[active=false]:hover:bg-[#5A9A3D]/5 data-[active=false]:hover:text-[#194D33]"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </SidebarMenuButton>
          </Link>
          {badgeCount !== undefined && (
            <SidebarMenuBadge className={`${badgeColor} text-foreground absolute right-2`} data-testid={`badge-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {badgeCount}
            </SidebarMenuBadge>
          )}
        </SidebarMenuItem>
      </li>
    );
  }

  // Filter menu items based on search query
  const filterItems = (label: string) => {
    if (!searchQuery) return true
    return label.toLowerCase().includes(searchQuery.toLowerCase())
  }

  return (
    <Sidebar className="border-r border-[#5A9A3D]/20" data-testid="admin-sidebar">
      <SidebarHeader className="sidebar-header border-b border-[#5A9A3D]/20 p-4" data-testid="sidebar-header">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" data-testid="admin-logo-link">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/pickle-logo.png" alt="Pickle Logo" className="object-contain w-full h-full" />
            </div>
            <span className="text-lg font-bold text-[#194D33]">Pickle Admin</span>
          </Link>
          <SidebarTrigger data-testid="sidebar-trigger" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1" data-testid="sidebar-search">
            <AdminSearch />
          </div>
          <AdminNotifications id="sidebar" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Dashboard") && (
                  <MenuItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                )}
                {filterItems("Analytics") && (
                  <MenuItem href="/admin/analytics" icon={BarChart3} label="Analytics" />
                )}
                {filterItems("Reports") && (
                  <MenuItem href="/admin/reports" icon={FileText} label="Reports" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Users") && (
                  <MenuItem href="/admin/users" icon={Users} label="Users" />
                )}
                {filterItems("Sellers") && (
                  <MenuItem href="/admin/sellers" icon={Truck} label="Sellers" />
                )}
                {filterItems("Products") && (
                  <li className="group/menu-item relative" data-testid="menu-item-products">
                    <SidebarMenuItem className="relative" data-testid="menu-item-products">
                      <Link href="/admin/products" className="w-full">
                        <SidebarMenuButton
                          isActive={isActive("/admin/products")}
                          className="data-[active=true]:bg-[#5A9A3D]/10 data-[active=true]:text-[#194D33] data-[active=false]:hover:bg-[#5A9A3D]/5 data-[active=false]:hover:text-[#194D33]"
                        >
                          <Box className="h-4 w-4" />
                          <span>Products</span>
                        </SidebarMenuButton>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href="/admin/products" data-testid="products-all-link">All Products</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/products/import" data-testid="products-import-link">Import Products</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/products/pexels" data-testid="products-pexels-link">Pexels Images</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  </li>
                )}
                {filterItems("Orders") && (
                  <MenuItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
                )}
                {filterItems("Categories") && (
                  <MenuItem href="/admin/categories" icon={Tag} label="Categories" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Finance</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Financial Dashboard") && (
                  <MenuItem href="/admin/financial" icon={BarChart3} label="Financial Dashboard" />
                )}
                {filterItems("Transactions") && (
                  <MenuItem href="/admin/transactions" icon={CreditCard} label="Transactions" />
                )}
                {filterItems("Invoices") && (
                  <MenuItem href="/admin/invoices" icon={FileText} label="Invoices" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Support Tickets") && (
                  <MenuItem
                    href="/admin/support"
                    icon={MessageSquare}
                    label="Support Tickets"
                    badgeCount={12}
                    badgeColor="bg-amber-100"
                  />
                )}
                {filterItems("Issues") && (
                  <MenuItem
                    href="/admin/issues"
                    icon={AlertCircle}
                    label="Issues"
                    badgeCount={3}
                    badgeColor="bg-red-100"
                  />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterItems("Settings") && (
                  <MenuItem href="/admin/settings" icon={Settings} label="Settings" />
                )}
                {filterItems("Help & Documentation") && (
                  <MenuItem href="/admin/help" icon={HelpCircle} label="Help & Documentation" />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#5A9A3D]/20 p-4" data-testid="sidebar-footer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex w-full items-center justify-between p-0 hover:bg-transparent" data-testid="user-menu-trigger">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/avatars/admin.png" alt="Admin User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@pickle.com</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-testid="user-menu">
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
