import { SafeLink } from "@/components/ui/safe-link"
import { SafeButton } from "@/components/ui/safe-button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart } from "lucide-react"

const favoriteProducts = [
  {
    id: "prod-1",
    name: "Organic Apples",
    image: "/ripe-apples.png",
    price: "$24.99",
    unit: "per case",
    seller: "Farm Fresh Produce",
  },
  {
    id: "prod-2",
    name: "Artisan Sourdough Bread",
    image: "/assorted-breads.png",
    price: "$6.50",
    unit: "per loaf",
    seller: "Artisan Bakery",
  },
  {
    id: "prod-3",
    name: "Organic Whole Milk",
    image: "/glass-of-milk.png",
    price: "$4.99",
    unit: "per gallon",
    seller: "Organic Dairy Co.",
  },
  {
    id: "prod-4",
    name: "Premium Coffee Beans",
    image: "/pile-of-coffee-beans.png",
    price: "$18.75",
    unit: "per lb",
    seller: "Global Coffee Traders",
  },
]

export function BuyerFavoriteProducts() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {favoriteProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
            <SafeButton
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-white/80 text-red-500 hover:bg-white/90 hover:text-red-600"
            >
              <Heart className="h-5 w-5 fill-current" />
              <span className="sr-only">Remove from favorites</span>
            </SafeButton>
          </div>
          <CardContent className="p-4">
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.seller}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">{product.price}</span>
                <span className="text-xs text-gray-500">{product.unit}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <SafeButton variant="outline" className="w-full" asChild>
                  <SafeLink href={`/marketplace/products/${product.id}`}>
                    View
                  </SafeLink>
                </SafeButton>
              </div>
              <SafeButton>
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add</span>
                </span>
              </SafeButton>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
