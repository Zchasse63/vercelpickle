"use client"

import { useState } from "react"
import { Check, ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for filters
const categories = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables" },
  { id: "dairy-eggs", name: "Dairy & Eggs" },
  { id: "bakery", name: "Bakery" },
  { id: "meat-seafood", name: "Meat & Seafood" },
  { id: "pantry", name: "Pantry" },
  { id: "beverages", name: "Beverages" },
]

const certifications = [
  { id: "organic", name: "Organic" },
  { id: "non-gmo", name: "Non-GMO" },
  { id: "fair-trade", name: "Fair Trade" },
  { id: "gluten-free", name: "Gluten-Free" },
  { id: "vegan", name: "Vegan" },
]

const origins = [
  { id: "local", name: "Local (< 100 miles)" },
  { id: "regional", name: "Regional (< 500 miles)" },
  { id: "domestic", name: "Domestic" },
  { id: "imported", name: "Imported" },
]

const sellerTypes = [
  { id: "farm", name: "Farm" },
  { id: "cooperative", name: "Cooperative" },
  { id: "distributor", name: "Distributor" },
  { id: "manufacturer", name: "Manufacturer" },
]

interface MarketplaceAdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void
  className?: string
}

interface FilterState {
  categories: string[]
  certifications: string[]
  origins: string[]
  sellerTypes: string[]
  priceRange: [number, number]
  inStock: boolean
  freeShipping: boolean
  bulkDiscount: boolean
}

