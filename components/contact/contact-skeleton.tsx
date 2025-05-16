"use client";

import {
  HeadingSkeleton,
  TextSkeleton,
  CardSkeleton,
  InputSkeleton,
  ButtonSkeleton
} from "@/components/ui/skeleton-elements";
import { skeletonArray } from "@/lib/styles/skeleton-styles";

export function ContactSkeleton() {
  return (
    <div className="space-y-6" data-testid="contact-skeleton">
      <HeadingSkeleton level={1} withSubheading />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <HeadingSkeleton level={2} />
          <TextSkeleton size="md" width="full" lines={2} />
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextSkeleton size="sm" width="xs" />
                <InputSkeleton size="md" animation="pulse" />
              </div>
              
              <div className="space-y-2">
                <TextSkeleton size="sm" width="xs" />
                <InputSkeleton size="md" animation="pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <TextSkeleton size="sm" width="xs" />
              <InputSkeleton size="md" animation="pulse" />
            </div>
            
            <div className="space-y-2">
              <TextSkeleton size="sm" width="xs" />
              <InputSkeleton size="md" animation="pulse" />
            </div>
            
            <div className="space-y-2">
              <TextSkeleton size="sm" width="xs" />
              <InputSkeleton size="md" animation="pulse" />
            </div>
            
            <div className="space-y-2">
              <TextSkeleton size="sm" width="xs" />
              <div className="h-32 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            
            <ButtonSkeleton size="lg" animation="pulse" className="mt-4" />
          </div>
        </div>
        
        <div className="space-y-6">
          <HeadingSkeleton level={2} />
          <TextSkeleton size="md" width="full" lines={1} />
          
          <div className="space-y-6">
            {skeletonArray(4).map((item) => (
              <CardSkeleton 
                key={item.id}
                headerSize="md" 
                contentLines={2} 
                animation="shimmer" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
