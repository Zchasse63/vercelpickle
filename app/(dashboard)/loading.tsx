"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { 
  HeadingSkeleton, 
  TextSkeleton, 
  CardSkeleton 
} from "@/components/ui/skeleton-elements";
import { skeletonGrids } from "@/lib/styles/skeleton-styles";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
        <div className="p-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 px-4 space-y-2 overflow-auto py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 space-y-6">
          <HeadingSkeleton level={1} withSubheading />
          
          <div className={skeletonGrids.cards4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton 
                key={i} 
                headerSize="md" 
                contentLines={1} 
                animation="shimmer" 
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CardSkeleton 
                headerSize="lg" 
                contentLines={0} 
                className="h-[300px]" 
                animation="wave" 
              />
            </div>
            <div>
              <CardSkeleton 
                headerSize="md" 
                contentLines={4} 
                animation="pulse" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton 
              headerSize="md" 
              contentLines={6} 
              animation="shimmer" 
            />
            <CardSkeleton 
              headerSize="md" 
              contentLines={6} 
              animation="shimmer" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
