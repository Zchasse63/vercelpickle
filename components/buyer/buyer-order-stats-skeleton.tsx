import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function BuyerOrderStatsSkeleton() {
  return (
    <>
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-12" />
          <div className="flex items-center text-xs mt-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-12" />
          <div className="flex items-center text-xs mt-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-12" />
          <div className="flex items-center text-xs mt-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-12" />
          <div className="flex items-center text-xs mt-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
