"use client"

import Link from "next/link"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function MarketplaceTopSellers() {
  // Fetch top sellers from Convex
  const allSellers = useQuery(api.users.getSellers);

  // Fetch product counts for each seller
  const productCounts = useQuery(api.products.getProductCountsBySeller);

  // Transform sellers data
  const sellers = useMemo(() => {
    if (!allSellers || !productCounts) return [];

    // Sort sellers by rating and limit to top 4
    return allSellers
      .map(seller => {
        // Find product count for this seller
        const productCount = productCounts.find(p => p.sellerId === seller._id);

        return {
          id: seller._id,
          name: seller.businessName || seller.name,
          description: seller.description || "Quality products from a trusted supplier.",
          image: seller.image || "/placeholder.svg",
          products: productCount?.count || 0,
          rating: seller.rating || 4.5,
          reviews: seller.reviewCount || 0,
          badge: "Verified Seller",
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allSellers, productCounts]);

  // If data is still loading, show skeleton
  if (!allSellers || !productCounts) {
    return <TopSellersSkeleton />;
  }

  // If no sellers found, show empty state
  if (sellers.length === 0) {
    return (
      <section className="container space-y-6 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Top Sellers</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            No sellers found. Check back soon for our trusted suppliers.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container space-y-6 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Top Sellers</h2>
        <p className="max-w-[700px] text-muted-foreground md:text-lg">
          Meet our most trusted and highest-rated food suppliers.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sellers.map((seller) => (
          <Card key={seller.id} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={seller.image || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(seller.name)}`}
                alt={seller.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground">{seller.badge}</Badge>
            </div>
            <CardContent className="grid gap-2 p-4">
              <Link href={`/marketplace/sellers/${seller.id}`} className="font-semibold hover:underline">
                {seller.name}
              </Link>
              <p className="text-sm text-muted-foreground">{seller.description}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">{seller.products} Products</div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-amber-500">★</span>
                  <span>{seller.rating}</span>
                  <span className="text-muted-foreground">({seller.reviews})</span>
                </div>
              </div>
              <Link href={`/marketplace/sellers/${seller.id}`}>
                <Button variant="outline" size="sm" className="mt-2">View Products</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Link href="/marketplace/sellers">
          <Button variant="outline" size="lg">View All Sellers</Button>
        </Link>
      </div>
    </section>
  )
}

// Skeleton loader for the top sellers section
function TopSellersSkeleton() {
  return (
    <section className="container space-y-6 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="grid gap-2 p-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="mt-2 h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-40" />
      </div>
    </section>
  )
}
