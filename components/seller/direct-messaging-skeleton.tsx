"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  TextSkeleton,
  AvatarSkeleton,
  InputSkeleton,
  ButtonSkeleton,
} from "@/components/ui/skeleton-elements";
import { skeletonArray } from "@/lib/styles/skeleton-styles";

export function DirectMessagingSkeleton() {
  return (
    <div className="border rounded-lg grid grid-cols-12 h-[600px]" data-testid="direct-messaging-skeleton">
      {/* Sidebar */}
      <div className="col-span-3 border-r">
        <div className="p-4 border-b">
          <InputSkeleton size="md" animation="pulse" />
        </div>
        <div className="p-2">
          {skeletonArray(8).map((item) => (
            <div key={item.id} className="p-2 mb-2 rounded-md">
              <div className="flex items-center space-x-3">
                <AvatarSkeleton size="md" animation="pulse" />
                <div className="space-y-1 flex-1">
                  <TextSkeleton size="sm" width="sm" />
                  <TextSkeleton size="xs" width="md" />
                </div>
                <TextSkeleton size="xs" width="xs" />
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
            <AvatarSkeleton size="md" animation="pulse" />
            <div>
              <TextSkeleton size="md" width="md" />
              <TextSkeleton size="xs" width="xs" className="mt-1" />
            </div>
          </div>
          <div className="flex space-x-2">
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-auto space-y-4">
          {/* Received messages */}
          <div className="flex items-start space-x-2 max-w-[80%]">
            <AvatarSkeleton size="sm" animation="pulse" />
            <div>
              <div className="bg-muted rounded-lg p-3">
                <TextSkeleton size="sm" width="xl" />
                <TextSkeleton size="sm" width="lg" className="mt-2" />
              </div>
              <TextSkeleton size="xs" width="xs" className="mt-1" />
            </div>
          </div>

          {/* Sent messages */}
          <div className="flex items-start space-x-2 max-w-[80%] ml-auto flex-row-reverse">
            <AvatarSkeleton size="sm" animation="pulse" />
            <div>
              <div className="bg-primary rounded-lg p-3">
                <TextSkeleton size="sm" width="xl" animation="shimmer" />
                <TextSkeleton size="sm" width="lg" className="mt-2" animation="shimmer" />
              </div>
              <div className="flex justify-end mt-1">
                <TextSkeleton size="xs" width="xs" />
              </div>
            </div>
          </div>

          {/* Received messages */}
          <div className="flex items-start space-x-2 max-w-[80%]">
            <AvatarSkeleton size="sm" animation="pulse" />
            <div>
              <div className="bg-muted rounded-lg p-3">
                <TextSkeleton size="sm" width="xxl" />
              </div>
              <TextSkeleton size="xs" width="xs" className="mt-1" />
            </div>
          </div>

          {/* Sent messages */}
          <div className="flex items-start space-x-2 max-w-[80%] ml-auto flex-row-reverse">
            <AvatarSkeleton size="sm" animation="pulse" />
            <div>
              <div className="bg-primary rounded-lg p-3">
                <TextSkeleton size="sm" width="xl" animation="shimmer" />
                <TextSkeleton size="sm" width="lg" className="mt-2" animation="shimmer" />
                <TextSkeleton size="sm" width="lg" className="mt-2" animation="shimmer" />
              </div>
              <div className="flex justify-end mt-1">
                <TextSkeleton size="xs" width="xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
            <InputSkeleton size="md" animation="pulse" />
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
            <ButtonSkeleton size="icon" shape="circle" animation="pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
