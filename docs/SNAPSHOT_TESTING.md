# Jest Snapshot Testing Enhancement

This document describes the Jest Snapshot Testing Enhancement implemented for the Pickle B2B Marketplace project.

## Overview

The Jest Snapshot Testing Enhancement provides a comprehensive set of utilities for snapshot testing React components. It extends Jest's built-in snapshot testing capabilities with features specifically designed for testing UI components, including:

- Capturing DOM structure and styling
- Testing component variants and sizes
- Testing component states
- Testing responsive behavior
- Testing accessibility
- Integration with our Component Factory Pattern and Component Composition System

## Files

- `lib/snapshot-testing.tsx`: Core snapshot testing utilities
- `lib/snapshot-testing-specialized.tsx`: Specialized snapshot testing functions
- `lib/snapshot-testing-factory.tsx`: Integration with Component Factory Pattern
- `lib/__tests__/snapshot-testing.test.tsx`: Tests for snapshot testing utilities
- `components/ui/__tests__/factory-button.snapshot.test.tsx`: Example of using snapshot testing with a real component

## Core Snapshot Testing Utilities

### captureComponentSnapshot

Captures a snapshot of a React component, including DOM structure, props, styling, and accessibility attributes.

```tsx
import { captureComponentSnapshot } from '@/lib/snapshot-testing';

const snapshot = captureComponentSnapshot(<Button>Click me</Button>);
expect(snapshot).toMatchSnapshot();
```

### captureComponentPropsSnapshots

Captures snapshots of a component with different props.

```tsx
import { captureComponentPropsSnapshots } from '@/lib/snapshot-testing';

const snapshots = captureComponentPropsSnapshots(
  Button,
  [
    { children: 'Default Button' },
    { children: 'Primary Button', variant: 'primary' },
    { children: 'Secondary Button', variant: 'secondary' },
  ]
);

snapshots.forEach((snapshot, index) => {
  expect(snapshot).toMatchSnapshot(`Button with props ${index}`);
});
```

### compareSnapshots

Compares two snapshots and returns the differences.

```tsx
import { captureComponentSnapshot, compareSnapshots } from '@/lib/snapshot-testing';

const snapshot1 = captureComponentSnapshot(<Button>Click me</Button>);
const snapshot2 = captureComponentSnapshot(<Button variant="primary">Click me</Button>);

const differences = compareSnapshots(snapshot1, snapshot2);
console.log(differences);
```

### createSnapshotSerializer

Creates a custom snapshot serializer for jest-dom-snapshot.

```tsx
import { createSnapshotSerializer } from '@/lib/snapshot-testing';

// In your Jest setup file
expect.addSnapshotSerializer(createSnapshotSerializer());
```

### toMatchDOMSnapshot

Custom matcher for testing if an element matches a DOM snapshot.

```tsx
import { toMatchDOMSnapshot } from '@/lib/snapshot-testing';

// In your Jest setup file
expect.extend({ toMatchDOMSnapshot });

// In your test
expect(screen.getByRole('button')).toMatchDOMSnapshot();
```

## Specialized Snapshot Testing Functions

### captureVariantSnapshots

Captures snapshots of a component with different variants.

```tsx
import { captureVariantSnapshots } from '@/lib/snapshot-testing-specialized';

const snapshots = captureVariantSnapshots(
  Button,
  ['default', 'primary', 'secondary'],
  { variantProp: 'variant', additionalProps: { children: 'Click me' } }
);

Object.entries(snapshots).forEach(([variant, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Button with variant ${variant}`);
});
```

### captureSizeSnapshots

Captures snapshots of a component with different sizes.

```tsx
import { captureSizeSnapshots } from '@/lib/snapshot-testing-specialized';

const snapshots = captureSizeSnapshots(
  Button,
  ['sm', 'md', 'lg'],
  { sizeProp: 'size', additionalProps: { children: 'Click me' } }
);

Object.entries(snapshots).forEach(([size, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Button with size ${size}`);
});
```

### captureStateSnapshots

Captures snapshots of a component in different states.

```tsx
import { captureStateSnapshots } from '@/lib/snapshot-testing-specialized';
import userEvent from '@testing-library/user-event';

const snapshots = captureStateSnapshots(
  Button,
  {
    states: [
      { name: 'default', setup: () => {} },
      { name: 'hover', setup: (element) => userEvent.hover(element) },
      { name: 'active', setup: (element) => userEvent.click(element) },
    ],
    additionalProps: { children: 'Click me' },
  }
);

Object.entries(snapshots).forEach(([state, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Button in ${state} state`);
});
```

### captureResponsiveSnapshots

Captures snapshots of a component at different screen sizes.

```tsx
import { captureResponsiveSnapshots } from '@/lib/snapshot-testing-specialized';

