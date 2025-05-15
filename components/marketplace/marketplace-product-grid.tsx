"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { useMemo, useState, useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StaggeredList } from "@/components/ui/page-transition"
import { useStaggeredAnimation } from "@/lib/animation-hooks"
import { ProductCard } from "@/components/marketplace/product-card"
import { VirtualizedProductGrid } from "@/components/marketplace/virtualized-product-grid"
import { ProductGridSkeleton } from "@/components/ui/loading"
import { useRenderCount } from "@/lib/performance"

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  images?: string[];
  sellerId: string;
  certifications?: string[];
  isOrganic?: boolean;
  isLocal?: boolean;
  [key: string]: any;
}

interface UIProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  seller: string;
  sellerId: string;
  rating: number;
  reviews: number;
  badges: { label: string; color: string }[];
  badge?: string;
  badgeColor?: string;
}

interface MarketplaceProductGridProps {
  onAddToComparison?: (productId: string) => void;
  products?: ProductType[];
  viewMode?: "grid" | "list";
  useVirtualization?: boolean;
  columnCount?: 2 | 3 | 4 | 5;
}

export function MarketplaceProductGrid({
  onAddToComparison,
  products: propProducts,
  viewMode = "grid",
  useVirtualization = true,
  columnCount = 5
}: MarketplaceProductGridProps) {
  // For performance monitoring in development
  const renderCount = process.env.NODE_ENV === 'development' ? useRenderCount('MarketplaceProductGrid') : 0;
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // Fetch products from Convex with error handling if not provided as props
  let convexProducts;
  let sellers;

  try {
    // Only fetch products if not provided as props
    convexProducts = propProducts || useQuery(api.products.getAll, {});

    // Fetch sellers from Convex - always fetch this, not conditionally
    sellers = useQuery(api.users.getSellers, {});
  } catch (error) {
    console.error("Error fetching data from Convex:", error);
    // Set default values
    convexProducts = propProducts || undefined;
    sellers = undefined;
  }

  // Transform Convex products to the format expected by the UI
  const products = useMemo(() => {
    if (!convexProducts || !sellers) return [];

    return convexProducts.map(product => {
      // Find the seller for this product
      const seller = sellers.find(s => s._id === product.sellerId);

      // Get badges from the enhanced schema
      const badges = product.certifications && product.certifications.length > 0
        ? [{
            label: product.certifications[0],
            color: "bg-green-100 text-green-800"
          }]
        : [];

      // Fallback to legacy badges if no certifications
      const legacyBadge = product.isOrganic ? "Organic" : product.isLocal ? "Local" : "";
      const legacyBadgeColor = product.isOrganic
        ? "bg-green-100 text-green-800"
        : product.isLocal
          ? "bg-purple-100 text-purple-800"
          : "";

      return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        image: product.images?.[0] || "/placeholder.svg",
        seller: seller?.name || seller?.businessName || "Unknown Seller",
        sellerId: product.sellerId,
        rating: seller?.rating || 4.5, // Fallback to 4.5 if no rating
        reviews: seller?.reviewCount || 0,
        badges: badges,
        badge: legacyBadge, // For backward compatibility
        badgeColor: legacyBadgeColor, // For backward compatibility
      };
    });
  }, [convexProducts, sellers]);

  // IMPORTANT: Always call hooks at the top level, before any conditional returns
  // Use the staggered animation hook with a safe default length
  const { containerRef, containerClassName, getItemClassName } = useStaggeredAnimation(
    products?.length || 0,
    { animationClass: "animate-fade-in-up", containerDelay: 100 }
  );

  // State for virtualized grid pagination
  const [hasMore, setHasMore] = useState(true);

  // Handle load more for virtualized grid
  const handleLoadMore = useCallback(() => {
    // In a real implementation, this would fetch more data from the API
    // For now, we'll just set hasMore to false after the first load
    setHasMore(false);
  }, []);

  // Convert products to the format expected by VirtualizedProductGrid
  const virtualizedProducts = useMemo(() => {
    if (!products) return [];

    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: [product.image],
      category: product.category || "",
      unit: product.unit,
      sellerId: product.sellerId,
      sellerName: product.seller,
      specifications: {
        dietary: {
          organic: product.badges?.some(b => b.label === "Organic") || product.badge === "Organic"
        },
        ecofriendly: product.badges?.some(b => b.label === "Eco-Friendly") || product.badge === "Local"
      }
    }));
  }, [products]);

  // If products are still loading, show loading state
  if (convexProducts === undefined || sellers === undefined) {
    return <ProductGridSkeleton viewMode={viewMode} />;
  }

  // If no products are found, show empty state
  if (convexProducts.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  // If no transformed products but we have data, show empty state with import suggestion
  if (products.length === 0 && convexProducts.length === 0) {
    return (
      <div className="flex flex-col h-40 w-full items-center justify-center rounded-md border border-dashed gap-4">
        <p className="text-muted-foreground">No products found in the database</p>
        <Link href="/admin/products/import" className="text-sm text-primary hover:underline">
          Import sample products
        </Link>
      </div>
    );
  }

  // Use virtualized grid if enabled and in grid view
  if (useVirtualization && viewMode === "grid") {
    return (
      <VirtualizedProductGrid
        products={virtualizedProducts}
        viewMode={viewMode}
        columnCount={columnCount}
        initialItemsToShow={15}
        itemsPerBatch={10}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onAddToCart={(productId) => addItem(productId, 1)}
        onAddToComparison={onAddToComparison}
        className="animate-fade-up"
      />
    );
  }

  // Otherwise, use the standard grid with staggered animation
  return (
    <div
      ref={containerRef}
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "flex flex-col gap-6",
        containerClassName
      )}
      data-testid="product-grid"
    >
      {products.map((product, index) => (
        <div key={product.id} className={getItemClassName(index)} data-testid="product-item">
          {viewMode === "grid" ? (
            // Grid view layout - use our updated ProductCard component
            <ProductCard
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`}
              category={product.category || ""}
              unit={product.unit}
              specifications={{
                dietary: {
                  organic: product.badges?.some(b => b.label === "Organic") || product.badge === "Organic"
                },
                ecofriendly: product.badges?.some(b => b.label === "Eco-Friendly") || product.badge === "Local"
              }}
              className="hover-lift shadow-sm border border-[#5A9A3D]/20 transition-all duration-200 hover:shadow-md"
              onAddToCart={() => addItem(product.id, 1)}
              onAddToComparison={onAddToComparison ? () => onAddToComparison(product.id) : undefined}
              data-testid="product-card"
              data-product-id={product.id}
            />
          ) : (
            // List view layout
            <Card className="overflow-hidden h-full hover-lift shadow-sm border border-[#5A9A3D]/20 flex flex-row transition-all duration-200 hover:shadow-md" style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.1), 0 4px 14px rgba(90, 154, 61, 0.1)' }} data-testid="product-card-list" data-product-id={product.id}>
              <Link href={`/marketplace/products/${product.id}`} className="w-1/4 min-w-[120px]">
                <div className="relative aspect-square overflow-hidden m-4 rounded-lg">
                  <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1">
                    {product.badges && product.badges.length > 0 ? (
                      product.badges.map((badge, index) => (
                        <Badge key={index} className={`${badge.color} shadow-sm`} data-testid={`product-badge-${badge.label.toLowerCase()}`}>
                          {badge.label}
                        </Badge>
                      ))
                    ) : (
                      // Fallback to legacy badge
                      product.badge && <Badge className={`${product.badgeColor} shadow-sm`} data-testid={`product-badge-${product.badge.toLowerCase()}`}>{product.badge}</Badge>
                    )}
                  </div>
                  <Image
                    src={product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    data-testid="product-image"
                  />
                </div>
              </Link>
              <div className="flex flex-col flex-grow p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/marketplace/products/${product.id}`} className="text-lg font-semibold hover:underline text-[#194D33]" data-testid="product-name">
                    {product.name}
                  </Link>
                  <div className="text-base font-bold text-[#194D33]" data-testid="product-price">
                    ${product.price.toFixed(2)} <span className="text-sm font-normal">/ {product.unit}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4" data-testid="product-description">{product.description}</p>
                <div className="flex gap-2 mt-auto">
                  <Button
                    className="flex-1 flex items-center justify-center bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addItem(product.id, 1);
                    }}
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  {onAddToComparison && (
                    <Button
                      className="flex-1 border-[#5A9A3D] text-[#5A9A3D] hover:bg-[#5A9A3D]/10"
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToComparison(product.id)}
                      data-testid="compare-button"
                    >
                      Compare
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}

// Skeleton loader for the product grid
function ProductGridSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  return (
    <div className={
      viewMode === "grid"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        : "flex flex-col gap-6"
    }>
      {Array(viewMode === "grid" ? 10 : 3).fill(0).map((_, i) => (
        <Card key={i} className={cn(
          "overflow-hidden shadow-sm border border-dill-green/20 animate-pulse",
          viewMode === "grid" ? "" : "flex flex-row"
        )} style={{ boxShadow: '0 0 0 1px rgba(25, 77, 51, 0.1), 0 4px 14px rgba(25, 77, 51, 0.05)' }}>
          {viewMode === "grid" ? (
            // Grid view skeleton
            <>
              <div className="relative aspect-square rounded-t-lg">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="grid gap-1.5 p-2.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
              <CardFooter className="p-2.5 pt-0 flex flex-col gap-1.5">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </CardFooter>
            </>
          ) : (
            // List view skeleton
            <>
              <div className="w-1/4 min-w-[120px] p-3">
                <div className="relative aspect-square rounded-lg">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>
              <div className="flex flex-col flex-grow p-3">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-full mb-1.5" />
                <Skeleton className="h-3 w-3/4 mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex gap-2 mt-auto">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-full" />
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
