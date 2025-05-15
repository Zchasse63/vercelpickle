"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Minus, Plus, Star, Truck, Info, Tag, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/providers/auth-provider";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeLink } from "@/components/ui/safe-link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface ProductQuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  specifications?: any;
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
}

export function ProductQuickViewModal({
  open,
  onOpenChange,
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
  origin,
  certifications,
  tags,
  status,
  inventory,
  onAddToCart,
}: ProductQuickViewModalProps) {
  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);
  const { toast } = useToast();

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      // Use the provided callback if available
      onAddToCart();
    } else {
      // Otherwise, use the cart hook
      try {
        addItem(id as Id<"products">, quantity);
        toast({
          title: "Added to cart",
          description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${name} added to your cart.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    }
    // Close the modal after adding to cart
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-white">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {/* Dietary badges */}
              {specifications?.dietary?.organic && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 shadow-sm">
                  Organic
                </Badge>
              )}
              {specifications?.dietary?.glutenFree && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 shadow-sm">
                  Gluten-Free
                </Badge>
              )}
              {specifications?.dietary?.vegan && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 shadow-sm">
                  Vegan
                </Badge>
              )}
              {specifications?.ecofriendly && (
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 shadow-sm">
                  Eco-Friendly
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col h-full border-l border-dill-green/10">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-xl font-semibold text-dill-green">{name}</DialogTitle>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xl font-bold text-dill-green">
                  {formatPrice(price)} <span className="text-sm font-normal">/ {unit}</span>
                </div>
                {seller && (
                  <div className="text-sm text-muted-foreground">
                    Sold by: <SafeLink href={ROUTES.SELLER_DETAILS(seller.id)} className="hover:underline text-dill-green">{seller.name}</SafeLink>
                  </div>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto max-h-[350px] pr-2 space-y-5">
              {/* Product Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-dill-green flex items-center">
                  <Info className="h-4 w-4 mr-1" /> Description
                </h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              {/* Key Features */}
              {features && features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-dill-green">Key Features</h3>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2 text-dill-green">•</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {specifications && Object.keys(specifications).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-dill-green flex items-center">
                    <Package className="h-4 w-4 mr-1" /> Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Physical specifications */}
                    {specifications.weight && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Weight:</span> {specifications.weight}
                      </p>
                    )}
                    {specifications.size && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Size:</span> {specifications.size}
                      </p>
                    )}
                    {specifications.dimensions && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Dimensions:</span> {specifications.dimensions}
                      </p>
                    )}
                    {specifications.servingSize && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Serving Size:</span> {specifications.servingSize}
                      </p>
                    )}
                  </div>

                  {/* Dietary information */}
                  {specifications.dietary && Object.values(specifications.dietary).some(Boolean) && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Dietary Information</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(specifications.dietary)
                          .filter(([_, value]) => Boolean(value))
                          .map(([key]) => (
                            <Badge key={key} variant="secondary" className="bg-green-50 text-green-800">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Origin Information */}
              {origin && (origin.country || origin.region) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-dill-green">Origin</h3>
                  <p className="text-sm text-muted-foreground">
                    {origin.region && `${origin.region}, `}{origin.country}
                    {origin.farm && ` - ${origin.farm}`}
                  </p>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-dill-green">Certifications</h3>
                  <div className="flex flex-wrap gap-1">
                    {certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-dill-green flex items-center">
                  <Truck className="h-4 w-4 mr-1" /> Shipping & Storage
                </h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $100. Standard delivery within 2-5 business days.
                </p>

                {specifications?.storage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Storage:</span> {specifications.storage}
                  </p>
                )}

                {inventory !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Availability:</span> {inventory > 10 ? "In Stock" : inventory > 0 ? `Only ${inventory} left in stock` : "Out of Stock"}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-8 w-12 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <Button
                    variant="mustard"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <SafeLink
                  href={ROUTES.PRODUCT_DETAILS(id)}
                  className="text-center text-sm text-dill-green hover:underline"
                >
                  View full product details
                </SafeLink>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
