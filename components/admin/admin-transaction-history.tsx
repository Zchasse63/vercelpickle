"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Search, Filter, ChevronDown } from "lucide-react"

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

// Mock transaction data
const transactions = [
  {
    id: "TX-1234",
    date: new Date("2025-05-01"),
    seller: "Farm Fresh Produce",
    buyer: "Metro Grocery",
    amount: 1250.00,
    fee: 62.50,
    status: "completed",
    type: "sale"
  },
  {
    id: "TX-1235",
    date: new Date("2025-05-02"),
    seller: "Dairy Delights",
    buyer: "Sunshine Catering",
    amount: 875.50,
    fee: 43.78,
    status: "completed",
    type: "sale"
  },
  {
    id: "TX-1236",
    date: new Date("2025-05-03"),
    seller: "Organic Farms Co.",
    buyer: "Health Foods Inc.",
    amount: 2340.00,
    fee: 117.00,
    status: "processing",
    type: "sale"
  },
  {
    id: "TX-1237",
    date: new Date("2025-05-03"),
    seller: "Meat Masters",
    buyer: "Restaurant Supply Co.",
    amount: 4500.00,
    fee: 225.00,
    status: "completed",
    type: "sale"
  },
  {
    id: "TX-1238",
    date: new Date("2025-05-04"),
    seller: "Seafood Specialists",
    buyer: "Coastal Restaurants",
    amount: 3200.00,
    fee: 160.00,
    status: "failed",
    type: "sale"
  },
  {
    id: "TX-1239",
    date: new Date("2025-05-05"),
    seller: "Bakery Basics",
    buyer: "Coffee Shop Chain",
    amount: 950.00,
    fee: 47.50,
    status: "completed",
    type: "sale"
  },
  {
    id: "TX-1240",
    date: new Date("2025-05-05"),
    seller: "Pickle Platform",
    buyer: "Seafood Specialists",
    amount: 160.00,
    fee: 0,
    status: "completed",
    type: "payout"
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

export function AdminTransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Paginate transactions
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  // Export transactions as CSV
  const exportTransactions = () => {
    const headers = ["ID", "Date", "Seller", "Buyer", "Amount", "Fee", "Status", "Type"]
    const csvData = filteredTransactions.map(t => [
      t.id,
      format(t.date, "yyyy-MM-dd"),
      t.seller,
      t.buyer,
      t.amount.toFixed(2),
      t.fee.toFixed(2),
      t.status,
      t.type
    ])
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View and manage all platform transactions
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="payout">Payout</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Platform Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
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
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${transaction.fee.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          {transaction.status === "processing" && (
                            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                          )}
                          {transaction.status === "failed" && (
                            <DropdownMenuItem>Retry Transaction</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-gray-500">
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
