"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the call to action section on the home page
 * Displays a placeholder while the actual CTA section is loading
 * 
 * @returns A skeleton loader for the CTA section
 */
export function CtaSectionSkeleton() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-20 relative" data-testid="cta-section-skeleton">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F1E5C3]/20 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-[800px] rounded-xl bg-white p-8 shadow-md md:p-12 relative overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-5 w-full max-w-[600px] mx-auto" />
            </div>
            <div className="w-full max-w-md space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSectionSkeleton;
