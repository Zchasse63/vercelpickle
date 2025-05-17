# Component Composition System

This document describes the Component Composition System implemented for the Pickle B2B Marketplace project.

## Overview

The Component Composition System is a powerful and flexible system for composing complex components from simpler ones. It provides a high-level API for creating components that follow consistent patterns and are easy to maintain.

## Files

- `lib/component-composition.tsx`: The core composition system implementation.
- `lib/composition-patterns.tsx`: Pre-defined patterns for common composition scenarios.
- `lib/composition-utils.tsx`: Utilities for working with composed components.
- `lib/component-composition-factory.tsx`: Integration with the Component Factory Pattern.
- `components/ui/composed-form-field.tsx`: Example of a composed form field component.
- `components/ui/composed-product-card.tsx`: Example of a composed product card component.

## Core Concepts

### Composition Types

The Component Composition System supports several types of composition:

- **Horizontal**: Components are arranged horizontally (side by side).
- **Vertical**: Components are arranged vertically (stacked).
- **Layered**: Components are layered on top of each other.
- **Nested**: Components are nested inside each other.
- **Conditional**: Components are conditionally rendered.
- **Custom**: Custom composition logic.

### Component Factory Integration

The Component Composition System integrates with our existing Component Factory Pattern, allowing you to create composed components that follow the same patterns as our factory components.

## Usage

### Basic Composition

```tsx
import { composeComponents } from '@/lib/component-composition';

const FormField = composeComponents(
  {
    name: 'FormField',
    type: 'vertical',
    gap: 'xs',
    align: 'start',
  },
  [
    { component: Label, props: { htmlFor: 'email' } },
    { component: Input, props: { id: 'email', name: 'email' } },
    { 
      component: ErrorMessage, 
      condition: (props) => !!props.error,
      props: { children: (props) => props.error },
    },
  ]
);
```

### Using Composition Patterns

```tsx
import { createFormField } from '@/lib/composition-patterns';

const FormField = createFormField({
  label: Label,
  input: Input,
  message: ErrorMessage,
});
```

### Using Composition Utilities

```tsx
import { withLabel, withErrorMessage } from '@/lib/composition-utils';

const InputWithLabel = withLabel(Input, (props) => props.label);
const InputWithError = withErrorMessage(Input, (props) => props.error);

const FormField = (props) => (
  <div className="space-y-2">
    <InputWithLabel {...props} />
    <InputWithError {...props} />
  </div>
);
```

### Using Component Factory Integration

```tsx
import { createComposedComponent } from '@/lib/component-composition-factory';

const FormField = createComposedComponent({
  factory: {
    name: 'FormField',
    element: 'div',
    baseClassName: 'space-y-2',
  },
  composition: {
    name: 'FormField',
    type: 'vertical',
    gap: 'xs',
    align: 'start',
  },
  components: [
    { component: Label },
    { component: Input },
    { component: ErrorMessage, condition: (props) => !!props.error },
  ],
});
```

## Composition Types

### Horizontal Composition

```tsx
const ButtonGroup = composeComponents(
  {
    name: 'ButtonGroup',
    type: 'horizontal',
    gap: 'sm',
    align: 'center',
    justify: 'start',
  },
  [
    { component: Button, props: { children: 'Save' } },
    { component: Button, props: { children: 'Cancel', variant: 'outline' } },
  ]
);
```

### Vertical Composition

```tsx
const FormField = composeComponents(
  {
    name: 'FormField',
    type: 'vertical',
    gap: 'xs',
    align: 'start',
  },
  [
    { component: Label },
    { component: Input },
    { component: ErrorMessage, condition: (props) => !!props.error },
  ]
);
```

### Layered Composition

```tsx
const ImageWithOverlay = composeComponents(
  {
    name: 'ImageWithOverlay',
    type: 'layered',
    position: 'relative',
  },
  [
    { component: Image },
    { component: Overlay },
  ]
);
```

### Nested Composition

```tsx
const Card = composeComponents(
  {
    name: 'Card',
    type: 'nested',
    padding: 'md',
  },
  [
    { component: CardContent },
  ]
);
```

### Conditional Composition

```tsx
const ConditionalMessage = composeComponents(
  {
    name: 'ConditionalMessage',
    type: 'conditional',
    condition: (props) => props.showMessage,
    fallback: <div>No message</div>,
  },
  [
    { component: SuccessMessage, condition: (props) => props.type === 'success' },
    { component: ErrorMessage, condition: (props) => props.type === 'error' },
    { component: InfoMessage, condition: (props) => props.type === 'info' },
  ]
);
```

