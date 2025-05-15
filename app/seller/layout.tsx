"use client"

import type React from "react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { SellerHeader } from "@/components/seller/seller-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useEffect } from "react"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add effect to ensure content-type is properly set
  useEffect(() => {
    // This is a client-side effect that runs after hydration
    // It helps ensure the page is properly rendered
    document.documentElement.style.visibility = 'visible';
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="seller-layout flex min-h-screen" data-testid="seller-layout">
        <SellerSidebar />
        <div className="flex flex-1 flex-col">
          <SellerHeader />
          <SidebarInset className="flex-1 bg-gradient-to-b from-[#F1E5C3]/20 to-white relative w-full" data-testid="seller-content">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
            <div className="relative z-10 w-full mx-auto p-6 max-w-full">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
