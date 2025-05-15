"use client"

import { useState } from "react"
import { Check, ChevronDown, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Sorting options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "bestselling", label: "Best Selling" },
  { value: "distance", label: "Distance (Closest)" },
]

interface MarketplaceProductSortingProps {
  onSortChange: (sortOption: string) => void
  className?: string
}

export function MarketplaceProductSorting({ onSortChange, className }: MarketplaceProductSortingProps) {
  const [open, setOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("relevance")

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    onSortChange(value)
    setOpen(false)
  }

  // Get the label for the selected sort option
  const getSelectedSortLabel = () => {
    const option = sortOptions.find((option) => option.value === selectedSort)
    return option ? option.label : "Sort By"
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 transition-all duration-200 border-dill-green/20 ${selectedSort !== 'relevance' ? 'bg-dill-green/5 text-dill-green' : 'hover:border-dill-green hover:text-dill-green'}`}
          >
            <SortAsc className="mr-2 h-4 w-4" />
            {getSelectedSortLabel()}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 border-dill-green/20 shadow-md" align="start">
          <Command>
            <CommandInput placeholder="Search sort options..." className="border-b border-dill-green/15" />
            <CommandList>
              <CommandEmpty>No sort options found.</CommandEmpty>
              <CommandGroup>
                {sortOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSortChange(option.value)}
                    className={selectedSort === option.value ? 'bg-dill-green/5 text-dill-green font-medium' : ''}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSort === option.value ? "opacity-100 text-dill-green" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
