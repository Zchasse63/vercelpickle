"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SellerInventoryTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // This would typically come from your data fetching logic
  const inventory = [
    {
      id: "PROD-001",
      name: "Organic Carrots (5lb)",
      image: "/bunch-of-carrots.png",
      category: "Vegetables",
      sku: "VEG-CARR-5LB",
      stock: 120,
      threshold: 50,
      percentage: 240,
    },
    {
      id: "PROD-002",
      name: "Fresh Milk (1 Gallon)",
      image: "/glass-of-milk.png",
      category: "Dairy",
      sku: "DAIRY-MILK-1G",
      stock: 85,
      threshold: 100,
      percentage: 85,
    },
    {
      id: "PROD-003",
      name: "Artisan Bread Loaf",
      image: "/assorted-breads.png",
      category: "Bakery",
      sku: "BAK-BREAD-ART",
      stock: 42,
      threshold: 40,
      percentage: 105,
    },
    {
      id: "PROD-004",
      name: "Organic Spinach (1lb)",
      image: "/fresh-spinach.png",
      category: "Vegetables",
      sku: "VEG-SPIN-1LB",
      stock: 8,
      threshold: 30,
      percentage: 27,
    },
    {
      id: "PROD-005",
      name: "Russet Potatoes (10lb)",
      image: "/pile-of-potatoes.png",
      category: "Vegetables",
      sku: "VEG-POT-10LB",
      stock: 65,
      threshold: 60,
      percentage: 108,
    },
    {
      id: "PROD-006",
      name: "Assorted Dairy Pack",
      image: "/assorted-dairy-products.png",
      category: "Dairy",
      sku: "DAIRY-ASST-PK",
      stock: 0,
      threshold: 20,
      percentage: 0,
    },
    {
      id: "PROD-007",
      name: "Premium Coffee Beans (1lb)",
      image: "/steaming-coffee-cup.png",
      category: "Beverages",
      sku: "BEV-COFF-1LB",
      stock: 28,
      threshold: 25,
      percentage: 112,
    },
  ]

  // Filter inventory based on search query and category
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
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
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Bulk Update
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={item.stock === 0 ? "text-destructive" : item.percentage < 50 ? "text-amber-500" : ""}
                      >
                        {item.stock} in stock
                      </span>
                      <span className="text-muted-foreground">Min: {item.threshold}</span>
                    </div>
                    <Progress
                      value={Math.min(item.percentage, 100)}
                      className="h-2"
                      indicatorClassName={
                        item.stock === 0 ? "bg-destructive" : item.percentage < 50 ? "bg-amber-500" : undefined
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Restock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
