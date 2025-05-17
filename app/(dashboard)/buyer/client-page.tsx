"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BuyerOrderStats,
  BuyerRecentOrders,
  BuyerSavedProducts,
  BuyerRecentActivity,
  preloadBuyerRecentOrders,
  preloadBuyerSavedProducts,
  preloadBuyerRecentActivity
} from "@/components/buyer/lazy-buyer-components"
import { BuyerOrderStatsSkeleton } from "@/components/buyer/buyer-order-stats-skeleton"
import { BuyerRecentOrdersSkeleton } from "@/components/buyer/buyer-recent-orders-skeleton"
import { BuyerSavedProductsSkeleton } from "@/components/buyer/buyer-saved-products-skeleton"
import { BuyerRecentActivitySkeleton } from "@/components/buyer/buyer-recent-activity-skeleton"

export default function BuyerDashboardClient() {
  const [activeTab, setActiveTab] = useState("overview")

  // Preload components based on the active tab
  useEffect(() => {
    // Always preload the recent orders component since it's used in multiple tabs
    preloadBuyerRecentOrders()

    // Preload other components based on the active tab
    if (activeTab === "overview") {
      preloadBuyerRecentActivity()
    } else if (activeTab === "saved") {
      preloadBuyerSavedProducts()
    }
  }, [activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col gap-6" data-testid="buyer-dashboard">
      <div className="flex flex-col gap-2 animate-fade-up" data-testid="buyer-sidebar">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your recent activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
        <BuyerOrderStats />
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-6 animate-fade-up delay-200"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="overview" className="hover-scale" data-testid="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="hover-scale" data-testid="orders-tab">Orders</TabsTrigger>
          <TabsTrigger value="saved" className="hover-scale" data-testid="saved-tab">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" data-testid="overview-content">
          <BuyerRecentOrders limit={3} />
          <BuyerRecentActivity />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6" data-testid="orders-content">
          <BuyerRecentOrders limit={10} />
        </TabsContent>

        <TabsContent value="saved" className="space-y-6" data-testid="saved-content">
          <BuyerSavedProducts />
        </TabsContent>
      </Tabs>
    </div>
  )
}


