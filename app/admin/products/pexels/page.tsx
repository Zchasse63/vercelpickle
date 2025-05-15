"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PexelsImagesPage() {
  const updateAllProductImages = useAction(api.pexels.updateAllProductImages);
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get all products to display
  const products = useQuery(api.products.getAll, {});

  const handleUpdateAllImages = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updateResult = await updateAllProductImages();
      setResult(updateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-10" data-testid="pexels-page">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pexels Product Images</h1>
          <p className="text-muted-foreground">
            Update product images using the Pexels API to get high-quality, relevant images for your products.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update All Product Images</CardTitle>
            <CardDescription>
              This will search Pexels for images that match each product's name and category, and update all products with the best matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Pexels API will be used to find the most relevant images for each product. This process may take some time depending on the number of products.
            </p>
            <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-amber-700">
                This action will replace all existing product images. Make sure you have a backup if needed.
              </p>
            </div>
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
                    {result.results && (
                      <div className="mt-2 max-h-40 overflow-y-auto text-sm">
                        <p className="font-semibold">Results:</p>
                        <ul className="list-disc pl-5">
                          {result.results.slice(0, 10).map((item: any, index: number) => (
                            <li key={index} className={item.success ? "text-green-600" : "text-red-600"}>
                              {item.name}: {item.success ? "Updated" : item.message}
                            </li>
                          ))}
                          {result.results.length > 10 && (
                            <li className="text-muted-foreground">
                              ...and {result.results.length - 10} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpdateAllImages}
              disabled={isUpdating}
              className="w-full sm:w-auto"
              data-testid="update-image-button"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Images...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Update All Product Images
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Separator className="my-4" />

        <div>
          <h2 className="text-2xl font-bold mb-4">Current Products</h2>
          {!products ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">No products found</p>
              <Link href="/admin/products/import" className="text-primary hover:underline mt-2 inline-block">
                Import sample products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden" data-testid="pexels-image">
                  <div className="relative aspect-square bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No image</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
