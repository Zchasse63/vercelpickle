"use client";

import {
  HeadingSkeleton,
  TextSkeleton,
  CardSkeleton
} from "@/components/ui/skeleton-elements";
import { skeletonArray } from "@/lib/styles/skeleton-styles";

export function AboutSkeleton() {
  return (
    <div className="space-y-10" data-testid="about-skeleton">
      <HeadingSkeleton level={1} withSubheading />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <HeadingSkeleton level={2} />
          <TextSkeleton size="md" width="full" lines={3} />
        </div>
        
        <div className="space-y-4">
          <HeadingSkeleton level={2} />
          <TextSkeleton size="md" width="full" lines={3} />
        </div>
      </div>
      
      <div className="space-y-4">
        <HeadingSkeleton level={2} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skeletonArray(3).map((item) => (
            <CardSkeleton 
              key={item.id}
              headerSize="md" 
              contentLines={2} 
              animation="shimmer" 
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <HeadingSkeleton level={2} />
        <TextSkeleton size="md" width="full" lines={2} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {skeletonArray(4).map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
              <TextSkeleton size="md" width="md" className="mx-auto" />
              <TextSkeleton size="sm" width="sm" className="mx-auto mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
