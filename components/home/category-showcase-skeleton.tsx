"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

/**
 * Skeleton loader for the category showcase section on the home page
 * Displays a placeholder while the actual categories are loading
 * 
 * @returns A skeleton loader for the category showcase section
 */
export function CategoryShowcaseSkeleton() {
  return (
    <section className="w-full py-8 md:py-12 relative" data-testid="category-showcase-skeleton">
      <div className="absolute inset-0 bg-[#F1E5C3]/10 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-full max-w-[700px] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mt-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="shadow-sm overflow-hidden">
              <CardHeader className="p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="aspect-square w-full rounded-lg" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcaseSkeleton;
