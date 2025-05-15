"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const data = [
  {
    id: "ORD-7652",
    customer: "Fresh Foods Market",
    customerEmail: "orders@freshfoods.com",
    date: "2023-06-12T09:22:31",
    amount: 125.5,
    status: "completed",
    items: 5,
    seller: "Organic Farms Co.",
  },
  {
    id: "ORD-7651",
    customer: "Green Grocers Co.",
    customerEmail: "purchasing@greengrocers.com",
    date: "2023-06-12T08:45:12",
    amount: 247.8,
    status: "processing",
    items: 8,
    seller: "Farm Direct LLC",
  },
  {
    id: "ORD-7650",
    customer: "Healthy Bites Cafe",
    customerEmail: "kitchen@healthybites.com",
    date: "2023-06-12T07:32:45",
    amount: 86.25,
    status: "completed",
    items: 3,
    seller: "Fresh Produce Inc.",
  },
  {
    id: "ORD-7649",
    customer: "Farm to Table Restaurant",
    customerEmail: "chef@farmtotable.com",
    date: "2023-06-12T06:18:22",
    amount: 325.4,
    status: "cancelled",
    items: 12,
    seller: "Green Valley Foods",
  },
  {
    id: "ORD-7648",
    customer: "Organic Life Store",
    customerEmail: "inventory@organiclife.com",
    date: "2023-06-11T22:15:36",
    amount: 174.9,
    status: "completed",
    items: 7,
    seller: "Nature's Best Supply",
  },
  {
    id: "ORD-7647",
    customer: "Natural Bakery",
    customerEmail: "bakery@naturalbakery.com",
    date: "2023-06-11T20:42:18",
    amount: 95.75,
    status: "processing",
    items: 4,
    seller: "Organic Farms Co.",
  },
  {
    id: "ORD-7646",
    customer: "Wellness Foods Co.",
    customerEmail: "orders@wellnessfoods.com",
    date: "2023-06-11T18:30:55",
    amount: 215.3,
    status: "completed",
    items: 9,
    seller: "Farm Direct LLC",
  },
  {
    id: "ORD-7645",
    customer: "Fresh Foods Market",
    customerEmail: "orders@freshfoods.com",
    date: "2023-06-11T16:25:42",
    amount: 132.6,
    status: "processing",
    items: 6,
    seller: "Fresh Produce Inc.",
  },
  {
    id: "ORD-7644",
    customer: "Green Grocers Co.",
    customerEmail: "purchasing@greengrocers.com",
    date: "2023-06-11T14:18:10",
    amount: 78.4,
    status: "cancelled",
    items: 2,
    seller: "Green Valley Foods",
  },
  {
    id: "ORD-7643",
    customer: "Healthy Bites Cafe",
    customerEmail: "kitchen@healthybites.com",
    date: "2023-06-11T12:05:33",
    amount: 156.2,
    status: "completed",
    items: 5,
    seller: "Nature's Best Supply",
  },
]

// Table columns definition
const columns: ColumnDef<(typeof data)[0]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link href={`/admin/orders/${row.getValue("id")}`} className="font-medium text-blue-600 hover:underline">
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: ({ row }) => <div>{row.getValue("seller")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{format(new Date(row.getValue("date")), "MMM dd, yyyy")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-right">${row.getValue<number>("amount").toFixed(2)}</div>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <div className="text-center">{row.getValue("items")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (status === "completed") {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        )
      }

      if (status === "processing") {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        )
      }

      if (status === "cancelled") {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex w-fit items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      }

      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Copy order ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`} data-testid="view-order-button">View order details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Print invoice</DropdownMenuItem>
            {order.status === "processing" && (
              <DropdownMenuItem className="text-green-600">Mark as completed</DropdownMenuItem>
            )}
            {order.status === "processing" && (
              <DropdownMenuItem className="text-red-600">Cancel order</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function OrdersTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4" data-testid="orders-table">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-medium">Filter Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1">Search Order ID</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search orders..."
                  value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
                  className="pl-8"
                  data-testid="order-search"
                />
              </div>
            </div>
            <div>
              <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
              <Input
                id="customer"
                placeholder="Customer name..."
                value={(table.getColumn("customer")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("customer")?.setFilterValue(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? null : value)}
                data-testid="status-filter"
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="seller" className="block text-sm font-medium mb-1">Seller</label>
              <Input
                id="seller"
                placeholder="Seller name..."
                value={(table.getColumn("seller")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("seller")?.setFilterValue(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium mb-1">Date From</label>
              <Input
                id="date-from"
                type="date"
                placeholder="From date..."
              />
            </div>
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium mb-1">Date To</label>
              <Input
                id="date-to"
                type="date"
                placeholder="To date..."
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                table.getColumn("id")?.setFilterValue("")
                table.getColumn("customer")?.setFilterValue("")
                table.getColumn("seller")?.setFilterValue("")
                table.getColumn("status")?.setFilterValue(null)
              }}
            >
              Reset Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Quick Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "completed"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "completed") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("completed")
                  }
                }}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "processing"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "processing") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("processing")
                  }
                }}
              >
                Processing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "cancelled"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "cancelled") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("cancelled")
                  }
                }}
              >
                Cancelled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} data-testid="order-row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
