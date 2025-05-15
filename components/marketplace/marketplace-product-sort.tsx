"use client"

import { SortAsc, SortDesc } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MarketplaceProductSort() {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <strong>248</strong> products
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto flex gap-1">
            <SortAsc className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <SortAsc className="mr-2 h-4 w-4" />
            <span>Price: Low to High</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SortDesc className="mr-2 h-4 w-4" />
            <span>Price: High to Low</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SortDesc className="mr-2 h-4 w-4" />
            <span>Newest First</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SortDesc className="mr-2 h-4 w-4" />
            <span>Best Rated</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SortDesc className="mr-2 h-4 w-4" />
            <span>Most Popular</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
