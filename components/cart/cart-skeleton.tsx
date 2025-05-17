"use client";

import {
  HeadingSkeleton,
  TextSkeleton,
  CardSkeleton,
  ButtonSkeleton
} from "@/components/ui/skeleton-elements";
import { skeletonArray, skeletonGrids } from "@/lib/styles/skeleton-styles";
import { Card, CardContent } from "@/components/ui/card";

export function CartSkeleton() {
  return (
    <div className="space-y-6" data-testid="cart-skeleton">
      <HeadingSkeleton level={1} withSubheading />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HeadingSkeleton level={2} />
          
          <div className="space-y-4 mt-4">
            {skeletonArray(3).map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="space-y-1">
                          <TextSkeleton size="lg" width="md" />
                          <TextSkeleton size="sm" width="sm" />
                          <TextSkeleton size="sm" width="xs" />
                        </div>
                        
                        <div className="mt-2 sm:mt-0 text-right">
                          <TextSkeleton size="md" width="xs" />
                          <TextSkeleton size="sm" width="sm" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center space-x-2">
                          <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
                          <TextSkeleton size="sm" width="xs" />
                          <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
                        </div>
                        
                        <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <HeadingSkeleton level={2} />
          
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <TextSkeleton size="md" width="sm" />
                  <TextSkeleton size="md" width="xs" />
                </div>
                
                <div className="flex justify-between">
                  <TextSkeleton size="md" width="xs" />
                  <TextSkeleton size="md" width="xs" />
                </div>
                
                <div className="flex justify-between">
                  <TextSkeleton size="md" width="sm" />
                  <TextSkeleton size="md" width="xs" />
                </div>
                
                <div className="h-px w-full bg-gray-200"></div>
                
                <div className="flex justify-between font-bold">
                  <TextSkeleton size="lg" width="sm" />
                  <TextSkeleton size="lg" width="sm" />
                </div>
                
                <div className="pt-4">
                  <ButtonSkeleton size="lg" animation="pulse" className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <TextSkeleton size="md" width="md" className="mb-2" />
            <div className="flex gap-2">
              <div className="flex-grow">
                <TextSkeleton size="md" width="full" />
              </div>
              <ButtonSkeleton size="md" animation="pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