const snapshots = captureResponsiveSnapshots(
  Button,
  {
    screenSizes: [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
    ],
    additionalProps: { children: 'Click me' },
  }
);

Object.entries(snapshots).forEach(([screenSize, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Button at ${screenSize} screen size`);
});
```

### captureAccessibilitySnapshot

Captures accessibility snapshots of a component.

```tsx
import { captureAccessibilitySnapshot } from '@/lib/snapshot-testing-specialized';

const snapshot = captureAccessibilitySnapshot(
  Button,
  { additionalProps: { children: 'Click me', 'aria-label': 'Click me button' } }
);

expect(snapshot).toMatchSnapshot('Button accessibility');
```

## Integration with Component Factory Pattern

### captureFactoryComponentSnapshots

Captures snapshots of a component created with the component factory pattern.

```tsx
import { captureFactoryComponentSnapshots } from '@/lib/snapshot-testing-factory';

const snapshots = captureFactoryComponentSnapshots(
  {
    name: 'Button',
    element: 'button',
    baseClassName: 'btn',
    variants: {
      variant: {
        default: 'btn-default',
        primary: 'btn-primary',
        secondary: 'btn-secondary',
      },
      size: {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
  {
    variants: {
      variant: ['default', 'primary', 'secondary'],
      size: ['sm', 'md', 'lg'],
    },
    additionalProps: { children: 'Click me' },
  }
);

Object.entries(snapshots).forEach(([variantCombination, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Button with ${variantCombination}`);
});
```

### captureCompoundComponentSnapshots

Captures snapshots of a compound component created with the component factory pattern.

```tsx
import { captureCompoundComponentSnapshots } from '@/lib/snapshot-testing-factory';

const snapshots = captureCompoundComponentSnapshots(
  {
    name: 'Card',
    element: 'div',
    baseClassName: 'card',
    parts: {
      Header: {
        element: 'div',
        baseClassName: 'card-header',
      },
      Body: {
        element: 'div',
        baseClassName: 'card-body',
      },
      Footer: {
        element: 'div',
        baseClassName: 'card-footer',
      },
    },
  },
  {
    parts: ['Header', 'Body', 'Footer'],
  }
);

Object.entries(snapshots).forEach(([variantCombination, snapshot]) => {
  expect(snapshot).toMatchSnapshot(`Card with ${variantCombination}`);
});
```

### captureComposedComponentSnapshots

Captures snapshots of a component created with the component composition system.

```tsx
import { captureComposedComponentSnapshots } from '@/lib/snapshot-testing-factory';

const snapshot = captureComposedComponentSnapshots(
  {
    name: 'FormField',
    type: 'vertical',
    gap: 'sm',
  },
  [
    { component: Label, props: { children: 'Email' } },
    { component: Input, props: { type: 'email' } },
    { component: ErrorMessage, props: { children: 'Invalid email' } },
  ]
);

expect(snapshot).toMatchSnapshot('FormField');
```

### captureComposedFactoryComponentSnapshots

Captures snapshots of a component created with the component composition factory.

```tsx
import { captureComposedFactoryComponentSnapshots } from '@/lib/snapshot-testing-factory';

const snapshot = captureComposedFactoryComponentSnapshots(
  {
    factory: {
      name: 'FormField',
      element: 'div',
      baseClassName: 'form-field',
    },
    composition: {
      name: 'FormField',
      type: 'vertical',
      gap: 'sm',
    },
    components: [
      { component: Label, props: { children: 'Email' } },
      { component: Input, props: { type: 'email' } },
      { component: ErrorMessage, props: { children: 'Invalid email' } },
    ],
  }
);

expect(snapshot).toMatchSnapshot('FormField');
```

## Best Practices

### 1. Use Descriptive Snapshot Names

Always use descriptive names for your snapshots to make it easier to identify them when they change.

```tsx
expect(snapshot).toMatchSnapshot('Button with primary variant and large size');
```

### 2. Keep Snapshots Focused

Capture snapshots for specific aspects of a component rather than capturing everything at once.

```tsx
// Good
const variantSnapshots = captureVariantSnapshots(Button, ['default', 'primary']);
const sizeSnapshots = captureSizeSnapshots(Button, ['sm', 'md', 'lg']);

