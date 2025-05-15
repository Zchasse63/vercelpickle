# Global State Management

## Overview

The global state management system is built using Zustand, a lightweight state management library. It provides a centralized store for managing application state, with support for persistence, synchronization with the backend, and error handling.

## Key Features

- **Modular Stores**: Each domain has its own store with specific state and methods.
- **Persistence**: State is persisted to localStorage for a seamless user experience.
- **Synchronization**: State is synchronized with the backend when the user is authenticated.
- **Error Handling**: Consistent error handling across all stores.
- **Loading States**: Loading states are managed consistently across all stores.
- **Type Safety**: All stores are fully typed for better developer experience.

## Store Structure

```
lib/store/
├── index.ts                # Core utilities and exports
├── auth-store.ts           # Authentication state
├── cart-store.ts           # Shopping cart state
├── address-store.ts        # Shipping address state
├── payment-store.ts        # Payment method state
├── order-store.ts          # Order and checkout state
├── theme-store.ts          # Theme preferences
└── store-initializer.ts    # Store initialization and synchronization
```

## Store Provider and Initialization

The `StoreProvider` component initializes all stores and handles synchronization with the backend. It is included in the application's provider tree to ensure all stores are available throughout the application.

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

### StoreInitializer

The `StoreInitializer` component is responsible for synchronizing all stores with the backend when the user is authenticated. It is included in the `StoreProvider` component to ensure all stores are synchronized automatically.

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

## Core Utilities

### `createPersistedStore`

Creates a persisted store with error handling.

```typescript
export function createPersistedStore<T extends object, M>(
  name: string,
  initialState: T,
  methods: (set: any, get: any) => M
) {
  return create(
    persist<T & M>(
      (set, get) => ({
        ...initialState,
        ...methods(set, get),
      }),
      {
        name: `pickle_${name}`,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log(`State '${name}' rehydrated`)
          } else {
            console.warn(`Failed to rehydrate state '${name}'`)
          }
        },
      }
    )
  )
}
```

### `createStore`

Creates a store without persistence.

```typescript
export function createStore<T extends object, M>(
  initialState: T,
  methods: (set: any, get: any) => M
) {
  return create<T & M>((set, get) => ({
    ...initialState,
    ...methods(set, get),
  }))
}
```

### `handleStoreError`

Handles errors in store operations.

```typescript
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
```

### Loading and Error Handlers

```typescript
export const createLoadingHandler = (set: any) => ({
  startLoading: () => set({ isLoading: true, error: null }),
  stopLoading: () => set({ isLoading: false }),
  setError: (error: Error | null) => set({ error, isLoading: false }),
})

export const createErrorHandler = (set: any) => ({
  setError: (error: Error | null) => set({ error }),
  clearError: () => set({ error: null }),
})

export const createResetHandler = (set: any, initialState: any) => ({
  reset: () => set(initialState),
})
```

## Store Implementations

### Authentication Store

The authentication store manages user authentication state, including login, registration, and logout.

```typescript
export const useAuthStore = createPersistedStore<AuthState, AuthMethods>(
  'auth',
  initialState,
  (set, get) => ({
    setUser: (user: User | null) => { ... },
    login: async (email: string, password: string) => { ... },
    register: async (name: string, email: string, password: string, role: string) => { ... },
    logout: () => { ... },
    checkAuth: async () => { ... },
  })
)
```

### Cart Store

The cart store manages the shopping cart state, including adding, updating, and removing items.

```typescript
export const useCartStore = createPersistedStore<CartState, CartMethods>(
  'cart',
  initialState,
  (set, get) => ({
    calculateTotals: () => { ... },
    addItem: async (productId: Id<'products'>, product: Product, quantity: number) => { ... },
    updateItem: async (itemId: string, quantity: number) => { ... },
    removeItem: async (itemId: string) => { ... },
    clearCart: async () => { ... },
    syncWithBackend: async (userId: Id<'users'> | null) => { ... },
  })
)
```

### Address Store

The address store manages shipping and billing addresses, including adding, updating, and deleting addresses.

```typescript
export const useAddressStore = createPersistedStore<AddressState, AddressMethods>(
  'address',
  initialState,
  (set, get) => ({
    addAddress: async (addressData: AddressFormData) => { ... },
    updateAddress: async (id: string, addressData: AddressFormData) => { ... },
    deleteAddress: async (id: string) => { ... },
    setDefaultAddress: async (id: string) => { ... },
    selectAddress: (id: string | null) => { ... },
    loadAddresses: async (userId: Id<'users'> | null) => { ... },
    syncWithBackend: async (userId: Id<'users'> | null) => { ... },
  })
)
```

