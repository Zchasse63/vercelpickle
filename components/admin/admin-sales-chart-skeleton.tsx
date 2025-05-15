import { Skeleton } from "@/components/ui/skeleton"

export function AdminSalesChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Skeleton className="w-full h-full min-h-[300px] rounded-md" />
    </div>
  )
}
