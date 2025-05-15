import Image from "next/image"
import { Progress } from "@/components/ui/progress"

const topProducts = [
  {
    id: "1",
    name: "Organic Apples (5lb)",
    category: "Fruits",
    image: "/placeholder.svg?key=p7hpt",
    sales: 245,
    revenue: 1225,
  },
  {
    id: "2",
    name: "Fresh Broccoli (2lb)",
    category: "Vegetables",
    image: "/placeholder.svg?key=3l7ua",
    sales: 187,
    revenue: 935,
  },
  {
    id: "3",
    name: "Grass-Fed Ground Beef",
    category: "Meat",
    image: "/placeholder.svg?key=g6a3m",
    sales: 152,
    revenue: 1824,
  },
  {
    id: "4",
    name: "Organic Whole Milk",
    category: "Dairy",
    image: "/placeholder.svg?key=ehfha",
    sales: 128,
    revenue: 640,
  },
  {
    id: "5",
    name: "Sourdough Bread",
    category: "Bakery",
    image: "/placeholder.svg?key=53f06",
    sales: 105,
    revenue: 525,
  },
]

export function AdminTopProducts() {
  const maxSales = Math.max(...topProducts.map((product) => product.sales))

  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.id} className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <Progress value={(product.sales / maxSales) * 100} className="h-1.5 mt-2" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{product.sales} sold</p>
          </div>
        </div>
      ))}
    </div>
  )
}
