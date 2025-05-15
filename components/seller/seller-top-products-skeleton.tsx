import { Skeleton } from "@/components/ui/skeleton"

interface SellerTopProductsSkeletonProps {
  rowCount?: number
}

export function SellerTopProductsSkeleton({ rowCount = 5 }: SellerTopProductsSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      
      <div className="space-y-4">
        {Array(rowCount).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-2 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-16 ml-auto mb-1" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
