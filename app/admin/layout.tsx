"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/providers/theme-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Add effect to ensure content-type is properly set
  useEffect(() => {
    // This is a client-side effect that runs after hydration
    // It helps ensure the page is properly rendered
    document.documentElement.style.visibility = 'visible';
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="admin-layout flex min-h-screen w-full flex-col" data-testid="admin-layout">
          <AdminHeader toggleSidebar={toggleSidebar} />
          <div className="flex flex-1">
            <AdminSidebar />
            <SidebarInset className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F1E5C3]/20 to-white relative w-full" data-testid="admin-content">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
              <div className="relative z-10 w-full mx-auto p-4 md:p-6 max-w-full">
                {children}
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
