"use client"

import { Suspense, lazy } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load components
const BuyerOrderStats = lazy(() => import("@/components/buyer/buyer-order-stats"))
const BuyerRecentOrders = lazy(() => import("@/components/buyer/buyer-recent-orders"))
const BuyerSavedProducts = lazy(() => import("@/components/buyer/buyer-saved-products"))
const BuyerRecentActivity = lazy(() => import("@/components/buyer/buyer-recent-activity"))

export default function BuyerDashboardClient() {
  return (
    <div className="flex flex-col gap-6" data-testid="buyer-dashboard">
      <div className="flex flex-col gap-2 animate-fade-up" data-testid="buyer-sidebar">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your recent activity.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
        <Suspense fallback={<OrderStatsSkeleton />}>
          <BuyerOrderStats />
        </Suspense>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6 animate-fade-up delay-200">
        <TabsList>
          <TabsTrigger value="overview" className="hover-scale" data-testid="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="hover-scale" data-testid="orders-tab">Orders</TabsTrigger>
          <TabsTrigger value="saved" className="hover-scale" data-testid="saved-tab">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6" data-testid="overview-content">
          <Suspense fallback={<RecentOrdersSkeleton />}>
            <BuyerRecentOrders limit={3} />
          </Suspense>
          
          <Suspense fallback={<RecentActivitySkeleton />}>
            <BuyerRecentActivity />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6" data-testid="orders-content">
          <Suspense fallback={<RecentOrdersSkeleton />}>
            <BuyerRecentOrders limit={10} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-6" data-testid="saved-content">
          <Suspense fallback={<SavedProductsSkeleton />}>
            <BuyerSavedProducts />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Skeleton loaders
function OrderStatsSkeleton() {
  return (
    <>
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      ))}
    </>
  )
}

function RecentOrdersSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-dill-green/20">
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg">
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SavedProductsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-dill-green/20">
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-dill-green/20">
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full max-w-md mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
