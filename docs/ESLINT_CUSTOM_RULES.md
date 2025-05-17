# ESLint Custom Rules

This document describes the custom ESLint rules implemented for the Pickle B2B Marketplace project.

## Overview

We have implemented a custom ESLint plugin (`eslint-plugin-pickle`) with five rules to enforce consistent component patterns:

1. **require-data-testid**: Enforces data-testid attributes on interactive elements.
2. **require-aria-attributes**: Enforces ARIA attributes on elements that need them.
3. **enforce-component-naming**: Enforces consistent component naming conventions.
4. **enforce-props-interface**: Enforces consistent props interface naming and structure.
5. **enforce-component-factory**: Enforces the use of the component factory pattern.

## Installation

The ESLint plugin is installed locally in the project. To install it, run:

```bash
npm run install:eslint-plugin
```

This will create a symlink to the plugin in the `node_modules` directory.

## Configuration

The ESLint plugin is configured in the `.eslintrc.js` file. You can customize the rules by modifying the configuration.

## Rules

### require-data-testid

This rule enforces data-testid attributes on interactive elements to make them easier to test.

#### Examples

```jsx
// ❌ Bad
<Button>Click me</Button>

// ✅ Good
<Button data-testid="submit-button">Click me</Button>
```

#### Options

```js
{
  'pickle/require-data-testid': ['warn', {
    components: [
      'Button', 'Link', 'Input', 'Select', 'Textarea', 'Form',
      'Dialog', 'Menu', 'MenuItem', 'Checkbox', 'RadioGroup',
      'Switch', 'Tabs', 'Tab', 'Accordion', 'Popover',
    ],
    ignore: ['InternalButton', 'InternalLink']
  }]
}
```

### require-aria-attributes

This rule enforces ARIA attributes on elements that need them to improve accessibility.

#### Examples

```jsx
// ❌ Bad
<Skeleton />

// ✅ Good
<Skeleton role="status" />
```

#### Options

```js
{
  'pickle/require-aria-attributes': ['warn', {
    components: {
      'Skeleton': {
        attributes: {},
        roles: ['status']
      },
      'Progress': {
        attributes: {},
        roles: ['progressbar']
      },
      'Alert': {
        attributes: {},
        roles: ['alert']
      },
      'Button': {
        attributes: {
          'aria-busy': (node) => {
            // Check if the button has an isLoading prop
            const isLoadingProp = node.attributes.find(attr => 
              attr.type === 'JSXAttribute' && 
              attr.name.name === 'isLoading'
            );
            
            return isLoadingProp ? 'true' : null;
          }
        },
        roles: []
      }
    }
  }]
}
```

### enforce-component-naming

This rule enforces consistent component naming conventions to improve code readability.

#### Examples

```jsx
// ❌ Bad
const button = () => <button>Click me</button>;

// ✅ Good
const Button = () => <button>Click me</button>;
```

#### Options

```js
{
  'pickle/enforce-component-naming': ['warn', {
    pattern: '^[A-Z][a-zA-Z0-9]*$',
    ignorePattern: '^_',
    checkFilename: true
  }]
}
```

### enforce-props-interface

This rule enforces consistent props interface naming and structure to improve code consistency.

#### Examples

```tsx
// ❌ Bad
interface Props {
  label: string;
}

const Button = ({ label }: Props) => <button>{label}</button>;

// ✅ Good
interface ButtonProps {
  label: string;
  className?: string;
}

const Button = ({ label, className }: ButtonProps) => (
  <button className={className}>{label}</button>
);
```

#### Options

```js
{
  'pickle/enforce-props-interface': ['warn', {
    pattern: '^{{componentName}}Props$',
    requiredProps: ['className']
  }]
}
```

### enforce-component-factory

This rule enforces the use of the component factory pattern to improve component consistency.

#### Examples

```tsx
// ❌ Bad
const Button = ({ label }: ButtonProps) => <button>{label}</button>;

// ✅ Good
const Button = createComponent({
  name: 'Button',
  element: 'button',
  baseClassName: 'inline-flex items-center justify-center rounded-md',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
```

#### Options

```js
{
  'pickle/enforce-component-factory': ['warn', {
    components: [
      'Button', 'Card', 'Checkbox', 'Dialog', 'Input', 'Select',
      'Textarea', 'Form', 'RadioGroup', 'Switch', 'Tabs', 'Tab',
      'Accordion', 'Popover', 'Alert', 'Badge', 'Tooltip'
    ],
    ignoreComponents: ['InternalButton', 'InternalLink'],
    factoryPath: '@/lib/component-factory'
  }]
}
```

## Configurations

The ESLint plugin provides two configurations:

### Recommended

```js
{
  extends: ['plugin:pickle/recommended']
}
```

This enables all rules with the "warn" severity.

### Strict

```js
{
  extends: ['plugin:pickle/strict']
}
```

This enables all rules with the "error" severity.

## Running ESLint

To run ESLint with the custom rules, use:

```bash
npm run lint
```

To fix automatically fixable issues, use:

```bash
npm run lint -- --fix
```

## Benefits

Using these custom ESLint rules provides several benefits:

1. **Improved Code Consistency**: Enforces consistent patterns across the codebase.
2. **Better Testability**: Ensures components have proper test IDs for testing.
3. **Enhanced Accessibility**: Enforces proper ARIA attributes for accessibility.
4. **Reduced Bugs**: Catches common issues early in the development process.
5. **Faster Development**: Automates repetitive tasks like adding test IDs and ARIA attributes.

## Integration with CI/CD

These rules are integrated with the CI/CD pipeline to ensure code quality. The pipeline will fail if there are any ESLint errors.

## Customizing Rules

You can customize the rules by modifying the `.eslintrc.js` file. For example, you can add more components to the `components` list or change the severity of the rules.
