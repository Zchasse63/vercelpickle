"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DirectMessagingSkeleton() {
  return (
    <div className="border rounded-lg grid grid-cols-12 h-[600px]" data-testid="direct-messaging-skeleton">
      {/* Sidebar */}
      <div className="col-span-3 border-r">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="p-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-2 mb-2 rounded-md">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="col-span-9 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-auto space-y-4">
          {/* Received messages */}
          <div className="flex items-start space-x-2 max-w-[80%]">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <div className="bg-muted rounded-lg p-3">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48 mt-2" />
              </div>
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>

          {/* Sent messages */}
          <div className="flex items-start space-x-2 max-w-[80%] ml-auto flex-row-reverse">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <div className="bg-primary rounded-lg p-3">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-40 mt-2" />
              </div>
              <div className="flex justify-end mt-1">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>

          {/* Received messages */}
          <div className="flex items-start space-x-2 max-w-[80%]">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <div className="bg-muted rounded-lg p-3">
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>

          {/* Sent messages */}
          <div className="flex items-start space-x-2 max-w-[80%] ml-auto flex-row-reverse">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <div className="bg-primary rounded-lg p-3">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-52 mt-2" />
                <Skeleton className="h-4 w-48 mt-2" />
              </div>
              <div className="flex justify-end mt-1">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
