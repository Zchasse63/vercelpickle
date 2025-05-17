"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton loader for the marketplace filter component
 * Displays a placeholder while the actual filter component is loading
 * 
 * @returns A skeleton loader for the filter component
 */
export function FilterSkeleton() {
  return (
    <Card className="w-full" data-testid="filter-skeleton">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories Section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Attributes Section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Seller Section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterSkeleton;
