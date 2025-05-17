# Component Transformation Script

This tool helps you automatically add accessibility attributes and test IDs to UI components.

## Usage

```bash
npm run transform:components
```

## Features

The component transformation script provides several transformations:

1. **Add data-testid attributes**: Adds data-testid attributes to icons and other elements to make them easier to test.
2. **Add role attributes**: Adds appropriate ARIA role attributes to components like Skeleton, Progress, and Alert.
3. **Add aria attributes**: Adds aria-hidden to icons and aria-busy to loading states.

## Example

When you run the script, you'll be prompted to:

1. Select a mode (process all components or a specific component)
2. If you choose to process a specific component, enter the component file name

The script will then apply the transformations to the selected components.

## Configuration

The script is configured with a mapping of components to elements that need data-testid attributes:

```javascript
const TEST_ID_MAP = {
  'button.tsx': [
    { element: 'Loader2', testId: 'loader-icon' }
  ],
  'checkbox.tsx': [
    { element: 'Check', testId: 'check-icon' },
    { element: 'Minus', testId: 'minus-icon' }
  ],
  // ... more components
};
```

You can add more components and elements to this mapping as needed.

## Transformations

### Adding data-testid Attributes

The script adds data-testid attributes to elements specified in the TEST_ID_MAP. For example:

```jsx
// Before
<Loader2 className="h-4 w-4 animate-spin" />

// After
<Loader2 className="h-4 w-4 animate-spin" data-testid="loader-icon" />
```

### Adding Role Attributes

The script adds appropriate ARIA role attributes to components:

```jsx
// Before
<div className={cn("relative overflow-hidden rounded-md", gradientClass, animationClasses[animation], className)} {...props} />

// After
<div className={cn("relative overflow-hidden rounded-md", gradientClass, animationClasses[animation], className)} role="status" {...props} />
```

### Adding ARIA Attributes

The script adds aria-hidden to icons and aria-busy to loading states:

```jsx
// Before
<Check className="h-4 w-4" />

// After
<Check className="h-4 w-4" aria-hidden="true" />
```

## Best Practices

1. Run the script before writing tests to ensure all components have the necessary attributes.
2. After running the script, verify that the changes are correct and don't break existing functionality.
3. Consider adding the script to your CI/CD pipeline to ensure all new components have the necessary attributes.

## Integration with Testing

The added attributes make it easier to write tests using the testing utilities:

```tsx
// Test with data-testid
const loader = screen.getByTestId('loader-icon');
expect(loader).toBeInTheDocument();

// Test with role
const skeleton = screen.getByRole('status');
expect(skeleton).toBeInTheDocument();
```

This helps create more robust and maintainable tests.
