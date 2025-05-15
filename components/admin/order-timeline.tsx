import { format } from "date-fns"
import { CheckCircle } from "lucide-react"

interface TimelineItem {
  status: string
  date: string
  description: string
}

export function OrderTimeline({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <div className="space-y-4" data-testid="order-timeline">
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-4" data-testid="timeline-item">
          <div className="relative flex flex-col items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-4 w-4" />
            </div>
            {index < timeline.length - 1 && <div className="h-full w-px bg-green-200" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="font-medium" data-testid="timeline-status">{item.status}</div>
            <div className="text-sm text-muted-foreground" data-testid="timeline-date">
              {format(new Date(item.date), "MMM dd, yyyy 'at' h:mm a")}
            </div>
            <div className="mt-1 text-sm" data-testid="timeline-description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
