"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the product grid component
 * Displays a grid of product card skeletons while the actual product grid is loading
 * 
 * @returns A skeleton loader for the product grid
 */
export function ProductGridSkeleton() {
  // Create an array of 12 items to represent a typical product grid
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="w-full" data-testid="product-grid-skeleton">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item} className="flex flex-col space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGridSkeleton;
