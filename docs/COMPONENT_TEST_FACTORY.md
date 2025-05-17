# Component Test Factory

This document describes the Component Test Factory implemented for the Pickle B2B Marketplace project.

## Overview

The Component Test Factory is a system for generating comprehensive test suites for UI components. It provides a high-level API for creating tests that cover all aspects of a component's functionality, including rendering, variants, sizes, states, events, and accessibility.

## Files

- `lib/test-factory.tsx`: The core test factory implementation.
- `lib/test-factory-specialized.tsx`: Specialized test factories for specific component types.
- `scripts/generate-component-tests.js`: A script for generating test files using the test factory.

## Usage

### Basic Usage

```tsx
import { createComponentTests } from '@/lib/test-factory';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  createComponentTests({
    component: Button,
    name: 'Button',
    type: 'interactive',
    testVariants: true,
    variantProp: 'variant',
    variants: ['default', 'destructive', 'outline'],
    variantClassNames: {
      default: ['bg-primary', 'text-primary-foreground'],
      destructive: ['bg-destructive', 'text-destructive-foreground'],
      outline: ['border', 'border-input'],
    },
    testSizes: true,
    sizeProp: 'size',
    sizes: ['default', 'sm', 'lg'],
    sizeClassNames: {
      default: ['h-10', 'px-4'],
      sm: ['h-9', 'px-3'],
      lg: ['h-11', 'px-8'],
    },
    testEvents: true,
    events: [
      {
        name: 'click',
        handlerProp: 'onClick',
        action: (element) => fireEvent.click(element),
      },
    ],
  });
});
```

### Using Specialized Test Factories

```tsx
import { createButtonTests } from '@/lib/test-factory-specialized';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  createButtonTests(Button, {
    name: 'Button',
    testId: 'button-element',
  });
});
```

### Generating Test Files

You can use the `generate-component-tests` script to generate test files for your components:

```bash
npm run generate:component-tests
```

This will prompt you for the component path and other information, and then generate a test file with the appropriate configuration.

## Configuration Options

### Base Configuration

- `component`: The component to test.
- `name`: The name of the component.
- `type`: The type of component (basic, interactive, form, compound, layout, navigation, feedback, data-display).
- `testId`: The test ID to use for the component.
- `children`: The children to render inside the component.
- `props`: Additional props to pass to the component.
- `testA11y`: Whether to test accessibility attributes.
- `testClassName`: Whether to test with custom className.
- `testAdditionalProps`: Whether to test with additional props.

### Variant Configuration

- `testVariants`: Whether to test variants.
- `variantProp`: The variant prop name.
- `variants`: The variants to test.
- `variantClassNames`: The expected class names for each variant.

### Size Configuration

- `testSizes`: Whether to test sizes.
- `sizeProp`: The size prop name.
- `sizes`: The sizes to test.
- `sizeClassNames`: The expected class names for each size.

### State Configuration

- `testStates`: Whether to test states.
- `states`: The states to test, including name, props, expected class names, and expected attributes.

### Event Configuration

- `testEvents`: Whether to test events.
- `events`: The events to test, including name, handler prop, and action.

### Form Configuration

- `testForm`: Whether to test form functionality.
- `inputValue`: The input value to test.
- `expectedValue`: The expected value after input.

### Compound Configuration

- `testCompound`: Whether to test compound component structure.
- `subcomponents`: The subcomponents to test, including name, children, class name, and expected class names.

## Specialized Test Factories

The following specialized test factories are available:

- `createButtonTests`: For button components.
- `createInputTests`: For form input components.
- `createCardTests`: For card components.
- `createSelectTests`: For select components.
- `createCheckboxTests`: For checkbox components.
- `createDialogTests`: For dialog components.
- `createTabsTests`: For tabs components.

Each specialized test factory provides a pre-configured test suite for the specific component type, with sensible defaults for variants, sizes, states, events, and other properties.

## Benefits

Using the Component Test Factory provides several benefits:

1. **Consistency**: Ensures consistent testing patterns across all components.
2. **Completeness**: Covers all aspects of a component's functionality.
3. **Efficiency**: Reduces the time and effort required to write tests.
4. **Maintainability**: Makes it easier to update tests when components change.
5. **Discoverability**: Makes it easier to understand what tests are available and how to use them.

## Integration with Existing Tools

The Component Test Factory integrates with our existing testing utilities:

- `test-utils.tsx`: Provides the basic testing utilities.
- `test-utils-extended.tsx`: Provides additional testing utilities for specific component types.
- `user-event.ts`: Provides utilities for simulating user interactions.

## Examples

### Testing a Button Component

```tsx
import { createButtonTests } from '@/lib/test-factory-specialized';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  createButtonTests(Button);
});
```

### Testing a Form Input Component

```tsx
import { createInputTests } from '@/lib/test-factory-specialized';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  createInputTests(Input);
});
```

### Testing a Compound Component

```tsx
import { createCardTests } from '@/lib/test-factory-specialized';
import { Card } from '@/components/ui/card';

describe('Card Component', () => {
  createCardTests(Card);
});
```

### Testing a Custom Component

```tsx
import { createComponentTests } from '@/lib/test-factory';
import { CustomComponent } from '@/components/ui/custom-component';

describe('CustomComponent', () => {
  createComponentTests({
    component: CustomComponent,
    name: 'CustomComponent',
    type: 'basic',
    testId: 'custom-component',
    // Add other configuration options as needed
  });
});
```

## Conclusion

The Component Test Factory provides a powerful and flexible system for testing UI components. It reduces the time and effort required to write tests, ensures consistent testing patterns across all components, and makes it easier to maintain tests when components change.
