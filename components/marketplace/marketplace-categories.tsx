import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function MarketplaceCategories() {
  const categories = [
    {
      name: "Fruits & Vegetables",
      image: "/bunch-of-carrots.png",
      href: "/marketplace/categories/fruits-vegetables",
      color: "bg-green-100",
    },
    {
      name: "Dairy & Eggs",
      image: "/glass-of-milk.png",
      href: "/marketplace/categories/dairy-eggs",
      color: "bg-blue-100",
    },
    {
      name: "Bakery",
      image: "/assorted-breads.png",
      href: "/marketplace/categories/bakery",
      color: "bg-amber-100",
    },
    {
      name: "Meat & Seafood",
      image: "/fresh-meat.png",
      href: "/marketplace/categories/meat-seafood",
      color: "bg-red-100",
    },
    {
      name: "Beverages",
      image: "/steaming-coffee-cup.png",
      href: "/marketplace/categories/beverages",
      color: "bg-orange-100",
    },
    {
      name: "Pantry & Dry Goods",
      image: "/pantry-items.png",
      href: "/marketplace/categories/pantry",
      color: "bg-yellow-100",
    },
  ]

  return (
    <section className="container space-y-6 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Categories</h2>
        <p className="max-w-[700px] text-muted-foreground md:text-lg">
          Browse our wide selection of quality food products by category.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className={cn("mb-3 flex h-20 w-20 items-center justify-center rounded-full", category.color)}>
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="text-center text-sm font-medium">{category.name}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