### Payment Method Store

The payment method store manages payment methods, including adding, deleting, and setting default payment methods.

```typescript
export const usePaymentStore = createPersistedStore<PaymentState, PaymentMethods>(
  'payment',
  initialState,
  (set, get) => ({
    addPaymentMethod: async (formData: PaymentFormData) => { ... },
    deletePaymentMethod: async (id: string) => { ... },
    setDefaultPaymentMethod: async (id: string) => { ... },
    selectPaymentMethod: (id: string | null) => { ... },
    loadPaymentMethods: async (userId: Id<'users'> | null) => { ... },
    syncWithBackend: async (userId: Id<'users'> | null) => { ... },
  })
)
```

### Order Store

The order store manages orders and checkout state, including creating orders, getting order history, and managing checkout steps.

```typescript
export const useOrderStore = createPersistedStore<OrderState, OrderMethods>(
  'order',
  initialState,
  (set, get) => ({
    createOrder: async (...) => { ... },
    getOrder: async (id: Id<'orders'> | string) => { ... },
    getOrders: async (userId: Id<'users'> | null) => { ... },
    cancelOrder: async (id: Id<'orders'> | string) => { ... },
    setCheckoutStep: (step: CheckoutState['step']) => { ... },
    setShippingAddress: (id: string | null) => { ... },
    setBillingAddress: (id: string | null) => { ... },
    setPaymentMethod: (id: string | null) => { ... },
    setShippingMethod: (method: CheckoutState['shippingMethod']) => { ... },
    setNotes: (notes: string) => { ... },
    resetCheckout: () => { ... },
  })
)
```

### Theme Store

The theme store manages theme preferences, including light, dark, and system themes.

```typescript
export const useThemeStore = createPersistedStore<ThemeState, ThemeMethods>(
  'theme',
  initialState,
  (set, get) => ({
    setTheme: (theme: Theme) => { ... },
    toggleTheme: () => { ... },
    setSystemTheme: (systemTheme: 'light' | 'dark') => { ... },
  })
)
```

## Usage Examples

### Using Authentication Store

```tsx
import { useAuthStore } from '@/lib/store'

function LoginForm() {
  const { login, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    const success = await login(email, password)

    if (success) {
      // Redirect to dashboard
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error.message}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Using Cart Store

```tsx
import { useCartStore } from '@/lib/store'

function AddToCartButton({ product }) {
  const { addItem, isLoading } = useCartStore()

  const handleAddToCart = async () => {
    await addItem(product.id, product, 1)
  }

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

### Using Theme Store

```tsx
import { useThemeStore } from '@/lib/store'

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

## Best Practices

1. **Use Selectors**: When accessing store state, use selectors to avoid unnecessary re-renders.
2. **Keep State Minimal**: Only store what you need in global state. Use local state for UI-specific state.
3. **Use TypeScript**: Always define types for your state and methods.
4. **Handle Errors**: Always handle errors in your store methods using the centralized error handling utilities.
5. **Manage Loading States**: Always manage loading states for async operations using the loading handlers.
6. **Sync with Backend**: Always implement a `syncWithBackend` method in your stores to synchronize state with the backend.
7. **Use Persistence**: Use persistence for state that should be preserved across page reloads.
8. **Reset State**: Always provide a way to reset state to its initial values.
9. **Provide Feedback**: Always provide feedback to users using the notification system.
10. **Optimize Queries**: Use optimized queries when fetching data from the backend.

### Backend Synchronization Pattern

When implementing backend synchronization, follow this pattern:

```typescript
// Example syncWithBackend method
syncWithBackend: async (userId: Id<'users'> | null) => {
  // Skip if no user ID
  if (!userId) return

  // Start loading
  loadingHandler.startLoading()

  try {
    // Get data from backend
    const data = await fetchDataFromBackend(userId)

    // Update state
    set({
      items: data,
      error: null,
    })

    // Return data for chaining
    return data
  } catch (error) {
    // Handle error
    const err = error instanceof Error ? error : new Error('Failed to sync with backend')
    errorHandler.setError(err)

    // Show error notification
    showErrorNotification('Sync Failed', err.message)

    // Rethrow for handling in the caller
    throw err
  } finally {
    // Stop loading
    loadingHandler.stopLoading()
  }
}
```
