"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, ImageIcon } from "lucide-react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PexelsImageModal } from "@/components/ui/pexels-image-modal"

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  inventory: number;
  images: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingNotes: string;
}

export function SellerAddProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    price: 0,
    cost: 0,
    sku: "",
    inventory: 0,
    images: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    shippingNotes: ""
  })

  // Convex action to create a product
  const createProduct = useAction(api.products.create)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProductData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleDimensionChange = (dimension: 'length' | 'width' | 'height', value: string) => {
    setProductData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: parseFloat(value) || 0
      }
    }))
  }

  const handleImagesSelected = (images: string[]) => {
    setProductData(prev => ({
      ...prev,
      images
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the seller ID (in a real app, this would come from auth)
      // For now, we'll use a placeholder
      const sellerId = "placeholder_seller_id"

      // Create the product in Convex
      await createProduct({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sellerId,
        category: productData.category,
        images: productData.images.length > 0 ? productData.images : ["/placeholder-product.jpg"],
        inventory: productData.inventory,
        unit: "each", // Default unit
      })

      router.push("/seller/products")
    } catch (error) {
      console.error("Error creating product:", error)
      // Handle error (show error message, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="product-form">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel htmlFor="name">Product Name</FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={handleInputChange}
                    data-testid="product-name-input"
                  />
                  <FormDescription>The name of your product as it will appear to customers.</FormDescription>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category" data-testid="product-category-select">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                      <SelectItem value="meat">Meat & Poultry</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={5}
                    value={productData.description}
                    onChange={handleInputChange}
                    data-testid="product-description-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="rounded-l-none"
                      value={productData.price || ""}
                      onChange={(e) => setProductData(prev => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0
                      }))}
                      data-testid="product-price-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="cost">Cost</FormLabel>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="rounded-l-none"
                      value={productData.cost || ""}
                      onChange={(e) => setProductData(prev => ({
                        ...prev,
                        cost: parseFloat(e.target.value) || 0
                      }))}
                      data-testid="product-cost-input"
                    />
                  </div>
                  <FormDescription>Your cost (not visible to customers).</FormDescription>
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="sku">SKU</FormLabel>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={productData.sku}
                    onChange={handleInputChange}
                    data-testid="product-sku-input"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="inventory">Inventory</FormLabel>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={productData.inventory || ""}
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      inventory: parseInt(e.target.value) || 0
                    }))}
                    data-testid="product-inventory-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <FormLabel>Product Images</FormLabel>

                  {productData.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="product-images-grid">
                      {productData.images.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => setProductData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            data-testid={`remove-image-${index}`}
                          >
                            <span className="sr-only">Remove image</span>
                            ×
                          </Button>
                        </div>
                      ))}

                      {productData.images.length < 5 && (
                        <PexelsImageModal
                          productName={productData.name}
                          productCategory={productData.category}
                          onImagesSelected={handleImagesSelected}
                          initialImages={productData.images}
                          maxImages={5}
                          trigger={
                            <div className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 p-4 text-center hover:bg-muted aspect-square">
                              <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Add more images</p>
                            </div>
                          }
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md" data-testid="empty-images-container">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No product images selected</p>
                      <PexelsImageModal
                        productName={productData.name}
                        productCategory={productData.category}
                        onImagesSelected={handleImagesSelected}
                        maxImages={5}
                        buttonText="Select Images from Pexels"
                      />
                    </div>
                  )}

                  <FormDescription>
                    Select up to 5 images from Pexels. The first image will be the main product image.
                    Images are automatically sourced from Pexels based on your product name and category.
                  </FormDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel htmlFor="weight">Weight (lbs)</FormLabel>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={productData.weight || ""}
                    onChange={(e) => setProductData(prev => ({
                      ...prev,
                      weight: parseFloat(e.target.value) || 0
                    }))}
                    data-testid="product-weight-input"
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel htmlFor="dimensions">Dimensions (in)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="L"
                      value={productData.dimensions.length || ""}
                      onChange={(e) => handleDimensionChange('length', e.target.value)}
                      data-testid="product-length-input"
                    />
                    <Input
                      placeholder="W"
                      value={productData.dimensions.width || ""}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      data-testid="product-width-input"
                    />
                    <Input
                      placeholder="H"
                      value={productData.dimensions.height || ""}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      data-testid="product-height-input"
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <FormLabel htmlFor="shippingNotes">Shipping Notes</FormLabel>
                  <Textarea
                    id="shippingNotes"
                    placeholder="Any special shipping instructions"
                    rows={3}
                    value={productData.shippingNotes}
                    onChange={handleInputChange}
                    data-testid="product-shipping-notes-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/seller/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="save-product-button">
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  )
}
