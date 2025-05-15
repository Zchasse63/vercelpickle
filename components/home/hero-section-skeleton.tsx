"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the hero section on the home page
 * Displays a placeholder while the actual hero section is loading
 * 
 * @returns A skeleton loader for the hero section
 */
export function HeroSectionSkeleton() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-[#F1E5C3]/20 to-white" data-testid="hero-section-skeleton">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>

      {/* Accent color strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5A9A3D] via-[#194D33] to-[#F3B522]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center">
          <div className="order-2 lg:order-1 space-y-3 max-w-xl text-center lg:text-left">
            <Skeleton className="h-10 w-3/4 mx-auto lg:mx-0" />
            <Skeleton className="h-5 w-full mx-auto lg:mx-0" />
            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
              <Skeleton className="h-10 w-full sm:w-40" />
              <Skeleton className="h-10 w-full sm:w-40" />
            </div>
          </div>
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <Skeleton className="relative w-full max-w-[250px] aspect-square rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSectionSkeleton;
