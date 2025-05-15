import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const tickets = [
  {
    id: "TKT-1234",
    subject: "Order delivery delay",
    status: "Open",
    priority: "High",
    created: "2023-05-01",
    updated: "2023-05-02",
  },
  {
    id: "TKT-1235",
    subject: "Product quality issue",
    status: "In Progress",
    priority: "Medium",
    created: "2023-05-03",
    updated: "2023-05-04",
  },
  {
    id: "TKT-1236",
    subject: "Billing question",
    status: "Closed",
    priority: "Low",
    created: "2023-05-05",
    updated: "2023-05-06",
  },
  {
    id: "TKT-1237",
    subject: "Return request",
    status: "Open",
    priority: "Medium",
    created: "2023-05-07",
    updated: "2023-05-07",
  },
  {
    id: "TKT-1238",
    subject: "Missing item in order",
    status: "Closed",
    priority: "High",
    created: "2023-05-08",
    updated: "2023-05-10",
  },
]

export function BuyerSupportTickets() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.status === "Open" ? "default" : ticket.status === "In Progress" ? "outline" : "secondary"
                  }
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.priority === "High" ? "destructive" : ticket.priority === "Medium" ? "default" : "outline"
                  }
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{ticket.created}</TableCell>
              <TableCell className="hidden md:table-cell">{ticket.updated}</TableCell>
              <TableCell className="text-right">
                <Link href={`/buyer/support/${ticket.id.toLowerCase()}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tickets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500">You don't have any support tickets yet.</p>
          <Button className="mt-4">Create Ticket</Button>
        </div>
      )}
    </div>
  )
}
