# Backend Integration Guide

This document provides a comprehensive guide to the backend integration implemented in the Pickle B2B Marketplace project. It covers the three main components: User Profile Management, Product Management, and Analytics Dashboard.

## Overview

The backend integration is built on top of Convex, a real-time backend as a service. The integration follows a consistent pattern:

1. **Convex Functions**: Server-side functions for data operations
2. **Data Access Layer (DAL)**: Client-side hooks for accessing data
3. **UI Components**: React components for displaying and interacting with data

## 1. User Profile Management

### Data Structures

- **User Profile**: Basic user information including name, email, role, and profile images
- **Business Profile**: Detailed business information including address, contact details, and certifications

### Convex Functions

Located in `convex/users.ts`:

- `getCurrentUser`: Get the current authenticated user
- `getById`: Get a user by ID
- `getByIds`: Get multiple users by IDs
- `getByRole`: Get users by role with pagination
- `create`: Create a new user
- `update`: Update a user
- `remove`: Delete a user
- `search`: Search for users
- `getStatistics`: Get user statistics

Located in `convex/businessProfiles.ts`:

- `getByUser`: Get a business profile by user ID
- `create`: Create a business profile
- `update`: Update a business profile

### Data Access Layer

Located in `lib/data/user-profiles.ts`:

- `useCurrentUserProfile`: Hook for fetching the current user's profile
- `useUserProfile`: Hook for fetching a user profile by ID
- `useUserProfiles`: Hook for fetching multiple user profiles
- `useUsersByRole`: Hook for fetching users by role
- `useUpdateUserProfile`: Hook for updating a user profile
- `useBusinessProfile`: Hook for fetching a business profile by user ID
- `useCreateBusinessProfile`: Hook for creating a business profile
- `useUpdateBusinessProfile`: Hook for updating a business profile

### UI Components

- `ProfileForm`: Form for editing user profile information
- `BusinessProfileForm`: Form for editing business profile information
- `ProfilePage`: Page for viewing and editing user profiles
- `ImageUpload`: Component for uploading profile images

### Pages

- `/profile`: Page for viewing and editing the current user's profile
- `/users/[id]`: Page for viewing another user's profile

## 2. Product Management

### Data Structures

- **Product**: Basic product information including name, description, price, and inventory
- **Product Variant**: Variations of a product with different prices and inventory

### Convex Functions

Located in `convex/products-batch.ts`:

- `batchCreate`: Create multiple products at once
- `batchUpdate`: Update multiple products at once
- `getByIds`: Get products by IDs
- `getLowInventory`: Get products with inventory below a threshold
- `getNeedReordering`: Get products that need reordering
- `getStatistics`: Get product statistics

### Data Access Layer

Located in `lib/data/product-management.ts`:

- `useBatchCreateProducts`: Hook for batch creating products
- `useBatchUpdateProducts`: Hook for batch updating products
- `useImportProducts`: Hook for importing products from CSV or JSON
- `useExportProducts`: Hook for exporting products to CSV or JSON
- `useProductVariants`: Hook for managing product variants
- `useAddProductVariant`: Hook for adding a product variant
- `useUpdateProductVariant`: Hook for updating a product variant
- `useRemoveProductVariant`: Hook for removing a product variant

### UI Components

- `ProductImportExport`: Component for importing and exporting products
- `ProductVariants`: Component for managing product variants

### Pages

- `/seller/products`: Page for managing products
- `/seller/products/[id]`: Page for editing a product
- `/seller/products/[id]/variants`: Page for managing product variants

## 3. Analytics Dashboard

### Data Structures

- **Sales Data**: Revenue, orders, and average order value over time
- **User Activity Data**: Active users, new users, and sessions over time
- **Product Performance Data**: Revenue, units sold, and conversion rates for products
- **Dashboard Summary**: Summary of key metrics

### Convex Functions

Located in `convex/analytics.ts`:

- `getDashboardSummary`: Get summary data for the dashboard
- `getSalesData`: Get sales data over time
- `getUserActivityData`: Get user activity data over time
- `getProductPerformanceData`: Get product performance data
- `getCategoryPerformanceData`: Get category performance data
- `getUserAcquisitionData`: Get user acquisition data
- `getOrderStatusData`: Get order status data
- `trackProductView`: Track a product view
- `trackUserAction`: Track a user action

### Data Access Layer

Located in `lib/data/analytics.ts`:

- `useDashboardSummary`: Hook for fetching dashboard summary data
- `useSalesData`: Hook for fetching sales data
- `useUserActivityData`: Hook for fetching user activity data
- `useProductPerformanceData`: Hook for fetching product performance data
- `useCategoryPerformanceData`: Hook for fetching category performance data
- `useUserAcquisitionData`: Hook for fetching user acquisition data
- `useOrderStatusData`: Hook for fetching order status data
- `useTrackProductView`: Hook for tracking a product view
- `useTrackUserAction`: Hook for tracking a user action

### UI Components

- `DashboardSummary`: Component for displaying dashboard summary data
- `SalesChart`: Component for displaying sales data
- `ProductPerformance`: Component for displaying product performance data

### Pages

- `/analytics`: General analytics dashboard
- `/seller/analytics`: Seller-specific analytics dashboard
- `/admin/analytics`: Admin-specific analytics dashboard

## Integration with Existing Code

The backend integration builds on top of the existing codebase:

- It uses the existing Convex schema defined in `convex/schema.ts`
- It extends the existing Data Access Layer pattern in `lib/data/index.ts`
- It follows the same component structure and styling as the rest of the application

## Best Practices

The backend integration follows these best practices:

1. **Consistent Patterns**: All data access follows the same pattern for consistency
2. **Error Handling**: All operations include proper error handling
3. **Loading States**: All components handle loading states gracefully
4. **Optimistic Updates**: Where appropriate, operations use optimistic updates for better UX
5. **Type Safety**: All data structures and operations are properly typed
6. **Caching**: Data is cached appropriately to reduce unnecessary requests
7. **Server-Side Functions**: Server-side functions are provided for use in Server Components

## Future Improvements

Potential future improvements to the backend integration:

1. **Real-time Updates**: Implement real-time updates for data changes
2. **Offline Support**: Add offline support for critical operations
3. **Advanced Filtering**: Implement more advanced filtering and sorting options
4. **Batch Operations**: Expand batch operations to more data types
5. **Performance Monitoring**: Add performance monitoring for data operations
6. **Data Validation**: Enhance data validation for all operations
7. **Data Migration**: Add tools for data migration and backup
