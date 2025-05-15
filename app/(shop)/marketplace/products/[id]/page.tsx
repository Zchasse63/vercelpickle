import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { Suspense } from "react"
import { queryConvex } from "@/lib/convex-server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductInteractiveClient } from "@/components/marketplace/product-interactive-client"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Fetch product data for metadata
    const product = await queryConvex("products.getById", { id: params.id });

    if (!product) {
      return {
        title: "Product Not Found | Pickle B2B Marketplace",
        description: "The product you are looking for could not be found.",
      };
    }

    return {
      title: `${product.name} | Pickle B2B Marketplace`,
      description: product.description || "View detailed product information",
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images && product.images.length > 0
          ? [{ url: product.images[0] }]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details | Pickle B2B Marketplace",
      description: "View detailed product information",
    };
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  try {
    // Fetch product data on the server
    const product = await queryConvex("products.getById", { id: params.id });

    if (!product) {
      notFound();
    }

    // Fetch seller data on the server
    const seller = product.sellerId
      ? await queryConvex("users.getById", { id: product.sellerId })
      : null;

    // Fetch reviews on the server
    const reviews = await queryConvex("reviews.getByProduct", { productId: params.id });

    // Transform product to the format expected by the UI
    const productUI = {
      id: product._id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      unit: product.unit || "each",
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
      category: product.category || "",
      subcategory: product.subcategory || "",
      rating: reviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1) : 4.5,
      reviews: reviews?.length || 0,
      stock: product.inventory || 100,
      specifications: product.specifications || {},
      features: product.features || [],
      badges: [
        product.specifications?.dietary?.organic ? { label: "Organic", color: "bg-green-100 text-green-800" } : null,
        product.specifications?.dietary?.glutenFree ? { label: "Gluten-Free", color: "bg-blue-100 text-blue-800" } : null,
        product.specifications?.dietary?.lactoseFree ? { label: "Lactose-Free", color: "bg-yellow-100 text-yellow-800" } : null,
        product.specifications?.ecofriendly ? { label: "Eco-Friendly", color: "bg-emerald-100 text-emerald-800" } : null,
        product.specifications?.compostable ? { label: "Compostable", color: "bg-lime-100 text-lime-800" } : null,
        product.subcategory ? { label: product.subcategory, color: "bg-gray-100 text-gray-800" } : null,
      ].filter(Boolean),
      badge: product.isOrganic ? "Organic" : product.isLocal ? "Local" : "",
      badgeColor: product.isOrganic
        ? "bg-green-100 text-green-800"
        : product.isLocal
          ? "bg-purple-100 text-purple-800"
          : "",
      certifications: product.certifications || product.specifications?.certifications || [],
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
      storageInfo: product.specifications?.storage || product.storageInstructions || "Store according to product instructions.",
      shippingInfo: "Ships within 24 hours. Delivery typically takes 1-3 business days depending on your location.",
    };

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
                  productUI.badges.map((badge: any, index: number) => (
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
              {productUI.gallery.map((image: string, index: number) => (
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

          {/* Interactive client component for add to cart functionality */}
          <Suspense fallback={<ProductDetailRightSkeleton />}>
            <ProductInteractiveClient product={productUI} />
          </Suspense>
        </div>

        {/* Product tabs - server rendered content */}
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
                  <p className="whitespace-pre-line text-muted-foreground" data-testid="product-long-description">
                    {productUI.description}
                    {productUI.features && productUI.features.length > 0
                      ? "\n\n" + productUI.features.join("\n\n")
                      : "\n\nThese products are grown using sustainable farming practices that prioritize soil health and biodiversity. We never use synthetic pesticides, herbicides, or fertilizers in our growing process, resulting in a product that's better for you and the environment."}
                  </p>
                </div>
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
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(productUI.rating) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{productUI.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({productUI.reviews} reviews)</span>
                </div>
                <p className="text-muted-foreground">
                  {reviews && reviews.length > 0
                    ? "Here's what our customers are saying:"
                    : "Be the first to review this product!"}
                </p>
                {reviews && reviews.slice(0, 3).map((review: any) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.userName || "Anonymous"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

// Skeleton loader for the right side of the product detail page
function ProductDetailRightSkeleton() {
  return (
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
  );
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
