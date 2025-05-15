# Data Access Layer (DAL) Documentation

## Overview

The Data Access Layer (DAL) provides a centralized interface for interacting with the Convex backend. It implements consistent patterns for data fetching, error handling, and state management.

## Key Features

- **Centralized Data Access**: All Convex queries and mutations are accessed through a single, consistent interface.
- **Consistent Error Handling**: All errors are handled in a consistent way, with toast notifications for user feedback.
- **Loading States**: All data operations include loading states for better UX.
- **Caching**: Data is cached for better performance.
- **Type Safety**: All data structures are fully typed for better developer experience.

## Modules

### Base Utilities (`lib/data/index.ts`)

Core utilities for interacting with Convex:

- `useQuery`: Enhanced query hook with loading, error, and success states
- `useMutation`: Enhanced mutation hook with loading, error, and success states
- `handleError`: Common error handling for data operations

### Auth (`lib/data/auth.ts`)

Authentication-related hooks:

- `useCurrentUser`: Hook for getting the current user
- `useLogin`: Hook for logging in
- `useRegister`: Hook for registering a new user
- `useLogout`: Hook for logging out

### Users (`lib/data/users.ts`)

User-related hooks:

- `useUserProfile`: Hook for fetching a user profile by ID
- `useUpdateUserProfile`: Hook for updating a user profile
- `useBusinessProfile`: Hook for fetching business profile by user ID
- `useUserAddresses`: Hook for fetching user addresses
- `useUserPaymentMethods`: Hook for fetching user payment methods

### Products (`lib/data/products.ts`)

Product-related hooks:

- `useProducts`: Hook for fetching all products
- `useProduct`: Hook for fetching a product by ID
- `useProductsByCategory`: Hook for fetching products by category
- `useProductsBySeller`: Hook for fetching products by seller
- `useCreateProduct`: Hook for creating a product
- `useUpdateProduct`: Hook for updating a product
- `useDeleteProduct`: Hook for deleting a product
- `useSearchProducts`: Hook for searching products

### Cart (`lib/data/cart.ts`)

Cart-related hooks:

- `useCart`: Hook for fetching cart items by user
- `useAddToCart`: Hook for adding an item to the cart
- `useUpdateCartItem`: Hook for updating a cart item quantity
- `useRemoveFromCart`: Hook for removing an item from the cart
- `useClearCart`: Hook for clearing the cart
- `calculateCartTotals`: Function for calculating cart totals

### Orders (`lib/data/orders.ts`)

Order-related hooks:

- `useOrder`: Hook for fetching an order by ID
- `useBuyerOrders`: Hook for fetching orders by buyer
- `useSellerOrders`: Hook for fetching orders by seller
- `useOrderHistory`: Hook for fetching order history with pagination
- `useCreateOrder`: Hook for creating an order
- `useUpdateOrder`: Hook for updating an order
- `useCancelOrder`: Hook for cancelling an order

## Usage Examples

### Fetching User Profile

```tsx
import { useUserProfile } from "@/lib/data/exports";

function ProfileComponent() {
  const { data: profile, isLoading, error } = useUserProfile(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.email}</p>
    </div>
  );
}
```

### Updating User Profile

```tsx
import { useUpdateUserProfile } from "@/lib/data/exports";

function ProfileForm() {
  const { updateProfile, isLoading } = useUpdateUserProfile();
  
  const handleSubmit = async (data) => {
    await updateProfile(userId, {
      name: data.name,
      email: data.email,
      // other fields...
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

### Fetching Products

```tsx
import { useProducts } from "@/lib/data/exports";

function ProductList() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Adding to Cart

```tsx
import { useAddToCart } from "@/lib/data/exports";

function AddToCartButton({ productId }) {
  const { addToCart, isLoading } = useAddToCart();
  
  const handleClick = async () => {
    await addToCart(userId, productId, 1);
  };
  
  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

## Best Practices

1. **Always handle loading states**: Use the `isLoading` property to show loading indicators.
2. **Always handle errors**: Use the `error` property to show error messages.
3. **Use the DAL for all data operations**: Don't use Convex directly in components.
4. **Keep components focused on UI**: Move data fetching and mutation logic to the DAL.
5. **Use the provided hooks**: Don't create new hooks for data operations unless necessary.
