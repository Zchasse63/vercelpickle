"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton loader for the customer reviews section on the home page
 * Displays a placeholder while the actual customer reviews are loading
 * 
 * @returns A skeleton loader for the customer reviews section
 */
export function CustomerReviewsSkeleton() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#F1E5C3]/10" data-testid="customer-reviews-skeleton">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-full max-w-[700px] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 mr-1 rounded-full" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerReviewsSkeleton;
