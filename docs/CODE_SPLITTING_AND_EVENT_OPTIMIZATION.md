# Code Splitting and Event Handler Optimization

## Overview

This document outlines the code splitting and event handler optimization strategies implemented in the Pickle B2B Marketplace application. These optimizations focus on reducing initial load time and preventing unnecessary re-renders.

## 1. Code Splitting with React.lazy() and Suspense

### Lazy Loading Utility

We use a utility function for lazy loading components:

```typescript
// lib/lazy-import.ts
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K, options?: LazyImportOptions): I[K] {
  const LazyComponent = lazy(() => factory().then((module) => ({ default: module[name] })));

  const Component = (props: React.ComponentProps<T>) => {
    if (options?.ssr === false && typeof window === "undefined") {
      if (options?.loading) {
        return <>{options.loading()}</>;
      }
      return null;
    }

    return (
      <Suspense fallback={options?.loading ? options.loading() : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  return Component as I[K];
}
```

### Lazy Loading Checkout Components

We've implemented lazy loading for checkout components to reduce the initial bundle size:

```typescript
// components/checkout/lazy-checkout-components.tsx
export const LazyCheckoutShippingStep = lazyImport(
  () => import("@/components/checkout/checkout-shipping-step"),
  "CheckoutShippingStep",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }
)
```

### Lazy Loading Marketplace Components

We've implemented lazy loading for marketplace components:

```typescript
// components/marketplace/lazy-marketplace-components.tsx
export const LazyMarketplaceProductComparison = lazyImport(
  () => import("@/components/marketplace/marketplace-product-comparison"),
  "MarketplaceProductComparison",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }
)
```

### Using Lazy-Loaded Components

We've updated the checkout page to use lazy-loaded components:

```tsx
// app/checkout/page.tsx
import {
  CheckoutShippingStepLazy,
  CheckoutPaymentStepLazy,
  CheckoutReviewStepLazy,
  CheckoutOrderSummaryLazy
} from "@/components/checkout/lazy-checkout-components"

// ...

{currentStep === "shipping" && (
  <CheckoutShippingStepLazy
    onNext={handleNextStep}
    testId="checkout-shipping-step"
  />
)}
```

We've also updated the marketplace products client to use lazy-loaded components:

```tsx
// components/marketplace/marketplace-products-client.tsx
import {
  MarketplaceAdvancedFiltersLazy,
  MarketplaceProductSortingLazy,
  MarketplaceProductComparisonLazy,
  VirtualizedProductGridLazy
} from "@/components/marketplace/lazy-marketplace-components"

// ...

<MarketplaceProductComparisonLazy
  products={comparisonProducts}
  onRemoveProduct={handleRemoveProduct}
  onAddToCart={handleAddToCart}
/>
```

## 2. Event Handler Optimization with useCallback

### Memoizing Event Handlers

We've memoized event handlers to prevent unnecessary re-renders:

```typescript
// components/marketplace/marketplace-products-client.tsx
const handleFilterChange = useCallback((newFilters: FilterOptions) => {
  setFilters(newFilters);
  console.log("Filters changed:", newFilters);

  // Update active filters for the product query
  setActiveFilters(prevFilters => ({
    ...prevFilters,
    categories: newFilters.categories || [],
    certifications: newFilters.certifications || [],
    sellers: newFilters.sellers || [],
    priceRange: {
      min: newFilters.priceRange?.min,
      max: newFilters.priceRange?.max,
    },
    // Handle additional filters from MarketplaceAdvancedFilters
    inStock: newFilters.inStock || false,
    freeShipping: newFilters.freeShipping || false,
    bulkDiscount: newFilters.bulkDiscount || false,
    // Handle new filter types
    dietary: newFilters.dietary || {},
    environmental: newFilters.environmental || {},
    origins: newFilters.origins || [],
  }));
}, []);
```

### Using Functional Updates

We've used functional updates to avoid dependencies on previous state:

```typescript
const handleRemoveProduct = useCallback((productId: string) => {
  setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  setSelectedProductIds(prev => prev.filter(id => id !== productId));
}, []);
```

### Including Dependencies

We've included all necessary dependencies in the dependency array:

```typescript
const handleAddToCart = useCallback((productId: string) => {
  addItem(productId, 1);
}, [addItem]);

const handleAddToComparison = useCallback((productId: string) => {
  if (selectedProductIds.includes(productId)) return;

  // Limit to 4 products for comparison
  if (selectedProductIds.length >= 4) {
    toast({
      title: "Comparison limit reached",
      description: "You can compare up to 4 products at a time",
      variant: "destructive",
    });
    return;
  }

  setSelectedProductIds(prev => [...prev, productId]);
  
  // We need to call fetchComparisonProducts in the next tick
  // to ensure selectedProductIds has been updated
  setTimeout(() => {
    fetchComparisonProducts();
    setShowComparison(true);
  }, 0);
}, [selectedProductIds, toast, fetchComparisonProducts]);
```

## Benefits of These Optimizations

### Code Splitting Benefits

1. **Reduced Initial Bundle Size**: By splitting the code into smaller chunks, we reduce the amount of JavaScript that needs to be downloaded, parsed, and executed on initial page load.

2. **Faster Initial Load Time**: Users can see and interact with the page faster because only the essential code is loaded initially.

3. **Improved Performance on Low-End Devices**: Smaller JavaScript bundles are particularly beneficial for users on low-end devices with limited processing power.

4. **Better Caching**: Smaller, more focused bundles can be cached more effectively, improving subsequent page loads.

### Event Handler Optimization Benefits

1. **Reduced Re-renders**: By memoizing event handlers with useCallback, we prevent unnecessary re-renders of components that receive these handlers as props.

2. **Improved Performance**: Fewer re-renders means better performance, especially for complex components or lists with many items.

3. **Consistent References**: Memoized event handlers maintain the same reference between renders, which is important for optimized child components that use React.memo.

4. **Predictable Behavior**: Using functional updates for state changes ensures that we always work with the latest state, avoiding race conditions and bugs.

## Next Steps

1. **Measure Performance Impact**: Use tools like Lighthouse and React DevTools to measure the performance impact of these optimizations.

2. **Expand Code Splitting**: Identify additional components that would benefit from code splitting.

3. **Implement Route-Based Code Splitting**: Use Next.js's built-in route-based code splitting to further optimize the application.

4. **Add Performance Monitoring**: Implement real-time performance monitoring to identify additional optimization opportunities.

5. **Optimize Images**: Implement responsive images and lazy loading for better performance.
