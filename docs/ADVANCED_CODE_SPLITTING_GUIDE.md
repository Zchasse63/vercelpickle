# Advanced Code Splitting Guide for Pickle B2B Marketplace

This document provides a comprehensive guide for expanding code splitting in the Pickle B2B marketplace application, focusing on both component-level and route-based approaches.

## 1. Identifying Components for Code Splitting

### Criteria for Component Code Splitting

Components are good candidates for code splitting if they meet one or more of these criteria:

1. **Size**: Large components with significant JavaScript footprint
2. **Complexity**: Components with complex logic or many dependencies
3. **Usage Patterns**: Components that aren't needed on initial page load
4. **Conditional Rendering**: Components that are only shown based on user interaction
5. **Low-Priority Features**: Features that aren't critical to the core user experience

### Additional Components to Code Split

Based on analysis of the Pickle B2B marketplace codebase, these additional components are prime candidates for code splitting:

#### Admin Dashboard Components

```typescript
// components/admin/lazy-admin-components.tsx
import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

export const LazyAdminProductManager = lazyImport(
  () => import("@/components/admin/admin-product-manager"),
  "AdminProductManager",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazyAdminUserManager = lazyImport(
  () => import("@/components/admin/admin-user-manager"),
  "AdminUserManager",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazyAdminOrderManager = lazyImport(
  () => import("@/components/admin/admin-order-manager"),
  "AdminOrderManager",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazyAdminAnalyticsDashboard = lazyImport(
  () => import("@/components/admin/admin-analytics-dashboard"),
  "AdminAnalyticsDashboard",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)
```

#### Seller Dashboard Components

```typescript
// components/seller/lazy-seller-components.tsx
import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

export const LazySellerProductManager = lazyImport(
  () => import("@/components/seller/seller-product-manager"),
  "SellerProductManager",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazySellerOrderManager = lazyImport(
  () => import("@/components/seller/seller-order-manager"),
  "SellerOrderManager",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazySellerAnalyticsDashboard = lazyImport(
  () => import("@/components/seller/seller-analytics-dashboard"),
  "SellerAnalyticsDashboard",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)
```

#### Buyer Dashboard Components

```typescript
// components/buyer/lazy-buyer-components.tsx
import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

export const LazyBuyerOrderHistory = lazyImport(
  () => import("@/components/buyer/buyer-order-history"),
  "BuyerOrderHistory",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazyBuyerPaymentMethods = lazyImport(
  () => import("@/components/buyer/buyer-payment-methods"),
  "BuyerPaymentMethods",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)

export const LazyBuyerAddressBook = lazyImport(
  () => import("@/components/buyer/buyer-address-book"),
  "BuyerAddressBook",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />
  }
)
```

#### Rich UI Components

```typescript
// components/ui/lazy-rich-components.tsx
import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

export const LazyRichTextEditor = lazyImport(
  () => import("@/components/ui/rich-text-editor"),
  "RichTextEditor",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
  }
)

export const LazyDataTable = lazyImport(
  () => import("@/components/ui/data-table"),
  "DataTable",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />
  }
)

export const LazyChartComponent = lazyImport(
  () => import("@/components/ui/chart"),
  "ChartComponent",
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
  }
)
```

## 2. Next.js Route-Based Code Splitting

### How Route-Based Code Splitting Works

Next.js automatically code-splits at the route level. Each page or layout in the `app` directory becomes its own JavaScript bundle. This is different from component-level code splitting in several ways:

1. **Automatic vs. Manual**: Route-based splitting happens automatically; component-level requires explicit `React.lazy()` calls
2. **Granularity**: Route-based splitting is at the page level; component-level can be more granular
3. **Loading States**: Route-based uses loading.tsx files; component-level uses Suspense boundaries

### Implementing Route-Based Code Splitting

#### 1. Leveraging Next.js App Router Structure

The App Router already provides automatic code splitting at the route level. Each page in the `app` directory becomes its own bundle:

```
app/
├── page.tsx               # → / (home route bundle)
├── marketplace/
│   └── page.tsx           # → /marketplace (marketplace route bundle)
├── checkout/
│   └── page.tsx           # → /checkout (checkout route bundle)
└── buyer/
    └── page.tsx           # → /buyer (buyer dashboard route bundle)
```

#### 2. Using Loading States for Routes

Create loading.tsx files for each route to provide a loading UI while the route bundle is being loaded:

