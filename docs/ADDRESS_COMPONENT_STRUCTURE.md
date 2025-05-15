# Address Component Structure

## Overview

The Address Component Structure provides a modular and composable approach to building address-related UI components. It follows best practices for component composition, state management, and UI consistency.

## Key Features

- **Modular Components**: Each component has a single responsibility and can be composed with other components.
- **Consistent UI**: All address components follow the same design patterns and UI conventions.
- **Separation of Concerns**: Display, form, and selection components are separated for better reusability.
- **Accessibility**: All components include proper ARIA attributes and keyboard navigation.
- **Testability**: All components include data-testid attributes for testing.

## Component Hierarchy

```
components/address/
├── index.ts                # Exports all address components
├── address-card.tsx        # Card component for displaying an address
├── address-form.tsx        # Form component for adding/editing an address
├── address-form-dialog.tsx # Dialog component for address forms
├── address-list.tsx        # List component for displaying addresses
└── address-selector.tsx    # Selector component for choosing an address
```

## Components

### AddressCard

A component for displaying an address with actions for editing, deleting, and setting as default.

```tsx
<AddressCard
  address={address}
  onEdit={(address) => {}}
  onDelete={(id) => {}}
  onSetDefault={(id) => {}}
  testId="shipping-address"
/>
```

### AddressForm

A form for adding or editing an address.

```tsx
<AddressForm
  initialData={address}
  onSubmit={(data) => {}}
  isEditing={true}
  testId="edit-address-form"
/>
```

### AddressFormDialog

A dialog for adding or editing an address.

```tsx
<AddressFormDialog
  title="Edit Shipping Address"
  description="Update your shipping address details."
  initialData={address}
  onSubmit={(data) => {}}
  isEditing={true}
  testId="edit-address-dialog"
>
  <Button>Edit Address</Button>
</AddressFormDialog>
```

### AddressList

A component for displaying a list of addresses with actions for adding, editing, deleting, and setting as default.

```tsx
<AddressList
  addresses={addresses}
  onAddAddress={(address) => {}}
  onUpdateAddress={(id, address) => {}}
  onDeleteAddress={(id) => {}}
  onSetDefaultAddress={(id) => {}}
  testId="address-list"
/>
```

### AddressSelector

A component for selecting an address from a list of addresses.

```tsx
<AddressSelector
  addresses={addresses}
  selectedAddressId={selectedAddressId}
  onAddressSelected={(id) => {}}
  onAddAddress={(address) => {}}
  testId="address-selector"
/>
```

## Buyer Components

### BuyerAddressManager

A component for managing a buyer's shipping addresses.

```tsx
<BuyerAddressManager testId="buyer-addresses" />
```

### BuyerAddressSelector

A component for selecting a buyer's shipping address.

```tsx
<BuyerAddressSelector
  onAddressSelected={(id) => {}}
  selectedAddressId={selectedAddressId}
  testId="buyer-address-selector"
/>
```

## Implementation Examples

### Address Management Page

```tsx
export default function ShippingAddressesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shipping Addresses</h1>
        <p className="text-gray-500">Manage your shipping addresses for deliveries.</p>
      </div>

      <Card className="p-6">
        <BuyerAddressManager testId="shipping-addresses" />
      </Card>
    </div>
  )
}
```

### Checkout Address Selection

```tsx
export function CheckoutAddressStep({ onNext }: { onNext: () => void }) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  
  const handleAddressSelected = (id: string) => {
    setSelectedAddressId(id)
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      
      <BuyerAddressSelector
        onAddressSelected={handleAddressSelected}
        selectedAddressId={selectedAddressId}
        testId="checkout-address-selector"
      />
      
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedAddressId}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
```

## Data Flow

The address components follow a consistent data flow pattern:

1. **Data Fetching**: The `BuyerAddressManager` and `BuyerAddressSelector` components fetch address data from the Data Access Layer.
2. **State Management**: The components maintain local state for optimistic updates.
3. **User Interactions**: User interactions (add, edit, delete, select) are handled by the components and propagated to the parent components.
4. **API Calls**: API calls are made through the Data Access Layer.

## Form Validation

The `AddressForm` component uses Zod for form validation:

```tsx
const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  street: z.string().min(3, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string()
    .min(5, "ZIP code is required")
    .refine(
      (val) => /^\d{5}(-\d{4})?$/.test(val) || /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(val),
      "Invalid ZIP/postal code format"
    ),
  country: z.string().min(2, "Country is required"),
  phone: z.string()
    .min(10, "Phone number is required")
    .refine(
      (val) => /^\(\d{3}\) \d{3}-\d{4}$/.test(val),
      "Invalid phone number format"
    ),
  isDefault: z.boolean().default(false)
});
```

## Best Practices

1. **Use Composition**: Compose smaller components to build more complex UIs.
2. **Separate Display and Form Components**: Keep display and form components separate for better reusability.
3. **Use Consistent Patterns**: Follow the same patterns across all address components.
4. **Add TestIDs**: Always add testId props to components for testing.
5. **Handle Loading States**: Always include loading states for better UX.
6. **Add Proper ARIA Attributes**: Ensure all components are accessible.
