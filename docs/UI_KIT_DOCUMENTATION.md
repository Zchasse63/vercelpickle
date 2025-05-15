# Pickle B2B Marketplace UI Kit

**Last Updated:** `2025-05-06`

## Overview

The Pickle B2B Marketplace UI Kit is a comprehensive component library designed to provide a consistent, accessible, and responsive user interface across the platform. This document serves as the central reference for all UI components.

## Getting Started

### Installation

The UI Kit is pre-installed as part of the Pickle B2B Marketplace codebase. No additional installation is required.

### Usage

Import components from the UI Kit:

```tsx
import { Button, Input, Card } from "@/components/ui-kit"

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button>Submit</Button>
    </Card>
  )
}
```

## Component Categories

The UI Kit is organized into the following categories:

### Form Components

Components for user input and form handling:

- [Button](./examples/BUTTON_USAGE_EXAMPLE.md)
- [Input](./examples/INPUT_USAGE_EXAMPLE.md)
- [Textarea](./examples/TEXTAREA_USAGE_EXAMPLE.md)
- [Select](./examples/FORM_COMPONENTS_USAGE_EXAMPLE.md#select)
- [Checkbox](./examples/FORM_COMPONENTS_USAGE_EXAMPLE.md#checkbox)
- [Radio Group](./examples/FORM_COMPONENTS_USAGE_EXAMPLE.md#radio-group)
- [Switch](./examples/FORM_COMPONENTS_USAGE_EXAMPLE.md#switch)
- [Form](./examples/FORM_COMPONENTS_USAGE_EXAMPLE.md#using-with-react-hook-form)

### Layout Components

Components for page layout and structure:

- [Card](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#card)
- [Dialog](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#dialog)
- [Drawer](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#drawer)
- [Sheet](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#sheet)
- [Tabs](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#tabs)
- [Accordion](./examples/LAYOUT_COMPONENTS_USAGE_EXAMPLE.md#accordion)

### Data Display Components

Components for displaying data:

- [Table](./examples/DATA_DISPLAY_COMPONENTS_USAGE_EXAMPLE.md#table)
- [Avatar](./examples/DATA_DISPLAY_COMPONENTS_USAGE_EXAMPLE.md#avatar)
- [Badge](./examples/DATA_DISPLAY_COMPONENTS_USAGE_EXAMPLE.md#badge)
- [Calendar](./examples/DATA_DISPLAY_COMPONENTS_USAGE_EXAMPLE.md#calendar)
- [Skeleton](./examples/DATA_DISPLAY_COMPONENTS_USAGE_EXAMPLE.md#skeleton)

### Feedback Components

Components for user feedback:

- [Alert](./examples/FEEDBACK_COMPONENTS_USAGE_EXAMPLE.md#alert)
- [Progress](./examples/FEEDBACK_COMPONENTS_USAGE_EXAMPLE.md#progress)
- [Toast](./examples/FEEDBACK_COMPONENTS_USAGE_EXAMPLE.md#toast)
- [Tooltip](./examples/FEEDBACK_COMPONENTS_USAGE_EXAMPLE.md#tooltip)
- [Popover](./examples/FEEDBACK_COMPONENTS_USAGE_EXAMPLE.md#popover)

### Navigation Components

Components for navigation:

- [Breadcrumb](./examples/NAVIGATION_COMPONENTS_USAGE_EXAMPLE.md#breadcrumb)
- [Dropdown Menu](./examples/NAVIGATION_COMPONENTS_USAGE_EXAMPLE.md#dropdown-menu)
- [Pagination](./examples/NAVIGATION_COMPONENTS_USAGE_EXAMPLE.md#pagination)
- [Sidebar](./examples/NAVIGATION_COMPONENTS_USAGE_EXAMPLE.md#sidebar)

### Utility Components

Utility components for common UI patterns:

- [Separator](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#separator)
- [Scroll Area](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#scroll-area)
- [Slider](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#slider)
- [Label](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#label)
- [Aspect Ratio](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#aspect-ratio)
- [Command](./examples/UTILITY_COMPONENTS_USAGE_EXAMPLE.md#command)

## Feature Components

The UI Kit also includes feature-specific components for different user roles:

### Admin Components

Components specific to the admin dashboard:

- [Admin Header](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md#admin-header)
- [Admin Sidebar](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md#admin-sidebar)
- [Admin Overview Stats](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md#admin-overview-stats)
- [Admin Charts](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md#admin-charts)
- [Orders Table](./examples/ADMIN_COMPONENTS_USAGE_EXAMPLE.md#orders-table)

### Buyer Components

Components specific to the buyer dashboard:

- [Buyer Header](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md#buyer-header)
- [Buyer Sidebar](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md#buyer-sidebar)
- [Buyer Order Stats](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md#buyer-order-stats)
- [Buyer Order Components](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md#buyer-order-components)
- [Buyer Settings](./examples/BUYER_COMPONENTS_USAGE_EXAMPLE.md#buyer-settings)

### Seller Components

Components specific to the seller dashboard:

- [Seller Header](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md#seller-header)
- [Seller Sidebar](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md#seller-sidebar)
- [Seller Stats](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md#seller-stats)
- [Seller Product Components](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md#seller-product-components)
- [Seller Order Components](./examples/SELLER_COMPONENTS_USAGE_EXAMPLE.md#seller-order-components)

### Marketplace Components

Components specific to the marketplace:

- [Marketplace Header](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md#marketplace-header)
- [Marketplace Footer](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md#marketplace-footer)
- [Product Components](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md#product-components)
- [Cart and Checkout](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md#cart-and-checkout)
- [Authentication Forms](./examples/MARKETPLACE_COMPONENTS_USAGE_EXAMPLE.md#authentication-forms)

## Design Principles

The UI Kit follows these design principles:

### Consistency

- Components use consistent props and interfaces
- Similar components behave in similar ways
- Variants and sizes are consistent across components

### Accessibility

- All components include proper ARIA attributes
- Components support keyboard navigation
- Color contrast meets WCAG 2.1 AA standards
- Focus states are visible and consistent

### Responsiveness

- Components are responsive by default
- Mobile-first design approach
- Touch-friendly for mobile devices

### Customization

- Components support variants for different visual styles
- Size options for different contexts
- Theming through CSS variables

## Best Practices

### Component Selection

- Use the appropriate component for each use case
- Combine components to create complex interfaces
- Maintain consistent patterns across the application

### Form Handling

- Use Form* components with React Hook Form for complex forms
- Use Standalone* components for simple cases
- Provide clear validation feedback

### Accessibility

- Always include labels for form elements
- Use ARIA attributes appropriately
- Test with keyboard navigation

### Performance

- Use code splitting for large components
- Optimize rendering with React.memo where appropriate
- Lazy load components when possible

## Migration Guide

If you're updating existing components to use the UI Kit:

1. Import components from `@/components/ui-kit` instead of individual files
2. Update props to match the enhanced components
3. Replace custom styling with component variants
4. Add accessibility attributes if missing

## Contributing

To contribute to the UI Kit:

1. Follow the established patterns for component enhancement
2. Ensure all components have proper documentation
3. Include usage examples
4. Test for accessibility and responsiveness
