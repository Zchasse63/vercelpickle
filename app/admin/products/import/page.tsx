"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function ImportProductsPage() {
  const { toast } = useToast();
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get all sellers
  const sellers = useQuery(api.users.getSellers) || [];

  // Legacy import action
  const importProductsLegacy = useAction(api.importProducts.importProducts);

  // New import action with enhanced schema
  const importProductsFromJson = useAction(api.importProductsFromJson.importFromJson);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);

    try {
      // If a seller is selected, use the new import function
      if (selectedSellerId) {
        const importResult = await importProductsFromJson({
          sellerId: selectedSellerId as any,
        });

        setResult({
          success: importResult.success,
          message: `Successfully imported ${importResult.count} products`,
          results: importResult.productIds.map((id: string) => ({
            name: `Product ${id}`,
            success: true
          }))
        });

        toast({
          title: "Import Successful",
          description: `Successfully imported ${importResult.count} products`,
        });
      } else {
        // Otherwise, use the legacy import function
        const importResult = await importProductsLegacy();
        setResult(importResult);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);

      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Import Products</h1>

      <Tabs defaultValue="enhanced" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enhanced" data-testid="import-method-json">Enhanced Import</TabsTrigger>
          <TabsTrigger value="legacy">Legacy Import</TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced">
          <Card>
            <CardHeader>
              <CardTitle>Import Products with Enhanced Schema</CardTitle>
              <CardDescription>
                This will import the sample product data from Pickleproducts.json with the enhanced product schema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Select a seller to assign the imported products to. The products will be imported with
                  comprehensive specifications, including dietary information, certifications, and more.
                </p>

                <div className="space-y-2">
                  <label htmlFor="seller" className="text-sm font-medium">Seller</label>
                  <Select
                    value={selectedSellerId}
                    onValueChange={setSelectedSellerId}
                    disabled={isImporting}
                    data-testid="seller-select"
                  >
                    <SelectTrigger id="seller" className="w-full">
                      <SelectValue placeholder="Select a seller" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller._id} value={seller._id}>
                          {seller.businessName || seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <Alert className="mb-4" variant={result.success ? "default" : "destructive"} data-testid="import-results">
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
                              {result.results.map((item: any, index: number) => (
                                <li key={index} className={item.success ? "text-green-600" : "text-red-600"}>
                                  {item.name}: {item.success ? "Imported" : item.error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleImport}
                disabled={isImporting || !selectedSellerId}
                className="w-full sm:w-auto"
                data-testid="start-import-button"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Products"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="legacy">
          <Card>
            <CardHeader>
              <CardTitle>Legacy Import</CardTitle>
              <CardDescription>
                This will import the sample product data from Pickleproducts.json using the legacy import function.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Click the button below to import the sample products. This will create new product records
                in the database with the admin user as the seller.
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
                      {result.results && (
                        <div className="mt-2 max-h-40 overflow-y-auto text-sm">
                          <p className="font-semibold">Results:</p>
                          <ul className="list-disc pl-5">
                            {result.results.map((item: any, index: number) => (
                              <li key={index} className={item.success ? "text-green-600" : "text-red-600"}>
                                {item.name}: {item.success ? "Imported" : item.error}
                              </li>
                            ))}
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
                onClick={handleImport}
                disabled={isImporting}
                className="w-full sm:w-auto"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Products"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
