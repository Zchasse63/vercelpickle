import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface ProductQuickViewSkeletonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickViewSkeleton({ open, onOpenChange }: ProductQuickViewSkeletonProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image Skeleton */}
          <div className="relative aspect-square bg-white">
            <Skeleton className="h-full w-full" />
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="p-6 flex flex-col h-full border-l border-dill-green/10">
            <div className="pb-2">
              <Skeleton className="h-7 w-3/4 mb-4" />
              <div className="mt-2 flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="flex-1 overflow-auto max-h-[350px] pr-2 space-y-5">
              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Features Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Specifications Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              {/* Shipping Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <Skeleton className="h-5 w-16 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
                <div className="flex-1">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="flex justify-center">
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
