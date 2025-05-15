"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ShoppingCart, Eye, Scale } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeLink } from "@/components/ui/safe-link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProductQuickViewModal } from "@/components/marketplace/product-quick-view-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { memoWithComparison, useRenderCount } from "@/lib/performance";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  onAddToComparison?: () => void;
  specifications?: {
    // General specifications
    packaging?: string;
    casePack?: string;
    quantity?: string;
    size?: string;
    diameter?: string;
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
    color?: string;
    material?: string;
    handleMaterial?: string;
    handleColor?: string;

    // Product-specific specifications
    shape?: string;
    design?: string;
    pattern?: string;
    style?: string;
    flavor?: string;
    scent?: string;
    container?: string;

    // Physical properties
    bladeType?: string;
    handleType?: string;
    edgeType?: string;
    textured?: boolean;
    slipResistant?: boolean;
    greaseResistant?: boolean;
    microwavable?: boolean;
    dishwasherSafe?: boolean;

    // Food-specific specifications
    servingSize?: string;
    caloriesPerServing?: string;
    storage?: string;

    // Equipment specifications
    capacity?: string;
    speed?: string;
    power?: string;
    clutch?: string;
    control?: string;
    blades?: string;
    base?: string;
    compatibleWith?: string;

    // Chemical specifications
    activeIngredient?: string;
    formType?: string;
    usage?: string;
    dilutionRatio?: string;
    formula?: string;
    concentrate?: boolean;

    // Dietary information
    dietary?: {
      organic?: boolean;
      glutenFree?: boolean;
      lactoseFree?: boolean;
      vegan?: boolean;
      vegetarian?: boolean;
      kosher?: boolean;
      kosherDairy?: boolean;
      halal?: boolean;
      nonGMO?: boolean;
      cholesterolFree?: boolean;
      sugarFree?: boolean;
      caffeineFree?: boolean;
    };

    // Environmental specifications
    ecofriendly?: boolean;
    compostable?: boolean;
    biodegradable?: boolean;
    recyclable?: boolean;

    // Quality grading
    quality?: {
      grade?: string;
      inspectionDate?: number;
      shelfLife?: {
        value?: number;
        unit?: string;
      };
    };

    // Certifications
    certifications?: string[];

    [key: string]: any;
  };
  features?: string[];
  unit?: string;
  seller?: {
    id: string;
    name: string;
  };
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
  onAddToCart?: () => void;
  className?: string;
}

/**
 * Product card component for displaying a product in the marketplace
 * @param props - Product card props
 * @returns Product card component
 */
function ProductCardComponent({
  id,
  name,
  description,
  price,
  image,
  category,
  subcategory,
  specifications,
  features,
  unit = "each",
  seller,
  status,
  inventory,
  isNew,
  isOnSale,
  salePercentage,
  isLimitedQuantity,
  isFeatured,
  rating,
  reviewCount,
  origin,
  onAddToCart,
  onAddToComparison,
  className,
}: ProductCardProps) {
  // For performance monitoring in development
  const renderCount = process.env.NODE_ENV === 'development' ? useRenderCount('ProductCard') : 0;

  // State for quick view modal
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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

  // Truncate description if it's too long - memoize the computation
  const truncatedDescription = useMemo(() =>
    description.length > 60
      ? `${description.substring(0, 60)}...`
      : description,
    [description]
  );

  return (
    <>
      <Card
        className={`${className} border border-dill-green/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group`}
        data-testid="product-card"
        data-cy="product-card"
        data-product-id={id}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
            <SafeLink href={ROUTES.PRODUCT_DETAILS(id)} aria-label={`View details for ${name}`}>
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                data-testid="product-image"
                data-cy="product-image"
              />
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
        features={features}
        unit={unit}
        seller={seller}
        origin={origin}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

/**
 * Custom comparison function for ProductCard props
 * Only re-render if important props have changed
 */
function arePropsEqual(prevProps: ProductCardProps, nextProps: ProductCardProps): boolean {
  // Compare primitive props that affect rendering
  const primitivePropsEqual =
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.image === nextProps.image &&
    prevProps.unit === nextProps.unit &&
    prevProps.className === nextProps.className;

  // If primitive props are different, re-render
  if (!primitivePropsEqual) return false;

  // Compare specifications that affect badges
  const prevOrganic = prevProps.specifications?.dietary?.organic;
  const nextOrganic = nextProps.specifications?.dietary?.organic;
  const prevGlutenFree = prevProps.specifications?.dietary?.glutenFree;
  const nextGlutenFree = nextProps.specifications?.dietary?.glutenFree;
  const prevEcoFriendly = prevProps.specifications?.ecofriendly;
  const nextEcoFriendly = nextProps.specifications?.ecofriendly;

  const specificationsEqual =
    prevOrganic === nextOrganic &&
    prevGlutenFree === nextGlutenFree &&
    prevEcoFriendly === nextEcoFriendly;

  // If specifications are different, re-render
  if (!specificationsEqual) return false;

  // If we got here, the props are equal enough to skip re-rendering
  return true;
}

/**
 * Memoized ProductCard component
 * Only re-renders when important props change
 */
export const ProductCard = memoWithComparison(ProductCardComponent, arePropsEqual);
