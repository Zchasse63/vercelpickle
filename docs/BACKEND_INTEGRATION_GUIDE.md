# Backend Integration Guide

**Last Updated:** `2023-06-15`

> **Note**: This document provides guidance on integrating with the Convex backend in the Pickle B2B Marketplace project. For more detailed information, see the [Documentation Index](DOCUMENTATION_INDEX.md) and [Convex Schemas](CONVEX_SCHEMAS.md).

## Introduction

The Pickle B2B Marketplace project uses Convex as its backend service. This guide provides information on how to integrate with the Convex backend, including setting up the client, defining schemas, creating queries and mutations, and implementing real-time data synchronization.

## Setting Up Convex

### Installation

Convex is already installed in the project. The main packages used are:

- `convex`: The core Convex package
- `convex/react`: React hooks for Convex
- `convex/server`: Server-side utilities for Convex

### Configuration

The Convex configuration is defined in `convex.json`:

```json
{
  "functions": {
    "codegen": {
      "provider": "convex/codegen",
      "output": "convex/_generated"
    }
  }
}
```

### Environment Variables

Convex requires the following environment variables:

- `CONVEX_DEPLOYMENT`: The Convex deployment ID (e.g., `avid-dove-899`)
- `NEXT_PUBLIC_CONVEX_URL`: The public URL for the Convex deployment

These are defined in `.env.local` and should not be committed to version control.

## Convex Schema

The Convex schema is defined in `convex/schema.ts` and includes the following main tables:

### Users

