# Error Handling and Notifications Guide

## Overview

This guide outlines the error handling and notification system implemented in the Pickle B2B Marketplace project. The system provides consistent error handling across the application and user-friendly notifications.

## Key Features

- **Centralized Error Handling**: Consistent error handling across the application
- **User-friendly Notifications**: Toast notifications for success and error messages
- **Loading State Management**: Consistent loading state management
- **Form Validation**: Zod schema validation for forms
- **Error Boundaries**: React error boundaries for catching rendering errors

## Error Handling Utilities

### `handleError`

The `handleError` function is a centralized utility for handling errors consistently across the application.

```typescript
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

### `handleStoreError`

The `handleStoreError` function is a specialized version of `handleError` for handling errors in store operations.

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
```

### Loading and Error State Handlers

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

## Notification System

### Toast Notifications

We use toast notifications to provide feedback to users. The toast system is based on the `@/components/ui/use-toast` component.

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

### Toast Component

The toast component is a customizable notification component that can be used to display success, error, and information messages.

```tsx
// components/ui/toast.tsx
export function Toast({
  className,
  variant = "default",
  ...props
}: ToastProps) {
  return (
    <ToastPrimitives.Root
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        {
          "border-dill-green bg-dill-green/10 text-dill-green": variant === "success",
          "border-destructive bg-destructive/10 text-destructive": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  )
}
```

## Form Validation

### Zod Schema Validation

We use Zod schemas for form validation. The `useForm` hook from `react-hook-form` is configured to use Zod for validation.

```typescript
// lib/forms/index.ts
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: UseFormProps<z.infer<TSchema>>
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });
}
```

### Form Error Handling

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

## Error Boundaries

### ErrorBoundary Component

We use React error boundaries to catch rendering errors and display a fallback UI.

```tsx
// components/ui/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <h4 className="font-medium text-destructive">Something went wrong</h4>
          </div>
          <p className="text-sm text-destructive/90 mb-3">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Usage Examples

### Using Error Handling in Stores

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

### Using Form Validation

```tsx
// Example form component
function AddressForm() {
  const form = useZodForm({
    schema: addressSchema,
    defaultValues: {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    try {
      await addAddress(data);
      showSuccessNotification('Address Added', 'Your address has been added successfully.');
    } catch (error) {
      handleError(error, 'Failed to add address');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Adding...' : 'Add Address'}
        </Button>
      </form>
    </Form>
  );
}
```

### Using Error Boundaries

```tsx
// Example usage of error boundary
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

## Best Practices

1. **Use Centralized Error Handling**: Always use the centralized error handling utilities.
2. **Provide User-friendly Messages**: Always provide user-friendly error messages.
3. **Log Errors**: Always log errors for debugging purposes.
4. **Handle Loading States**: Always manage loading states for async operations.
5. **Validate Input**: Always validate input data using Zod schemas.
6. **Use Error Boundaries**: Use error boundaries to catch rendering errors.
7. **Provide Feedback**: Always provide feedback to users using the notification system.
8. **Handle Edge Cases**: Always handle edge cases and unexpected errors.
