"use client"

import { useState } from "react"
import Link from "next/link"
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
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

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
    id: "USR-001",
    name: "John Smith",
    email: "john@freshfoods.com",
    role: "buyer",
    status: "active",
    company: "Fresh Foods Market",
    createdAt: "2023-01-15T09:24:45",
    ordersCount: 48,
  },
  {
    id: "USR-002",
    name: "Sarah Johnson",
    email: "sarah@organicfarms.com",
    role: "seller",
    status: "active",
    company: "Organic Farms Co.",
    createdAt: "2023-02-22T14:32:18",
    ordersCount: 0,
  },
  {
    id: "USR-003",
    name: "Michael Brown",
    email: "michael@greengrocers.com",
    role: "buyer",
    status: "inactive",
    company: "Green Grocers Co.",
    createdAt: "2023-03-10T11:15:36",
    ordersCount: 12,
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily@healthybites.com",
    role: "buyer",
    status: "active",
    company: "Healthy Bites Cafe",
    createdAt: "2023-04-05T08:45:22",
    ordersCount: 27,
  },
  {
    id: "USR-005",
    name: "David Wilson",
    email: "david@farmtotable.com",
    role: "seller",
    status: "pending",
    company: "Farm to Table Restaurant",
    createdAt: "2023-05-18T16:20:10",
    ordersCount: 0,
  },
  {
    id: "USR-006",
    name: "Jessica Martinez",
    email: "jessica@organiclife.com",
    role: "buyer",
    status: "active",
    company: "Organic Life Store",
    createdAt: "2023-06-02T10:12:45",
    ordersCount: 15,
  },
  {
    id: "USR-007",
    name: "Robert Taylor",
    email: "robert@naturalbakery.com",
    role: "seller",
    status: "active",
    company: "Natural Bakery",
    createdAt: "2023-06-20T13:28:55",
    ordersCount: 0,
  },
  {
    id: "USR-008",
    name: "Amanda Clark",
    email: "amanda@freshproduce.com",
    role: "buyer",
    status: "active",
    company: "Fresh Produce Inc.",
    createdAt: "2023-07-08T09:35:17",
    ordersCount: 32,
  },
  {
    id: "USR-009",
    name: "Thomas Rodriguez",
    email: "thomas@greenvalley.com",
    role: "seller",
    status: "inactive",
    company: "Green Valley Foods",
    createdAt: "2023-08-14T15:42:30",
    ordersCount: 0,
  },
  {
    id: "USR-010",
    name: "Jennifer Lee",
    email: "jennifer@naturesbest.com",
    role: "buyer",
    status: "active",
    company: "Nature's Best Supply",
    createdAt: "2023-09-01T11:10:25",
    ordersCount: 19,
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
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.getValue("company")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={role === "seller" ? "outline" : "secondary"}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge
          variant="outline"
          className={
            status === "active"
              ? "bg-green-50 text-green-700 border-green-200"
              : status === "inactive"
                ? "bg-gray-50 text-gray-700 border-gray-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "ordersCount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("ordersCount")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`} data-testid="view-user-button">View user details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="edit-user-button">Edit user</DropdownMenuItem>
            {user.status === "active" ? (
              <DropdownMenuItem className="text-red-600">Deactivate user</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">Activate user</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Fetch users from Convex with error handling
  let usersData = [];
  try {
    usersData = useQuery(api.users.getAll) || [];
  } catch (error) {
    console.error("Error fetching users from Convex:", error);
    // Fall back to sample data
    usersData = [];
  }

  // Transform users data to match the table format if we have real data
  const transformedData = usersData.length > 0
    ? usersData.map(user => ({
        id: user._id,
        name: user.name || "Unknown User",
        email: user.email || "No email",
        role: user.role || "buyer",
        status: "active",
        company: user.businessName || "Not specified",
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        ordersCount: 0,
      }))
    : [];

  // Use real data if available, otherwise use sample data
  const tableData = usersData.length > 0 ? transformedData : data;

  const table = useReactTable({
    data: tableData,
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
    <div className="space-y-4" data-testid="users-table">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-medium">Filter Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                  className="pl-8"
                  data-testid="user-search"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
              <Select
                value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("role")?.setFilterValue(value === "all" ? null : value)}
                data-testid="role-filter"
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                table.getColumn("name")?.setFilterValue("")
                table.getColumn("role")?.setFilterValue(null)
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
              <DropdownMenuLabel>Role</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("role")?.getFilterValue() === "buyer"}
                onCheckedChange={() => {
                  if (table.getColumn("role")?.getFilterValue() === "buyer") {
                    table.getColumn("role")?.setFilterValue(null)
                  } else {
                    table.getColumn("role")?.setFilterValue("buyer")
                  }
                }}
              >
                Buyers
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("role")?.getFilterValue() === "seller"}
                onCheckedChange={() => {
                  if (table.getColumn("role")?.getFilterValue() === "seller") {
                    table.getColumn("role")?.setFilterValue(null)
                  } else {
                    table.getColumn("role")?.setFilterValue("seller")
                  }
                }}
              >
                Sellers
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "active"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "active") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("active")
                  }
                }}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "inactive"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "inactive") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("inactive")
                  }
                }}
              >
                Inactive
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "pending"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "pending") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("pending")
                  }
                }}
              >
                Pending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-8" data-testid="add-user-button">
            <Plus className="mr-2 h-4 w-4" />
            Add User
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} data-testid="user-row">
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
