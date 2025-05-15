"use client"

import { useState, useCallback } from "react"
import { ShoppingCart, Star, Truck, Plus, Minus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MarketplaceProductQuantity } from "@/components/marketplace/marketplace-product-quantity"

interface ProductInteractiveClientProps {
  product: any
}

export function ProductInteractiveClient({ product }: ProductInteractiveClientProps) {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // Handle quantity change
  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  }, []);

  // Handle quantity increment
  const handleIncrement = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  // Handle quantity decrement
  const handleDecrement = useCallback(() => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    addItem(product.id, quantity);
  }, [addItem, product.id, quantity]);

  return (
    <div className="space-y-6 animate-fade-left" data-testid="product-details-right">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="product-name" data-cy="product-name">{product.name}</h1>
        <div className="mt-2 flex items-center gap-2" data-testid="product-seller">
          <span className="text-sm text-muted-foreground">Sold by {product.seller.name}</span>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="ml-1 text-xs font-medium">{product.seller.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-baseline gap-2" data-testid="product-price" data-cy="product-price">
        <span className="text-2xl font-bold text-dill-green">${product.price.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">/ {product.unit}</span>
      </div>
      <p className="text-muted-foreground" data-testid="product-description" data-cy="product-description">
        {product.description}
      </p>
      <div className="space-y-2" data-testid="product-details">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-dill-green" />
          <span className="text-sm">
            {product.stock > 0 ? (
              <>
                <span className="font-medium text-dill-green">In Stock</span> - Ships within 24 hours
              </>
            ) : (
              <span className="font-medium text-red-500">Out of Stock</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            <span className="font-medium">Category:</span> {product.category}
            {product.subcategory && ` > ${product.subcategory}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            <span className="font-medium">SKU:</span> {product.id.substring(0, 8)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2" data-testid="product-certifications">
          {product.certifications && product.certifications.map((cert: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {cert}
            </Badge>
          ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-4" data-testid="product-actions">
        <MarketplaceProductQuantity
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          testId="product-quantity"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1 bg-dill-green hover:bg-dill-green/90"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            data-testid="add-to-cart-button"
            data-cy="add-to-cart-button"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-dill-green text-dill-green hover:bg-dill-green/10"
            data-testid="save-for-later-button"
          >
            Save for Later
          </Button>
        </div>
      </div>
      <div className="rounded-lg bg-muted p-4 text-sm" data-testid="product-guarantee">
        <p className="font-medium">Pickle B2B Guarantee</p>
        <p className="mt-1 text-muted-foreground">
          We stand behind the quality of all our products. Not satisfied? We'll make it right with a refund or replacement.
        </p>
      </div>
    </div>
  )
}