### Custom Composition

```tsx
const CustomComposition = composeComponents(
  {
    name: 'CustomComposition',
    type: 'custom',
    render: (props) => (
      <div className="custom-layout">
        <div className="custom-header">{props.header}</div>
        <div className="custom-content">{props.children}</div>
        <div className="custom-footer">{props.footer}</div>
      </div>
    ),
  },
  []
);
```

## Composition Patterns

### Form Field

```tsx
import { createFormField } from '@/lib/composition-patterns';

const FormField = createFormField({
  label: Label,
  input: Input,
  message: ErrorMessage,
});

// Usage
<FormField
  label="Email"
  name="email"
  error={errors.email}
  value={values.email}
  onChange={handleChange}
/>
```

### Card

```tsx
import { createCard } from '@/lib/composition-patterns';

const ProductCard = createCard({
  header: ProductHeader,
  content: ProductContent,
  footer: ProductFooter,
});

// Usage
<ProductCard
  title="Product Title"
  description="Product description"
  price={19.99}
/>
```

### Button Group

```tsx
import { createButtonGroup } from '@/lib/composition-patterns';

const ActionButtons = createButtonGroup({
  buttons: [
    { component: Button, props: { children: 'Save', variant: 'default' } },
    { component: Button, props: { children: 'Cancel', variant: 'outline' } },
  ],
});

// Usage
<ActionButtons onClick={handleAction} />
```

### Layout

```tsx
import { createLayout } from '@/lib/composition-patterns';

const AppLayout = createLayout({
  header: Header,
  sidebar: Sidebar,
  content: Content,
  footer: Footer,
});

// Usage
<AppLayout user={user} />
```

## Composition Utilities

### Merge Refs

```tsx
import { mergeRefs } from '@/lib/composition-utils';

const Component = React.forwardRef((props, ref) => {
  const internalRef = React.useRef(null);
  const mergedRef = mergeRefs(internalRef, ref);
  
  return <div ref={mergedRef} {...props} />;
});
```

### Merge Props

```tsx
import { mergeProps } from '@/lib/composition-utils';

const mergedProps = mergeProps(
  { className: 'text-red-500', disabled: true },
  { className: 'bg-blue-500', 'aria-disabled': true }
);
// { className: 'text-red-500 bg-blue-500', disabled: true, 'aria-disabled': true }
```

### Forward Props

```tsx
import { forwardProps } from '@/lib/composition-utils';

const ButtonWithIcon = forwardProps(Button, (props) => ({
  ...props,
  leftIcon: <Icon name="check" />,
}));
```

### Conditional Render

```tsx
import { conditionalRender } from '@/lib/composition-utils';

const ConditionalButton = conditionalRender(
  Button,
  (props) => !props.disabled,
  () => <div>Button is disabled</div>
);
```

### With Props

```tsx
import { withProps } from '@/lib/composition-utils';

const PrimaryButton = withProps(Button, { variant: 'primary' });
```

### With Wrapper

```tsx
import { withWrapper } from '@/lib/composition-utils';

const ButtonWithTooltip = withWrapper(Button, (children, props) => (
  <Tooltip content={props.tooltipContent}>{children}</Tooltip>
));
```

### With Label

```tsx
import { withLabel } from '@/lib/composition-utils';

const LabeledInput = withLabel(Input, (props) => props.label);
```

### With Error Message

```tsx
import { withErrorMessage } from '@/lib/composition-utils';

const InputWithError = withErrorMessage(Input, (props) => props.error);
```

## Component Factory Integration

### Create Composed Component

```tsx
import { createComposedComponent } from '@/lib/component-composition-factory';

const FormField = createComposedComponent({
  factory: {
    name: 'FormField',
    element: 'div',
    baseClassName: 'space-y-2',
  },
  composition: {
    name: 'FormField',
    type: 'vertical',
    gap: 'xs',
    align: 'start',
  },
  components: [
    { component: Label },
    { component: Input },
    { component: ErrorMessage, condition: (props) => !!props.error },
  ],
});
```

### Create Composed Compound Component

