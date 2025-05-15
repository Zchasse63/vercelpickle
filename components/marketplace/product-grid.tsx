"use client";

import React, { useMemo } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import { cn } from "@/lib/utils";
import { memoWithComparison, useRenderCount } from "@/lib/performance";
import { ProductGridSkeleton } from "@/components/ui/loading";

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

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  columnCount?: 2 | 3 | 4 | 5;
}

/**
 * Product grid component for displaying multiple products in a grid layout
 * @param props - Product grid props
 * @returns Product grid component
 */
function ProductGridComponent({
  products,
  onAddToCart,
  className,
  emptyMessage = "No products found",
  isLoading = false,
  viewMode = "grid",
  columnCount = 4,
}: ProductGridProps) {
  // For performance monitoring in development
  const renderCount = process.env.NODE_ENV === 'development' ? useRenderCount('ProductGrid') : 0;

  // Show skeleton loader while loading
  if (isLoading) {
    return <ProductGridSkeleton count={8} viewMode={viewMode} />;
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

  // Memoize the product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((product) => (
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
    ));
  }, [products, onAddToCart]);

  return (
    <div
      className={cn(
        "grid gap-6",
        gridColumnsClass,
        className
      )}
      data-testid="product-grid"
      data-cy="product-grid"
    >
      {productCards}
    </div>
  );
}

/**
 * Custom comparison function for ProductGrid props
 * Only re-render if important props have changed
 */
function arePropsEqual(prevProps: ProductGridProps, nextProps: ProductGridProps): boolean {
  // Always re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  // If loading, no need to compare other props
  if (prevProps.isLoading) return true;

  // Compare view mode and column count
  if (prevProps.viewMode !== nextProps.viewMode ||
      prevProps.columnCount !== nextProps.columnCount) {
    return false;
  }

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
 * Memoized ProductGrid component
 * Only re-renders when important props change
 */
export const ProductGrid = memoWithComparison(ProductGridComponent, arePropsEqual);
