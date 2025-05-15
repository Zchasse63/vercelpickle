import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Checkout Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dill-green text-white">
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-5 w-24 ml-2" />
              </div>
              <div className="flex-1 mx-4">
                <Skeleton className="h-1 w-full" />
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-5 w-24 ml-2" />
              </div>
              <div className="flex-1 mx-4">
                <Skeleton className="h-1 w-full" />
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-5 w-24 ml-2" />
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-4 w-64 mb-6" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20 sticky top-24">
            <Skeleton className="h-6 w-40 mb-4" />
            
            <div className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Skeleton className="h-px w-full" />
              
              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <Skeleton className="h-px w-full" />
              
              <div className="flex justify-between font-bold">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
