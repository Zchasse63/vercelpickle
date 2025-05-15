"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TextSkeleton } from "@/components/ui/skeleton-elements";

export default function AuthLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      
      <div className="flex justify-between pt-4">
        <TextSkeleton size="sm" width="sm" />
        <TextSkeleton size="sm" width="sm" />
      </div>
    </div>
  );
}
