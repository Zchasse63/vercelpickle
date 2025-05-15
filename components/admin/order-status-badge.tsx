import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function OrderStatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Completed
      </Badge>
    )
  }

  if (status === "processing") {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Processing
      </Badge>
    )
  }

  if (status === "cancelled") {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Cancelled
      </Badge>
    )
  }

  return <Badge variant="outline">{status}</Badge>
}
