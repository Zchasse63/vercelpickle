import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ProductCardSkeletonProps {
  className?: string
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <Card
      className={`${className} border border-dill-green/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}
      data-testid="product-card-skeleton"
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
          <Skeleton className="h-full w-full" />
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 flex-grow">
        <div className="mb-1">
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="mt-0.5">
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="p-2.5 pt-0 flex flex-col gap-1.5 mt-auto">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
