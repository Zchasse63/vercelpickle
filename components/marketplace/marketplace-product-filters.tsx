"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"

interface MarketplaceProductFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export function MarketplaceProductFilters({ onFilterChange }: MarketplaceProductFiltersProps) {
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);

  // New state for dietary filters
  const [dietaryFilters, setDietaryFilters] = useState({
    organic: false,
    glutenFree: false,
    lactoseFree: false,
    vegan: false,
    vegetarian: false,
    nonGMO: false,
  });

  // New state for environmental filters
  const [environmentalFilters, setEnvironmentalFilters] = useState({
    ecofriendly: false,
    compostable: false,
    biodegradable: false,
    recyclable: false,
  });

  // New state for origin filters
  const [originFilters, setOriginFilters] = useState<string[]>([]);

  // New state for inventory filter
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch data from the backend with error handling
  let allCategories;
  let allCertifications;
  let allSellers;
  let allOrigins;

  try {
    allCategories = useQuery(api.products.getAllCategories);
    allCertifications = useQuery(api.products.getAllCertifications);
    allSellers = useQuery(api.users.getSellers);
    allOrigins = useQuery(api.products.getAllOrigins);
  } catch (error) {
    console.error("Error fetching filter data from Convex:", error);
    // Set default values
    allCategories = undefined;
    allCertifications = undefined;
    allSellers = undefined;
    allOrigins = undefined;
  }

  // Function to apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      // Create dietary object with only true values
      const dietary: Record<string, boolean> = {};
      Object.entries(dietaryFilters).forEach(([key, value]) => {
        if (value) dietary[key] = true;
      });

      // Create environmental object with only true values
      const environmental: Record<string, boolean> = {};
      Object.entries(environmentalFilters).forEach(([key, value]) => {
        if (value) environmental[key] = true;
      });

      const filters = {
        categories: selectedCategories,
        certifications: selectedCertifications,
        sellers: selectedSellers,
        priceRange: {
          min: priceRange.min ? parseFloat(priceRange.min) : undefined,
          max: priceRange.max ? parseFloat(priceRange.max) : undefined,
        },
        dietary: Object.keys(dietary).length > 0 ? dietary : undefined,
        environmental: Object.keys(environmental).length > 0 ? environmental : undefined,
        origins: originFilters.length > 0 ? originFilters : undefined,
        inStock: inStockOnly || undefined,
      };

      onFilterChange(filters);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedCertifications([]);
    setSelectedSellers([]);
    setPriceRange({ min: "", max: "" });
    setDietaryFilters({
      organic: false,
      glutenFree: false,
      lactoseFree: false,
      vegan: false,
      vegetarian: false,
      nonGMO: false,
    });
    setEnvironmentalFilters({
      ecofriendly: false,
      compostable: false,
      biodegradable: false,
      recyclable: false,
    });
    setOriginFilters([]);
    setInStockOnly(false);

    if (onFilterChange) {
      onFilterChange({
        categories: [],
        certifications: [],
        sellers: [],
        priceRange: { min: undefined, max: undefined },
        dietary: undefined,
        environmental: undefined,
        origins: undefined,
        inStock: undefined,
      });
    }
  };

  // Update filters when selections change
  useEffect(() => {
    applyFilters();
  }, [
    selectedCategories,
    selectedCertifications,
    selectedSellers,
    priceRange,
    dietaryFilters,
    environmentalFilters,
    originFilters,
    inStockOnly
  ]);

  // Transform categories to the format expected by the UI
  const categories = allCategories
    ? allCategories.map(category => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        label: category
      }))
    : [];

  // If categories are still loading or empty, show default categories
  const displayCategories = categories.length > 0
    ? categories
    : [
        { id: "fruits-vegetables", label: "Fruits & Vegetables" },
        { id: "dairy-eggs", label: "Dairy & Eggs" },
        { id: "bakery", label: "Bakery" },
        { id: "meat-seafood", label: "Meat & Seafood" },
        { id: "beverages", label: "Beverages" },
        { id: "pantry", label: "Pantry & Dry Goods" },
      ];

  // Transform certifications to the format expected by the UI
  const certifications = allCertifications && allCertifications.length > 0
    ? allCertifications.map(cert => ({
        id: cert.toLowerCase().replace(/\s+/g, '-'),
        label: cert
      }))
    : [
        { id: "organic", label: "Organic" },
        { id: "non-gmo", label: "Non-GMO" },
        { id: "fair-trade", label: "Fair Trade" },
        { id: "gluten-free", label: "Gluten-Free" },
        { id: "vegan", label: "Vegan" },
      ];

  // Transform sellers to the format expected by the UI
  const sellers = allSellers && allSellers.length > 0
    ? allSellers.map(seller => ({
        id: seller._id,
        label: seller.businessName || seller.name
      }))
    : [
        { id: "green-farms", label: "Green Farms" },
        { id: "dairy-delights", label: "Dairy Delights" },
        { id: "bakers-haven", label: "Baker's Haven" },
        { id: "farm-fresh", label: "Farm Fresh Produce" },
        { id: "cheese-crafters", label: "Cheese Crafters" },
      ];

  // Handle checkbox changes
  const handleCategoryChange = (id: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleCertificationChange = (id: string, checked: boolean) => {
    setSelectedCertifications(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSellerChange = (id: string, checked: boolean) => {
    setSelectedSellers(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const FilterSection = ({
    title,
    items,
    selectedItems,
    onItemChange
  }: {
    title: string;
    items: { id: string; label: string }[];
    selectedItems: string[];
    onItemChange: (id: string, checked: boolean) => void;
  }) => (
    <div className="space-y-4" data-testid={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="font-medium">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2" data-testid={`filter-item-${item.id}`}>
            <Checkbox
              id={item.id}
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked) => onItemChange(item.id, !!checked)}
              data-testid={`filter-checkbox-${item.id}`}
            />
            <Label htmlFor={item.id} className="text-sm font-normal">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )

  // Handle dietary filter changes
  const handleDietaryChange = (key: string, checked: boolean) => {
    setDietaryFilters(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // Handle environmental filter changes
  const handleEnvironmentalChange = (key: string, checked: boolean) => {
    setEnvironmentalFilters(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // Handle origin filter changes
  const handleOriginChange = (id: string, checked: boolean) => {
    setOriginFilters(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  // Transform origins to the format expected by the UI
  const origins = allOrigins && allOrigins.length > 0
    ? allOrigins.map(origin => ({
        id: origin.toLowerCase().replace(/\s+/g, '-'),
        label: origin
      }))
    : [
        { id: "usa", label: "USA" },
        { id: "local", label: "Local" },
        { id: "imported", label: "Imported" },
        { id: "california", label: "California" },
        { id: "new-york", label: "New York" },
        { id: "florida", label: "Florida" },
      ];

  const FiltersContent = () => (
    <div className="space-y-6">
      <div data-testid="category-filter">
        <FilterSection
          title="Categories"
          items={displayCategories}
          selectedItems={selectedCategories}
          onItemChange={handleCategoryChange}
        />
      </div>
      <Separator />
      <div className="space-y-4" data-testid="price-range-filter">
        <h3 className="font-medium">Price Range</h3>
        <div className="flex items-center space-x-2">
          <div className="grid gap-1.5">
            <Label htmlFor="price-min" className="text-sm font-normal">
              Min
            </Label>
            <Input
              id="price-min"
              placeholder="$0"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="h-8"
              data-testid="price-min-input"
            />
          </div>
          <span className="mt-5">-</span>
          <div className="grid gap-1.5">
            <Label htmlFor="price-max" className="text-sm font-normal">
              Max
            </Label>
            <Input
              id="price-max"
              placeholder="$100"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="h-8"
              data-testid="price-max-input"
            />
          </div>
        </div>
      </div>
      <Separator />

      {/* Dietary Filters */}
      <div className="space-y-4" data-testid="dietary-filter">
        <h3 className="font-medium">Dietary Preferences</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2" data-testid="filter-item-organic">
            <Checkbox
              id="organic"
              checked={dietaryFilters.organic}
              onCheckedChange={(checked) => handleDietaryChange("organic", !!checked)}
              data-testid="filter-checkbox-organic"
            />
            <Label htmlFor="organic" className="text-sm font-normal">
              Organic
            </Label>
          </div>
          <div className="flex items-center space-x-2" data-testid="filter-item-gluten-free">
            <Checkbox
              id="glutenFree"
              checked={dietaryFilters.glutenFree}
              onCheckedChange={(checked) => handleDietaryChange("glutenFree", !!checked)}
              data-testid="filter-checkbox-gluten-free"
            />
            <Label htmlFor="glutenFree" className="text-sm font-normal">
              Gluten-Free
            </Label>
          </div>
          <div className="flex items-center space-x-2" data-testid="filter-item-lactose-free">
            <Checkbox
              id="lactoseFree"
              checked={dietaryFilters.lactoseFree}
              onCheckedChange={(checked) => handleDietaryChange("lactoseFree", !!checked)}
              data-testid="filter-checkbox-lactose-free"
            />
            <Label htmlFor="lactoseFree" className="text-sm font-normal">
              Lactose-Free
            </Label>
          </div>
          <div className="flex items-center space-x-2" data-testid="filter-item-vegan">
            <Checkbox
              id="vegan"
              checked={dietaryFilters.vegan}
              onCheckedChange={(checked) => handleDietaryChange("vegan", !!checked)}
              data-testid="filter-checkbox-vegan"
            />
            <Label htmlFor="vegan" className="text-sm font-normal">
              Vegan
            </Label>
          </div>
          <div className="flex items-center space-x-2" data-testid="filter-item-vegetarian">
            <Checkbox
              id="vegetarian"
              checked={dietaryFilters.vegetarian}
              onCheckedChange={(checked) => handleDietaryChange("vegetarian", !!checked)}
              data-testid="filter-checkbox-vegetarian"
            />
            <Label htmlFor="vegetarian" className="text-sm font-normal">
              Vegetarian
            </Label>
          </div>
          <div className="flex items-center space-x-2" data-testid="filter-item-non-gmo">
            <Checkbox
              id="nonGMO"
              checked={dietaryFilters.nonGMO}
              onCheckedChange={(checked) => handleDietaryChange("nonGMO", !!checked)}
              data-testid="filter-checkbox-non-gmo"
            />
            <Label htmlFor="nonGMO" className="text-sm font-normal">
              Non-GMO
            </Label>
          </div>
        </div>
      </div>
      <Separator />

      {/* Environmental Filters */}
      <div className="space-y-4">
        <h3 className="font-medium">Environmental</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ecofriendly"
              checked={environmentalFilters.ecofriendly}
              onCheckedChange={(checked) => handleEnvironmentalChange("ecofriendly", !!checked)}
            />
            <Label htmlFor="ecofriendly" className="text-sm font-normal">
              Eco-Friendly
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="compostable"
              checked={environmentalFilters.compostable}
              onCheckedChange={(checked) => handleEnvironmentalChange("compostable", !!checked)}
            />
            <Label htmlFor="compostable" className="text-sm font-normal">
              Compostable
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="biodegradable"
              checked={environmentalFilters.biodegradable}
              onCheckedChange={(checked) => handleEnvironmentalChange("biodegradable", !!checked)}
            />
            <Label htmlFor="biodegradable" className="text-sm font-normal">
              Biodegradable
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="recyclable"
              checked={environmentalFilters.recyclable}
              onCheckedChange={(checked) => handleEnvironmentalChange("recyclable", !!checked)}
            />
            <Label htmlFor="recyclable" className="text-sm font-normal">
              Recyclable
            </Label>
          </div>
        </div>
      </div>
      <Separator />

      {/* Origin Filters */}
      <FilterSection
        title="Origin"
        items={origins}
        selectedItems={originFilters}
        onItemChange={handleOriginChange}
      />
      <Separator />

      {/* Inventory Filter */}
      <div className="space-y-4">
        <h3 className="font-medium">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(!!checked)}
          />
          <Label htmlFor="inStock" className="text-sm font-normal">
            In Stock Only
          </Label>
        </div>
      </div>
      <Separator />

      <FilterSection
        title="Certifications"
        items={certifications}
        selectedItems={selectedCertifications}
        onItemChange={handleCertificationChange}
      />
      <Separator />
      <FilterSection
        title="Sellers"
        items={sellers}
        selectedItems={selectedSellers}
        onItemChange={handleSellerChange}
      />
    </div>
  )

  return (
    <>
      <div className="hidden lg:block" data-testid="desktop-filters">
        <FiltersContent />
        <div className="mt-6 space-x-2">
          <Button variant="outline" size="sm" onClick={resetFilters} data-testid="reset-filters-button">
            Reset Filters
          </Button>
          <Button size="sm" onClick={applyFilters} data-testid="apply-filters-button">
            Apply Filters
          </Button>
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <Accordion type="multiple" className="mt-4 w-full">
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {allCategories === undefined ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    displayCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                        />
                        <Label htmlFor={`mobile-${category.id}`} className="text-sm font-normal">
                          {category.label}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2 pt-1">
                  <div className="grid gap-1.5">
                    <Label htmlFor="mobile-price-min" className="text-sm font-normal">
                      Min
                    </Label>
                    <Input
                      id="mobile-price-min"
                      placeholder="$0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <span className="mt-5">-</span>
                  <div className="grid gap-1.5">
                    <Label htmlFor="mobile-price-max" className="text-sm font-normal">
                      Max
                    </Label>
                    <Input
                      id="mobile-price-max"
                      placeholder="$100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="h-8"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dietary Filters */}
            <AccordionItem value="dietary">
              <AccordionTrigger>Dietary Preferences</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-organic"
                      checked={dietaryFilters.organic}
                      onCheckedChange={(checked) => handleDietaryChange("organic", !!checked)}
                    />
                    <Label htmlFor="mobile-organic" className="text-sm font-normal">
                      Organic
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-glutenFree"
                      checked={dietaryFilters.glutenFree}
                      onCheckedChange={(checked) => handleDietaryChange("glutenFree", !!checked)}
                    />
                    <Label htmlFor="mobile-glutenFree" className="text-sm font-normal">
                      Gluten-Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-lactoseFree"
                      checked={dietaryFilters.lactoseFree}
                      onCheckedChange={(checked) => handleDietaryChange("lactoseFree", !!checked)}
                    />
                    <Label htmlFor="mobile-lactoseFree" className="text-sm font-normal">
                      Lactose-Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-vegan"
                      checked={dietaryFilters.vegan}
                      onCheckedChange={(checked) => handleDietaryChange("vegan", !!checked)}
                    />
                    <Label htmlFor="mobile-vegan" className="text-sm font-normal">
                      Vegan
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-vegetarian"
                      checked={dietaryFilters.vegetarian}
                      onCheckedChange={(checked) => handleDietaryChange("vegetarian", !!checked)}
                    />
                    <Label htmlFor="mobile-vegetarian" className="text-sm font-normal">
                      Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-nonGMO"
                      checked={dietaryFilters.nonGMO}
                      onCheckedChange={(checked) => handleDietaryChange("nonGMO", !!checked)}
                    />
                    <Label htmlFor="mobile-nonGMO" className="text-sm font-normal">
                      Non-GMO
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Environmental Filters */}
            <AccordionItem value="environmental">
              <AccordionTrigger>Environmental</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-ecofriendly"
                      checked={environmentalFilters.ecofriendly}
                      onCheckedChange={(checked) => handleEnvironmentalChange("ecofriendly", !!checked)}
                    />
                    <Label htmlFor="mobile-ecofriendly" className="text-sm font-normal">
                      Eco-Friendly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-compostable"
                      checked={environmentalFilters.compostable}
                      onCheckedChange={(checked) => handleEnvironmentalChange("compostable", !!checked)}
                    />
                    <Label htmlFor="mobile-compostable" className="text-sm font-normal">
                      Compostable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-biodegradable"
                      checked={environmentalFilters.biodegradable}
                      onCheckedChange={(checked) => handleEnvironmentalChange("biodegradable", !!checked)}
                    />
                    <Label htmlFor="mobile-biodegradable" className="text-sm font-normal">
                      Biodegradable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-recyclable"
                      checked={environmentalFilters.recyclable}
                      onCheckedChange={(checked) => handleEnvironmentalChange("recyclable", !!checked)}
                    />
                    <Label htmlFor="mobile-recyclable" className="text-sm font-normal">
                      Recyclable
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Origin Filters */}
            <AccordionItem value="origin">
              <AccordionTrigger>Origin</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {origins.map((origin) => (
                    <div key={origin.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-origin-${origin.id}`}
                        checked={originFilters.includes(origin.id)}
                        onCheckedChange={(checked) => handleOriginChange(origin.id, !!checked)}
                      />
                      <Label htmlFor={`mobile-origin-${origin.id}`} className="text-sm font-normal">
                        {origin.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Availability Filter */}
            <AccordionItem value="availability">
              <AccordionTrigger>Availability</AccordionTrigger>
              <AccordionContent>
                <div className="pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-inStock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    />
                    <Label htmlFor="mobile-inStock" className="text-sm font-normal">
                      In Stock Only
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="certifications">
              <AccordionTrigger>Certifications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {allCertifications === undefined ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    certifications.map((certification) => (
                      <div key={certification.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${certification.id}`}
                          checked={selectedCertifications.includes(certification.id)}
                          onCheckedChange={(checked) => handleCertificationChange(certification.id, !!checked)}
                        />
                        <Label htmlFor={`mobile-${certification.id}`} className="text-sm font-normal">
                          {certification.label}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sellers">
              <AccordionTrigger>Sellers</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {allSellers === undefined ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    sellers.map((seller) => (
                      <div key={seller.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${seller.id}`}
                          checked={selectedSellers.includes(seller.id)}
                          onCheckedChange={(checked) => handleSellerChange(seller.id, !!checked)}
                        />
                        <Label htmlFor={`mobile-${seller.id}`} className="text-sm font-normal">
                          {seller.label}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-6 space-x-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
