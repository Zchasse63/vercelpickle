"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { 
  HeadingSkeleton, 
  TextSkeleton, 
  CardSkeleton,
  ButtonSkeleton
} from "@/components/ui/skeleton-elements";
import { skeletonArray } from "@/lib/styles/skeleton-styles";

export default function CheckoutLoading() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Checkout steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {skeletonArray(4).map((item, index) => (
            <div key={item.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <TextSkeleton size="sm" width="xs" className="mt-2" />
              </div>
              {index < 3 && (
                <Skeleton className="h-1 w-24 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="md:col-span-2 space-y-6">
          <HeadingSkeleton level={2} />
          
          <CardSkeleton 
            headerSize="md" 
            contentLines={4} 
            animation="pulse" 
          />
          
          <CardSkeleton 
            headerSize="md" 
            contentLines={3} 
            animation="pulse" 
          />
          
          <CardSkeleton 
            headerSize="md" 
            contentLines={2} 
            animation="pulse" 
          />
          
          <div className="flex justify-between items-center pt-4">
            <ButtonSkeleton size="md" />
            <ButtonSkeleton size="md" />
          </div>
        </div>
        
        {/* Order summary */}
        <div>
          <CardSkeleton 
            headerSize="md" 
            contentLines={0} 
            className="sticky top-4" 
          >
            <div className="space-y-4">
              {skeletonArray(3).map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                  <div className="flex space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="space-y-1">
                      <TextSkeleton size="sm" width="md" />
                      <TextSkeleton size="xs" width="sm" />
                    </div>
                  </div>
                  <TextSkeleton size="md" width="xs" />
                </div>
              ))}
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <TextSkeleton size="sm" width="xs" />
                  <TextSkeleton size="sm" width="xs" />
                </div>
                <div className="flex justify-between">
                  <TextSkeleton size="sm" width="xs" />
                  <TextSkeleton size="sm" width="xs" />
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <TextSkeleton size="md" width="sm" />
                  <TextSkeleton size="md" width="sm" />
                </div>
              </div>
            </div>
          </CardSkeleton>
        </div>
      </div>
    </div>
  );
}
