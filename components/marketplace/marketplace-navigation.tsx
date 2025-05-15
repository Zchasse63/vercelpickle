"use client"

import { usePathname } from "next/navigation"
import { SafeLink } from "@/components/ui/safe-link"
import { cn } from "@/lib/utils"

interface MarketplaceNavigationProps {
  className?: string
}

export function MarketplaceNavigation({ className }: MarketplaceNavigationProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/home",
      label: "Home",
      active: pathname === "/home",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      active: pathname === "/marketplace",
    },
    {
      href: "/marketplace/deals",
      label: "Deals",
      active: pathname === "/marketplace/deals",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ]

  return (
    <div className={cn("flex", className)} data-testid="navigation-links">
      {routes.map((route) => (
        <SafeLink
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
          data-testid={`nav-link-${route.label.toLowerCase()}`}
        >
          {route.label}
        </SafeLink>
      ))}
    </div>
  )
}
