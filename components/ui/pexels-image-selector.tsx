"use client"

import { useState, useEffect } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Search, Loader2, ImageIcon, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface PexelsImage {
  id: number
  url: string
  thumbnail: string
  original: string
  photographer: string
  photographerUrl: string
  alt: string
}

interface PexelsSearchResult {
  success: boolean
  images: PexelsImage[]
  totalResults: number
  page: number
  perPage: number
  hasNextPage: boolean
  error?: string
}

interface PexelsImageSelectorProps {
  productName?: string
  productCategory?: string
  onSelectImages: (images: string[]) => void
  initialImages?: string[]
  maxImages?: number
}

export function PexelsImageSelector({
  productName = "",
  productCategory = "",
  onSelectImages,
  initialImages = [],
  maxImages = 5
}: PexelsImageSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<PexelsSearchResult | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>(initialImages)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("search")
  const [error, setError] = useState<string | null>(null)

  // Convex action to search Pexels
  const searchPexelsImages = useAction(api.pexelsApi.searchImages)

  // Handle search
  const handleSearch = async (query: string = searchQuery, page: number = 1) => {
    if (!query) return

    setIsSearching(true)
    setError(null)

    try {
      const results = await searchPexelsImages({
        query,
        perPage: 12,
        page
      })

      setSearchResults(results)
      setCurrentPage(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search for images")
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle image selection
  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl)
      } else {
        if (prev.length >= maxImages) {
          return [...prev.slice(1), imageUrl] // Remove oldest image if at max
        }
        return [...prev, imageUrl]
      }
    })
  }

  // Update parent component when selection changes
  useEffect(() => {
    onSelectImages(selectedImages)
  }, [selectedImages, onSelectImages])

  // Auto-search when component mounts if product name is provided
  useEffect(() => {
    if (productName) {
      const query = productCategory 
        ? `${productCategory} ${productName}`
        : productName
      
      setSearchQuery(query)
      handleSearch(query, 1)
    }
  }, [productName, productCategory])

  return (
    <div className="space-y-4" data-testid="pexels-image-selector">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="search" data-testid="search-tab">Search Images</TabsTrigger>
          <TabsTrigger value="selected" data-testid="selected-tab">Selected Images ({selectedImages.length}/{maxImages})</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                data-testid="image-search-input"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button 
              onClick={() => handleSearch()} 
              disabled={isSearching || !searchQuery}
              data-testid="search-button"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" data-testid="search-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSearching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : searchResults?.images && searchResults.images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="search-results">
                {searchResults.images.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`overflow-hidden cursor-pointer transition-all ${
                      selectedImages.includes(image.url) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleImageSelection(image.url)}
                    data-testid={`image-card-${image.id}`}
                  >
                    <div className="relative aspect-square">
                      <img 
                        src={image.thumbnail} 
                        alt={image.alt || "Product image"} 
                        className="object-cover w-full h-full"
                      />
                      {selectedImages.includes(image.url) && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className="bg-primary">
                            <Check className="h-3 w-3 mr-1" /> Selected
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <p className="text-xs text-muted-foreground truncate">
                        Photo by {image.photographer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {searchResults.totalResults > searchResults.perPage && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handleSearch(searchQuery, currentPage - 1)}
                        disabled={currentPage === 1 || isSearching}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-4 py-2">
                        Page {currentPage}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handleSearch(searchQuery, currentPage + 1)}
                        disabled={!searchResults.hasNextPage || isSearching}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : searchResults ? (
            <div className="text-center py-12 border rounded-md">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No images found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="selected">
          {selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="selected-images">
              {selectedImages.map((imageUrl, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <img 
                      src={imageUrl} 
                      alt={`Selected product image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => toggleImageSelection(imageUrl)}
                      data-testid={`remove-image-${index}`}
                    >
                      <span className="sr-only">Remove image</span>
                      ×
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No images selected</p>
              <p className="text-sm text-muted-foreground mt-2">Search and select images from the Pexels library</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
