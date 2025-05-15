"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface SellerProductFormProps {
  productId?: string
  editMode?: boolean
}

export function SellerProductForm({ productId, editMode = false }: SellerProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: editMode ? "Organic Spinach" : "",
    description: editMode ? "Fresh organic spinach, perfect for salads and cooking." : "",
    price: editMode ? "3.99" : "",
    unit: editMode ? "bunch" : "",
    category: editMode ? "Vegetables" : "",
    subcategory: editMode ? "Leafy Greens" : "",
    inventory: editMode ? "50" : "",
    isOrganic: editMode ? true : false,
    isFeatured: editMode ? false : false,
    minOrderQuantity: editMode ? "1" : "1",
    maxOrderQuantity: editMode ? "100" : "100",
    images: [] as File[]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      setSuccess(true)
      
      // Reset form if not in edit mode
      if (!editMode) {
        setFormData({
          name: "",
          description: "",
          price: "",
          unit: "",
          category: "",
          subcategory: "",
          inventory: "",
          isOrganic: false,
          isFeatured: false,
          minOrderQuantity: "1",
          maxOrderQuantity: "100",
          images: []
        })
      }
      
      // Redirect after a delay in edit mode
      if (editMode) {
        setTimeout(() => {
          router.push('/seller/products')
        }, 1500)
      }
    } catch (error) {
      console.error("Error submitting product:", error)
    } finally {
      setIsSubmitting(false)
      
      // Clear success message after delay
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="product-form">
      <Card>
        <CardHeader>
          <CardTitle>{editMode ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {editMode 
              ? "Update your product information" 
              : "Fill in the details to add a new product to your inventory"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                  data-testid="product-name-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  data-testid="product-price-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                required
                data-testid="product-description-input"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category" data-testid="product-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory"
                  data-testid="product-subcategory-input"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory & Pricing</h3>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  name="inventory"
                  type="number"
                  min="0"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  data-testid="product-inventory-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., lb, bunch, each"
                  required
                  data-testid="product-unit-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Min Order Qty</Label>
                <Input
                  id="minOrderQuantity"
                  name="minOrderQuantity"
                  type="number"
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isOrganic" 
                  checked={formData.isOrganic}
                  onCheckedChange={(checked) => handleCheckboxChange("isOrganic", checked as boolean)}
                />
                <Label htmlFor="isOrganic">Organic Product</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isFeatured" 
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleCheckboxChange("isFeatured", checked as boolean)}
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => router.push('/seller/products')}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-4">
            {success && (
              <span className="text-green-600">
                {editMode ? "Product updated successfully" : "Product added successfully"}
              </span>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              data-testid="save-product-button"
            >
              {isSubmitting 
                ? (editMode ? "Updating..." : "Adding...") 
                : (editMode ? "Update Product" : "Add Product")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
