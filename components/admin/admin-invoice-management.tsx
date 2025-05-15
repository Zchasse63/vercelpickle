"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Search, Filter, ChevronDown, FileText, Mail, Printer, Eye } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-kit"

// Mock invoice data
const invoices = [
  {
    id: "INV-1234",
    date: new Date("2025-05-01"),
    dueDate: new Date("2025-05-15"),
    seller: "Farm Fresh Produce",
    amount: 1250.00,
    fee: 62.50,
    status: "paid",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-1235",
    date: new Date("2025-05-02"),
    dueDate: new Date("2025-05-16"),
    seller: "Dairy Delights",
    amount: 875.50,
    fee: 43.78,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-1236",
    date: new Date("2025-05-03"),
    dueDate: new Date("2025-05-17"),
    seller: "Organic Farms Co.",
    amount: 2340.00,
    fee: 117.00,
    status: "pending",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-1237",
    date: new Date("2025-05-03"),
    dueDate: new Date("2025-05-17"),
    seller: "Meat Masters",
    amount: 4500.00,
    fee: 225.00,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-1238",
    date: new Date("2025-05-04"),
    dueDate: new Date("2025-05-18"),
    seller: "Seafood Specialists",
    amount: 3200.00,
    fee: 160.00,
    status: "overdue",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-1239",
    date: new Date("2025-05-05"),
    dueDate: new Date("2025-05-19"),
    seller: "Bakery Basics",
    amount: 950.00,
    fee: 47.50,
    status: "pending",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-1240",
    date: new Date("2025-05-05"),
    dueDate: new Date("2025-05-19"),
    seller: "Pickle Platform",
    amount: 160.00,
    fee: 0,
    status: "draft",
    paymentMethod: "Bank Transfer"
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    paid: "bg-green-100 text-green-800 hover:bg-green-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    overdue: "bg-red-100 text-red-800 hover:bg-red-100",
    draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function AdminInvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter invoices based on search term and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.seller.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Paginate invoices
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)

  // Export invoices as CSV
  const exportInvoices = () => {
    const headers = ["ID", "Date", "Due Date", "Seller", "Amount", "Fee", "Status", "Payment Method"]
    const csvData = filteredInvoices.map(i => [
      i.id,
      format(i.date, "yyyy-MM-dd"),
      format(i.dueDate, "yyyy-MM-dd"),
      i.seller,
      i.amount.toFixed(2),
      i.fee.toFixed(2),
      i.status,
      i.paymentMethod
    ])
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `invoices-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
        <CardDescription>
          View, manage, and process platform invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportInvoices}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Platform Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.length > 0 ? (
                currentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(invoice.dueDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{invoice.seller}</TableCell>
                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${invoice.fee.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send to Seller
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
                          </DropdownMenuItem>
                          {invoice.status === "draft" && (
                            <DropdownMenuItem>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Mark as Pending
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "pending" && (
                            <DropdownMenuItem>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "overdue" && (
                            <DropdownMenuItem>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {Math.min(filteredInvoices.length, indexOfFirstItem + 1)}-{Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} invoices
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
