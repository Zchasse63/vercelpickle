import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <Skeleton className="h-1 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-10 w-full" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
