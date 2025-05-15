# Checkout Flow

## Overview

The checkout flow is a multi-step process that guides users through the checkout experience. It leverages our new component structures and global state management system to provide a seamless and intuitive checkout experience.

## Key Features

- **Multi-Step Process**: The checkout flow is divided into multiple steps (shipping, payment, review, confirmation) to simplify the checkout process.
- **Global State Management**: The checkout flow uses our global state management system to manage checkout state across steps.
- **Modular Components**: Each step of the checkout flow is implemented as a separate component for better maintainability.
- **Validation**: Each step includes validation to ensure all required information is provided before proceeding.
- **Responsive Design**: The checkout flow is fully responsive and works well on all device sizes.
- **Error Handling**: The checkout flow includes comprehensive error handling to provide a better user experience.
- **Loading States**: The checkout flow includes loading states to provide feedback during asynchronous operations.

## Component Hierarchy

```
components/checkout/
├── index.ts                      # Exports all checkout components
├── checkout-layout.tsx           # Layout component for checkout pages
├── checkout-steps.tsx            # Component to display checkout progress
├── checkout-order-summary.tsx    # Component to display order summary
├── checkout-shipping-step.tsx    # Component for shipping step
├── checkout-payment-step.tsx     # Component for payment step
├── checkout-review-step.tsx      # Component for review step
└── checkout-confirmation.tsx     # Component for confirmation step
```

## Checkout Steps

### 1. Shipping Step

The shipping step allows users to select a shipping address and shipping method, and provide any additional notes for their order.

**Components Used:**
- `BuyerAddressSelector`: For selecting a shipping address
- `RadioGroup`: For selecting a shipping method
- `Textarea`: For providing additional notes

**Validation:**
- Shipping address is required
- Shipping method is required

### 2. Payment Step

The payment step allows users to select a payment method and billing address.

**Components Used:**
- `BuyerPaymentMethodSelector`: For selecting a payment method
- `BuyerAddressSelector`: For selecting a billing address
- `Checkbox`: For using the same address for shipping and billing

**Validation:**
- Payment method is required
- Billing address is required

### 3. Review Step

The review step allows users to review their order details before placing the order.

**Components Used:**
- `Card`: For displaying order information
- `Checkbox`: For accepting terms and conditions
- `Button`: For placing the order

**Validation:**
- Terms and conditions must be accepted

### 4. Confirmation Step

The confirmation step displays the order confirmation details after the order has been placed.

**Components Used:**
- `Card`: For displaying order information
- `Button`: For continuing shopping or viewing orders

## Checkout Flow

1. User adds items to cart
2. User proceeds to checkout
3. User selects shipping address and shipping method
4. User selects payment method and billing address
5. User reviews order details and places order
6. User receives order confirmation

## Integration with Global State

The checkout flow is integrated with our global state management system:

- **Order Store**: Manages checkout state, including current step, selected addresses, payment method, and shipping method
- **Address Store**: Manages shipping and billing addresses
- **Payment Store**: Manages payment methods
- **Cart Store**: Manages cart items and totals

## Usage Example

```tsx
export default function CheckoutPage() {
  // Get global state
  const { checkout, setCheckoutStep } = useGlobalState()
  
  // Set the current step
  const [currentStep, setCurrentStep] = useState(checkout.step)
  
  // Update global state when current step changes
  useEffect(() => {
    setCheckoutStep(currentStep)
  }, [currentStep, setCheckoutStep])
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === "shipping") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("review")
    }
  }
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping")
    } else if (currentStep === "review") {
      setCurrentStep("payment")
    }
  }
  
  return (
    <CheckoutLayout
      title="Checkout"
      description="Complete your purchase"
      testId="checkout-page"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CheckoutSteps 
            currentStep={currentStep}
            testId="checkout-steps"
          />
          
          {currentStep === "shipping" && (
            <CheckoutShippingStep
              onNext={handleNextStep}
              testId="checkout-shipping-step"
            />
          )}
          
          {currentStep === "payment" && (
            <CheckoutPaymentStep
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              testId="checkout-payment-step"
            />
          )}
          
          {currentStep === "review" && (
            <CheckoutReviewStep
              onBack={handlePreviousStep}
              testId="checkout-review-step"
            />
          )}
        </div>
        
        <div>
          <CheckoutOrderSummary
            testId="checkout-order-summary"
          />
        </div>
      </div>
    </CheckoutLayout>
  )
}
```

## Best Practices

1. **Use Global State**: Use global state to manage checkout state across steps.
2. **Validate Each Step**: Validate each step before proceeding to the next step.
3. **Provide Feedback**: Provide feedback during asynchronous operations.
4. **Handle Errors**: Handle errors gracefully and provide helpful error messages.
5. **Use Consistent UI**: Use consistent UI patterns across all steps.
6. **Add TestIDs**: Add testId props to all components for testing.
7. **Handle Empty Cart**: Handle the case where the cart is empty.
8. **Provide Navigation**: Allow users to navigate between steps.
9. **Show Order Summary**: Show the order summary throughout the checkout process.
10. **Confirm Order**: Provide a confirmation page after the order is placed.