// Bad
const allSnapshots = captureComponentPropsSnapshots(Button, [
  { variant: 'default', size: 'sm' },
  { variant: 'default', size: 'md' },
  { variant: 'default', size: 'lg' },
  { variant: 'primary', size: 'sm' },
  { variant: 'primary', size: 'md' },
  { variant: 'primary', size: 'lg' },
]);
```

### 3. Review Snapshots Carefully

Always review snapshot changes carefully to ensure they reflect expected changes.

### 4. Update Snapshots Intentionally

Only update snapshots when you're confident that the changes are expected.

```bash
# Update all snapshots
npm test -- -u

# Update specific snapshots
npm test -- -u -t "Button"
```

### 5. Use Snapshot Testing with Other Testing Techniques

Snapshot testing is most effective when used alongside other testing techniques, such as unit tests and integration tests.

## Example

Here's a complete example of using snapshot testing with a Button component:

```tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  captureComponentSnapshot,
  captureComponentPropsSnapshots,
} from '@/lib/snapshot-testing';
import {
  captureVariantSnapshots,
  captureSizeSnapshots,
  captureStateSnapshots,
  captureAccessibilitySnapshot,
} from '@/lib/snapshot-testing-specialized';

describe('Button Component Snapshots', () => {
  describe('Basic Snapshots', () => {
    it('renders correctly with default props', () => {
      const snapshot = captureComponentSnapshot(<Button>Click me</Button>);
      expect(snapshot).toMatchSnapshot();
    });
    
    it('renders correctly with different props', () => {
      const snapshots = captureComponentPropsSnapshots(
        Button,
        [
          { children: 'Default Button' },
          { children: 'Primary Button', variant: 'primary' },
          { children: 'Secondary Button', variant: 'secondary' },
        ]
      );
      
      snapshots.forEach((snapshot, index) => {
        expect(snapshot).toMatchSnapshot(`Button with props ${index}`);
      });
    });
  });
  
  describe('Variant Snapshots', () => {
    it('renders correctly with different variants', () => {
      const snapshots = captureVariantSnapshots(
        Button,
        ['default', 'primary', 'secondary'],
        { variantProp: 'variant', additionalProps: { children: 'Button' } }
      );
      
      Object.entries(snapshots).forEach(([variant, snapshot]) => {
        expect(snapshot).toMatchSnapshot(`Button with variant ${variant}`);
      });
    });
  });
  
  describe('Size Snapshots', () => {
    it('renders correctly with different sizes', () => {
      const snapshots = captureSizeSnapshots(
        Button,
        ['sm', 'md', 'lg'],
        { sizeProp: 'size', additionalProps: { children: 'Button' } }
      );
      
      Object.entries(snapshots).forEach(([size, snapshot]) => {
        expect(snapshot).toMatchSnapshot(`Button with size ${size}`);
      });
    });
  });
  
  describe('State Snapshots', () => {
    it('renders correctly in different states', () => {
      const snapshots = captureStateSnapshots(
        Button,
        {
          states: [
            { name: 'default', setup: () => {} },
            { name: 'disabled', setup: () => {} },
            { name: 'loading', setup: () => {} },
          ],
          additionalProps: { 
            children: 'Button',
            disabled: (state) => state === 'disabled',
            isLoading: (state) => state === 'loading',
          },
        }
      );
      
      Object.entries(snapshots).forEach(([state, snapshot]) => {
        expect(snapshot).toMatchSnapshot(`Button in ${state} state`);
      });
    });
  });
  
  describe('Accessibility Snapshots', () => {
    it('captures accessibility attributes', () => {
      const snapshot = captureAccessibilitySnapshot(
        Button,
        { 
          additionalProps: { 
            children: 'Button',
            'aria-label': 'Action button',
            'aria-haspopup': 'true',
            role: 'button',
          } 
        }
      );
      
      expect(snapshot).toMatchSnapshot('Button accessibility');
    });
  });
});
```

## Conclusion

The Jest Snapshot Testing Enhancement provides a powerful and flexible way to test UI components in the Pickle B2B Marketplace project. It integrates with our existing Component Factory Pattern and Component Composition System, making it easy to test components created with these patterns.
