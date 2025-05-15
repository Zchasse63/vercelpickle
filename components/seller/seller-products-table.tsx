"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SellerProductsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // This would typically come from your data fetching logic
  const products = [
    {
      id: "PROD-001",
      name: "Organic Carrots (5lb)",
      image: "/bunch-of-carrots.png",
      category: "Vegetables",
      price: "$4.99",
      stock: 120,
      status: "Active",
    },
    {
      id: "PROD-002",
      name: "Fresh Milk (1 Gallon)",
      image: "/glass-of-milk.png",
      category: "Dairy",
      price: "$5.49",
      stock: 85,
      status: "Active",
    },
    {
      id: "PROD-003",
      name: "Artisan Bread Loaf",
      image: "/assorted-breads.png",
      category: "Bakery",
      price: "$3.99",
      stock: 42,
      status: "Active",
    },
    {
      id: "PROD-004",
      name: "Organic Spinach (1lb)",
      image: "/fresh-spinach.png",
      category: "Vegetables",
      price: "$3.49",
      stock: 8,
      status: "Low Stock",
    },
    {
      id: "PROD-005",
      name: "Russet Potatoes (10lb)",
      image: "/pile-of-potatoes.png",
      category: "Vegetables",
      price: "$6.99",
      stock: 65,
      status: "Active",
    },
    {
      id: "PROD-006",
      name: "Assorted Dairy Pack",
      image: "/assorted-dairy-products.png",
      category: "Dairy",
      price: "$12.99",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: "PROD-007",
      name: "Premium Coffee Beans (1lb)",
      image: "/steaming-coffee-cup.png",
      category: "Beverages",
      price: "$14.99",
      stock: 28,
      status: "Active",
    },
  ]

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            data-testid="product-search"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36" data-testid="category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Bakery">Bakery</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-36" data-testid="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Bulk Edit
          </Button>
          <Button size="sm" data-testid="add-product-button">
            Add Product
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table data-testid="products-table">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} data-testid="product-row">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "Active"
                        ? "default"
                        : product.status === "Low Stock"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex items-center">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/seller/products/${product.id}`} className="flex items-center" data-testid="view-product-button">
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/seller/products/${product.id}/edit`} className="flex items-center" data-testid="edit-product-button">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive flex items-center">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