export function MarketplaceAdvancedFilters({ onFilterChange, className }: MarketplaceAdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    certifications: [],
    origins: [],
    sellerTypes: [],
    priceRange: [0, 100],
    inStock: false,
    freeShipping: false,
    bulkDiscount: false,
  })

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Update filters and count active filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)

    // Count active filters
    let count = 0
    count += updatedFilters.categories.length
    count += updatedFilters.certifications.length
    count += updatedFilters.origins.length
    count += updatedFilters.sellerTypes.length
    if (updatedFilters.priceRange[0] > 0 || updatedFilters.priceRange[1] < 100) count++
    if (updatedFilters.inStock) count++
    if (updatedFilters.freeShipping) count++
    if (updatedFilters.bulkDiscount) count++

    setActiveFiltersCount(count)
  }

  // Reset all filters
  const resetFilters = () => {
    const resetState = {
      categories: [],
      certifications: [],
      origins: [],
      sellerTypes: [],
      priceRange: [0, 100] as [number, number],
      inStock: false,
      freeShipping: false,
      bulkDiscount: false,
    }
    setFilters(resetState)
    onFilterChange(resetState)
    setActiveFiltersCount(0)
  }

  // Toggle array item
  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 border-dashed transition-all duration-200 ${activeFiltersCount > 0 ? 'border-dill-green text-dill-green bg-dill-green/5' : 'hover:border-dill-green hover:text-dill-green'}`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-full px-1.5 font-normal bg-dill-green text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0 border-dill-green/20 shadow-md" align="start">
            <Card className="border-none">
              <CardHeader className="px-4 pb-0 pt-4 bg-gradient-to-r from-dill-green/5 to-dill-green/10 border-b border-dill-green/15">
                <CardTitle className="text-base text-dill-green flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </CardTitle>
                <CardDescription>
                  Narrow down products with filters
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-0 pt-2">
                <div className="space-y-4">
                  {/* Category filter */}
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className={`w-full justify-between border-dill-green/20 ${filters.categories.length > 0 ? 'bg-dill-green/5 text-dill-green' : ''}`}
                      >
                        {filters.categories.length > 0
                          ? `${filters.categories.length} categories selected`
                          : "Select categories"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 border-dill-green/20 shadow-md">
                      <Command>
                        <CommandInput placeholder="Search categories..." className="border-b border-dill-green/15" />
                        <CommandList>
                          <CommandEmpty>No categories found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.id}
                                onSelect={() => {
                                  updateFilters({
                                    categories: toggleArrayItem(filters.categories, category.id),
                                  })
                                }}
                                className={filters.categories.includes(category.id) ? 'bg-dill-green/5 text-dill-green font-medium' : ''}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    filters.categories.includes(category.id)
                                      ? "opacity-100 text-dill-green"
                                      : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Certifications */}
                  <Collapsible className="space-y-2">
                    <div className="flex items-center justify-between border-b border-dill-green/10 pb-1">
                      <h4 className="text-sm font-medium text-dill-green">Certifications</h4>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-dill-green">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2 pt-1">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-dill-green/5 transition-colors">
                          <Checkbox
                            id={`cert-${cert.id}`}
                            checked={filters.certifications.includes(cert.id)}
                            onCheckedChange={(checked) => {
                              updateFilters({
                                certifications: checked
                                  ? [...filters.certifications, cert.id]
                                  : filters.certifications.filter((id) => id !== cert.id),
                              })
                            }}
                            className={filters.certifications.includes(cert.id) ? 'text-dill-green border-dill-green' : ''}
                          />
                          <label
                            htmlFor={`cert-${cert.id}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${filters.certifications.includes(cert.id) ? 'text-dill-green' : ''}`}
                          >
                            {cert.name}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-dill-green/10 pb-1">
                      <h4 className="text-sm font-medium text-dill-green">Price Range</h4>
                      <div className="text-xs font-medium text-dill-green">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </div>
                    </div>
                    <div className="px-2 pt-2">
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={1}
                        value={filters.priceRange}
                        onValueChange={(value) => {
                          updateFilters({ priceRange: value as [number, number] })
                        }}
                        className="py-4"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">$0</span>
                        <span className="text-xs text-muted-foreground">$100</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional filters */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-dill-green/10 pb-1">
                      <h4 className="text-sm font-medium text-dill-green">Additional Filters</h4>
                    </div>
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-dill-green/5 transition-colors">
                        <Checkbox
                          id="in-stock"
                          checked={filters.inStock}
                          onCheckedChange={(checked) => {
                            updateFilters({ inStock: !!checked })
                          }}
                          className={filters.inStock ? 'text-dill-green border-dill-green' : ''}
                        />
                        <label
                          htmlFor="in-stock"
                          className={`text-sm font-medium leading-none ${filters.inStock ? 'text-dill-green' : ''}`}
                        >
                          In Stock Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-dill-green/5 transition-colors">
                        <Checkbox
                          id="free-shipping"
                          checked={filters.freeShipping}
                          onCheckedChange={(checked) => {
                            updateFilters({ freeShipping: !!checked })
                          }}
                          className={filters.freeShipping ? 'text-dill-green border-dill-green' : ''}
                        />
                        <label
                          htmlFor="free-shipping"
                          className={`text-sm font-medium leading-none ${filters.freeShipping ? 'text-dill-green' : ''}`}
                        >
                          Free Shipping
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-dill-green/5 transition-colors">
                        <Checkbox
                          id="bulk-discount"
                          checked={filters.bulkDiscount}
                          onCheckedChange={(checked) => {
                            updateFilters({ bulkDiscount: !!checked })
                          }}
                          className={filters.bulkDiscount ? 'text-dill-green border-dill-green' : ''}
                        />
                        <label
                          htmlFor="bulk-discount"
                          className={`text-sm font-medium leading-none ${filters.bulkDiscount ? 'text-dill-green' : ''}`}
                        >
                          Bulk Discount Available
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between px-4 pb-4 pt-2 bg-gradient-to-r from-dill-green/5 to-dill-green/10 border-t border-dill-green/15">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="border-dill-green/20 hover:bg-dill-green/10 hover:text-dill-green transition-colors"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => onFilterChange(filters)}
                  className="bg-dill-green hover:bg-dill-green/90 transition-colors"
                >
                  Apply Filters
                </Button>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.categories.length > 0 && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 animate-fade-in border-dill-green/20 bg-dill-green/5 text-dill-green hover:bg-dill-green/10 transition-colors"
              >
                Categories: {filters.categories.length}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:text-red-500"
                  onClick={() => updateFilters({ categories: [] })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {filters.certifications.length > 0 && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 animate-fade-in border-dill-green/20 bg-dill-green/5 text-dill-green hover:bg-dill-green/10 transition-colors"
              >
                Certifications: {filters.certifications.length}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:text-red-500"
                  onClick={() => updateFilters({ certifications: [] })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 animate-fade-in border-dill-green/20 bg-dill-green/5 text-dill-green hover:bg-dill-green/10 transition-colors"
              >
                Price: ${filters.priceRange[0]}-${filters.priceRange[1]}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:text-red-500"
                  onClick={() => updateFilters({ priceRange: [0, 100] })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {filters.inStock && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 animate-fade-in border-dill-green/20 bg-dill-green/5 text-dill-green hover:bg-dill-green/10 transition-colors"
              >
                In Stock
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:text-red-500"
                  onClick={() => updateFilters({ inStock: false })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {filters.freeShipping && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 animate-fade-in border-dill-green/20 bg-dill-green/5 text-dill-green hover:bg-dill-green/10 transition-colors"
              >
                Free Shipping
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:text-red-500"
                  onClick={() => updateFilters({ freeShipping: false })}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs border-dill-green/20 text-dill-green hover:bg-dill-green/10 transition-colors"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
