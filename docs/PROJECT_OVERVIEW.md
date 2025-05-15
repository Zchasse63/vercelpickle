# Pickle B2B Marketplace - Technical Project Overview

**Last Updated:** `2023-06-15`

> **Note**: This document provides a comprehensive technical overview of the Pickle B2B Marketplace project. For more detailed information, see the [Documentation Index](DOCUMENTATION_INDEX.md).

## Introduction

Pickle is a B2B food marketplace platform designed to connect food producers and suppliers with business buyers such as restaurants, grocery stores, and catering services. This document provides a comprehensive technical overview of the project, its architecture, and implementation details.

## Current Status

The project has made significant progress with the following achievements:

- **TypeScript Integration**: We've completed a major round of TypeScript fixes, resolving numerous type errors and enhancing code stability.
- **UI Component Library**: The shadcn/ui component library has been fully integrated and customized for our needs.
- **Animation Framework**: Framer Motion has been implemented for smooth transitions and interactions.
- **Convex Backend**: Full backend integration with Convex has been completed, including authentication, data models, and real-time synchronization.
- **Form Validation**: Zod schema validation has been implemented for all forms.
- **Global State Management**: Zustand stores have been implemented for global state management with backend synchronization.
- **Error Handling**: Comprehensive error handling and notification system has been implemented.
- **Authentication**: User authentication with Convex has been implemented with role-based access control.

### Current Focus Areas

1. **Testing Infrastructure**: Setting up comprehensive testing for components and API endpoints
2. **Payment Processing**: Integrating Stripe for secure payment handling
3. **Performance Optimization**: Optimizing data fetching and rendering performance
4. **Accessibility Improvements**: Enhancing accessibility across all components

## System Architecture

### Frontend Architecture

The frontend is built with Next.js 14 using the App Router architecture, which provides several advantages:

- **Server Components**: Improved performance and reduced client-side JavaScript
- **Nested Layouts**: Consistent UI across related routes
- **Server Actions**: Secure form handling and mutations
- **Route Handlers**: API endpoints with simplified implementation
- **Streaming**: Progressive rendering for improved user experience

The UI is implemented using React components styled with Tailwind CSS and our enhanced UI Kit based on shadcn/ui. The UI Kit provides a comprehensive set of standardized, accessible, and responsive components that ensure a consistent design language across the entire platform.

### Backend Architecture

The backend is powered by Convex, a real-time database and backend service:

- **Schema Definition**: Strongly typed schema for data validation
- **Mutations & Queries**: Type-safe database operations
- **Real-time Subscriptions**: Live updates for collaborative features
- **Access Control**: Fine-grained permissions for data security
- **Serverless Functions**: Backend logic without managing infrastructure

### State Management Architecture

The application uses Zustand for global state management:

- **Modular Stores**: Each domain has its own store with specific state and methods
- **Persistence**: State is persisted to localStorage for a seamless user experience
- **Backend Synchronization**: State is synchronized with the backend when the user is authenticated
- **Error Handling**: Consistent error handling across all stores
- **Loading States**: Loading states are managed consistently across all stores

The state management system includes the following stores:

- **AuthStore**: Authentication state management
- **CartStore**: Shopping cart state management
- **AddressStore**: Shipping address state management
- **PaymentStore**: Payment method state management
- **OrderStore**: Order and checkout state management
- **ThemeStore**: Theme preferences management

### Error Handling and Notifications

The application implements a comprehensive error handling and notification system:

- **Centralized Error Handling**: Consistent error handling across the application
- **User-friendly Notifications**: Toast notifications for success and error messages
- **Loading State Management**: Consistent loading state management
- **Form Validation**: Zod schema validation for forms
- **Error Boundaries**: React error boundaries for catching rendering errors

### Authentication & Authorization

Authentication has been implemented with Convex's authentication system:

- **JWT-based Authentication**: Secure token handling
- **Role-based Access Control**: Different permissions for buyers, sellers, and admins
- **Protected Routes**: Server-side and client-side route protection
- **Session Management**: Secure handling of user sessions
- **Persistent Authentication**: Authentication state is persisted across page reloads
- **Automatic Token Refresh**: Authentication tokens are automatically refreshed

### Payment Processing

Payment processing will be implemented with Stripe:

- **Secure Checkout**: PCI-compliant payment handling
- **Payment Intents API**: Modern payment flow with 3D Secure support
- **Webhook Integration**: Real-time payment event handling
- **Connect Accounts**: Marketplace payments with commission handling

