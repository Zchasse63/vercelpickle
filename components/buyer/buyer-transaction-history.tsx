"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Search, Filter, Eye, FileText } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { SafeButton } from "@/components/ui/safe-button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock transaction data
const transactions = [
  {
    id: "TX-1234",
    date: new Date("2025-05-01"),
    seller: "Farm Fresh Produce",
    items: [
      { name: "Organic Apples (Case)", quantity: 2, price: 45.00 },
      { name: "Fresh Spinach (Box)", quantity: 3, price: 30.00 }
    ],
    total: 180.00,
    status: "completed",
    paymentMethod: "Credit Card"
  },
  {
    id: "TX-1235",
    date: new Date("2025-05-02"),
    seller: "Dairy Delights",
    items: [
      { name: "Premium Cheese (Box)", quantity: 1, price: 75.00 },
      { name: "Organic Milk (Case)", quantity: 2, price: 60.00 }
    ],
    total: 195.00,
    status: "completed",
    paymentMethod: "Credit Card"
  },
  {
    id: "TX-1236",
    date: new Date("2025-05-03"),
    seller: "Organic Farms Co.",
    items: [
      { name: "Organic Carrots (Box)", quantity: 2, price: 35.00 },
      { name: "Fresh Herbs (Bundle)", quantity: 5, price: 15.00 }
    ],
    total: 145.00,
    status: "processing",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TX-1237",
    date: new Date("2025-05-04"),
    seller: "Meat Masters",
    items: [
      { name: "Premium Beef (Case)", quantity: 1, price: 120.00 },
      { name: "Organic Chicken (Box)", quantity: 2, price: 85.00 }
    ],
    total: 290.00,
    status: "completed",
    paymentMethod: "Credit Card"
  },
  {
    id: "TX-1238",
    date: new Date("2025-05-05"),
    seller: "Seafood Specialists",
    items: [
      { name: "Fresh Salmon (Case)", quantity: 1, price: 95.00 },
      { name: "Jumbo Shrimp (Box)", quantity: 1, price: 85.00 }
    ],
    total: 180.00,
    status: "completed",
    paymentMethod: "Bank Transfer"
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    failed: "bg-red-100 text-red-800 hover:bg-red-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function BuyerTransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Paginate transactions
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  // Export transactions as CSV
  const exportTransactions = () => {
    const headers = ["ID", "Date", "Seller", "Items", "Total", "Status", "Payment Method"]
    const csvData = filteredTransactions.map(t => [
      t.id,
      format(t.date, "yyyy-MM-dd"),
      t.seller,
      t.items.map(item => `${item.quantity}x ${item.name}`).join("; "),
      t.total.toFixed(2),
      t.status,
      t.paymentMethod
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `purchase-history-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>
          View and manage your purchase transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search transactions..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <SafeButton variant="outline" onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </SafeButton>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>{transaction.seller}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {transaction.items.map((item, index) => (
                          <span key={index}>
                            {item.quantity}x {item.name}
                            {index < transaction.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${transaction.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <SafeButton variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </SafeButton>
                        <SafeButton variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Receipt</span>
                        </SafeButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {Math.min(filteredTransactions.length, indexOfFirstItem + 1)}-{Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
