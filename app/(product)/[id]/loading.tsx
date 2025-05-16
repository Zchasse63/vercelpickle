"use client";

import { Container } from "@/components/ui/container";
import { 
  HeadingSkeleton, 
  TextSkeleton,
  ButtonSkeleton
} from "@/components/ui/skeleton-elements";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductLoading() {
  return (
    <Container className="py-10" data-testid="product-detail-loading">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg bg-gray-200 animate-shimmer" />
          
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="aspect-square w-full rounded-md bg-gray-200 animate-shimmer" 
              />
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <TextSkeleton size="sm" width="sm" />
            <HeadingSkeleton level={1} />
            <div className="flex items-center space-x-2">
              <TextSkeleton size="md" width="xs" />
              <TextSkeleton size="sm" width="xs" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <HeadingSkeleton level={2} />
            <TextSkeleton size="sm" width="xs" />
          </div>
          
          <TextSkeleton size="md" width="full" lines={3} />
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" 
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <Skeleton className="h-10 w-10 animate-pulse" />
              <Skeleton className="h-10 w-12 animate-pulse" />
              <Skeleton className="h-10 w-10 animate-pulse" />
            </div>
            
            <ButtonSkeleton size="lg" animation="pulse" />
          </div>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <TextSkeleton size="sm" width="sm" />
                <TextSkeleton size="sm" width="xs" />
              </div>
              <div className="flex justify-between">
                <TextSkeleton size="sm" width="md" />
                <TextSkeleton size="sm" width="xs" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-10">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger 
              value="details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
              disabled
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
              disabled
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
              disabled
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <div className="py-6 space-y-4">
            <TextSkeleton size="md" width="full" lines={4} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <TextSkeleton size="md" width="md" />
                      <TextSkeleton size="md" width="xs" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="mt-10">
        <HeadingSkeleton level={2} className="mb-6" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full rounded-t-lg bg-gray-200 animate-shimmer" />
                <div className="p-4 space-y-2">
                  <TextSkeleton size="md" width="md" />
                  <TextSkeleton size="sm" width="sm" />
                  <HeadingSkeleton level={3} />
                  <ButtonSkeleton size="sm" animation="pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
