import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, MessageSquare, AlertCircle } from "lucide-react"

interface OrderActionsProps {
  order: {
    id: string
    status: string
  }
}

export function BuyerOrderActions({ order }: OrderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" />
        Invoice
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <MessageSquare className="h-4 w-4" />
        Contact Seller
      </Button>
      {order.status !== "Delivered" && order.status !== "Cancelled" && (
        <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-600">
          <AlertCircle className="h-4 w-4" />
          Cancel Order
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Track Shipment</DropdownMenuItem>
          <DropdownMenuItem>Return Item</DropdownMenuItem>
          <DropdownMenuItem>Report Issue</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
