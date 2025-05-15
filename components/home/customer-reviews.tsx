"use client";

import { Card, CardContent } from "@/components/ui/card";

/**
 * Customer reviews component for the home page
 * Displays customer testimonials in a grid layout
 */
export function CustomerReviews() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#F1E5C3]/10" data-testid="customer-reviews">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#194D33]">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Hear from businesses that have transformed their food sourcing with Pickle
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-[#F3B522]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-muted-foreground italic mb-4">
                "Pickle has completely transformed how we source ingredients for our restaurant. The quality is exceptional and the ordering process is seamless."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                  JD
                </div>
                <div>
                  <p className="font-medium text-[#194D33]">John Doe</p>
                  <p className="text-xs text-muted-foreground">Executive Chef, Farm to Table</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review 2 */}
          <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-[#F3B522]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-muted-foreground italic mb-4">
                "We've been able to connect with local suppliers and reduce our carbon footprint while maintaining the highest quality standards. Pickle makes it easy."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                  JS
                </div>
                <div>
                  <p className="font-medium text-[#194D33]">Jane Smith</p>
                  <p className="text-xs text-muted-foreground">Procurement Manager, Green Eats Co.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review 3 */}
          <Card className="hover-lift shadow-sm" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-[#F3B522]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-muted-foreground italic mb-4">
                "The variety of specialty products available on Pickle has allowed us to create unique menu offerings that set us apart from competitors."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#5A9A3D]/20 flex items-center justify-center text-[#5A9A3D] font-bold mr-3">
                  RJ
                </div>
                <div>
                  <p className="font-medium text-[#194D33]">Robert Johnson</p>
                  <p className="text-xs text-muted-foreground">Owner, Culinary Innovations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;
