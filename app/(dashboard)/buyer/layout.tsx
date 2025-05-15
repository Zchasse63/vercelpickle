"use client"

import type React from "react"
import { BuyerSidebar } from "@/components/buyer/buyer-sidebar"
import { BuyerHeader } from "@/components/buyer/buyer-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useEffect } from "react"

export default function BuyerLayout({
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
      <div className="buyer-layout flex min-h-screen">
        <BuyerSidebar />
        <div className="flex flex-col flex-1">
          <BuyerHeader />
          <SidebarInset className="flex-1 bg-gradient-to-b from-[#F1E5C3]/20 to-white relative w-full">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
            <div className="relative z-10 w-full mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
