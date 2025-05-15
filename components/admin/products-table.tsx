"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
    id: "PROD-001",
    name: "Organic Apples (5lb)",
    category: "Fruits",
    price: 12.99,
    stock: 45,
    status: "active",
    seller: "Organic Farms Co.",
    image: "/placeholder.svg?key=xkpaf",
  },
  {
    id: "PROD-002",
    name: "Fresh Broccoli (2lb)",
    category: "Vegetables",
    price: 4.99,
    stock: 78,
    status: "active",
    seller: "Farm Direct LLC",
    image: "/placeholder.svg?key=4qn46",
  },
  {
    id: "PROD-003",
    name: "Grass-Fed Ground Beef",
    category: "Meat",
    price: 8.99,
    stock: 32,
    status: "active",
    seller: "Green Valley Foods",
    image: "/placeholder.svg?key=yjq8f",
  },
  {
    id: "PROD-004",
    name: "Organic Whole Milk",
    category: "Dairy",
    price: 5.99,
    stock: 54,
    status: "active",
    seller: "Nature's Best Supply",
    image: "/placeholder.svg?key=km2uz",
  },
  {
    id: "PROD-005",
    name: "Sourdough Bread",
    category: "Bakery",
    price: 6.99,
    stock: 23,
    status: "active",
    seller: "Natural Bakery",
    image: "/placeholder.svg?key=2qkr6",
  },
  {
    id: "PROD-006",
    name: "Organic Spinach (1lb)",
    category: "Vegetables",
    price: 3.99,
    stock: 0,
    status: "out_of_stock",
    seller: "Farm Direct LLC",
    image: "/placeholder.svg?key=mxxmi",
  },
  {
    id: "PROD-007",
    name: "Free-Range Eggs (12pk)",
    category: "Dairy",
    price: 4.49,
    stock: 42,
    status: "active",
    seller: "Organic Farms Co.",
    image: "/placeholder.svg?key=uhrut",
  },
  {
    id: "PROD-008",
    name: "Artisan Cheese Selection",
    category: "Dairy",
    price: 15.99,
    stock: 18,
    status: "active",
    seller: "Nature's Best Supply",
    image: "/placeholder.svg?key=5w24w",
  },
  {
    id: "PROD-009",
    name: "Organic Blueberries (1pt)",
    category: "Fruits",
    price: 4.99,
    stock: 0,
    status: "out_of_stock",
    seller: "Organic Farms Co.",
    image: "/placeholder.svg?key=xorw5",
  },
  {
    id: "PROD-010",
    name: "Grass-Fed Ribeye Steak",
    category: "Meat",
    price: 18.99,
    stock: 12,
    status: "active",
    seller: "Green Valley Foods",
    image: "/placeholder.svg?key=sfvjw",
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
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
        <Image
          src={row.getValue("image") || "/placeholder.svg"}
          alt={row.getValue("name")}
          fill
          className="object-cover"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        <Link href={`/admin/products/${row.getValue("id")}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
        <div className="text-xs text-muted-foreground">SKU: {row.getValue("id")}</div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          data-testid="sort-by-price"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-right">${row.getValue<number>("price").toFixed(2)}</div>,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (status === "active") {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      }

      if (status === "out_of_stock") {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Out of Stock
          </Badge>
        )
      }

      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    accessorKey: "seller",
    header: "Seller",
    cell: ({ row }) => <div>{row.getValue("seller")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`} data-testid="view-product-button">View product details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}/edit`} data-testid="edit-product-button">Edit product</Link>
            </DropdownMenuItem>
            {product.status === "active" ? (
              <DropdownMenuItem className="text-red-600">Deactivate product</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">Activate product</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ProductsTable() {
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
    <div className="space-y-4" data-testid="products-table">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-medium">Filter Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1">Search Product</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                  className="pl-8"
                  data-testid="product-search"
                />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={(table.getColumn("category")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("category")?.setFilterValue(value === "all" ? null : value)}
                data-testid="category-filter"
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
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
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="seller" className="block text-sm font-medium mb-1">Seller</label>
              <Select
                value={(table.getColumn("seller")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => table.getColumn("seller")?.setFilterValue(value === "all" ? null : value)}
              >
                <SelectTrigger id="seller">
                  <SelectValue placeholder="All Sellers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sellers</SelectItem>
                  <SelectItem value="Organic Farms Co.">Organic Farms Co.</SelectItem>
                  <SelectItem value="Farm Direct LLC">Farm Direct LLC</SelectItem>
                  <SelectItem value="Green Valley Foods">Green Valley Foods</SelectItem>
                  <SelectItem value="Nature's Best Supply">Nature's Best Supply</SelectItem>
                  <SelectItem value="Natural Bakery">Natural Bakery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="price-min" className="block text-sm font-medium mb-1">Min Price</label>
              <Input
                id="price-min"
                type="number"
                placeholder="Min price..."
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="price-max" className="block text-sm font-medium mb-1">Max Price</label>
              <Input
                id="price-max"
                type="number"
                placeholder="Max price..."
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                table.getColumn("name")?.setFilterValue("")
                table.getColumn("category")?.setFilterValue(null)
                table.getColumn("status")?.setFilterValue(null)
                table.getColumn("seller")?.setFilterValue(null)
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
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("category")?.getFilterValue() === "Fruits"}
                onCheckedChange={() => {
                  if (table.getColumn("category")?.getFilterValue() === "Fruits") {
                    table.getColumn("category")?.setFilterValue(null)
                  } else {
                    table.getColumn("category")?.setFilterValue("Fruits")
                  }
                }}
              >
                Fruits
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("category")?.getFilterValue() === "Vegetables"}
                onCheckedChange={() => {
                  if (table.getColumn("category")?.getFilterValue() === "Vegetables") {
                    table.getColumn("category")?.setFilterValue(null)
                  } else {
                    table.getColumn("category")?.setFilterValue("Vegetables")
                  }
                }}
              >
                Vegetables
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("category")?.getFilterValue() === "Meat"}
                onCheckedChange={() => {
                  if (table.getColumn("category")?.getFilterValue() === "Meat") {
                    table.getColumn("category")?.setFilterValue(null)
                  } else {
                    table.getColumn("category")?.setFilterValue("Meat")
                  }
                }}
              >
                Meat
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("category")?.getFilterValue() === "Dairy"}
                onCheckedChange={() => {
                  if (table.getColumn("category")?.getFilterValue() === "Dairy") {
                    table.getColumn("category")?.setFilterValue(null)
                  } else {
                    table.getColumn("category")?.setFilterValue("Dairy")
                  }
                }}
              >
                Dairy
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("category")?.getFilterValue() === "Bakery"}
                onCheckedChange={() => {
                  if (table.getColumn("category")?.getFilterValue() === "Bakery") {
                    table.getColumn("category")?.setFilterValue(null)
                  } else {
                    table.getColumn("category")?.setFilterValue("Bakery")
                  }
                }}
              >
                Bakery
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
                checked={table.getColumn("status")?.getFilterValue() === "out_of_stock"}
                onCheckedChange={() => {
                  if (table.getColumn("status")?.getFilterValue() === "out_of_stock") {
                    table.getColumn("status")?.setFilterValue(null)
                  } else {
                    table.getColumn("status")?.setFilterValue("out_of_stock")
                  }
                }}
              >
                Out of Stock
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-8" data-testid="add-product-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} data-testid="product-row">
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
