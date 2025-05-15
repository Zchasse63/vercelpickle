import type { Metadata } from "next"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import BuyerDashboardClient from "./client-page"

export const metadata: Metadata = {
  title: "Buyer Dashboard | Pickle B2B Marketplace",
  description: "Manage your orders and account",
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<BuyerDashboardSkeleton />}>
      <BuyerDashboardClient />
    </Suspense>
  )
}

// Skeleton loader for the buyer dashboard
function BuyerDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Recent Orders */}
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
        </div>
      </div>
    </div>
  )
}
