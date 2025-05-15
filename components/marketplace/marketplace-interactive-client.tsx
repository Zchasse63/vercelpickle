"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MarketplaceProductFilters } from "@/components/marketplace/marketplace-product-filters"
import {
  MarketplaceAdvancedFiltersLazy,
  MarketplaceProductSortingLazy,
  MarketplaceProductComparisonLazy,
  VirtualizedProductGridLazy,
  preloadMarketplaceComponents
} from "@/components/marketplace/lazy-marketplace-components-with-suffix"
import { MarketplaceViewToggle, ViewMode } from "@/components/marketplace/marketplace-view-toggle"
import { MarketplacePersistentCart } from "@/components/marketplace/marketplace-persistent-cart"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface MarketplaceInteractiveClientProps {
  initialProducts: any[]
  categories: any[]
}

export function MarketplaceInteractiveClient({
  initialProducts,
  categories
}: MarketplaceInteractiveClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortOption, setSortOption] = useState("relevance")
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonProducts, setComparisonProducts] = useState<any[]>([])
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [filters, setFilters] = useState<any>({})

  // Preload marketplace components when the component mounts
  useEffect(() => {
    // Preload all marketplace components after a short delay
    const timer = setTimeout(() => {
      preloadMarketplaceComponents();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get the authenticated user
  const { user } = useAuth();

  // Use the toast hook
  const { toast } = useToast();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    certifications: [] as string[],
    sellers: [] as string[],
    priceRange: { min: undefined as number | undefined, max: undefined as number | undefined },
    inStock: false,
    freeShipping: false,
    bulkDiscount: false,
    dietary: {} as Record<string, boolean>,
    environmental: {} as Record<string, boolean>,
    origins: [] as string[],
  });

  // State for sorting
  const [sortParams, setSortParams] = useState({
    sortBy: undefined as string | undefined,
    sortOrder: "asc" as "asc" | "desc",
  });

  // Prepare query parameters
  const queryParams: any = useMemo(() => {
    const params: any = {};

    // Add category filter if only one category is selected
    if (activeFilters.categories.length === 1) {
      params.category = activeFilters.categories[0];
    }

    // Add price range filters
    if (activeFilters.priceRange.min !== undefined) {
      params.minPrice = activeFilters.priceRange.min;
    }

    if (activeFilters.priceRange.max !== undefined) {
      params.maxPrice = activeFilters.priceRange.max;
    }

    // Add sorting parameters
    if (sortParams.sortBy) {
      params.sortBy = sortParams.sortBy;
      params.sortOrder = sortParams.sortOrder;
    }

    // Add dietary filters
    if (Object.keys(activeFilters.dietary).length > 0) {
      params.dietary = activeFilters.dietary;
    }

    // Add environmental filters
    if (Object.keys(activeFilters.environmental).length > 0) {
      params.environmental = activeFilters.environmental;
    }

    // Add origin filters
    if (activeFilters.origins.length > 0) {
      params.origin = {
        country: activeFilters.origins[0] // For now, just use the first origin
      };
    }

    // Add inventory filter
    if (activeFilters.inStock) {
      params.inStock = true;
    }

    return params;
  }, [activeFilters, sortParams]);

  // Fetch products from Convex with filters
  const products = useQuery(api.products.getAll, queryParams) || initialProducts;

  // Fetch sellers from Convex
  const sellers = useQuery(api.users.getSellers, {}) || [];

  // Apply client-side filtering for multiple categories, certifications, and sellers
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter(product => {
      // Filter by multiple categories if needed
      if (activeFilters.categories.length > 0 &&
          !activeFilters.categories.includes(product.category)) {
        return false;
      }

      // Filter by certifications
      if (activeFilters.certifications.length > 0) {
        const productCerts = product.certifications || [];
        if (!activeFilters.certifications.some(cert => productCerts.includes(cert))) {
          return false;
        }
      }

      // Filter by origins (if not already filtered by the server)
      if (activeFilters.origins.length > 1) { // More than one origin selected
        const productOrigin = product.origin?.country || product.origin?.region || '';
        if (!activeFilters.origins.some(origin =>
          productOrigin.toLowerCase().includes(origin.toLowerCase())
        )) {
          return false;
        }
      }

      // Filter by sellers
      if (activeFilters.sellers.length > 0 &&
          !activeFilters.sellers.includes(product.sellerId)) {
        return false;
      }

      // Filter by in-stock status
      if (activeFilters.inStock && (!product.inventory || product.inventory <= 0)) {
        return false;
      }

      // Filter by free shipping
      if (activeFilters.freeShipping && !product.freeShipping) {
        return false;
      }

      // Filter by bulk discount
      if (activeFilters.bulkDiscount && !product.bulkDiscount) {
        return false;
      }

      return true;
    });
  }, [products,
      activeFilters.categories,
      activeFilters.certifications,
      activeFilters.origins,
      activeFilters.sellers,
      activeFilters.inStock,
      activeFilters.freeShipping,
      activeFilters.bulkDiscount]);

  // Transform products for comparison when selectedProductIds changes
  const fetchComparisonProducts = useCallback(() => {
    if (!products || !sellers || selectedProductIds.length === 0) return;

    const comparisonData = selectedProductIds.map(id => {
      const product = products.find(p => p._id === id);
      if (!product) return null;

      // Find the seller for this product
      const seller = sellers.find(s => s._id === product.sellerId);

      return {
        id: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.images?.[0] || "/placeholder.svg",
        seller: {
          name: seller?.name || seller?.businessName || "Unknown Seller",
          rating: seller?.rating || 4.5,
        },
        rating: 4.7, // This would come from reviews
        reviews: 100, // This would come from reviews
        stock: product.inventory || 0,
        organic: product.isOrganic || product.specifications?.dietary?.organic || false,
        nonGMO: product.specifications?.dietary?.nonGMO || false,
        locallySourced: product.isLocal || false,
        freeShipping: false,
        bulkDiscount: false,
        description: product.description || "",
        specifications: product.specifications || {
          dietary: {
            organic: product.isOrganic || false,
            nonGMO: product.specifications?.dietary?.nonGMO || false
          }
        },
        origin: product.origin || {},
        certifications: product.certifications || []
      };
    }).filter(Boolean) as any[];

    setComparisonProducts(comparisonData);
  }, [products, sellers, selectedProductIds]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);

    // Update active filters for the product query
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      categories: newFilters.categories || [],
      certifications: newFilters.certifications || [],
      sellers: newFilters.sellers || [],
      priceRange: {
        min: newFilters.priceRange?.min,
        max: newFilters.priceRange?.max,
      },
      inStock: newFilters.inStock || false,
      freeShipping: newFilters.freeShipping || false,
      bulkDiscount: newFilters.bulkDiscount || false,
      dietary: newFilters.dietary || {},
      environmental: newFilters.environmental || {},
      origins: newFilters.origins || [],
    }));
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);

    // Parse the sort option to get sortBy and sortOrder
    if (option === "relevance") {
      setSortParams({
        sortBy: undefined,
        sortOrder: "asc",
      });
    } else if (option === "price-asc") {
      setSortParams({
        sortBy: "price",
        sortOrder: "asc",
      });
    } else if (option === "price-desc") {
      setSortParams({
        sortBy: "price",
        sortOrder: "desc",
      });
    } else if (option === "newest") {
      setSortParams({
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    } else if (option === "rating-desc") {
      setSortParams({
        sortBy: "rating",
        sortOrder: "desc",
      });
    } else if (option === "bestselling") {
      setSortParams({
        sortBy: "sales",
        sortOrder: "desc",
      });
    } else if (option === "name-asc") {
      setSortParams({
        sortBy: "name",
        sortOrder: "asc",
      });
    } else if (option === "name-desc") {
      setSortParams({
        sortBy: "name",
        sortOrder: "desc",
      });
    }
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleRemoveProduct = useCallback((productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProductIds(prev => prev.filter(id => id !== productId));
  }, []);

  const handleAddToCart = useCallback((productId: string) => {
    addItem(productId, 1);
  }, [addItem]);

  // Add a product to comparison
  const handleAddToComparison = useCallback((productId: string) => {
    if (selectedProductIds.includes(productId)) return;

    // Limit to 4 products for comparison
    if (selectedProductIds.length >= 4) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 4 products at a time",
        variant: "destructive",
      });
      return;
    }

    setSelectedProductIds(prev => [...prev, productId]);

    // We need to call fetchComparisonProducts in the next tick
    // to ensure selectedProductIds has been updated
    setTimeout(() => {
      fetchComparisonProducts();
      setShowComparison(true);
    }, 0);
  }, [selectedProductIds, toast, fetchComparisonProducts]);

  return (
    <div className="mt-8 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-6 px-4 xl:px-8">
      {showComparison && (
        <div className="col-span-full mb-8" data-testid="product-comparison">
          <MarketplaceProductComparisonLazy
            products={comparisonProducts}
            onRemoveProduct={handleRemoveProduct}
            onAddToCart={handleAddToCart}
          />
          <div className="mt-4 flex justify-end">
            <button
              className="text-sm text-dill-green hover:underline hover-scale"
              onClick={() => setShowComparison(false)}
              data-testid="hide-comparison-button"
            >
              Hide Comparison
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar - Filters */}
      <div className="space-y-6 animate-fade-left" data-testid="filter-sidebar">
        <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20">
          <MarketplaceProductFilters
            onFilterChange={handleFilterChange}
            categories={categories}
          />
        </div>

        {/* Product comparison info */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-dill-green/20" data-testid="comparison-info">
          <h3 className="text-sm font-medium mb-2 text-dill-green">Product Comparison</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Compare products side by side to find the best option for your needs.
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Click "Compare" on product cards to add them to comparison.
          </p>
          {selectedProductIds.length > 0 && !showComparison && (
            <button
              className="w-full bg-dill-green hover:bg-dill-green/90 text-white px-3 py-2 rounded-md text-sm transition-all duration-200 hover:shadow-md"
              onClick={() => {
                fetchComparisonProducts();
                setShowComparison(true);
              }}
              data-testid="show-comparison-button"
            >
              Show Comparison ({selectedProductIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Products */}
      <div className="space-y-6 animate-fade-up" data-testid="product-content">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-dill-green/20" data-testid="product-controls">
          <MarketplaceAdvancedFiltersLazy onFilterChange={handleFilterChange} />
          <div className="flex items-center gap-4">
            <MarketplaceProductSortingLazy onSortChange={handleSortChange} />
            <MarketplaceViewToggle
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </div>

        <VirtualizedProductGridLazy
          products={filteredProducts}
          viewMode={viewMode}
          columnCount={viewMode === "grid" ? 4 : undefined}
          initialItemsToShow={15}
          itemsPerBatch={10}
          hasMore={false}
          onAddToCart={handleAddToCart}
          onAddToComparison={handleAddToComparison}
        />
      </div>

      {/* Right Sidebar - Persistent Cart */}
      <div className="animate-fade-right hidden lg:block" data-testid="cart-sidebar">
        <div className="sticky top-24">
          <MarketplacePersistentCart className="bg-white" />
        </div>
      </div>
    </div>
  )
}
