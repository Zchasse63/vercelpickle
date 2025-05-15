"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Trash, Image as ImageIcon, Loader2 } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductReviews } from "@/components/admin/product-reviews"
import { ProductInventory } from "@/components/admin/product-inventory"
import { ProductAnalytics } from "@/components/admin/product-analytics"

// Mock data for a single product
const productData = {
  id: "PROD-001",
  name: "Organic Apples (5lb)",
  description:
    "Fresh, organic apples grown without pesticides or synthetic fertilizers. These crisp and juicy apples are perfect for snacking, baking, or adding to salads.",
  category: "Fruits",
  price: 12.99,
  stock: 45,
  status: "active",
  seller: "Organic Farms Co.",
  sellerEmail: "sales@organicfarms.com",
  sellerPhone: "+1 (555) 987-6543",
  image: "/placeholder.svg?key=xkpaf",
  sku: "APL-ORG-5LB",
  barcode: "8901234567890",
  weight: "5 lb",
  dimensions: "10 × 8 × 6 in",
  dateAdded: "2023-03-15T10:30:00",
  lastUpdated: "2023-06-02T14:45:00",
  tags: ["organic", "fruit", "apples", "fresh"],
  variants: [
    {
      id: "VAR-001",
      name: "3lb Bag",
      price: 8.99,
      stock: 32,
    },
    {
      id: "VAR-002",
      name: "10lb Box",
      price: 22.99,
      stock: 18,
    },
  ],
  nutritionFacts: {
    servingSize: "1 medium apple (182g)",
    calories: 95,
    totalFat: "0.3g",
    sodium: "2mg",
    totalCarbs: "25g",
    sugars: "19g",
    protein: "0.5g",
  },
  reviews: [
    {
      id: "REV-001",
      customer: "John Smith",
      rating: 5,
      comment: "These apples are incredibly fresh and delicious. Will definitely order again!",
      date: "2023-05-20T09:15:00",
    },
    {
      id: "REV-002",
      customer: "Sarah Johnson",
      rating: 4,
      comment: "Great quality apples, but a couple were bruised upon arrival.",
      date: "2023-05-18T14:30:00",
    },
    {
      id: "REV-003",
      customer: "Michael Brown",
      rating: 5,
      comment: "Perfect for my apple pie recipe. Very fresh and flavorful.",
      date: "2023-05-15T11:45:00",
    },
  ],
  inventoryHistory: [
    {
      date: "2023-06-01T08:30:00",
      action: "Restock",
      quantity: 25,
      notes: "Regular weekly delivery",
    },
    {
      date: "2023-05-25T10:15:00",
      action: "Adjustment",
      quantity: -3,
      notes: "Damaged inventory removal",
    },
    {
      date: "2023-05-20T09:00:00",
      action: "Restock",
      quantity: 30,
      notes: "Regular weekly delivery",
    },
  ],
  salesData: {
    lastWeek: 42,
    lastMonth: 168,
    lastYear: 1850,
    monthlyTrend: [
      { month: "Jan", sales: 120 },
      { month: "Feb", sales: 145 },
      { month: "Mar", sales: 165 },
      { month: "Apr", sales: 140 },
      { month: "May", sales: 168 },
      { month: "Jun", sales: 0 },
    ],
  },
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  // Fetch the product data from Convex
  const product = useQuery(api.products.getById, { id: id as any });
  const seller = useQuery(api.users.getById, product?.sellerId ? { id: product.sellerId } : "skip");

  // Show loading state while data is being fetched
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6" data-testid="product-details">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to products</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="product-title">{product.name}</h1>
            <p className="text-muted-foreground">Product ID: {product._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${id}/edit`} data-testid="edit-product-button">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/products/${id}/pexels`} data-testid="update-image-button">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Update Image with Pexels
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Details about this product.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status</span>
              {product.inventory && product.inventory > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Price</span>
              <span data-testid="product-price">${product.price?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Stock</span>
              <span>{product.inventory || 0} units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Category</span>
              <span>{product.category || "Uncategorized"}</span>
            </div>
            {product.subcategory && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Subcategory</span>
                <span>{product.subcategory}</span>
              </div>
            )}
            {/* SKU is not in the schema, so we'll skip this section */}
            {product.unit && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Unit</span>
                <span>{product.unit}</span>
              </div>
            )}
            {product.specifications?.weight && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Weight</span>
                <span>{product.specifications.weight}</span>
              </div>
            )}
            {product.specifications?.length && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Dimensions</span>
                <span>
                  {[
                    product.specifications.length,
                    product.specifications.width,
                    product.specifications.height
                  ].filter(Boolean).join(" x ")}
                </span>
              </div>
            )}
            <Separator />
            <div>
              <span className="font-medium">Seller</span>
              <div className="mt-1">
                <div>{seller?.businessName || seller?.name || "Unknown Seller"}</div>
                {seller?.email && (
                  <div className="text-sm text-muted-foreground">{seller.email}</div>
                )}
                {/* Phone is not in the user schema */}
              </div>
            </div>
            {product.certifications && product.certifications.length > 0 && (
              <>
                <Separator />
                <div>
                  <span className="font-medium">Certifications</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p data-testid="product-description">{product.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="variants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Different sizes or options for this product.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 text-center text-muted-foreground">
                  No variants available for this product
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
              <CardDescription>Nutritional information per serving.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-bold">Nutrition Facts</div>
                {product.nutritionFacts ? (
                  <>
                    <div className="text-sm">{product.nutritionFacts}</div>
                    <Separator />
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No nutrition facts available for this product
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory History</CardTitle>
              <CardDescription>Track inventory changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center text-muted-foreground">
                No inventory history available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Reviews</CardTitle>
              <CardDescription>Customer feedback and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center text-muted-foreground">
                No reviews available for this product
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 text-center text-muted-foreground">
                No sales data available for this product
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
