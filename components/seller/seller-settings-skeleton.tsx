"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui-kit";

interface SellerSettingsSkeletonProps {
  type: "profile" | "store" | "payment" | "notifications";
}

export function SellerSettingsSkeleton({ type }: SellerSettingsSkeletonProps) {
  return (
    <div className="space-y-6" data-testid={`seller-${type}-settings-skeleton`}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {type === "profile" && (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full" />
              </div>
            </>
          )}

          {type === "store" && (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </>
          )}

          {type === "payment" && (
            <>
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                <div className="border rounded-lg p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </>
          )}

          {type === "notifications" && (
            <>
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}
