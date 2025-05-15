import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const topSellers = [
  {
    id: "1",
    name: "Organic Farms Co.",
    email: "contact@organicfarms.com",
    avatar: "/placeholder.svg?key=zvm2u",
    revenue: 24500,
    orders: 142,
  },
  {
    id: "2",
    name: "Fresh Produce Inc.",
    email: "sales@freshproduce.com",
    avatar: "/placeholder.svg?key=0dwi4",
    revenue: 18700,
    orders: 98,
  },
  {
    id: "3",
    name: "Green Valley Foods",
    email: "info@greenvalley.com",
    avatar: "/placeholder.svg?key=dq2tc",
    revenue: 15200,
    orders: 87,
  },
  {
    id: "4",
    name: "Nature's Best Supply",
    email: "orders@naturesbest.com",
    avatar: "/placeholder.svg?key=k3kbq",
    revenue: 12800,
    orders: 76,
  },
  {
    id: "5",
    name: "Farm Direct LLC",
    email: "support@farmdirect.com",
    avatar: "/placeholder.svg?key=azoww",
    revenue: 10500,
    orders: 63,
  },
]

export function AdminTopSellers() {
  const maxRevenue = Math.max(...topSellers.map((seller) => seller.revenue))

  return (
    <div className="space-y-4">
      {topSellers.map((seller) => (
        <div key={seller.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
            <AvatarFallback>
              {seller.name.charAt(0)}
              {seller.name.split(" ")[1]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{seller.name}</p>
            <p className="text-xs text-muted-foreground">{seller.orders} orders</p>
            <Progress value={(seller.revenue / maxRevenue) * 100} className="h-1.5 mt-2" />
          </div>
          <div className="text-sm font-medium">${seller.revenue.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