```typescript
// app/marketplace/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplaceLoading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-64 mb-4" />
      <Skeleton className="h-4 w-48 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    </div>
  )
}
```

#### 3. Using Route Groups for Better Code Organization

Route groups allow you to organize routes without affecting the URL structure, which can help with code splitting:

```
app/
├── (marketing)/           # Route group for marketing pages
│   ├── page.tsx           # → / (home route)
│   ├── about/
│   │   └── page.tsx       # → /about
│   └── contact/
│       └── page.tsx       # → /contact
├── (shop)/                # Route group for shop pages
│   ├── marketplace/
│   │   └── page.tsx       # → /marketplace
│   └── checkout/
│       └── page.tsx       # → /checkout
└── (dashboard)/           # Route group for dashboard pages
    ├── buyer/
    │   └── page.tsx       # → /buyer
    ├── seller/
    │   └── page.tsx       # → /seller
    └── admin/
        └── page.tsx       # → /admin
```

#### 4. Implementing Parallel Routes for Complex Pages

Parallel routes allow you to split a single URL into multiple slots, each with its own loading state:

```typescript
// app/marketplace/@filters/page.tsx
export default function MarketplaceFilters() {
  return <MarketplaceFiltersComponent />
}

// app/marketplace/@products/page.tsx
export default function MarketplaceProducts() {
  return <MarketplaceProductsComponent />
}

// app/marketplace/layout.tsx
export default function MarketplaceLayout({
  children,
  filters,
  products
}: {
  children: React.ReactNode
  filters: React.ReactNode
  products: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <div className="sidebar">{filters}</div>
      <div className="main">{products}</div>
    </div>
  )
}
```

### Best Practices for Route Organization

1. **Group Related Functionality**: Use route groups to organize related pages
2. **Prioritize Critical Routes**: Ensure critical routes have minimal dependencies
3. **Separate Admin/User Routes**: Keep admin routes separate from user-facing routes
4. **Use Shared Layouts Wisely**: Balance shared layouts with code splitting needs

## 3. Combining Component and Route-Based Code Splitting

For optimal performance, combine both approaches:

1. **Route-Level Splitting**: Let Next.js handle the primary code splitting at route boundaries
2. **Component-Level Splitting**: Use React.lazy for large components within routes
3. **Dynamic Imports for Data**: Use dynamic imports for large data processing utilities

Example of combined approach:

```typescript
// app/marketplace/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Route-level code splitting happens automatically
// Component-level code splitting for complex components
const DynamicMarketplaceFilters = dynamic(
  () => import('@/components/marketplace/marketplace-filters'),
  { 
    loading: () => <Skeleton className="h-[600px] w-full" />,
    ssr: false
  }
)

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-8">
      <h1>Marketplace</h1>
      <div className="grid grid-cols-[300px_1fr] gap-6">
        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <DynamicMarketplaceFilters />
        </Suspense>
        <MarketplaceProductsClient />
      </div>
    </div>
  )
}
```

## 4. Measuring Performance Impact

To measure the impact of route-based code splitting:

1. **Bundle Analysis**:
   ```bash
   # Install the bundle analyzer
   npm install --save-dev @next/bundle-analyzer
   
   # Create next.config.js with analyzer
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   module.exports = withBundleAnalyzer({})
   
   # Run the analysis
   ANALYZE=true npm run build
   ```

2. **Network Tab Analysis**:
   - Open Chrome DevTools → Network tab
   - Filter by JS
   - Navigate between routes and observe which bundles are loaded

3. **Lighthouse Metrics**:
   - Compare TTI, TBT, and JavaScript execution time before and after implementing route-based code splitting

4. **Core Web Vitals**:
   - Monitor LCP, FID, and CLS improvements in real user monitoring

## 5. Implementation Plan for Pickle B2B Marketplace

1. **Phase 1: Optimize Route Structure**
   - Reorganize routes using route groups
   - Implement loading.tsx files for all routes
   - Add error.tsx files for error handling

2. **Phase 2: Implement Component-Level Code Splitting**
   - Apply lazy loading to identified components
   - Add Suspense boundaries with appropriate fallbacks

3. **Phase 3: Implement Parallel Routes**
   - Split complex pages into parallel routes
   - Implement independent loading states for each slot

4. **Phase 4: Measure and Refine**
   - Analyze bundle sizes
   - Measure performance improvements
   - Refine code splitting strategy based on results

By implementing this comprehensive code splitting strategy, the Pickle B2B marketplace will achieve significantly improved initial load times and better overall performance.
