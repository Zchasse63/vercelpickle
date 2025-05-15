"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Image, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProductPexelsPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const updateProductImage = useAction(api.pexels.updateProductImage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the product
  const product = useQuery(api.products.getById, {
    id: id as any
  });

  const handleUpdateImage = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updateResult = await updateProductImage({
        productId: id as any
      });
      setResult(updateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Badge variant="outline">{product.category}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Image</CardTitle>
              <CardDescription>
                The current product image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    data-testid="current-product-image"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update with Pexels</CardTitle>
              <CardDescription>
                Find a new image for this product using the Pexels API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The Pexels API will search for images that match the product name "{product.name}" and category "{product.category}".
              </p>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {result && (
                <Alert className="mb-4" variant={result.success ? "default" : "destructive"}>
                  <div className="flex items-start">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                    )}
                    <div>
                      <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>{result.message}</AlertDescription>
                      {result.success && result.photo && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Photo by <a href={result.photo.photographer_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{result.photo.photographer}</a> on <a href={result.photo.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pexels</a>
                          </p>
                          {result.imageUrls && result.imageUrls.length > 0 && (
                            <div className="mt-2 relative aspect-square bg-muted rounded-md overflow-hidden">
                              <img
                                src={result.imageUrls[0]}
                                alt={result.photo.alt || product.name}
                                className="object-cover w-full h-full"
                                data-testid="pexels-image"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateImage}
                disabled={isUpdating}
                className="w-full sm:w-auto"
                data-testid="update-image-button"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching Pexels...
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Find New Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
