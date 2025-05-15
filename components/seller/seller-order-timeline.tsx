import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SellerOrderTimelineProps {
  orderId: string
}

export function SellerOrderTimeline({ orderId }: SellerOrderTimelineProps) {
  // This would typically come from your data fetching logic
  const timeline = [
    {
      id: 1,
      status: "Order Placed",
      date: "May 15, 2023",
      time: "10:23 AM",
      description: "Order #ORD-001 was placed by Acme Restaurant",
    },
    {
      id: 2,
      status: "Payment Confirmed",
      date: "May 15, 2023",
      time: "10:25 AM",
      description: "Payment of $55.64 was confirmed",
    },
    {
      id: 3,
      status: "Processing",
      date: "May 15, 2023",
      time: "11:30 AM",
      description: "Order is being processed and prepared for shipping",
      current: true,
    },
    {
      id: 4,
      status: "Shipped",
      date: "",
      time: "",
      description: "Order has been shipped",
      upcoming: true,
    },
    {
      id: 5,
      status: "Delivered",
      date: "",
      time: "",
      description: "Order has been delivered",
      upcoming: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-muted">
          {timeline.map((item) => (
            <li key={item.id} className="mb-6 ml-6 last:mb-0">
              <span
                className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${
                  item.upcoming ? "border-2 border-muted bg-background" : item.current ? "bg-blue-500" : "bg-green-500"
                } ring-8 ring-background`}
              >
                {!item.upcoming && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <h3
                className={`mb-1 flex items-center text-sm font-semibold ${
                  item.upcoming ? "text-muted-foreground" : ""
                }`}
              >
                {item.status}
                {item.current && (
                  <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    Current
                  </span>
                )}
              </h3>
              {!item.upcoming && (
                <time className="mb-1 block text-xs text-muted-foreground">
                  {item.date} at {item.time}
                </time>
              )}
              <p className={`text-sm ${item.upcoming ? "text-muted-foreground" : ""}`}>{item.description}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
