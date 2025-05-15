import { format } from "date-fns"
import { Star } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Review {
  id: string
  customer: string
  rating: number
  comment: string
  date: string
}

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>{reviews.length} reviews for this product</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-lg font-bold">{averageRating.toFixed(1)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{review.customer}</div>
                <div className="text-sm text-muted-foreground">{format(new Date(review.date), "MMM dd, yyyy")}</div>
              </div>
              <div className="mt-1 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
