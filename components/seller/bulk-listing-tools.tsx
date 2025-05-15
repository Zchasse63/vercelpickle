"use client"

import { useState } from "react"
import { Upload, FileSpreadsheet, FileText, CheckCircle2, AlertCircle, Copy, Download, RefreshCw, Table as TableIcon, List, Grid, Search } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@/components/ui-kit"

// Mock data for bulk listings
const mockListings = [
  {
    id: "prod-1",
    name: "Organic Gala Apples",
    category: "Produce",
    subcategory: "Fruits",
    unit: "Case (88 ct)",
    price: 45.00,
    quantity: 200,
    description: "Fresh organic Gala apples, medium size, excellent quality",
    status: "active",
  },
  {
    id: "prod-2",
    name: "Premium Cheddar Cheese",
    category: "Dairy",
    subcategory: "Cheese",
    unit: "Box (10 lb)",
    price: 75.00,
    quantity: 50,
    description: "Aged cheddar cheese, sharp flavor profile, perfect for retail",
    status: "active",
  },
  {
    id: "prod-3",
    name: "Organic Spinach",
    category: "Produce",
    subcategory: "Vegetables",
    unit: "Case (24 bunches)",
    price: 36.00,
    quantity: 100,
    description: "Fresh organic spinach, triple-washed, ready for retail",
    status: "active",
  },
  {
    id: "prod-4",
    name: "Artisan Sourdough Bread",
    category: "Bakery",
    subcategory: "Bread",
    unit: "Case (12 loaves)",
    price: 48.00,
    quantity: 40,
    description: "Freshly baked artisan sourdough bread, 1.5 lb loaves",
    status: "active",
  },
  {
    id: "prod-5",
    name: "Grass-Fed Ground Beef",
    category: "Meat",
    subcategory: "Beef",
    unit: "Case (20 lb)",
    price: 120.00,
    quantity: 30,
    description: "Premium grass-fed ground beef, 85% lean, vacuum sealed",
    status: "active",
  },
]

// Template data
const templateFields = [
  { name: "product_name", required: true, description: "Full product name" },
  { name: "category", required: true, description: "Main product category" },
  { name: "subcategory", required: false, description: "Product subcategory" },
  { name: "unit_type", required: true, description: "Selling unit (e.g., Case, Box, Pallet)" },
  { name: "unit_size", required: true, description: "Size or count per unit" },
  { name: "price", required: true, description: "Price per unit in USD" },
  { name: "quantity", required: true, description: "Available quantity" },
  { name: "description", required: true, description: "Detailed product description" },
  { name: "origin", required: false, description: "Product origin location" },
  { name: "best_by_date", required: false, description: "Best by date (if applicable)" },
  { name: "storage_requirements", required: false, description: "Storage requirements" },
  { name: "certifications", required: false, description: "Organic, Non-GMO, etc." },
]

export function BulkListingTools() {
  const [listings, setListings] = useState(mockListings)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid" | "list">("table")

  // Simulate file upload
  const handleFileUpload = () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Filter listings based on search term
  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bulk Listing Tools</h2>
          <p className="text-muted-foreground">
            Efficiently manage multiple product listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Listings
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Inventory
          </Button>
        </div>
      </div>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Current Listings</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search listings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded-md p-1 flex items-center">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("table")}
                >
                  <TableIcon className="h-4 w-4" />
                  <span className="sr-only">Table view</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {viewMode === "table" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">
                          <div>
                            {listing.name}
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {listing.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {listing.category}
                            {listing.subcategory && (
                              <p className="text-xs text-muted-foreground">
                                {listing.subcategory}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{listing.unit}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${listing.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {listing.quantity}
                        </TableCell>
                        <TableCell>
                          <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                              <Separator />
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No listings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{listing.name}</CardTitle>
                        <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                          {listing.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {listing.category} {listing.subcategory && `› ${listing.subcategory}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        {listing.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{listing.unit}</p>
                          <p className="text-xs text-muted-foreground">
                            {listing.quantity} available
                          </p>
                        </div>
                        <p className="text-lg font-bold">${listing.price.toFixed(2)}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Duplicate</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-gray-500">
                  No listings found
                </div>
              )}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-2">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{listing.name}</h3>
                        <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                          {listing.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {listing.category} • {listing.unit} • ${listing.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{listing.quantity} available</p>
                      <div className="flex gap-1 mt-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Duplicate</Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No listings found
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Inventory</CardTitle>
              <CardDescription>
                Upload multiple product listings at once using CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Upload Inventory File</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Drag and drop your CSV or Excel file here, or click to browse your files.
                    Make sure your file follows our template format.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleFileUpload}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>

              {uploadStatus !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {uploadStatus === "uploading" && "Uploading..."}
                      {uploadStatus === "success" && "Upload Complete"}
                      {uploadStatus === "error" && "Upload Failed"}
                    </p>
                    <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />

                  {uploadStatus === "success" && (
                    <Alert variant="default" className="mt-4 border-green-500 bg-green-50 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Upload Successful</AlertTitle>
                      <AlertDescription>
                        Your inventory file has been processed successfully. 5 new products added.
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadStatus === "error" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Upload Failed</AlertTitle>
                      <AlertDescription>
                        There was an error processing your file. Please check the format and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>File Requirements</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>File must be CSV or Excel (.xlsx) format</li>
                    <li>Maximum file size: 10MB</li>
                    <li>First row must contain column headers</li>
                    <li>Required fields: product_name, category, unit_type, unit_size, price, quantity</li>
                    <li>Use our template for the correct format</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Templates</CardTitle>
              <CardDescription>
                Download and use our templates for bulk inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Standard Inventory Template</CardTitle>
                    <CardDescription>
                      Basic template with all required fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>CSV and Excel formats available</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Detailed Inventory Template</CardTitle>
                    <CardDescription>
                      Extended template with all optional fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Includes all optional fields and examples</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateFields.map((field) => (
                      <TableRow key={field.name}>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>
                          {field.required ? (
                            <Badge variant="default">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>{field.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Alert className="mt-4">
                <FileText className="h-4 w-4" />
                <AlertTitle>Template Tips</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Do not modify column headers in the templates</li>
                    <li>Leave optional fields blank if not applicable</li>
                    <li>Use the exact format shown in the examples</li>
                    <li>For categories, use our standard category names for best results</li>
                    <li>Prices should be entered without the dollar sign</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