## Component Structure

### Core Components

1. **Layout Components**:
   - `AdminLayout`: Layout for admin dashboard
   - `BuyerLayout`: Layout for buyer dashboard
   - `SellerLayout`: Layout for seller dashboard
   - `MarketplaceLayout`: Layout for marketplace pages

2. **Navigation Components**:
   - `AdminSidebar`: Navigation for admin dashboard
   - `BuyerSidebar`: Navigation for buyer dashboard
   - `SellerSidebar`: Navigation for seller dashboard
   - `MarketplaceHeader`: Main navigation for marketplace

3. **Dashboard Components**:
   - `AdminDashboard`: Overview for administrators
   - `BuyerDashboard`: Overview for buyers
   - `SellerDashboard`: Overview for sellers

4. **Data Display Components**:
   - `DataTable`: Reusable table with sorting, filtering, and pagination
   - `StatsCard`: Metrics display card
   - `Chart`: Data visualization component

5. **Form Components**:
   - `ProductForm`: Form for creating/editing products
   - `OrderForm`: Form for creating/editing orders
   - `UserForm`: Form for user profile management

### Admin Dashboard Components

1. **User Management**:
   - `UsersTable`: Table for managing users
   - `UserDetails`: Detailed user information

2. **Order Management**:
   - `OrdersTable`: Table for managing orders
   - `OrderDetails`: Detailed order information
   - `OrderTimeline`: Visual representation of order status

3. **Product Management**:
   - `ProductsTable`: Table for managing products
   - `ProductDetails`: Detailed product information
   - `ProductInventory`: Inventory management interface

4. **Support System**:
   - `SupportTicketsTable`: Table for managing support tickets
   - `TicketDetails`: Detailed ticket information
   - `TicketConversation`: Support conversation interface

5. **Analytics**:
   - `SalesChart`: Sales data visualization
   - `UserChart`: User growth visualization
   - `CategoryChart`: Category performance visualization
   - `GeographyChart`: Geographic distribution visualization

### Buyer Dashboard Components

1. **Product Browsing**:
   - `ProductGrid`: Grid display of products
   - `ProductFilters`: Filtering options for products
   - `ProductSearch`: Search functionality for products

2. **Order Management**:
   - `BuyerOrdersTable`: Table for buyer's orders
   - `BuyerOrderDetails`: Detailed order information for buyers

3. **Account Management**:
   - `BuyerProfile`: Buyer profile management
   - `PaymentMethods`: Payment method management
   - `ShippingAddresses`: Shipping address management

### Seller Dashboard Components

1. **Product Management**:
   - `SellerProductsTable`: Table for seller's products
   - `SellerProductForm`: Form for creating/editing products
   - `InventoryManagement`: Interface for managing inventory

2. **Order Fulfillment**:
   - `SellerOrdersTable`: Table for seller's orders
   - `OrderFulfillment`: Interface for fulfilling orders

3. **Analytics**:
   - `SellerSalesChart`: Sales data visualization for sellers
   - `ProductPerformance`: Product performance metrics
   - `CustomerInsights`: Customer behavior insights

### Marketplace Components

1. **Product Browsing**:
   - `ProductCatalog`: Main product browsing interface
   - `ProductCard`: Card display for individual products
   - `CategoryNavigation`: Category-based navigation

2. **Shopping**:
   - `ProductDetails`: Detailed product view
   - `ShoppingCart`: Cart management interface
   - `Checkout`: Checkout process interface

## Database Schema Details

### Users Collection

```typescript
// users schema
{
  id: v.id("users"),
  name: v.string(),
  email: v.string(),
  role: v.string(), // "buyer", "seller", "admin"
  status: v.string(), // "active", "inactive", "pending"
  createdAt: v.number(),
  updatedAt: v.number(),

  // Buyer-specific fields
  company: v.optional(v.string()),
  phone: v.optional(v.string()),
  shippingAddresses: v.optional(v.array(v.object({
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
    isDefault: v.boolean(),
  }))),

  // Seller-specific fields
  businessName: v.optional(v.string()),
  businessDescription: v.optional(v.string()),
  businessLogo: v.optional(v.string()),
  businessAddress: v.optional(v.object({
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
  })),
  taxId: v.optional(v.string()),
  bankInfo: v.optional(v.object({
    accountName: v.string(),
    accountNumber: v.string(),
    routingNumber: v.string(),
  })),
}