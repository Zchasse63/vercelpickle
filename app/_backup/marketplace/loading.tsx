import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplaceLoading() {
  return (
    <div className="w-full py-8 md:py-12">
      <div className="flex flex-col gap-2 max-w-[1920px] mx-auto px-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
      </div>

      <div className="mt-8 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-6 px-4 xl:px-8">
        {/* Left Sidebar - Filters */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Main Content - Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-dill-green/20">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-dill-green/10 hover:shadow-lg transition-shadow duration-200">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Persistent Cart */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-px w-full my-2" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-px w-full my-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
