"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, ShoppingCart } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function SellerDetailPage({ params }: { params: { id: string } }) {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // Convert the string ID to a Convex ID
  let convexId;
  try {
    convexId = params.id as Id<"users">;
  } catch (error) {
    console.error("Invalid seller ID format:", error);
  }

  // Fetch seller data from Convex
  const seller = useQuery(
    api.users.getById,
    convexId ? { id: convexId } : "skip"
  );

  // Fetch business profile for the seller
  const businessProfile = useQuery(
    api.users.getBusinessProfileByUserId,
    convexId ? { userId: convexId } : "skip"
  );

  // Fetch products by this seller
  const sellerProducts = useQuery(
    api.products.getBySeller,
    convexId ? { sellerId: convexId } : "skip"
  );

  // Transform seller data
  const sellerData = useMemo(() => {
    if (!seller || !businessProfile) return null;

    return {
      _id: seller._id,
      name: businessProfile?.businessName || seller.businessName || seller.name,
      description: businessProfile?.description || seller.description || "Quality products from a trusted supplier.",
      longDescription: businessProfile?.description || seller.description || "This seller is committed to providing high-quality products to their customers.",
      image: seller.image || "/placeholder.svg",
      coverImage: seller.coverImage || "/placeholder.svg",
      location: businessProfile?.address?.city && businessProfile?.address?.state
        ? `${businessProfile.address.city}, ${businessProfile.address.state}`
        : "Location not specified",
      phone: businessProfile?.phone || "Contact information not available",
      email: businessProfile?.email || seller.email,
      website: businessProfile?.website || "#",
      rating: seller.rating || 4.5,
      reviews: seller.reviewCount || 0,
      badge: businessProfile?.businessType || "Verified Seller",
      founded: "Not specified",
      employees: "Not specified",
      certifications: businessProfile?.certifications || [],
      deliveryOptions: ["Standard Shipping"],
      paymentOptions: ["Credit Card", "Purchase Order"],
    };
  }, [seller, businessProfile]);

  // Transform products data
  const products = useMemo(() => {
    if (!sellerProducts) return [];

    return sellerProducts.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      image: product.images?.[0] || "/placeholder.svg",
      badge: product.certifications?.[0] || (product.isOrganic ? "Organic" : product.isLocal ? "Local" : ""),
      badgeColor: product.isOrganic
        ? "bg-green-100 text-green-800"
        : product.isLocal
          ? "bg-purple-100 text-purple-800"
          : "bg-gray-100 text-gray-800",
    }));
  }, [sellerProducts]);

  // If seller is still loading, show loading state
  if (seller === undefined || businessProfile === undefined || sellerProducts === undefined) {
    return <SellerDetailSkeleton />;
  }

  // If seller is not found, show error state
  if (!sellerData) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center px-4 py-8 text-center md:px-6 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight">Seller Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The seller you are looking for does not exist or has been removed.
        </p>
        <Link href="/marketplace/sellers">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sellers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Link href="/marketplace">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>
      </div>
      <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl bg-muted md:h-64 lg:h-80">
        <Image
          src={sellerData.coverImage || "/placeholder.svg"}
          alt={`${sellerData.name} Cover`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_3fr]">
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-background p-2">
            <Image
              src={sellerData.image || "/placeholder.svg"}
              alt={sellerData.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-4 rounded-xl border p-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{sellerData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{sellerData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{sellerData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={sellerData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Visit Website
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-xl border p-4">
            <h3 className="text-lg font-semibold">Business Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Founded</span>
                <span>{sellerData.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employees</span>
                <span>{sellerData.employees}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Certifications</span>
                <div className="flex flex-wrap gap-1">
                  {sellerData.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{sellerData.name}</h1>
              <Badge className="bg-green-100 text-green-800">{sellerData.badge}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(sellerData.rating) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                    />
                  ))}
              </div>
              <span className="text-sm font-medium">{sellerData.rating}</span>
              <span className="text-sm text-muted-foreground">({sellerData.reviews} reviews)</span>
            </div>
            <p className="text-muted-foreground">{sellerData.description}</p>
          </div>
          <Tabs defaultValue="products">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <Link href={`/marketplace/products/${product.id}`}>
                        <div className="relative aspect-square">
                          <Badge className={`absolute right-2 top-2 z-10 ${product.badgeColor}`}>{product.badge}</Badge>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      </Link>
                      <CardContent className="grid gap-2 p-4">
                        <div className="flex items-center justify-between">
                          <Link href={`/marketplace/products/${product.id}`} className="font-semibold hover:underline">
                            {product.name}
                          </Link>
                          <div className="text-sm font-medium">
                            ${product.price.toFixed(2)} / {product.unit}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <Button
                          className="mt-2 w-full"
                          size="sm"
                          onClick={() => addItem(product.id, 1)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link href={`/marketplace/sellers/${params.id}/products`}>
                    <Button variant="outline">View All Products</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">About {sellerData.name}</h2>
                <p className="whitespace-pre-line text-muted-foreground">{sellerData.longDescription}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <p className="text-muted-foreground">Reviews will be displayed here.</p>
              </div>
            </TabsContent>
            <TabsContent value="policies" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Policies</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Delivery Options</h3>
                    <ul className="mt-2 list-inside list-disc text-muted-foreground">
                      {sellerData.deliveryOptions.map((option: string) => (
                        <li key={option}>{option}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Payment Options</h3>
                    <ul className="mt-2 list-inside list-disc text-muted-foreground">
                      {sellerData.paymentOptions.map((option: string) => (
                        <li key={option}>{option}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for the seller detail page
function SellerDetailSkeleton() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="relative mb-8 h-48 w-full overflow-hidden rounded-xl bg-muted md:h-64 lg:h-80">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_3fr]">
        <div className="space-y-6">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}
