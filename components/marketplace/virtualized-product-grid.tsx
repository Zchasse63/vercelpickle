"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import { cn } from "@/lib/utils";
import { memoWithComparison, useRenderCount } from "@/lib/performance";
import { ProductGridSkeleton } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { VirtualizedGrid } from "@/components/ui/virtualized";

// Reuse the Product interface from product-grid.tsx
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
  isOrganic?: boolean;
  isLocal?: boolean;
  unit: string;
  sellerId: string;
  sellerName?: string;
  specifications?: any;
  features?: string[];
  origin?: {
    country?: string;
    region?: string;
    farm?: string;
    producer?: string;
  };
  certifications?: string[];
  tags?: string[];
  status?: string;
  inventory?: number;
}

interface VirtualizedProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  columnCount?: 2 | 3 | 4 | 5;
  initialItemsToShow?: number;
  itemsPerBatch?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * Virtualized product grid component for efficiently displaying large lists of products
 * Uses a "load more" approach with intersection observer for better performance
 * @param props - Virtualized product grid props
 * @returns Virtualized product grid component
 */
function VirtualizedProductGridComponent({
  products,
  onAddToCart,
  className,
  emptyMessage = "No products found",
  isLoading = false,
  viewMode = "grid",
  columnCount = 4,
  initialItemsToShow = 12,
  itemsPerBatch = 8,
  hasMore = false,
  onLoadMore,
}: VirtualizedProductGridProps) {
  // For performance monitoring in development
  const renderCount = process.env.NODE_ENV === 'development' ? useRenderCount('VirtualizedProductGrid') : 0;

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  // Show skeleton loader while loading initial data
  if (isLoading && products.length === 0) {
    return <ProductGridSkeleton count={initialItemsToShow} viewMode={viewMode} />;
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Memoize the grid columns class based on columnCount
  const gridColumnsClass = useMemo(() => {
    if (viewMode === "list") return "grid-cols-1";

    switch (columnCount) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  }, [columnCount, viewMode]);

  // Render function for each product
  const renderProduct = useCallback((product: Product, index: number) => {
    return (
      <ProductCard
        key={product.id}
        id={product.id}
        name={product.name}
        description={product.description}
        price={product.price}
        image={product.images[0] || "/images/placeholder.jpg"}
        category={product.category}
        subcategory={product.subcategory}
        specifications={
          product.specifications || {
            dietary: {
              organic: product.isOrganic || false
            },
            ecofriendly: product.isLocal || false
          }
        }
        features={product.features}
        unit={product.unit}
        seller={
          product.sellerName
            ? {
                id: product.sellerId,
                name: product.sellerName,
              }
            : undefined
        }
        origin={product.origin}
        certifications={product.certifications}
        tags={product.tags}
        status={product.status}
        inventory={product.inventory}
        onAddToCart={
          onAddToCart ? () => onAddToCart(product.id) : undefined
        }
      />
    );
  }, [onAddToCart]);

  // Empty placeholder
  const emptyPlaceholder = (
    <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
      <p className="text-muted-foreground">{emptyMessage}</p>
    </div>
  );

  // Loading placeholder
  const loadingPlaceholder = (
    <ProductGridSkeleton count={Math.min(itemsPerBatch, columnCount)} viewMode={viewMode} />
  );

  return (
    <div className="space-y-6" data-testid="virtualized-product-grid" data-cy="virtualized-product-grid">
      <VirtualizedGrid
        items={products}
        renderItem={renderProduct}
        columnCount={viewMode === "list" ? 1 : columnCount}
        rowHeight={viewMode === "list" ? 150 : 350}
        className={cn("gap-6", className)}
        containerClassName="min-h-[500px]"
        emptyPlaceholder={emptyPlaceholder}
        loadingPlaceholder={isLoading ? loadingPlaceholder : undefined}
        onEndReached={hasMore ? handleLoadMore : undefined}
        testId="product-grid"
      />

      {/* Manual load more button for better UX */}
      {hasMore && (
        <div className="w-full py-4 flex justify-center">
          {isLoading ? (
            <ProductGridSkeleton count={Math.min(itemsPerBatch, columnCount)} viewMode={viewMode} />
          ) : (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="flex items-center gap-2"
              data-testid="load-more-button"
              data-cy="load-more-button"
            >
              Load More <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Custom comparison function for VirtualizedProductGrid props
 * Only re-render if important props have changed
 */
function arePropsEqual(prevProps: VirtualizedProductGridProps, nextProps: VirtualizedProductGridProps): boolean {
  // Always re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  // Compare view mode and column count
  if (prevProps.viewMode !== nextProps.viewMode ||
      prevProps.columnCount !== nextProps.columnCount) {
    return false;
  }

  // Compare hasMore flag
  if (prevProps.hasMore !== nextProps.hasMore) return false;

  // Compare products array length
  if (!prevProps.products || !nextProps.products) return false;
  if (prevProps.products.length !== nextProps.products.length) return false;

  // Compare product IDs (if IDs are the same and in the same order, we assume the products are the same)
  // This is a performance optimization to avoid deep comparison of all product properties
  const prevIds = prevProps.products.map(p => p.id);
  const nextIds = nextProps.products.map(p => p.id);

  return prevIds.every((id, index) => id === nextIds[index]);
}

/**
 * Memoized VirtualizedProductGrid component
 * Only re-renders when important props change
 */
export const VirtualizedProductGrid = memoWithComparison(VirtualizedProductGridComponent, arePropsEqual);
