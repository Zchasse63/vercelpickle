"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

/**
 * Skeleton loader for the featured products section on the home page
 * Displays a placeholder while the actual featured products are loading
 * 
 * @returns A skeleton loader for the featured products section
 */
export function FeaturedProductsSkeleton() {
  return (
    <section className="w-full py-8 md:py-12" data-testid="featured-products-skeleton">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-full max-w-[700px] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="shadow-sm overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="aspect-square w-full rounded-lg mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSkeleton;
