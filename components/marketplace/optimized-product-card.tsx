"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ShoppingCart, Eye, Scale } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeLink } from "@/components/ui/safe-link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProductQuickViewModal } from "@/components/marketplace/product-quick-view-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { memoWithComparison, useRenderCount } from "@/lib/performance";

// Define a type for the blur data URL
type BlurDataURL = string;

// Generate a simple blur data URL for a placeholder
const generateBlurDataURL = (color = 'e2e8f0'): BlurDataURL => {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23${color}'/%3E%3C/svg%3E`;
};

// Default blur data URL
const DEFAULT_BLUR_DATA_URL = generateBlurDataURL();

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  blurDataURL?: BlurDataURL;
  category: string;
  subcategory?: string;
  specifications?: {
    // Simplified specifications for this example
    dietary?: {
      organic?: boolean;
      glutenFree?: boolean;
    };
    ecofriendly?: boolean;
    weight?: string;
  };
  unit?: string;
  seller?: {
    id: string;
    name: string;
  };
  onAddToCart?: () => void;
  onAddToComparison?: () => void;
  className?: string;
}

/**
 * Optimized Product card component with improved image handling
 */
function OptimizedProductCardComponent({
  id,
  name,
  description,
  price,
  image,
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  category,
  subcategory,
  specifications,
  unit = "each",
  seller,
  onAddToCart,
  onAddToComparison,
  className,
}: ProductCardProps) {
  // For performance monitoring in development
  const renderCount = process.env.NODE_ENV === 'development' ? useRenderCount('OptimizedProductCard') : 0;

  // State for quick view modal
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  
  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);
  const { toast } = useToast();

  // Handle adding to cart - memoize the function to prevent unnecessary re-renders
  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      // Use the provided callback if available
      onAddToCart();
    } else {
      // Otherwise, use the cart hook
      try {
        addItem(id, 1);
        toast({
          title: "Added to cart",
          description: `${name} has been added to your cart.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [onAddToCart, addItem, id, name, toast]);

  // Handle quick view click - memoize the function
  const handleQuickViewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  }, []);

  // Handle image load complete
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <>
      <Card
        className={`${className} border border-dill-green/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group`}
        data-testid="product-card"
        data-cy="product-card"
        data-product-id={id}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <SafeLink href={ROUTES.PRODUCT_DETAILS(id)} aria-label={`View details for ${name}`}>
              <div className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  priority={false}
                  onLoad={handleImageLoad}
                  data-testid="product-image"
                  data-cy="product-image"
                />
              </div>
            </SafeLink>

            {/* Quick View Button with Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleQuickViewClick}
                    className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-700 backdrop-blur-sm transition-all hover:bg-white hover:text-dill-green focus:outline-none focus:ring-2 focus:ring-dill-green opacity-0 group-hover:opacity-100"
                    aria-label="Quick view"
                    data-testid="quick-view-button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1" data-testid="product-badges">
              {/* Dietary badges - limit to 2 most important */}
              {specifications?.dietary?.organic && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs" data-testid="badge-organic">
                  Organic
                </Badge>
              )}
              {specifications?.dietary?.glutenFree && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs" data-testid="badge-gluten-free">
                  Gluten-Free
                </Badge>
              )}

              {/* Environmental badge - show only if organic is not present */}
              {!specifications?.dietary?.organic && specifications?.ecofriendly && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs" data-testid="badge-eco-friendly">
                  Eco-Friendly
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2.5 flex-grow">
          <div className="mb-1">
            <SafeLink
              href={ROUTES.PRODUCT_DETAILS(id)}
              className="text-sm font-semibold truncate block hover:underline hover:text-dill-green transition-colors"
              aria-label={`View details for ${name}`}
              data-testid="product-name"
              data-cy="product-name"
            >
              {name.length > 30 ? name.substring(0, 30) + '...' : name}
            </SafeLink>
            <div className="mt-1">
              <span className="text-sm font-bold text-dill-green" data-testid="product-price" data-cy="product-price">
                {formatPrice(price)} <span className="text-xs font-normal">/ {unit}</span>
              </span>
            </div>
          </div>

          {/* Display only the most important specification */}
          <div className="mt-0.5" data-testid="product-specs">
            {specifications?.weight && (
              <p className="text-xs text-muted-foreground truncate" data-testid="product-weight">
                <span className="font-medium">Weight:</span> {specifications.weight}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-2.5 pt-0 flex flex-col gap-1.5 mt-auto">
          <Button
            variant="mustard"
            size="sm"
            className="w-full text-xs py-1.5 transition-transform duration-200 hover:scale-[1.02]"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            data-testid="add-to-cart-button"
            data-cy="add-to-cart-button"
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add to Cart
          </Button>

          {onAddToComparison && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-dill-green text-dill-green hover:bg-dill-green/10 text-xs py-1 transition-colors duration-200"
                    size="sm"
                    onClick={onAddToComparison}
                    aria-label={`Compare ${name} with other products`}
                    data-testid="compare-button"
                    data-cy="compare-button"
                  >
                    <Scale className="mr-1.5 h-3.5 w-3.5" />
                    Compare
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to comparison</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        id={id}
        name={name}
        description={description}
        price={price}
        image={image}
        category={category}
        subcategory={subcategory}
        specifications={specifications}
        unit={unit}
        seller={seller}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

/**
 * Memoized OptimizedProductCard component
 * Only re-renders when important props change
 */
export const OptimizedProductCard = memoWithComparison(OptimizedProductCardComponent, (prevProps, nextProps) => {
  // Compare primitive props that affect rendering
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.image === nextProps.image &&
    prevProps.unit === nextProps.unit &&
    prevProps.className === nextProps.className &&
    prevProps.specifications?.dietary?.organic === nextProps.specifications?.dietary?.organic &&
    prevProps.specifications?.dietary?.glutenFree === nextProps.specifications?.dietary?.glutenFree &&
    prevProps.specifications?.ecofriendly === nextProps.specifications?.ecofriendly
  );
});
