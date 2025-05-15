"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/providers/auth-provider"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Categories with their descriptions
const categories = [
  {
    id: "fresh-produce",
    name: "Fresh Produce",
    description: "Fruits, vegetables, and herbs",
    searchTerm: "fresh vegetables"
  },
  {
    id: "bakery",
    name: "Bakery",
    description: "Breads, pastries, and baked goods",
    searchTerm: "artisan bread"
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    description: "Milk, cheese, butter, and eggs",
    searchTerm: "farm fresh eggs"
  },
  {
    id: "meat-seafood",
    name: "Meat & Seafood",
    description: "Premium cuts and fresh catches",
    searchTerm: "fresh seafood"
  },
  {
    id: "specialty-foods",
    name: "Specialty Foods",
    description: "Gourmet and artisanal products",
    searchTerm: "gourmet food"
  }
]

export function HomeClient() {
  // Get the authenticated user
  const { user } = useAuth()

  // Use the cart hook with the authenticated user
  const { addItem } = useCart(user?.id || null)

  // State for category images
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [isLoadingImages, setIsLoadingImages] = useState(true)

  // Fetch products from Convex
  const products = useQuery(api.products.getAll, {}) || []

  // State for product images
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  const [isLoadingProductImages, setIsLoadingProductImages] = useState(false)

  // Get featured products (5 random products)
  const featuredProducts = products.length > 0
    ? [...products].sort(() => 0.5 - Math.random()).slice(0, 5)
    : []

  // Get the Pexels API action
  const searchPexelsImages = useAction(api.pexelsApi.searchImages)

  // Fetch images from Pexels API for categories using Convex
  useEffect(() => {
    const fetchCategoryImages = async () => {
      setIsLoadingImages(true)
      const images: Record<string, string> = {}

      for (const category of categories) {
        try {
          // Use the Convex action to search for images
          const result = await searchPexelsImages({
            query: category.searchTerm,
            perPage: 1,
            page: 1
          })

          if (result.success && result.images && result.images.length > 0) {
            images[category.id] = result.images[0].url
          }
        } catch (error) {
          console.error(`Error fetching image for ${category.name}:`, error)
        }
      }

      setCategoryImages(images)
      setIsLoadingImages(false)
    }

    fetchCategoryImages()
  }, [])

  // Fetch images for products that don't have images
  useEffect(() => {
    const fetchProductImages = async () => {
      if (!featuredProducts.length) return

      // Filter products that don't have images
      const productsWithoutImages = featuredProducts.filter(
        product => !product.images || product.images.length === 0
      )

      if (productsWithoutImages.length === 0) return

      setIsLoadingProductImages(true)
      const images: Record<string, string> = {}

      for (const product of productsWithoutImages) {
        try {
          // Use the product name and category as search terms
          const searchTerm = product.category
            ? `${product.category} ${product.name}`
            : product.name

          const result = await searchPexelsImages({
            query: searchTerm,
            perPage: 1,
            page: 1
          })

          if (result.success && result.images && result.images.length > 0) {
            images[product._id] = result.images[0].url
          }
        } catch (error) {
          console.error(`Error fetching image for product ${product.name}:`, error)
        }
      }

      setProductImages(images)
      setIsLoadingProductImages(false)
    }

    fetchProductImages()
  }, [featuredProducts])

  // Handle adding to cart
  const handleAddToCart = (productId: string) => {
    if (productId) {
      addItem(productId, 1)
    }
  }

  return (
    <>
      {/* Categories Section */}
      <section className="w-full py-8 md:py-12 relative" data-testid="featured-categories">
        {/* Subtle diagonal pattern */}
        <div className="absolute inset-0 bg-[#F1E5C3]/10 z-0"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#194D33]">
                Browse Categories
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                Explore our wide range of quality food categories from trusted suppliers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mt-12 animate-stagger-fade-in">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover-lift shadow-sm border border-[#5A9A3D]/20 overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}
                data-testid="category-card"
                data-category-id={category.id}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-[#194D33]">{category.name}</CardTitle>
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    {isLoadingImages ? (
                      <div className="absolute inset-0 bg-[#F1E5C3]/20 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#5A9A3D]" />
                      </div>
                    ) : categoryImages[category.id] ? (
                      <Image
                        src={categoryImages[category.id]}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        data-testid={`category-image-${category.id}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#194D33]/10 flex items-center justify-center">
                        <span className="text-[#194D33] font-medium">{category.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/marketplace/categories/${category.id}`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#5A9A3D] text-[#5A9A3D] hover:bg-[#5A9A3D]/10"
                      data-testid={`view-category-${category.id}`}
                    >
                      View Products
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-8 md:py-12" data-testid="featured-products">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#194D33]">
                Featured Products
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                Discover our top-rated products from each category
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <Card
                key={product._id}
                className="hover-lift shadow-sm overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(90, 154, 61, 0.3), 0 4px 14px rgba(90, 154, 61, 0.1)' }}
                data-testid="product-card"
                data-product-id={product._id}
              >
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    {isLoadingProductImages && (!product.images || product.images.length === 0) ? (
                      <div className="absolute inset-0 bg-[#F1E5C3]/20 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#5A9A3D]" />
                      </div>
                    ) : product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        data-testid={`product-image-${product._id}`}
                      />
                    ) : productImages[product._id] ? (
                      <Image
                        src={productImages[product._id]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        data-testid={`pexels-image-${product._id}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#F1E5C3]/30 flex items-center justify-center">
                        <span className="text-[#194D33] font-medium">{product.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-[#194D33]" data-testid="product-name">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" data-testid="product-price">{formatPrice(product.price)}</span>
                      <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    size="sm"
                    className="w-full bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white"
                    onClick={() => handleAddToCart(product._id)}
                    data-testid="add-to-cart-button"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/marketplace">
              <Button className="bg-[#194D33] hover:bg-[#194D33]/90 text-white" data-testid="view-all-products">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