```tsx
import { createComposedCompoundComponent } from '@/lib/component-composition-factory';

const ProductCard = createComposedCompoundComponent({
  factory: {
    name: 'ProductCard',
    element: 'div',
    baseClassName: 'rounded-lg border bg-card',
    parts: {
      Header: {
        element: 'div',
        baseClassName: 'p-4',
      },
      Content: {
        element: 'div',
        baseClassName: 'p-4 pt-0',
      },
      Footer: {
        element: 'div',
        baseClassName: 'p-4 pt-0',
      },
    },
  },
  rootComposition: {
    name: 'ProductCard',
    type: 'vertical',
    gap: 'none',
  },
  rootComponents: [
    { component: (props) => <ProductCard.Header {...props} /> },
    { component: (props) => <ProductCard.Content {...props} /> },
    { component: (props) => <ProductCard.Footer {...props} /> },
  ],
  partCompositions: {
    Header: {
      name: 'ProductCardHeader',
      type: 'vertical',
      gap: 'xs',
    },
  },
  partComponents: {
    Header: [
      { component: ProductTitle },
      { component: ProductSubtitle },
    ],
  },
});
```

## Examples

### Composed Form Field

See `components/ui/composed-form-field.tsx` for a complete example of a composed form field component.

```tsx
import { createComposedComponent } from '@/lib/component-composition-factory';

export const FormField = createComposedComponent({
  factory: {
    name: 'FormField',
    element: 'div',
    baseClassName: 'space-y-2',
  },
  composition: {
    name: 'FormField',
    type: 'vertical',
    gap: 'xs',
    align: 'start',
  },
  components: [
    { 
      component: Label, 
      props: { 
        htmlFor: (props) => props.id || props.name,
      },
    },
    { 
      component: Input,
    },
    { 
      component: FormMessage, 
      condition: (props) => !!props.error,
      props: {
        children: (props) => props.error,
      },
    },
  ],
});
```

### Composed Product Card

See `components/ui/composed-product-card.tsx` for a complete example of a composed product card component.

```tsx
import { createComposedCompoundComponent } from '@/lib/component-composition-factory';

export const ProductCard = createComposedCompoundComponent({
  factory: {
    name: 'ProductCard',
    element: 'div',
    baseClassName: 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
    parts: {
      Header: {
        element: 'div',
        baseClassName: 'relative',
      },
      Content: {
        element: 'div',
        baseClassName: 'p-4',
      },
      Footer: {
        element: 'div',
        baseClassName: 'p-4 pt-0',
      },
    },
  },
  rootComposition: {
    name: 'ProductCard',
    type: 'vertical',
    gap: 'none',
  },
  rootComponents: [
    { component: (props) => <ProductCard.Header {...props} /> },
    { component: (props) => <ProductCard.Content {...props} /> },
    { component: (props) => <ProductCard.Footer {...props} /> },
  ],
  partCompositions: {
    Header: {
      name: 'ProductCardHeader',
      type: 'layered',
      position: 'relative',
    },
    Content: {
      name: 'ProductCardContent',
      type: 'vertical',
      gap: 'sm',
    },
    Footer: {
      name: 'ProductCardFooter',
      type: 'horizontal',
      gap: 'sm',
      justify: 'between',
      align: 'center',
    },
  },
  partComponents: {
    Header: [
      { 
        component: ProductImage,
        props: {
          src: (props) => props.imageSrc || 'https://via.placeholder.com/300x200',
          alt: (props) => props.title || 'Product image',
        },
      },
    ],
    Content: [
      { 
        component: ProductTitle,
        props: {
          children: (props) => props.title || 'Product Title',
        },
      },
      { 
        component: ProductDescription,
        props: {
          children: (props) => props.description || 'Product description goes here.',
        },
        condition: (props) => !!props.description,
      },
      { 
        component: ProductPrice,
        props: {
          price: (props) => props.price || 0,
          currency: (props) => props.currency || 'USD',
        },
      },
    ],
    Footer: [
      { 
        component: AddToCartButton,
        props: {
          onClick: (props) => props.onAddToCart,
        },
      },
    ],
  },
});
```

## Benefits

Using the Component Composition System provides several benefits:

1. **Consistency**: Ensures consistent component patterns across the codebase.
2. **Reusability**: Makes it easy to reuse component patterns.
3. **Maintainability**: Makes it easier to maintain and update components.
4. **Flexibility**: Provides a flexible system for creating complex components.
5. **Type Safety**: Provides strong TypeScript typing for composed components.
6. **Testing**: Makes it easier to test components.

## Conclusion

The Component Composition System provides a powerful and flexible way to create complex components from simpler ones. It integrates with our existing Component Factory Pattern and provides a high-level API for creating components that follow consistent patterns and are easy to maintain.
