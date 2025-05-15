"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { AdminSearch } from "@/components/admin/admin-search"
import { AdminNotifications } from "@/components/admin/admin-notifications"
import { UserNav } from "@/components/admin/user-nav"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AdminHeaderProps {
  toggleSidebar?: () => void
}

export function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6" data-testid="admin-header">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        data-testid="toggle-sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-bold text-xl">Pickle</span>
          <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:block">
          <AdminSearch />
        </div>
        <div className="flex items-center gap-2">
          <AdminNotifications id="header" />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