```typescript
users: defineTable({
  name: v.string(),
  email: v.string(),
  role: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

### Products

```typescript
products: defineTable({
  name: v.string(),
  description: v.string(),
  price: v.number(),
  sellerId: v.id("users"),
  sellerName: v.optional(v.string()),
  category: v.string(),
  subcategory: v.optional(v.string()),
  images: v.array(v.string()),
  inventory: v.number(),
  unit: v.string(),
  minimumOrder: v.optional(v.number()),
  status: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),

  // Enhanced product data
  features: v.optional(v.array(v.string())),
  specifications: v.optional(v.object({
    // Specifications schema
  })),
  origin: v.optional(v.object({
    // Origin schema
  })),
  certifications: v.optional(v.array(v.string())),
})
```

### Orders

```typescript
orders: defineTable({
  buyerId: v.id("users"),
  sellerId: v.id("users"),
  products: v.array(
    v.object({
      productId: v.id("products"),
      quantity: v.number(),
      price: v.number(),
    })
  ),
  status: v.string(),
  total: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

For more detailed schema information, see the [Convex Schemas](CONVEX_SCHEMAS.md) and [Enhanced Product Schema](enhanced-product-schema.md) documentation.

## Convex Client Setup

### Provider Setup

The Convex client is set up in our provider structure with proper singleton pattern to prevent multiple instances:

```tsx
// components/marketplace/marketplace-convex-provider.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";
import { Loading } from "@/components/ui/loading";

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create a singleton client instance
let clientSingleton: ConvexReactClient | null = null;

const getConvexClient = () => {
  // Always create a new client on the server
  if (typeof window === "undefined") return null;

  // Return the singleton if it exists
  if (clientSingleton) return clientSingleton;

  // Create a new client
  clientSingleton = new ConvexReactClient(convexUrl);
  return clientSingleton;
};

export function MarketplaceConvexProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the client on the client side
    const convexClient = getConvexClient();
    setClient(convexClient);

    // Set loading to false after a short delay to ensure the client is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // If we're still loading or don't have a client, show a loading indicator
  if (isLoading || !client) {
    return <Loading />;
  }

  return (
    <ConvexReactProvider client={client}>
      {children}
    </ConvexReactProvider>
  );
}
```

Our provider structure is organized as follows:

```tsx
<ConvexProviderClient>
  <AuthProvider>
    <StoreProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </StoreProvider>
  </AuthProvider>
</ConvexProviderClient>
```

### Using the Client

To use the Convex client in a component:

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function ProductList() {
  const products = useQuery(api.products.list);

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

## Queries and Mutations

### Defining Queries

Queries are defined in `convex/products.ts`:

```typescript
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    dietary: v.optional(v.object({
      organic: v.optional(v.boolean()),
      glutenFree: v.optional(v.boolean()),
      // Additional dietary filters
    })),
  },
  handler: async (ctx, args) => {
    let productsQuery = ctx.db.query("products");

    // Apply filters
    if (args.query) {
      productsQuery = productsQuery.filter((q) =>
        q.or(
          q.contains(q.field("name"), args.query),
          q.contains(q.field("description"), args.query)
        )
      );
    }

    if (args.category) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("category"), args.category)
      );
    }

    // Additional filters

    return await productsQuery.collect();
  },
});
```

### Defining Mutations

Mutations are defined in `convex/products.ts`:

```typescript
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    images: v.array(v.string()),
    inventory: v.number(),
    unit: v.string(),
    // Additional fields
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("products", {
      ...args,
      sellerId: userId.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    // Additional fields
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;

    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.sellerId !== userId.id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});
```

## Authentication Integration

We've implemented a comprehensive authentication system that integrates with Convex. The authentication store is responsible for managing user authentication state and synchronizing it with the backend.

```typescript
// lib/store/auth-store.ts
export const useAuthStore = createPersistedStore<AuthState, AuthMethods>(
  'auth',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Set user
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        })

        // Store user ID in localStorage for Convex queries
        if (user) {
          localStorage.setItem('userId', user.id)
        } else {
          localStorage.removeItem('userId')
        }
      },

      // Login
      login: async (email: string, password: string) => {
        loadingHandler.startLoading()

        try {
          // Get the login mutation from Convex
          const loginMutation = useMutation(api.auth.login)

          // Call the login mutation
          const result = await loginMutation({ email, password })

          if (result.success) {
            // Create user data from the result
            const userData: User = {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              role: result.user.role as 'admin' | 'seller' | 'buyer',
              image: result.user.image,
            }

            // Update the state
            set({
              user: userData,
              isAuthenticated: true,
              error: null,
            })

            // Store user ID in localStorage for Convex queries
            localStorage.setItem('userId', userData.id)

            // Show success notification
            showSuccessNotification('Login successful', `Welcome back, ${userData.name}!`)

            return true
          } else {
            // Handle login failure
            const error = new Error(result.message || 'Invalid email or password')
            errorHandler.setError(error)

            // Show error notification
            showErrorNotification('Login failed', result.message || 'Invalid email or password')

            return false
          }
        } catch (error) {
          // Handle unexpected errors
          const err = error instanceof Error ? error : new Error('Failed to login')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Login failed', err.message)

          return false
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Additional methods...
    }
  }
)
```

## Store Synchronization with Backend

We've implemented a `StoreInitializer` component that synchronizes all stores with the backend when the user is authenticated. This ensures that the user's data is always up-to-date.

```typescript
// lib/store/store-initializer.ts
export function StoreInitializer() {
  // Get stores
  const { user, checkAuth } = useAuthStore()
  const { syncWithBackend: syncCart } = useCartStore()
  const { syncWithBackend: syncAddresses } = useAddressStore()
  const { syncWithBackend: syncPaymentMethods } = usePaymentStore()
  const { syncWithBackend: syncOrders } = useOrderStore()

  // Check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Failed to check authentication:', error)
      }
    }

    initializeAuth()
  }, [checkAuth])

  // Sync stores with backend when user changes
  useEffect(() => {
    const syncStores = async () => {
      if (!user) return

      try {
        // Sync cart with backend
        await syncCart(user.id)

        // Sync addresses with backend
        await syncAddresses(user.id)

        // Sync payment methods with backend
        await syncPaymentMethods(user.id)

        // Sync orders with backend
        await syncOrders(user.id)
      } catch (error) {
        console.error('Failed to sync stores with backend:', error)
        showErrorNotification('Sync Failed', 'Failed to sync your data with the server.')
      }
    }

    syncStores()
  }, [user, syncCart, syncAddresses, syncPaymentMethods, syncOrders])

  // This component doesn't render anything
  return null
}
```

The `StoreProvider` component includes the `StoreInitializer` to ensure all stores are synchronized with the backend:

```typescript
// providers/store-provider.tsx
export function StoreProvider({ children }: StoreProviderProps) {
  // Get the authenticated user from the auth provider
  const { user } = useAuth()

  // Get the setUser method from the auth store
  const { setUser } = useAuthStore()

  // Sync the auth store with the auth provider
  useEffect(() => {
    if (user) {
      setUser({
        id: user.id as Id<'users'>,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      })
    } else {
      setUser(null)
    }
  }, [user, setUser])

  return (
    <>
      <StoreInitializer />
      {children}
    </>
  )
}
```

## Real-time Data Synchronization

Convex provides real-time data synchronization out of the box. When using the `useQuery` hook, the component will automatically re-render when the data changes.

```tsx
function ProductList() {
  const products = useQuery(api.products.list);

  // This component will automatically re-render when products change

  return (
    <div>
      {products?.map((product) => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling and Notifications

We've implemented a comprehensive error handling system that provides consistent error handling across the application and user-friendly notifications.

### Centralized Error Handling

We've created utility functions for handling errors consistently:

```typescript
// lib/store/index.ts
export const handleStoreError = (error: unknown, customMessage?: string) => {
  console.error('Store operation error:', error)

  const errorMessage = error instanceof Error
    ? error.message
    : 'An unexpected error occurred'

  toast({
    title: customMessage || 'Operation Failed',
    description: errorMessage,
    variant: 'destructive',
  })

  return errorMessage
}

// lib/data/index.ts
export const handleError = (error: unknown, customMessage?: string) => {
  console.error("Data operation error:", error);

  const errorMessage = error instanceof Error
    ? error.message
    : "An unexpected error occurred";

  toast({
    title: customMessage || "Operation Failed",
    description: errorMessage,
    variant: "destructive",
  });

  return errorMessage;
};
```

### Loading and Error State Handlers

We've created utility functions for managing loading and error states consistently:

```typescript
// lib/store/index.ts
export const createLoadingHandler = (set: any) => ({
  startLoading: () => set({ isLoading: true, error: null }),
  stopLoading: () => set({ isLoading: false }),
  setError: (error: Error | null) => set({ error, isLoading: false }),
})

export const createErrorHandler = (set: any) => ({
  setError: (error: Error | null) => set({ error }),
  clearError: () => set({ error: null }),
})
```

### Notification System

We've implemented a notification system using toast notifications:

```typescript
// lib/store/index.ts
export const showSuccessNotification = (title: string, description: string) => {
  toast({
    title,
    description,
  })
}

export const showErrorNotification = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: 'destructive',
  })
}
```

### Client-side Error Handling in Stores

All stores use the same pattern for error handling:

```typescript
// Example from cart-store.ts
addItem: async (productId: Id<'products'>, product: Product, quantity: number) => {
  loadingHandler.startLoading()

  try {
    // Add item to cart
    // ...

    // Show success notification
    showSuccessNotification('Item added', `${product.name} has been added to your cart.`)
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to add item to cart')
    errorHandler.setError(err)

    // Show error notification
    showErrorNotification('Error', err.message)
  } finally {
    loadingHandler.stopLoading()
  }
}
```

### Enhanced Form Error Handling

We've implemented enhanced error handling for forms:

```typescript
// lib/forms/index.ts
const handleSubmit = async (data: TFieldValues) => {
  if (!onSubmit) return;

  setIsSubmitting(true);

  try {
    await onSubmit(data);
  } catch (error) {
    console.error("Form submission error:", error);

    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

const handleError = (errors: FieldErrors<TFieldValues>) => {
  console.error("Form validation errors:", errors);

  // Show toast for validation errors
  if (Object.keys(errors).length > 0) {
    toast({
      title: "Validation Error",
      description: "Please correct the errors in the form.",
      variant: "destructive",
    });
  }

  // Call custom error handler if provided
  if (onError) {
    onError(errors);
  }
};
```

### Server-side Error Handling

On the server side, we handle errors in Convex mutations and queries:

```typescript
export const create = mutation({
  // Args definition
  handler: async (ctx, args) => {
    try {
      // Validation
      if (args.price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      // Create product
      return await ctx.db.insert("products", {
        // Product data
      });
    } catch (err) {
      // Log error
      console.error("Error creating product:", err);

      // Rethrow with user-friendly message
      throw new Error("Failed to create product. Please try again.");
    }
  },
});
```

## Best Practices

1. **Use TypeScript**: Define proper types for all queries, mutations, and store state
2. **Validate Input**: Validate all input data before processing using Zod schemas
3. **Handle Errors**: Use the centralized error handling utilities for consistent error handling
4. **Optimize Queries**: Use filters and pagination for large datasets
5. **Secure Access**: Implement proper authentication and authorization
6. **Synchronize State**: Use the StoreInitializer to synchronize state with the backend
7. **Manage Loading States**: Use loading handlers for consistent loading state management
8. **Provide Feedback**: Use notifications to provide feedback to users
9. **Test Thoroughly**: Test all queries, mutations, and store operations with various inputs

## Conclusion

By following this guide, you can effectively integrate with the Convex backend in the Pickle B2B Marketplace project. The combination of TypeScript, React hooks, Zustand stores, and Convex's real-time capabilities provides a powerful foundation for building a robust, scalable marketplace platform.

Our architecture ensures:

1. **Consistent State Management**: All state is managed consistently using Zustand stores
2. **Seamless Backend Integration**: All stores synchronize with the backend automatically
3. **Robust Error Handling**: All errors are handled consistently with user-friendly notifications
4. **Optimized Performance**: Queries are optimized for performance with proper caching
5. **Type Safety**: All data structures are fully typed for better developer experience

For more detailed information on specific aspects of the backend integration, see the [Convex Schemas](CONVEX_SCHEMAS.md), [Enhanced Product Schema](enhanced-product-schema.md), and [Global State Management](GLOBAL_STATE_MANAGEMENT.md) documentation.
