# Product Quick View Modal Documentation

**Last Updated:** `2023-06-01`

> **Note**: This document provides information about the enhanced product quick view modal in the Pickle B2B Marketplace platform. For more detailed information, see the [Documentation Index](DOCUMENTATION_INDEX.md).

## Overview

The product quick view modal provides a streamlined way for users to view detailed product information without navigating away from the current page. The modal has been enhanced to display all product information in a single view, eliminating the need for users to click through tabs to see different types of information.

## Key Features

- **Comprehensive Information Display**: All product information (details, specifications, shipping) is displayed in a single scrollable view
- **Organized Sections**: Information is organized into logical sections with clear headings
- **Visual Hierarchy**: Colored section headers help users scan the content
- **Efficient Use of Space**: Maximized content area with optimized layout
- **Consistent Styling**: Maintains the existing styling for badges and other UI elements

## Implementation

The product quick view modal is implemented in `components/marketplace/product-quick-view-modal.tsx` and includes the following main sections:

### Modal Structure

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[800px]">
    <DialogHeader>
      <DialogTitle>{name}</DialogTitle>
      <DialogDescription>{category}</DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-6 md:grid-cols-2">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden rounded-md">
        <img
          src={images[0] || "/placeholder.svg?height=400&width=400"}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* Product Information */}
      <div className="flex flex-col">
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">per {unit}</p>
          </div>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        {/* Product Details */}
        <div className="flex-1 overflow-auto max-h-[350px] pr-2 space-y-5">
          {/* Content sections go here */}
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

### Content Sections

The modal content is organized into the following sections:

1. **Product Description**
   ```tsx
   <div className="space-y-2">
     <h3 className="text-sm font-medium text-dill-green flex items-center">
       <Info className="h-4 w-4 mr-1" /> Description
     </h3>
     <p className="text-sm text-muted-foreground">{description}</p>
   </div>
   ```

2. **Key Features** (if available)
   ```tsx
   {features && features.length > 0 && (
     <div className="space-y-2">
       <h3 className="text-sm font-medium text-dill-green">Key Features</h3>
       <ul className="space-y-1">
         {features.map((feature, index) => (
           <li key={index} className="text-sm text-muted-foreground flex items-start">
             <span className="mr-2 text-dill-green">•</span> {feature}
           </li>
         ))}
       </ul>
     </div>
   )}
   ```

3. **Specifications** (if available)
   ```tsx
   {specifications && Object.keys(specifications).length > 0 && (
     <div className="space-y-2">
       <h3 className="text-sm font-medium text-dill-green flex items-center">
         <Package className="h-4 w-4 mr-1" /> Specifications
       </h3>
       <div className="grid grid-cols-2 gap-2">
         {/* Physical specifications */}
         {specifications.weight && (
           <p className="text-sm text-muted-foreground">
             <span className="font-medium">Weight:</span> {specifications.weight}
           </p>
         )}
         {/* Additional specifications... */}
       </div>
     </div>
   )}
   ```

4. **Origin Information** (if available)
   ```tsx
   {origin && (origin.country || origin.region) && (
     <div className="space-y-2">
       <h3 className="text-sm font-medium text-dill-green">Origin</h3>
       <p className="text-sm text-muted-foreground">
         {origin.region && `${origin.region}, `}{origin.country}
         {origin.farm && ` - ${origin.farm}`}
       </p>
     </div>
   )}
   ```

5. **Certifications** (if available)
   ```tsx
   {certifications && certifications.length > 0 && (
     <div className="space-y-2">
       <h3 className="text-sm font-medium text-dill-green">Certifications</h3>
       <div className="flex flex-wrap gap-1">
         {certifications.map((cert, index) => (
           <Badge key={index} variant="outline" className="text-xs">
             {cert}
           </Badge>
         ))}
       </div>
     </div>
   )}
   ```

6. **Shipping & Storage Information**
   ```tsx
   <div className="space-y-2">
     <h3 className="text-sm font-medium text-dill-green flex items-center">
       <Truck className="h-4 w-4 mr-1" /> Shipping & Storage
     </h3>
     <p className="text-sm text-muted-foreground">
       Free shipping on orders over $100. Standard delivery within 2-5 business days.
     </p>
     
     {specifications?.storage && (
       <p className="text-sm text-muted-foreground mt-1">
         <span className="font-medium">Storage:</span> {specifications.storage}
       </p>
     )}

     {inventory !== undefined && (
       <p className="text-sm text-muted-foreground mt-1">
         <span className="font-medium">Availability:</span> {inventory > 10 ? "In Stock" : inventory > 0 ? `Only ${inventory} left in stock` : "Out of Stock"}
       </p>
     )}
   </div>
   ```

## Usage

The product quick view modal is used in the following components:

1. **Product Card**: When the user clicks the "Quick View" button on a product card
2. **Product Grid**: When the user clicks the "Quick View" button on a product in the grid
3. **Search Results**: When the user clicks the "Quick View" button on a product in the search results

Example usage:
```tsx
import { ProductQuickViewModal } from "@/components/marketplace/product-quick-view-modal";

function ProductCard({ product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  return (
    <>
      <div className="product-card">
        {/* Product card content */}
        <Button onClick={() => setIsQuickViewOpen(true)}>Quick View</Button>
      </div>
      
      <ProductQuickViewModal
        isOpen={isQuickViewOpen}
        setIsOpen={setIsQuickViewOpen}
        product={product}
      />
    </>
  );
}
```

## Benefits of the New Design

1. **Improved User Experience**: Users can see all product information at a glance without additional clicks
2. **Reduced Cognitive Load**: No need to remember which tab contains which information
3. **Efficient Information Scanning**: Clear section headers and visual hierarchy make it easy to scan
4. **Consistent Experience**: All product information is presented in a consistent way
5. **Mobile-Friendly**: The scrollable design works well on all device sizes

## Future Enhancements

Potential future enhancements to the product quick view modal:

1. **Image Gallery**: Add support for multiple product images with thumbnails
2. **Quantity Selector**: Add a quantity selector for adding to cart
3. **Related Products**: Show related products at the bottom of the modal
4. **Variant Selection**: Add support for selecting product variants
5. **Animation Improvements**: Enhance the modal open/close animations

## Conclusion

The enhanced product quick view modal provides a more streamlined and efficient way for users to view detailed product information without navigating away from the current page. By displaying all information in a single view with clear organization and visual hierarchy, the modal truly functions as a "quick view" rather than requiring additional interaction.
