"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PexelsImageModal } from "@/components/ui/pexels-image-modal";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  // Fetch the product data from Convex
  const product = useQuery(api.products.getById, { id: id as any });
  const updateProduct = useAction(api.products.update);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>({
    name: "",
    description: "",
    price: 0,
    category: "",
    subcategory: "",
    images: [],
    inventory: 0,
    unit: "each",
    status: "active",
  });
  
  // Update local state when product data is loaded
  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        subcategory: product.subcategory || "",
        images: product.images || [],
        inventory: product.inventory || 0,
        unit: product.unit || "each",
        status: product.status || "active",
      });
    }
  }, [product]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle image selection
  const handleImagesSelected = (images: string[]) => {
    setProductData(prev => ({
      ...prev,
      images
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateProduct({
        id: id as any,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        subcategory: productData.subcategory || undefined,
        images: productData.images,
        inventory: parseInt(productData.inventory),
        unit: productData.unit,
        status: productData.status,
      });
      
      router.push(`/admin/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/products/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to product</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      data-testid="product-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productData.price || ""}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        data-testid="product-price-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={productData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status" data-testid="product-status-select">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
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
          
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Product Images</Label>
                  
                  {productData.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="product-images-grid">
                      {productData.images.map((image: string, index: number) => (
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
                              images: prev.images.filter((_: string, i: number) => i !== index)
                            }))}
                            data-testid={`remove-image-${index}`}
                          >
                            <span className="sr-only">Remove image</span>
                            ×
                          </Button>
                        </div>
                      ))}
                      
                      <PexelsImageModal
                        productName={productData.name}
                        productCategory={productData.category}
                        onImagesSelected={handleImagesSelected}
                        initialImages={productData.images}
                        maxImages={5}
                        buttonText="Update Images"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md" data-testid="empty-images-container">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input
                      id="inventory"
                      type="number"
                      min="0"
                      value={productData.inventory || ""}
                      onChange={handleInputChange}
                      data-testid="product-inventory-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={productData.unit}
                      onValueChange={(value) => handleSelectChange("unit", value)}
                    >
                      <SelectTrigger id="unit" data-testid="product-unit-select">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="lb">Pound (lb)</SelectItem>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="oz">Ounce (oz)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/products/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} data-testid="save-product-button">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
