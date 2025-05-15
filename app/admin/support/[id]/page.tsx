import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, CheckCircle, Clock, Send, User, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock data for a single ticket
const ticketData = {
  id: "TKT-001",
  subject: "Order delivery issue",
  customer: "John Smith",
  customerEmail: "john@freshfoods.com",
  customerPhone: "+1 (555) 123-4567",
  date: "2023-06-12T09:22:31",
  status: "open",
  priority: "high",
  category: "Delivery",
  assignedTo: "Support Team",
  description:
    "I placed an order (ORD-7652) three days ago and it was supposed to be delivered yesterday, but I still haven't received it. The tracking information hasn't been updated in 24 hours. I need this order urgently for a catering event tomorrow.",
  orderId: "ORD-7652",
  messages: [
    {
      id: "MSG-001",
      sender: "John Smith",
      senderType: "customer",
      message:
        "I placed an order (ORD-7652) three days ago and it was supposed to be delivered yesterday, but I still haven't received it. The tracking information hasn't been updated in 24 hours. I need this order urgently for a catering event tomorrow.",
      date: "2023-06-12T09:22:31",
      avatar: "/placeholder.svg?key=zvm2u",
    },
    {
      id: "MSG-002",
      sender: "Support Agent",
      senderType: "agent",
      message:
        "Hello John, I'm sorry to hear about the delay with your order. I've checked the tracking information and it appears there was a delay at the distribution center. Let me contact the logistics team to expedite your delivery.",
      date: "2023-06-12T10:15:45",
      avatar: "/placeholder.svg?key=0dwi4",
    },
    {
      id: "MSG-003",
      sender: "Support Agent",
      senderType: "agent",
      message:
        "I've spoken with the logistics team and they've confirmed your order is now out for delivery. It should arrive by 2:00 PM today. I've also added a note to prioritize this delivery. Please let me know if you don't receive it by then.",
      date: "2023-06-12T11:30:22",
      avatar: "/placeholder.svg?key=0dwi4",
    },
    {
      id: "MSG-004",
      sender: "John Smith",
      senderType: "customer",
      message: "Thank you for the update. I'll keep an eye out for the delivery this afternoon.",
      date: "2023-06-12T11:45:10",
      avatar: "/placeholder.svg?key=zvm2u",
    },
  ],
}

export default function SupportTicketDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  // In a real app, you would fetch the ticket data based on the ID
  const ticket = ticketData

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/support">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to tickets</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ticket {ticket.id}</h1>
            <p className="text-muted-foreground">
              Opened on {format(new Date(ticket.date), "MMMM dd, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status === "open" && (
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Mark as In Progress
            </Button>
          )}
          {ticket.status !== "closed" && (
            <Button variant="default">
              <CheckCircle className="mr-2 h-4 w-4" />
              Resolve Ticket
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{ticket.subject}</CardTitle>
              <CardDescription>Ticket conversation history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticket.messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.sender}</span>
                        <Badge variant={message.senderType === "agent" ? "outline" : "secondary"}>
                          {message.senderType === "agent" ? "Support" : "Customer"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.date), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="font-medium">Reply to this ticket</div>
                <Textarea placeholder="Type your response here..." className="min-h-[100px]" />
                <div className="flex justify-end">
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Send Response
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {ticket.status === "open" ? (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 flex w-fit items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Open
                  </Badge>
                ) : ticket.status === "in_progress" ? (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 flex w-fit items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    In Progress
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Closed
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Priority</span>
                {ticket.priority === "high" ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    High
                  </Badge>
                ) : ticket.priority === "medium" ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Medium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Low
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category</span>
                <span className="text-sm">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assigned To</span>
                <span className="text-sm">{ticket.assignedTo}</span>
              </div>
              {ticket.orderId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Related Order</span>
                  <Link href={`/admin/orders/${ticket.orderId}`} className="text-sm text-blue-600 hover:underline">
                    {ticket.orderId}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?key=zvm2u" alt={ticket.customer} />
                  <AvatarFallback>{ticket.customer.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{ticket.customer}</div>
                  <div className="text-xs text-muted-foreground">Customer</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{ticket.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{ticket.customerPhone}</span>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/admin/users/${ticket.customer.replace(/\s+/g, "-").toLowerCase()}`}>
                    <User className="mr-2 h-4 w-4" />
                    View Customer Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <CardDescription>Notes visible only to support staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea placeholder="Add internal notes here..." className="min-h-[100px]" />
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
