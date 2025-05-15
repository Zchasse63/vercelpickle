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
import { ArrowUpDown, CheckCircle, ChevronDown, Clock, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react"

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

// Sample data
const data = [
  {
    id: "TKT-001",
    subject: "Order delivery issue",
    customer: "John Smith",
    customerEmail: "john@freshfoods.com",
    date: "2023-06-12T09:22:31",
    status: "open",
    priority: "high",
    category: "Delivery",
    assignedTo: "Support Team",
  },
  {
    id: "TKT-002",
    subject: "Payment not processed",
    customer: "Sarah Johnson",
    customerEmail: "sarah@organicfarms.com",
    date: "2023-06-11T14:15:22",
    status: "in_progress",
    priority: "medium",
    category: "Payment",
    assignedTo: "Finance Team",
  },
  {
    id: "TKT-003",
    subject: "Product quality complaint",
    customer: "Michael Brown",
    customerEmail: "michael@greengrocers.com",
    date: "2023-06-10T11:30:45",
    status: "closed",
    priority: "low",
    category: "Product",
    assignedTo: "Quality Team",
  },
  {
    id: "TKT-004",
    subject: "Account access issue",
    customer: "Emily Davis",
    customerEmail: "emily@healthybites.com",
    date: "2023-06-09T16:45:12",
    status: "open",
    priority: "medium",
    category: "Account",
    assignedTo: "Tech Support",
  },
  {
    id: "TKT-005",
    subject: "Refund request",
    customer: "David Wilson",
    customerEmail: "david@farmtotable.com",
    date: "2023-06-08T10:20:33",
    status: "in_progress",
    priority: "high",
    category: "Refund",
    assignedTo: "Finance Team",
  },
  {
    id: "TKT-006",
    subject: "Missing items in order",
    customer: "Jessica Martinez",
    customerEmail: "jessica@organiclife.com",
    date: "2023-06-07T13:10:55",
    status: "closed",
    priority: "medium",
    category: "Order",
    assignedTo: "Support Team",
  },
  {
    id: "TKT-007",
    subject: "Billing discrepancy",
    customer: "Robert Taylor",
    customerEmail: "robert@naturalbakery.com",
    date: "2023-06-06T09:05:18",
    status: "open",
    priority: "high",
    category: "Billing",
    assignedTo: "Finance Team",
  },
  {
    id: "TKT-008",
    subject: "Website navigation issue",
    customer: "Amanda Clark",
    customerEmail: "amanda@freshproduce.com",
    date: "2023-06-05T15:30:42",
    status: "in_progress",
    priority: "low",
    category: "Website",
    assignedTo: "Tech Support",
  },
  {
    id: "TKT-009",
    subject: "Product recommendation request",
    customer: "Thomas Rodriguez",
    customerEmail: "thomas@greenvalley.com",
    date: "2023-06-04T11:25:37",
    status: "closed",
    priority: "low",
    category: "Product",
    assignedTo: "Sales Team",
  },
  {
    id: "TKT-010",
    subject: "Delivery address change",
    customer: "Jennifer Lee",
    customerEmail: "jennifer@naturesbest.com",
    date: "2023-06-03T14:50:29",
    status: "closed",
    priority: "medium",
    category: "Delivery",
    assignedTo: "Support Team",
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
    header: "Ticket ID",
    cell: ({ row }) => (
      <Link href={`/admin/support/${row.getValue("id")}`} className="font-medium text-blue-600 hover:underline">
        {row.getValue("id")}
      </Link>
    ),
  },
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div>{row.getValue("customer")}</div>
        <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
      </div>
    ),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (status === "open") {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex w-fit items-center gap-1">
            <Clock className="h-3 w-3" />
            Open
          </Badge>
        )
      }

      if (status === "in_progress") {
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex w-fit items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        )
      }

      if (status === "closed") {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Closed
          </Badge>
        )
      }

      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string

      if (priority === "high") {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      }

      if (priority === "medium") {
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      }

      if (priority === "low") {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      }

      return <Badge variant="outline">{priority}</Badge>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => <div>{row.getValue("assignedTo")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ticket.id)}>Copy ticket ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/support/${ticket.id}`}>View ticket details</Link>
            </DropdownMenuItem>
            {ticket.status !== "closed" && (
              <DropdownMenuItem className="text-green-600">Mark as resolved</DropdownMenuItem>
            )}
            {ticket.status === "closed" && <DropdownMenuItem className="text-blue-600">Reopen ticket</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function SupportTicketsTable() {
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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("subject")?.setFilterValue(event.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "open"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "open") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("open")
                  }
                }}
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "in_progress"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "in_progress") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("in_progress")
                  }
                }}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "closed"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "closed") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("closed")
                  }
                }}
              >
                Closed
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("priority")?.getFilterValue() === "high"}
                onCheckedChange={() => {
                  if (table.getColumn("priority")?.getFilterValue() === "high") {
                    table.getColumn("priority")?.setFilterValue(null)
                  } else {
                    table.getColumn("priority")?.setFilterValue("high")
                  }
                }}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("priority")?.getFilterValue() === "medium"}
                onCheckedChange={() => {
                  if (table.getColumn("priority")?.getFilterValue() === "medium") {
                    table.getColumn("priority")?.setFilterValue(null)
                  } else {
                    table.getColumn("priority")?.setFilterValue("medium")
                  }
                }}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("priority")?.getFilterValue() === "low"}
                onCheckedChange={() => {
                  if (table.getColumn("priority")?.getFilterValue() === "low") {
                    table.getColumn("priority")?.setFilterValue(null)
                  } else {
                    table.getColumn("priority")?.setFilterValue("low")
                  }
                }}
              >
                Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
