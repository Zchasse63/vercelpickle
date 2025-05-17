"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";
import {
  useProductVariants,
  useAddProductVariant,
  useUpdateProductVariant,
  useRemoveProductVariant,
  ProductVariant,
} from "@/lib/data/product-management";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

// Form schema for variant
const variantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  inventory: z.coerce.number().min(0, {
    message: "Inventory must be a positive number.",
  }),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface ProductVariantsProps {
  productId: Id<"products">;
}

export function ProductVariants({ productId }: ProductVariantsProps) {
  const { variants, product, isLoading } = useProductVariants(productId);
  const { addVariant, isLoading: isAddingVariant } = useAddProductVariant();
  const { updateVariant, isLoading: isUpdatingVariant } = useUpdateProductVariant();
  const { removeVariant, isLoading: isRemovingVariant } = useRemoveProductVariant();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variantImages, setVariantImages] = useState<string[]>([]);
  
  // Form for adding/editing variants
  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      name: selectedVariant?.name || "",
      price: selectedVariant?.price || 0,
      inventory: selectedVariant?.inventory || 0,
    },
    values: {
      name: selectedVariant?.name || "",
      price: selectedVariant?.price || 0,
      inventory: selectedVariant?.inventory || 0,
    },
  });
  
  // Handle adding a new variant
  const handleAddVariant = async (values: VariantFormValues) => {
    try {
      await addVariant(productId, {
        ...values,
        images: variantImages,
      });
      setIsAddDialogOpen(false);
      setVariantImages([]);
      form.reset();
    } catch (error) {
      console.error("Error adding variant:", error);
    }
  };
  
  // Handle editing a variant
  const handleEditVariant = async (values: VariantFormValues) => {
    if (!selectedVariant) return;
    
    try {
      await updateVariant(productId, selectedVariant.id, {
        ...values,
        images: variantImages.length > 0 ? variantImages : selectedVariant.images,
      });
      setIsEditDialogOpen(false);
      setSelectedVariant(null);
      setVariantImages([]);
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  };
  
  // Handle deleting a variant
  const handleDeleteVariant = async () => {
    if (!selectedVariant) return;
    
    try {
      await removeVariant(productId, selectedVariant.id);
      setIsDeleteDialogOpen(false);
      setSelectedVariant(null);
    } catch (error) {
      console.error("Error removing variant:", error);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (url: string) => {
    setVariantImages((prev) => [...prev, url]);
  };
  
  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setVariantImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Manage variants for {product?.name || "this product"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {variants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Images</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{variant.name}</TableCell>
                  <TableCell>${variant.price.toFixed(2)}</TableCell>
                  <TableCell>{variant.inventory}</TableCell>
                  <TableCell>
                    {variant.images && variant.images.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={variant.images[0]}
                          alt={variant.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                        {variant.images.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            +{variant.images.length - 1} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No images</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedVariant(variant);
                          setVariantImages(variant.images || []);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedVariant(variant);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border rounded-md bg-muted/50">
            <p className="text-muted-foreground">No variants found</p>
            <p className="text-sm text-muted-foreground">
              Add variants to offer different options for this product.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product Variant</DialogTitle>
              <DialogDescription>
                Create a new variant for {product?.name || "this product"}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddVariant)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant name" {...field} />
                      </FormControl>
                      <FormDescription>
                        E.g., "Small", "Red", "Bundle Pack"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {variantImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group h-16 w-16 rounded overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Variant image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload
                    onChange={handleImageUpload}
                    buttonText="Add Image"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setVariantImages([]);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAddingVariant}>
                    {isAddingVariant && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Variant
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Variant Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product Variant</DialogTitle>
              <DialogDescription>
                Update the variant for {product?.name || "this product"}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditVariant)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {variantImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group h-16 w-16 rounded overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Variant image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload
                    onChange={handleImageUpload}
                    buttonText="Add Image"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedVariant(null);
                      setVariantImages([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdatingVariant}>
                    {isUpdatingVariant && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Variant
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Variant Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product Variant</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this variant? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedVariant && (
                <div className="space-y-2">
                  <p className="font-medium">{selectedVariant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Price: ${selectedVariant.price.toFixed(2)} • Inventory: {selectedVariant.inventory}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedVariant(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteVariant}
                disabled={isRemovingVariant}
              >
                {isRemovingVariant && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
