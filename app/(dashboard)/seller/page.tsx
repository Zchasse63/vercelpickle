import type { Metadata } from "next"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import SellerDashboardClient from "./client-page"

export const metadata: Metadata = {
  title: "Seller Dashboard | Pickle B2B Marketplace",
  description: "Manage your store, products, and orders",
}

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<SellerDashboardSkeleton />}>
      <SellerDashboardClient />
    </Suspense>
  )
}

// Skeleton loader for the seller dashboard
function SellerDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-full">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-1" />
      </div>
      
      <div className="mt-4">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        
        <div className="space-y-4">
          {/* Sales Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border">
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
          
          {/* Charts and Tables */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-6 border">
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 border">
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 border rounded-md">
                    <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-16 ml-auto mb-1" />
                      <Skeleton className="h-3 w-12 ml-auto" />
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
