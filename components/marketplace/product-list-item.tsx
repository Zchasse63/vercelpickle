"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BarChart2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductListItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  description?: string;
  specifications?: any;
  onAddToCart?: () => void;
  onAddToComparison?: () => void;
}

/**
 * Product list item component for displaying products in a list view
 * Used in the marketplace when the list view is selected
 */
export function ProductListItem({
  id,
  name,
  price,
  image,
  unit,
  description,
  specifications,
  onAddToCart,
  onAddToComparison
}: ProductListItemProps) {
  // Extract specifications
  const isOrganic = specifications?.dietary?.organic || false;
  const isNonGMO = specifications?.dietary?.nonGMO || false;
  const isLocal = specifications?.ecofriendly || false;

  return (
    <div 
      className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
      data-testid="product-list-item"
      data-product-id={id}
    >
      {/* Product Image */}
      <div className="relative w-40 h-40 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 160px"
          className="object-cover"
          priority={false}
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {isOrganic && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Organic
                </Badge>
              )}
              {isNonGMO && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Non-GMO
                </Badge>
              )}
              {isLocal && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Local
                </Badge>
              )}
            </div>
          </div>
          <div className="text-lg font-semibold text-dill-green">
            {formatPrice(price)}/{unit}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
        
        {/* Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-dill-green hover:bg-dill-green/90"
              onClick={onAddToCart}
              data-testid="add-to-cart-button"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAddToComparison}
              data-testid="add-to-comparison-button"
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-500"
            data-testid="add-to-wishlist-button"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductListItem;
