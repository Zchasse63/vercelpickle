# Payment Method Component Structure

## Overview

The Payment Method Component Structure provides a modular and composable approach to building payment method-related UI components. It follows best practices for component composition, state management, and UI consistency.

## Key Features

- **Modular Components**: Each component has a single responsibility and can be composed with other components.
- **Consistent UI**: All payment method components follow the same design patterns and UI conventions.
- **Separation of Concerns**: Display, form, and selection components are separated for better reusability.
- **Accessibility**: All components include proper ARIA attributes and keyboard navigation.
- **Testability**: All components include data-testid attributes for testing.

## Component Hierarchy

```
components/payment/
├── index.ts                      # Exports all payment method components
├── payment-method-card.tsx       # Card component for displaying a payment method
├── payment-method-form.tsx       # Form component for adding/editing a payment method
├── payment-method-form-dialog.tsx # Dialog component for payment method forms
├── payment-method-list.tsx       # List component for displaying payment methods
└── payment-method-selector.tsx   # Selector component for choosing a payment method
```

## Components

### PaymentMethodCard

A component for displaying a payment method with actions for deleting and setting as default.

```tsx
<PaymentMethodCard
  paymentMethod={paymentMethod}
  onDelete={(id) => {}}
  onSetDefault={(id) => {}}
  testId="payment-method"
/>
```

### PaymentMethodForm

A form for adding or editing a payment method.

```tsx
<PaymentMethodForm
  initialData={paymentMethod}
  onSubmit={(data) => {}}
  testId="payment-method-form"
/>
```

### PaymentMethodFormDialog

A dialog for adding or editing a payment method.

```tsx
<PaymentMethodFormDialog
  title="Add Payment Method"
  description="Enter your card details to add a new payment method."
  onSubmit={(data) => {}}
  testId="payment-method-dialog"
>
  <Button>Add Payment Method</Button>
</PaymentMethodFormDialog>
```

### PaymentMethodList

A component for displaying a list of payment methods with actions for adding, deleting, and setting as default.

```tsx
<PaymentMethodList
  paymentMethods={paymentMethods}
  onAddPaymentMethod={(paymentMethod) => {}}
  onDeletePaymentMethod={(id) => {}}
  onSetDefaultPaymentMethod={(id) => {}}
  testId="payment-method-list"
/>
```

### PaymentMethodSelector

A component for selecting a payment method from a list of payment methods.

```tsx
<PaymentMethodSelector
  paymentMethods={paymentMethods}
  selectedPaymentMethodId={selectedPaymentMethodId}
  onPaymentMethodSelected={(id) => {}}
  onAddPaymentMethod={(paymentMethod) => {}}
  testId="payment-method-selector"
/>
```

## Buyer Components

### BuyerPaymentMethodManager

A component for managing a buyer's payment methods.

```tsx
<BuyerPaymentMethodManager testId="buyer-payment-methods" />
```

### BuyerPaymentMethodSelector

A component for selecting a buyer's payment method.

```tsx
<BuyerPaymentMethodSelector
  onPaymentMethodSelected={(id) => {}}
  selectedPaymentMethodId={selectedPaymentMethodId}
  testId="buyer-payment-method-selector"
/>
```

## Implementation Examples

### Payment Methods Page

```tsx
export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
        <p className="text-gray-500">Manage your payment methods for purchases.</p>
      </div>

      <Card className="p-6">
        <BuyerPaymentMethodManager testId="payment-methods" />
      </Card>
    </div>
  )
}
```

### Checkout Payment Selection

```tsx
export function CheckoutPaymentStep({ onNext }: { onNext: () => void }) {
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("")
  
  const handlePaymentMethodSelected = (id: string) => {
    setSelectedPaymentMethodId(id)
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      
      <BuyerPaymentMethodSelector
        onPaymentMethodSelected={handlePaymentMethodSelected}
        selectedPaymentMethodId={selectedPaymentMethodId}
        testId="checkout-payment-selector"
      />
      
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedPaymentMethodId}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
```

## Data Flow

The payment method components follow a consistent data flow pattern:

1. **Data Fetching**: The `BuyerPaymentMethodManager` and `BuyerPaymentMethodSelector` components fetch payment method data from the Data Access Layer.
2. **State Management**: The components maintain local state for optimistic updates.
3. **User Interactions**: User interactions (add, delete, select) are handled by the components and propagated to the parent components.
4. **API Calls**: API calls are made through the Data Access Layer.

## Form Validation

The `PaymentMethodForm` component uses Zod for form validation:

```tsx
const paymentMethodSchema = z.object({
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string()
    .min(13, "Card number is required")
    .refine(validateCardNumber, "Invalid card number"),
  expiry: z.string()
    .min(5, "Expiry date is required")
    .refine(validateExpiryDate, "Invalid expiry date"),
  cvc: z.string()
    .min(3, "CVC is required")
    .max(4, "CVC must be 3-4 digits")
    .regex(/^\d{3,4}$/, "CVC must be 3-4 digits"),
  isDefault: z.boolean().default(false)
});
```

## Card Number Validation

The `PaymentMethodForm` component includes comprehensive card number validation:

```tsx
const validateCardNumber = (value: string) => {
  // Remove spaces and non-numeric characters
  const cardNumber = value.replace(/\D/g, '');

  // Check if it's a valid length (most cards are 13-19 digits)
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return false;
  }

  // Luhn algorithm for card number validation
  let sum = 0;
  let shouldDouble = false;

  // Loop through the card number from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
```

## Best Practices

1. **Use Composition**: Compose smaller components to build more complex UIs.
2. **Separate Display and Form Components**: Keep display and form components separate for better reusability.
3. **Use Consistent Patterns**: Follow the same patterns across all payment method components.
4. **Add TestIDs**: Always add testId props to components for testing.
5. **Handle Loading States**: Always include loading states for better UX.
6. **Add Proper ARIA Attributes**: Ensure all components are accessible.
