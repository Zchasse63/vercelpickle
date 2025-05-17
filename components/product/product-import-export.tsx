"use client";

import { useState } from "react";
import { useImportProducts, useExportProducts } from "@/lib/data/product-management";
import { useProducts } from "@/lib/data/products";
import { useCurrentUserProfile } from "@/lib/data/user-profiles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Download, FileText, FileJson } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export function ProductImportExport() {
  const { data: currentUser } = useCurrentUserProfile();
  const { data: products } = useProducts();
  const { importProducts, isLoading: isImporting } = useImportProducts();
  const { exportProducts } = useExportProducts();
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [includeVariants, setIncludeVariants] = useState(true);
  const [includeSpecifications, setIncludeSpecifications] = useState(true);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or JSON file.",
          variant: "destructive",
        });
        return;
      }
      
      setImportFile(file);
    }
  };
  
  const handleImport = async () => {
    if (!importFile || !currentUser) {
      toast({
        title: "Error",
        description: "Please select a file to import and ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await importProducts(importFile, currentUser._id as Id<"users">, currentUser.name);
      setImportFile(null);
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error("Import error:", error);
    }
  };
  
  const handleExport = async () => {
    if (!products?.items || products.items.length === 0) {
      toast({
        title: "No products to export",
        description: "There are no products available to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await exportProducts(products.items, {
        format: exportFormat,
        includeVariants,
        includeSpecifications,
      });
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Export error:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>
          Import products from CSV or JSON files, or export your product catalog.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Products
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Products</DialogTitle>
              <DialogDescription>
                Upload a CSV or JSON file containing product data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, JSON
                </p>
              </div>
              {importFile && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  {importFile.name.endsWith(".csv") ? (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileJson className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{importFile.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {(importFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile || isImporting}
              >
                {isImporting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Products
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Products</DialogTitle>
              <DialogDescription>
                Export your product catalog to CSV or JSON format.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "csv" | "json")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv" className="cursor-pointer">CSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json" className="cursor-pointer">JSON</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeVariants"
                    checked={includeVariants}
                    onCheckedChange={(checked) => setIncludeVariants(!!checked)}
                  />
                  <Label htmlFor="includeVariants" className="cursor-pointer">
                    Include product variants
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSpecifications"
                    checked={includeSpecifications}
                    onCheckedChange={(checked) => setIncludeSpecifications(!!checked)}
                  />
                  <Label htmlFor="includeSpecifications" className="cursor-pointer">
                    Include product specifications
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsExportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleExport}>Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
