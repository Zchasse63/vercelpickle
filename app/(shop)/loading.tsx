"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { 
  HeadingSkeleton, 
  TextSkeleton, 
  CardSkeleton 
} from "@/components/ui/skeleton-elements";
import { skeletonGrids } from "@/lib/styles/skeleton-styles";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <HeadingSkeleton level={1} withSubheading />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-md" animation="shimmer" />
            <TextSkeleton size="md" width="full" />
            <TextSkeleton size="lg" width="half" />
            <div className="flex justify-between">
              <TextSkeleton size="sm" width="third" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex justify-center space-x-2 pt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-md" />
        ))}
      </div>
    </div>
  );
}
