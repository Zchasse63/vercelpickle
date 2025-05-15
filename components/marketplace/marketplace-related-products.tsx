import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { useMemo } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface MarketplaceRelatedProductsProps {
  category: string
  currentProductId: string
}

export function MarketplaceRelatedProducts({ category, currentProductId }: MarketplaceRelatedProductsProps) {
  // Get the authenticated user
  const { user } = useAuth();

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null);

  // Fetch related products from Convex
  const relatedProducts = useQuery(api.products.getRelated, {
    productId: currentProductId as any,
    category: category
  });

  // Fetch sellers from Convex
  const sellers = useQuery(api.users.getSellers);

  // Transform Convex products to the format expected by the UI
  const products = useMemo(() => {
    if (!relatedProducts || !sellers) return [];

    return relatedProducts.map(product => {
      // Find the seller for this product
      const seller = sellers.find(s => s._id === product.sellerId);

      // Get badges from the enhanced schema
      const badges = product.certifications && product.certifications.length > 0
        ? [{
            label: product.certifications[0],
            color: "bg-green-100 text-green-800"
          }]
        : [];

      // Fallback to legacy badges if no certifications
      const legacyBadge = product.isOrganic ? "Organic" : product.isLocal ? "Local" : "";
      const legacyBadgeColor = product.isOrganic
        ? "bg-green-100 text-green-800"
        : product.isLocal
          ? "bg-purple-100 text-purple-800"
          : "";

      return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        image: product.images?.[0] || "/placeholder.svg",
        seller: seller?.name || seller?.businessName || "Unknown Seller",
        sellerId: product.sellerId,
        rating: seller?.rating || 4.5, // Fallback to 4.5 if no rating
        reviews: seller?.reviewCount || 0,
        badges: badges,
        badge: legacyBadge, // For backward compatibility
        badgeColor: legacyBadgeColor, // For backward compatibility
        category: product.category,
      };
    });
  }, [relatedProducts, sellers]);

  // If products are still loading, show loading state
  if (relatedProducts === undefined || sellers === undefined) {
    return <RelatedProductsSkeleton />;
  }

  // If no related products found, show fallback message
  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <p className="text-muted-foreground">No related products found.</p>
      </div>
    );
  }

  // Use the real products from Convex
  const displayProducts = products;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/marketplace/products/${product.id}`}>
              <div className="relative aspect-square">
                <div className="absolute right-2 top-2 z-10 flex flex-wrap gap-1 justify-end">
                  {product.badges && product.badges.length > 0 ? (
                    product.badges.map((badge, index) => (
                      <Badge key={index} className={badge.color}>
                        {badge.label}
                      </Badge>
                    ))
                  ) : (
                    // Fallback to legacy badge
                    product.badge && <Badge className={product.badgeColor}>{product.badge}</Badge>
                  )}
                </div>
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
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  Seller: <Link href={`/marketplace/sellers/${product.sellerId}`} className="hover:underline text-primary">{product.seller}</Link>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-amber-500">★</span>
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews})</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                size="sm"
                onClick={() => addItem(product.id, 1)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Skeleton loader for the related products
function RelatedProductsSkeleton() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-square">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="grid gap-2 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
