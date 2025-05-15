"use client"

import React, { Suspense, useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Star, Truck, Plus, Minus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Loading } from "@/components/ui/loading"
import { MarketplaceProductQuantity } from "@/components/marketplace/marketplace-product-quantity"
import {
  MarketplaceProductReviewsLazy,
  MarketplaceRelatedProductsLazy
} from "@/components/marketplace/lazy-marketplace-components"

// Metadata is moved to a separate file for client components

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // Unwrap params using React.use() to avoid direct access warning
  const unwrappedParams = React.use(params);

  // Convert the string ID to a Convex ID
  // Using a useMemo to avoid re-computation on every render
  const convexId = useMemo(() => {
    try {
      return unwrappedParams.id as Id<"products">;
    } catch (error) {
      console.error("Invalid product ID format:", error);
      return undefined;
    }
  }, [unwrappedParams.id]);

  // Fetch all data upfront to maintain consistent hook order
  const product = useQuery(api.products.getById, convexId ? { id: convexId } : "skip");
  const seller = useQuery(
    api.users.getById,
    product && product.sellerId ? { id: product.sellerId } : "skip"
  );
  const reviews = useQuery(
    api.reviews.getByProduct,
    convexId ? { productId: convexId } : "skip"
  );

  // Check loading state
  const isLoading = product === undefined || seller === undefined || reviews === undefined;

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addItem(product._id, quantity);
    }
  };

  // If data is still loading, show loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // If product is not found, show error state
  if (product === null) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center px-4 py-8 text-center md:px-6 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/marketplace">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  // Transform product to the format expected by the UI
  const productUI = {
    id: product._id,
    name: product.name,
    description: product.description,
    longDescription: product.description + (product.features && product.features.length > 0
      ? "\n\n" + product.features.join("\n\n")
      : "\n\nThese products are grown using sustainable farming practices that prioritize soil health and biodiversity. We never use synthetic pesticides, herbicides, or fertilizers in our growing process, resulting in a product that's better for you and the environment."),
    price: product.price,
    unit: product.unit || "each",
    // Use product images or fallback to placeholders
    image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder-product.jpg",
    gallery: product.images && product.images.length > 0
      ? product.images
      : ["/placeholder-product.jpg", "/placeholder-product.jpg", "/placeholder-product.jpg"],
    seller: {
      id: product.sellerId,
      name: seller?.businessName || seller?.name || "Unknown Seller",
      rating: seller?.rating || 4.5,
      reviews: seller?.reviewCount || 0,
    },
    category: product.category,
    subcategory: product.subcategory,
    rating: reviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1) : 4.5,
    reviews: reviews?.length || 0,
    stock: product.inventory || 100,

    // Enhanced product information
    specifications: product.specifications || {},
    features: product.features || [],

    // Badges based on specifications
    badges: [
      product.specifications?.dietary?.organic ? { label: "Organic", color: "bg-green-100 text-green-800" } : null,
      product.specifications?.dietary?.glutenFree ? { label: "Gluten-Free", color: "bg-blue-100 text-blue-800" } : null,
      product.specifications?.dietary?.lactoseFree ? { label: "Lactose-Free", color: "bg-yellow-100 text-yellow-800" } : null,
      product.specifications?.ecofriendly ? { label: "Eco-Friendly", color: "bg-emerald-100 text-emerald-800" } : null,
      product.specifications?.compostable ? { label: "Compostable", color: "bg-lime-100 text-lime-800" } : null,
      product.subcategory ? { label: product.subcategory, color: "bg-gray-100 text-gray-800" } : null,
    ].filter(Boolean),

    // Legacy badge support
    badge: product.isOrganic ? "Organic" : product.isLocal ? "Local" : "",
    badgeColor: product.isOrganic
      ? "bg-green-100 text-green-800"
      : product.isLocal
        ? "bg-purple-100 text-purple-800"
        : "",

    certifications: product.certifications || product.specifications?.certifications || [],

    // Nutrition facts from specifications or fallback to default data
    nutritionFacts: product.specifications?.servingSize ? {
      servingSize: product.specifications.servingSize,
      calories: product.specifications.caloriesPerServing || "0",
      totalFat: "0g",
      sodium: "0mg",
      totalCarbohydrate: "0g",
      dietaryFiber: "0g",
      sugars: "0g",
      protein: "0g",
    } : {
      servingSize: "1 serving",
      calories: 0,
      totalFat: "0g",
      sodium: "0mg",
      totalCarbohydrate: "0g",
      dietaryFiber: "0g",
      sugars: "0g",
      protein: "0g",
      vitaminA: "0%",
      vitaminC: "0%",
      calcium: "0%",
      iron: "0%",
    },

    // Storage info from specifications or fallback
    storageInfo: product.specifications?.storage || product.storageInstructions || "Store according to product instructions.",

    shippingInfo: "Ships within 24 hours. Delivery typically takes 1-3 business days depending on your location.",
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12" data-testid="product-details" data-testid="product-detail">
      <div className="mb-6 animate-fade-up" data-testid="product-navigation">
        <Link href="/marketplace">
          <Button variant="ghost" size="sm" className="mb-2 hover-scale" data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 animate-fade-right" data-testid="product-images">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted" data-testid="product-main-image">
            {/* Display badges from the enhanced schema */}
            <div className="absolute right-2 top-2 z-10 flex flex-wrap gap-1 justify-end" data-testid="product-badges">
              {productUI.badges && productUI.badges.length > 0 ? (
                productUI.badges.map((badge, index) => (
                  <Badge key={index} className={badge?.color || ""} data-testid={`badge-${badge?.label?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {badge?.label || ""}
                  </Badge>
                ))
              ) : (
                // Fallback to legacy badge
                productUI.badge && <Badge className={productUI.badgeColor} data-testid={`badge-${productUI.badge.toLowerCase().replace(/\s+/g, '-')}`}>{productUI.badge}</Badge>
              )}
            </div>
            <Image
              src={productUI.image || "/placeholder.svg"}
              alt={productUI.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-cover hover-scale"
              priority
              data-testid="product-image"
              data-cy="product-image"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 animate-stagger-fade-in" data-testid="product-gallery">
            {productUI.gallery.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-md bg-muted" data-testid={`gallery-image-${index}`}>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productUI.name} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 200px"
                  className="object-cover hover-scale"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 animate-fade-left" data-testid="product-info">
          <div>
            <h1 className="text-3xl font-bold" data-testid="product-name" data-cy="product-name">{productUI.name}</h1>
            <div className="mt-2 flex items-center gap-2" data-testid="product-rating">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(productUI.rating) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                    />
                  ))}
              </div>
              <span className="text-sm font-medium">{productUI.rating}</span>
              <span className="text-sm text-muted-foreground">({productUI.reviews} reviews)</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2" data-testid="product-price" data-cy="product-price">
            <span className="text-3xl font-bold">${productUI.price.toFixed(2)}</span>
            <span className="text-muted-foreground">/ {productUI.unit}</span>
          </div>
          <p className="text-muted-foreground" data-testid="product-description" data-cy="product-description">{productUI.description}</p>
          <div className="space-y-2" data-testid="product-details">
            <div className="flex items-center gap-2 text-sm" data-testid="product-seller">
              <span className="font-medium">Seller:</span>
              <Link href={`/marketplace/sellers/${productUI.seller.id}`} className="text-primary hover:underline">
                {productUI.seller.name}
              </Link>
              <span className="text-muted-foreground">
                ({productUI.seller.rating} ★, {productUI.seller.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm" data-testid="product-category">
              <span className="font-medium">Category:</span>
              <span>
                {productUI.category} / {productUI.subcategory}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm" data-testid="product-stock">
              <span className="font-medium">Stock:</span>
              <span className="text-green-600">{productUI.stock} available</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm" data-testid="product-certifications">
              <span className="font-medium">Certifications:</span>
              {productUI.certifications.map((cert) => (
                <Badge key={cert} variant="outline" data-testid={`certification-${cert.toLowerCase().replace(/\s+/g, '-')}`}>
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-4" data-testid="product-actions">
            <div className="flex items-center" data-testid="quantity-selector">
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-none hover-scale"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                data-testid="decrease-quantity"
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="flex-1 border-y px-3 py-1.5 text-center"
                data-testid="quantity-input"
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-none hover-scale"
                onClick={() => setQuantity(quantity + 1)}
                data-testid="increase-quantity"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="w-full hover-scale"
                onClick={handleAddToCart}
                data-testid="add-to-cart-button"
                data-cy="add-to-cart-button"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full hover-scale" data-testid="request-quote-button">
                Request Quote
              </Button>
            </div>
          </div>
          <div className="rounded-lg border p-4 hover-lift" data-testid="shipping-info">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free shipping on orders over $100</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 animate-fade-up" data-testid="product-tabs">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details" className="hover-scale" data-testid="tab-details">Product Details</TabsTrigger>
            <TabsTrigger value="nutrition" className="hover-scale" data-testid="tab-nutrition">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="shipping" className="hover-scale" data-testid="tab-shipping">Shipping & Storage</TabsTrigger>
            <TabsTrigger value="reviews" className="hover-scale" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6 animate-fade-up" data-testid="tab-content-details">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About this product</h2>
                <p className="whitespace-pre-line text-muted-foreground" data-testid="product-long-description">{productUI.longDescription}</p>
              </div>

              {/* Product Features */}
              {productUI.features && productUI.features.length > 0 && (
                <div className="space-y-4" data-testid="product-features">
                  <h2 className="text-xl font-semibold">Features</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {productUI.features.map((feature, index) => (
                      <li key={index} data-testid={`feature-${index}`}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product Specifications */}
              {productUI.specifications && Object.keys(productUI.specifications).length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Specifications</h2>
                  <div className="rounded-lg border hover-lift">
                    <div className="divide-y">
                      {/* General specifications section */}
                      {(productUI.specifications.packaging ||
                        productUI.specifications.casePack ||
                        productUI.specifications.quantity ||
                        productUI.specifications.size ||
                        productUI.specifications.diameter ||
                        productUI.specifications.length ||
                        productUI.specifications.width ||
                        productUI.specifications.height ||
                        productUI.specifications.weight ||
                        productUI.specifications.color ||
                        productUI.specifications.material) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">General Specifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.packaging && (
                              <div className="flex justify-between">
                                <span className="font-medium">Packaging</span>
                                <span>{productUI.specifications.packaging}</span>
                              </div>
                            )}
                            {productUI.specifications.casePack && (
                              <div className="flex justify-between">
                                <span className="font-medium">Case Pack</span>
                                <span>{productUI.specifications.casePack}</span>
                              </div>
                            )}
                            {productUI.specifications.quantity && (
                              <div className="flex justify-between">
                                <span className="font-medium">Quantity</span>
                                <span>{productUI.specifications.quantity}</span>
                              </div>
                            )}
                            {productUI.specifications.size && (
                              <div className="flex justify-between">
                                <span className="font-medium">Size</span>
                                <span>{productUI.specifications.size}</span>
                              </div>
                            )}
                            {productUI.specifications.diameter && (
                              <div className="flex justify-between">
                                <span className="font-medium">Diameter</span>
                                <span>{productUI.specifications.diameter}</span>
                              </div>
                            )}
                            {productUI.specifications.length && (
                              <div className="flex justify-between">
                                <span className="font-medium">Length</span>
                                <span>{productUI.specifications.length}</span>
                              </div>
                            )}
                            {productUI.specifications.width && (
                              <div className="flex justify-between">
                                <span className="font-medium">Width</span>
                                <span>{productUI.specifications.width}</span>
                              </div>
                            )}
                            {productUI.specifications.height && (
                              <div className="flex justify-between">
                                <span className="font-medium">Height</span>
                                <span>{productUI.specifications.height}</span>
                              </div>
                            )}
                            {productUI.specifications.weight && (
                              <div className="flex justify-between">
                                <span className="font-medium">Weight</span>
                                <span>{productUI.specifications.weight}</span>
                              </div>
                            )}
                            {productUI.specifications.color && (
                              <div className="flex justify-between">
                                <span className="font-medium">Color</span>
                                <span>{productUI.specifications.color}</span>
                              </div>
                            )}
                            {productUI.specifications.material && (
                              <div className="flex justify-between">
                                <span className="font-medium">Material</span>
                                <span>{productUI.specifications.material}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Product-specific specifications */}
                      {(productUI.specifications.shape ||
                        productUI.specifications.design ||
                        productUI.specifications.pattern ||
                        productUI.specifications.style ||
                        productUI.specifications.flavor ||
                        productUI.specifications.scent ||
                        productUI.specifications.container) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Product Characteristics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.shape && (
                              <div className="flex justify-between">
                                <span className="font-medium">Shape</span>
                                <span>{productUI.specifications.shape}</span>
                              </div>
                            )}
                            {productUI.specifications.design && (
                              <div className="flex justify-between">
                                <span className="font-medium">Design</span>
                                <span>{productUI.specifications.design}</span>
                              </div>
                            )}
                            {productUI.specifications.pattern && (
                              <div className="flex justify-between">
                                <span className="font-medium">Pattern</span>
                                <span>{productUI.specifications.pattern}</span>
                              </div>
                            )}
                            {productUI.specifications.style && (
                              <div className="flex justify-between">
                                <span className="font-medium">Style</span>
                                <span>{productUI.specifications.style}</span>
                              </div>
                            )}
                            {productUI.specifications.flavor && (
                              <div className="flex justify-between">
                                <span className="font-medium">Flavor</span>
                                <span>{productUI.specifications.flavor}</span>
                              </div>
                            )}
                            {productUI.specifications.scent && (
                              <div className="flex justify-between">
                                <span className="font-medium">Scent</span>
                                <span>{productUI.specifications.scent}</span>
                              </div>
                            )}
                            {productUI.specifications.container && (
                              <div className="flex justify-between">
                                <span className="font-medium">Container</span>
                                <span>{productUI.specifications.container}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Physical properties */}
                      {(productUI.specifications.bladeType ||
                        productUI.specifications.handleType ||
                        productUI.specifications.edgeType ||
                        productUI.specifications.textured ||
                        productUI.specifications.slipResistant ||
                        productUI.specifications.greaseResistant ||
                        productUI.specifications.microwavable ||
                        productUI.specifications.dishwasherSafe) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Physical Properties</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.bladeType && (
                              <div className="flex justify-between">
                                <span className="font-medium">Blade Type</span>
                                <span>{productUI.specifications.bladeType}</span>
                              </div>
                            )}
                            {productUI.specifications.handleType && (
                              <div className="flex justify-between">
                                <span className="font-medium">Handle Type</span>
                                <span>{productUI.specifications.handleType}</span>
                              </div>
                            )}
                            {productUI.specifications.edgeType && (
                              <div className="flex justify-between">
                                <span className="font-medium">Edge Type</span>
                                <span>{productUI.specifications.edgeType}</span>
                              </div>
                            )}
                            {productUI.specifications.textured !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Textured</span>
                                <span>{productUI.specifications.textured ? "Yes" : "No"}</span>
                              </div>
                            )}
                            {productUI.specifications.slipResistant !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Slip Resistant</span>
                                <span>{productUI.specifications.slipResistant ? "Yes" : "No"}</span>
                              </div>
                            )}
                            {productUI.specifications.greaseResistant !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Grease Resistant</span>
                                <span>{productUI.specifications.greaseResistant ? "Yes" : "No"}</span>
                              </div>
                            )}
                            {productUI.specifications.microwavable !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Microwavable</span>
                                <span>{productUI.specifications.microwavable ? "Yes" : "No"}</span>
                              </div>
                            )}
                            {productUI.specifications.dishwasherSafe !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Dishwasher Safe</span>
                                <span>{productUI.specifications.dishwasherSafe ? "Yes" : "No"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Food-specific specifications */}
                      {(productUI.specifications.servingSize ||
                        productUI.specifications.caloriesPerServing ||
                        productUI.specifications.storage) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Food Specifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.servingSize && (
                              <div className="flex justify-between">
                                <span className="font-medium">Serving Size</span>
                                <span>{productUI.specifications.servingSize}</span>
                              </div>
                            )}
                            {productUI.specifications.caloriesPerServing && (
                              <div className="flex justify-between">
                                <span className="font-medium">Calories Per Serving</span>
                                <span>{productUI.specifications.caloriesPerServing}</span>
                              </div>
                            )}
                            {productUI.specifications.storage && (
                              <div className="flex justify-between">
                                <span className="font-medium">Storage</span>
                                <span>{productUI.specifications.storage}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Equipment specifications */}
                      {(productUI.specifications.capacity ||
                        productUI.specifications.speed ||
                        productUI.specifications.power ||
                        productUI.specifications.clutch ||
                        productUI.specifications.control ||
                        productUI.specifications.blades ||
                        productUI.specifications.base ||
                        productUI.specifications.compatibleWith) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Equipment Specifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.capacity && (
                              <div className="flex justify-between">
                                <span className="font-medium">Capacity</span>
                                <span>{productUI.specifications.capacity}</span>
                              </div>
                            )}
                            {productUI.specifications.speed && (
                              <div className="flex justify-between">
                                <span className="font-medium">Speed</span>
                                <span>{productUI.specifications.speed}</span>
                              </div>
                            )}
                            {productUI.specifications.power && (
                              <div className="flex justify-between">
                                <span className="font-medium">Power</span>
                                <span>{productUI.specifications.power}</span>
                              </div>
                            )}
                            {productUI.specifications.clutch && (
                              <div className="flex justify-between">
                                <span className="font-medium">Clutch</span>
                                <span>{productUI.specifications.clutch}</span>
                              </div>
                            )}
                            {productUI.specifications.control && (
                              <div className="flex justify-between">
                                <span className="font-medium">Control</span>
                                <span>{productUI.specifications.control}</span>
                              </div>
                            )}
                            {productUI.specifications.blades && (
                              <div className="flex justify-between">
                                <span className="font-medium">Blades</span>
                                <span>{productUI.specifications.blades}</span>
                              </div>
                            )}
                            {productUI.specifications.base && (
                              <div className="flex justify-between">
                                <span className="font-medium">Base</span>
                                <span>{productUI.specifications.base}</span>
                              </div>
                            )}
                            {productUI.specifications.compatibleWith && (
                              <div className="flex justify-between">
                                <span className="font-medium">Compatible With</span>
                                <span>{productUI.specifications.compatibleWith}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Chemical specifications */}
                      {(productUI.specifications.activeIngredient ||
                        productUI.specifications.formType ||
                        productUI.specifications.usage ||
                        productUI.specifications.dilutionRatio ||
                        productUI.specifications.formula ||
                        productUI.specifications.concentrate) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Chemical Specifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.activeIngredient && (
                              <div className="flex justify-between">
                                <span className="font-medium">Active Ingredient</span>
                                <span>{productUI.specifications.activeIngredient}</span>
                              </div>
                            )}
                            {productUI.specifications.formType && (
                              <div className="flex justify-between">
                                <span className="font-medium">Form Type</span>
                                <span>{productUI.specifications.formType}</span>
                              </div>
                            )}
                            {productUI.specifications.usage && (
                              <div className="flex justify-between">
                                <span className="font-medium">Usage</span>
                                <span>{productUI.specifications.usage}</span>
                              </div>
                            )}
                            {productUI.specifications.dilutionRatio && (
                              <div className="flex justify-between">
                                <span className="font-medium">Dilution Ratio</span>
                                <span>{productUI.specifications.dilutionRatio}</span>
                              </div>
                            )}
                            {productUI.specifications.formula && (
                              <div className="flex justify-between">
                                <span className="font-medium">Formula</span>
                                <span>{productUI.specifications.formula}</span>
                              </div>
                            )}
                            {productUI.specifications.concentrate !== undefined && (
                              <div className="flex justify-between">
                                <span className="font-medium">Concentrate</span>
                                <span>{productUI.specifications.concentrate ? "Yes" : "No"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dietary specifications */}
                      {productUI.specifications.dietary && Object.keys(productUI.specifications.dietary).length > 0 && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Dietary Information</h3>
                          <div className="flex flex-wrap gap-2">
                            {productUI.specifications.dietary.organic && (
                              <Badge variant="outline" className="bg-green-50">Organic</Badge>
                            )}
                            {productUI.specifications.dietary.glutenFree && (
                              <Badge variant="outline" className="bg-blue-50">Gluten-Free</Badge>
                            )}
                            {productUI.specifications.dietary.lactoseFree && (
                              <Badge variant="outline" className="bg-yellow-50">Lactose-Free</Badge>
                            )}
                            {productUI.specifications.dietary.vegan && (
                              <Badge variant="outline" className="bg-emerald-50">Vegan</Badge>
                            )}
                            {productUI.specifications.dietary.vegetarian && (
                              <Badge variant="outline" className="bg-lime-50">Vegetarian</Badge>
                            )}
                            {productUI.specifications.dietary.kosher && (
                              <Badge variant="outline" className="bg-indigo-50">Kosher</Badge>
                            )}
                            {productUI.specifications.dietary.kosherDairy && (
                              <Badge variant="outline" className="bg-purple-50">Kosher Dairy</Badge>
                            )}
                            {productUI.specifications.dietary.halal && (
                              <Badge variant="outline" className="bg-violet-50">Halal</Badge>
                            )}
                            {productUI.specifications.dietary.nonGMO && (
                              <Badge variant="outline" className="bg-amber-50">Non-GMO</Badge>
                            )}
                            {productUI.specifications.dietary.cholesterolFree && (
                              <Badge variant="outline" className="bg-indigo-50">Cholesterol-Free</Badge>
                            )}
                            {productUI.specifications.dietary.sugarFree && (
                              <Badge variant="outline" className="bg-pink-50">Sugar-Free</Badge>
                            )}
                            {productUI.specifications.dietary.caffeineFree && (
                              <Badge variant="outline" className="bg-red-50">Caffeine-Free</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Environmental specifications */}
                      {(productUI.specifications.ecofriendly ||
                        productUI.specifications.compostable ||
                        productUI.specifications.biodegradable ||
                        productUI.specifications.recyclable) && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Environmental Information</h3>
                          <div className="flex flex-wrap gap-2">
                            {productUI.specifications.ecofriendly && (
                              <Badge variant="outline" className="bg-emerald-50">Eco-Friendly</Badge>
                            )}
                            {productUI.specifications.compostable && (
                              <Badge variant="outline" className="bg-lime-50">Compostable</Badge>
                            )}
                            {productUI.specifications.biodegradable && (
                              <Badge variant="outline" className="bg-green-50">Biodegradable</Badge>
                            )}
                            {productUI.specifications.recyclable && (
                              <Badge variant="outline" className="bg-cyan-50">Recyclable</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quality grading */}
                      {productUI.specifications.quality && (
                        <div className="p-3">
                          <h3 className="font-semibold mb-2">Quality Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {productUI.specifications.quality.grade && (
                              <div className="flex justify-between">
                                <span className="font-medium">Grade</span>
                                <span>{productUI.specifications.quality.grade}</span>
                              </div>
                            )}
                            {productUI.specifications.quality.inspectionDate && (
                              <div className="flex justify-between">
                                <span className="font-medium">Inspection Date</span>
                                <span>{new Date(productUI.specifications.quality.inspectionDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {productUI.specifications.quality.shelfLife?.value && (
                              <div className="flex justify-between">
                                <span className="font-medium">Shelf Life</span>
                                <span>{productUI.specifications.quality.shelfLife.value} {productUI.specifications.quality.shelfLife.unit || 'days'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="nutrition" className="mt-6 animate-fade-up" data-testid="tab-content-nutrition">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Nutrition Facts</h2>
              <div className="rounded-lg border hover-lift" data-testid="nutrition-facts">
                <div className="border-b p-4">
                  <div className="text-lg font-bold">Nutrition Facts</div>
                  <div className="text-sm text-muted-foreground" data-testid="serving-size">
                    Serving Size: {productUI.nutritionFacts.servingSize}
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex justify-between border-b pb-2" data-testid="calories">
                    <span className="font-bold">Calories</span>
                    <span>{productUI.nutritionFacts.calories}</span>
                  </div>
                  <div className="flex justify-between border-b py-2" data-testid="total-fat">
                    <span>Total Fat</span>
                    <span>{productUI.nutritionFacts.totalFat}</span>
                  </div>
                  <div className="flex justify-between border-b py-2" data-testid="sodium">
                    <span>Sodium</span>
                    <span>{productUI.nutritionFacts.sodium}</span>
                  </div>
                  <div className="flex justify-between border-b py-2" data-testid="total-carbohydrate">
                    <span>Total Carbohydrate</span>
                    <span>{productUI.nutritionFacts.totalCarbohydrate}</span>
                  </div>
                  <div className="flex justify-between border-b py-2 pl-4" data-testid="dietary-fiber">
                    <span>Dietary Fiber</span>
                    <span>{productUI.nutritionFacts.dietaryFiber}</span>
                  </div>
                  <div className="flex justify-between border-b py-2 pl-4" data-testid="sugars">
                    <span>Sugars</span>
                    <span>{productUI.nutritionFacts.sugars}</span>
                  </div>
                  <div className="flex justify-between border-b py-2" data-testid="protein">
                    <span>Protein</span>
                    <span>{productUI.nutritionFacts.protein}</span>
                  </div>
                  <div className="flex justify-between py-2" data-testid="vitamin-a">
                    <span>Vitamin A</span>
                    <span>{productUI.nutritionFacts.vitaminA}</span>
                  </div>
                  <div className="flex justify-between py-2" data-testid="vitamin-c">
                    <span>Vitamin C</span>
                    <span>{productUI.nutritionFacts.vitaminC}</span>
                  </div>
                  <div className="flex justify-between py-2" data-testid="calcium">
                    <span>Calcium</span>
                    <span>{productUI.nutritionFacts.calcium}</span>
                  </div>
                  <div className="flex justify-between py-2" data-testid="iron">
                    <span>Iron</span>
                    <span>{productUI.nutritionFacts.iron}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6 animate-fade-up" data-testid="tab-content-shipping">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Storage Information</h2>
                <p className="text-muted-foreground" data-testid="storage-info">{productUI.storageInfo}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                <p className="text-muted-foreground" data-testid="shipping-info-text">{productUI.shippingInfo}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6 animate-fade-up" data-testid="tab-content-reviews">
            <MarketplaceProductReviewsLazy productId={productUI.id} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-16 animate-fade-up delay-300" data-testid="related-products">
        <MarketplaceRelatedProductsLazy category={productUI.category} currentProductId={productUI.id} />
      </div>
    </div>
  )
}

// Skeleton loader for the product detail page
function ProductDetailSkeleton() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <Skeleton className="h-1 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-10 w-full" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
      <div className="mt-16">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
