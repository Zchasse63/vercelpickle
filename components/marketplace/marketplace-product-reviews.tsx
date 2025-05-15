"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface MarketplaceProductReviewsProps {
  productId: string
}

export function MarketplaceProductReviews({ productId }: MarketplaceProductReviewsProps) {
  const [reviewFilter, setReviewFilter] = useState("all")

  // Convert the string ID to a Convex ID
  let convexId;
  try {
    convexId = productId as Id<"products">;
  } catch (error) {
    console.error("Invalid product ID format:", error);
  }

  // Fetch reviews from Convex
  const reviewsData = useQuery(
    api.reviews.getByProduct,
    convexId ? { productId: convexId } : "skip"
  );

  // Fetch users to get reviewer names
  const users = useQuery(api.users.getAll);

  // Transform reviews data
  const reviews = useMemo(() => {
    if (!reviewsData || !users) return [];

    return reviewsData.map(review => {
      // Find the user who wrote the review
      const user = users.find(u => u._id === review.userId);

      return {
        id: review._id,
        user: user?.name || "Anonymous User",
        rating: review.rating,
        date: new Date(review.createdAt).toISOString().split('T')[0],
        title: review.title || "Review",
        content: review.content,
        helpful: review.helpfulCount || 0,
      };
    });
  }, [reviewsData, users]);

  // If reviews are still loading, show skeleton
  if (reviewsData === undefined || users === undefined) {
    return <ReviewsSkeleton />;
  }

  // If no reviews found, show empty state
  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground">Be the first to review this product!</p>
          <Button className="mt-4">Write a Review</Button>
        </div>
      </div>
    );
  }

  // Calculate rating statistics
  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  const ratingPercentages = ratingCounts.map((count) => (count / totalReviews) * 100)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center py-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(averageRating) ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                  />
                ))}
            </div>
            <div className="text-sm text-muted-foreground">Based on {totalReviews} reviews</div>
          </div>
          <div className="space-y-2">
            {ratingPercentages.map((percentage, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-12 text-sm">{5 - index} stars</div>
                <Progress value={percentage} className="h-2" />
                <div className="w-12 text-right text-sm text-muted-foreground">{ratingCounts[4 - index]}</div>
              </div>
            ))}
          </div>
          <Button className="w-full">Write a Review</Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <Select value={reviewFilter} onValueChange={setReviewFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="5">5 Star Reviews</SelectItem>
                <SelectItem value="4">4 Star Reviews</SelectItem>
                <SelectItem value="3">3 Star Reviews</SelectItem>
                <SelectItem value="2">2 Star Reviews</SelectItem>
                <SelectItem value="1">1 Star Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {reviews
              .filter((review) => reviewFilter === "all" || review.rating.toString() === reviewFilter)
              .map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{review.title}</div>
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"}`}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{review.user}</span>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm">{review.content}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      Report
                    </Button>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
          </div>
          {reviews.filter((review) => reviewFilter === "all" || review.rating.toString() === reviewFilter).length ===
            0 && (
            <div className="py-4 text-center text-muted-foreground">
              No reviews match your filter. Try a different filter.
            </div>
          )}
          <div className="flex justify-center pt-4">
            <Button variant="outline">Load More Reviews</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for the reviews section
function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="text-center">
            <Skeleton className="h-12 w-16 mx-auto" />
            <div className="flex justify-center py-2">
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-20" />
                </div>
                <Skeleton className="h-px w-full mt-4" />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
