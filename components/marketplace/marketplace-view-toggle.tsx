"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list"

interface MarketplaceViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
  className?: string
}

export function MarketplaceViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: MarketplaceViewToggleProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
        className="border border-dill-green/20 rounded-md overflow-hidden"
      >
        <ToggleGroupItem
          value="grid"
          aria-label="Grid view"
          className={`transition-all duration-200 ${viewMode === 'grid' ? 'bg-dill-green text-white' : 'hover:bg-dill-green/10 hover:text-dill-green'}`}
        >
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          aria-label="List view"
          className={`transition-all duration-200 ${viewMode === 'list' ? 'bg-dill-green text-white' : 'hover:bg-dill-green/10 hover:text-dill-green'}`}
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
