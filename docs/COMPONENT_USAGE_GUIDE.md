# Pickle B2B Marketplace Component Usage Guide

This guide provides detailed information on how to use the UI components in the Pickle B2B Marketplace application. It covers component props, usage examples, and best practices.

## Table of Contents

1. [Button](#button)
2. [Card](#card)
3. [Badge](#badge)
4. [Form Components](#form-components)
5. [Navigation Components](#navigation-components)
6. [Layout Components](#layout-components)
7. [Data Display Components](#data-display-components)
8. [Feedback Components](#feedback-components)
9. [Animation Usage](#animation-usage)
10. [Marketplace Components](#marketplace-components)

## Button

The Button component is used for actions in forms, dialogs, and more.

### Import

```tsx
import { Button } from "@/components/ui/button"
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" \| "mustard" \| "dill" | "default" | The visual style of the button |
| size | "default" \| "sm" \| "lg" \| "icon" | "default" | The size of the button |
| asChild | boolean | false | Whether to render as a child element |

### Examples

```tsx
// Default button
<Button>Click me</Button>

// Mustard variant
<Button variant="mustard">Submit</Button>

// Small outline button
<Button variant="outline" size="sm">Cancel</Button>

// Icon button
<Button variant="ghost" size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>

// With animation
<Button className="hover-scale">Animated Button</Button>
```

## Card

The Card component is used to group related content and actions.

### Import

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

### Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Information</CardTitle>
    <CardDescription>Details about the product</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the main content of the card.</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Badge

The Badge component is used to highlight status, counts, or labels.

### Import

```tsx
import { Badge } from "@/components/ui/badge"
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "default" \| "secondary" \| "outline" \| "destructive" \| "mustard" \| "dill" \| "organic" \| "non-gmo" \| "fair-trade" | "default" | The visual style of the badge |

### Examples

```tsx
// Default badge
<Badge>New</Badge>

// Organic badge
<Badge variant="organic">Organic</Badge>

// Outline badge
<Badge variant="outline">Featured</Badge>
```

## Form Components

### Input

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Email" />
```

### Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="fruits">Fruits</SelectItem>
    <SelectItem value="vegetables">Vegetables</SelectItem>
    <SelectItem value="dairy">Dairy</SelectItem>
  </SelectContent>
</Select>
```

## Navigation Components

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
</Tabs>
```

### Pagination

```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Animation Usage

The application includes CSS-based animations that can be applied to any component.

### Available Animation Classes

| Class | Description |
|-------|-------------|
| animate-fade-in | Fade in animation |
| animate-fade-up | Fade up animation |
| animate-fade-down | Fade down animation |
| animate-fade-left | Fade left animation |
| animate-fade-right | Fade right animation |
| animate-scale | Scale animation |
| animate-stagger-fade-in | Staggered fade in for children |
| hover-scale | Scale on hover |
| hover-lift | Lift on hover |
| delay-100 | 100ms animation delay |
| delay-200 | 200ms animation delay |
| delay-300 | 300ms animation delay |
| delay-400 | 400ms animation delay |
| delay-500 | 500ms animation delay |

### Examples

```tsx
// Fade in animation
<div className="animate-fade-in">Content</div>

// Fade up with delay
<div className="animate-fade-up delay-200">Delayed content</div>

// Hover effect
<Button className="hover-scale">Hover me</Button>

// Staggered children
<div className="animate-stagger-fade-in">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Marketplace Components

### MarketplaceAdvancedFilters

The MarketplaceAdvancedFilters component provides advanced filtering options for products.

```tsx
import { MarketplaceAdvancedFilters } from "@/components/marketplace/marketplace-advanced-filters"

const handleFilterChange = (filters) => {
  console.log("Filters changed:", filters)
}

<MarketplaceAdvancedFilters onFilterChange={handleFilterChange} />
```

### MarketplaceProductSorting

The MarketplaceProductSorting component provides sorting options for products.

```tsx
import { MarketplaceProductSorting } from "@/components/marketplace/marketplace-product-sorting"

const handleSortChange = (sortOption) => {
  console.log("Sort option changed:", sortOption)
}

<MarketplaceProductSorting onSortChange={handleSortChange} />
```

### MarketplaceViewToggle

The MarketplaceViewToggle component allows switching between grid and list views.

```tsx
import { MarketplaceViewToggle } from "@/components/marketplace/marketplace-view-toggle"

const [viewMode, setViewMode] = useState("grid")

const handleViewModeChange = (mode) => {
  setViewMode(mode)
}

<MarketplaceViewToggle 
  viewMode={viewMode} 
  onViewModeChange={handleViewModeChange} 
/>
```

### MarketplaceProductComparison

The MarketplaceProductComparison component allows comparing multiple products side by side.

```tsx
import { MarketplaceProductComparison } from "@/components/marketplace/marketplace-product-comparison"

const products = [
  {
    id: "1",
    name: "Organic Apples",
    price: 2.99,
    unit: "lb",
    // ... other product properties
  },
  {
    id: "2",
    name: "Fresh Broccoli",
    price: 1.99,
    unit: "bunch",
    // ... other product properties
  }
]

const handleRemoveProduct = (productId) => {
  // Remove product from comparison
}

const handleAddToCart = (productId) => {
  // Add product to cart
}

<MarketplaceProductComparison 
  products={products}
  onRemoveProduct={handleRemoveProduct}
  onAddToCart={handleAddToCart}
/>
```

## Best Practices

1. **Consistent Styling**: Use the provided components and their variants to maintain a consistent look and feel.

2. **Responsive Design**: All components are designed to be responsive. Use the appropriate layout components to ensure a good experience on all devices.

3. **Accessibility**: Ensure all interactive elements have appropriate ARIA attributes and keyboard navigation.

4. **Animation Usage**: Use animations sparingly to enhance the user experience, not distract from it.

5. **Performance**: Avoid nesting too many components or using too many animations on a single page to maintain good performance.

6. **Brand Colors**: Use the brand color variants (mustard, dill) for primary actions and highlights to maintain brand consistency.

7. **Error Handling**: Always provide clear error messages and validation feedback in forms.

8. **Loading States**: Use loading states to indicate when data is being fetched or actions are being processed.

9. **Responsive Images**: Use the Next.js Image component with appropriate sizes and quality settings.

10. **Code Splitting**: Use dynamic imports for large components that aren't needed on initial page load.
