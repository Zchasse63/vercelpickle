import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, Store } from "lucide-react"

const favoriteSellers = [
  {
    id: "seller-1",
    name: "Farm Fresh Produce",
    image: "/farm-logo.png",
    description: "Fresh fruits and vegetables directly from local farms.",
    location: "California, USA",
    rating: 4.8,
  },
  {
    id: "seller-2",
    name: "Artisan Bakery",
    image: "/bakery-logo.png",
    description: "Handcrafted breads and pastries made with organic ingredients.",
    location: "Oregon, USA",
    rating: 4.7,
  },
  {
    id: "seller-3",
    name: "Organic Dairy Co.",
    image: "/assorted-dairy-products.png",
    description: "Premium organic dairy products from grass-fed cows.",
    location: "Wisconsin, USA",
    rating: 4.9,
  },
  {
    id: "seller-4",
    name: "Global Coffee Traders",
    image: "/steaming-coffee-cup.png",
    description: "Ethically sourced coffee beans from around the world.",
    location: "Washington, USA",
    rating: 4.6,
  },
]

export function BuyerFavoriteSellers() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {favoriteSellers.map((seller) => (
        <Card key={seller.id} className="overflow-hidden">
          <div className="relative h-32 w-full bg-gray-100 flex items-center justify-center p-4">
            <img
              src={seller.image || "/placeholder.svg"}
              alt={seller.name}
              className="h-full max-h-24 w-auto object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-white/80 text-red-500 hover:bg-white/90 hover:text-red-600"
            >
              <Heart className="h-5 w-5 fill-current" />
              <span className="sr-only">Remove from favorites</span>
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium">{seller.name}</h3>
              <p className="text-sm text-gray-500">{seller.location}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Rating:</span>
                <span className="text-sm">{seller.rating}/5</span>
              </div>
              <p className="text-sm line-clamp-2">{seller.description}</p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full gap-2">
              <Link href={`/marketplace/sellers/${seller.id}`} className="flex-1">
                <Button variant="outline" className="w-full gap-1">
                  <Store className="h-4 w-4" />
                  Visit Store
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
