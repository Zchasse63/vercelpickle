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

export default function ProductDetailClient({ params }: { params: { id: string } }) {
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
      
      {/* Product content here */}
      {/* This is just a placeholder for brevity - the actual component would include all the product details */}
      
      <div className="mt-12 animate-fade-up" data-testid="product-tabs">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details" className="hover-scale" data-testid="tab-details">Product Details</TabsTrigger>
            <TabsTrigger value="nutrition" className="hover-scale" data-testid="tab-nutrition">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="shipping" className="hover-scale" data-testid="tab-shipping">Shipping & Storage</TabsTrigger>
            <TabsTrigger value="reviews" className="hover-scale" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>
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
