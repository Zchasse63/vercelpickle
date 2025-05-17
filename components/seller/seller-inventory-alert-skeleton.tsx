import { Skeleton } from "@/components/ui/skeleton"

interface SellerInventoryAlertSkeletonProps {
  itemCount?: number
}

export function SellerInventoryAlertSkeleton({ itemCount = 4 }: SellerInventoryAlertSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      
      <div className="space-y-4">
        {Array(itemCount).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
