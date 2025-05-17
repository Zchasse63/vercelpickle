# Test Generator

This tool helps you quickly generate test files for UI components with different testing patterns.

## Usage

```bash
npm run generate:test
```

## Features

The test generator provides several template options:

1. **Basic**: Simple tests for rendering and basic props
2. **With Variants**: Tests for component variants and sizes
3. **With Events**: Tests for click and keyboard events using both fireEvent and UserEvent
4. **With States**: Tests for different component states (disabled, error, loading)
5. **With Accessibility**: Tests for ARIA attributes and keyboard navigation
6. **Compound Component**: Tests for compound components with subcomponents

## Example

When you run the generator, you'll be prompted for:

1. The component name (e.g., button, card, dialog)
2. The template type (1-6)

The generator will create a test file in the `components/ui/__tests__` directory with the appropriate test structure.

## Template Details

### Basic Template

```tsx
import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { ComponentName } from '@/components/ui/component-name';

describe('ComponentName Component', () => {
  it('renders correctly with default props', () => {
    render(<ComponentName data-testid="test-component-name">Content</ComponentName>);
    
    const component = screen.getByTestId('test-component-name');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('renders correctly with custom className', () => {
    render(<ComponentName className="custom-class" data-testid="test-component-name">Content</ComponentName>);
    
    const component = screen.getByTestId('test-component-name');
    expect(component).toHaveClass('custom-class');
  });
  
  it('passes additional props to the component', () => {
    render(
      <ComponentName 
        data-testid="test-component-name" 
        aria-label="Test component"
      >
        Content
      </ComponentName>
    );
    
    const component = screen.getByTestId('test-component-name');
    expect(component).toHaveAttribute('aria-label', 'Test component');
  });
});
```

### With Variants Template

Tests component with different variants and sizes.

### With Events Template

Tests component with click and keyboard events using both fireEvent and UserEvent.

### With States Template

Tests component in different states (disabled, error, loading).

### With Accessibility Template

Tests component with ARIA attributes and keyboard navigation.

### Compound Component Template

Tests compound components with subcomponents.

## Customizing Templates

You can customize the templates in the `scripts/generate-test.js` file. Each template is defined in the `templates` object.

## Best Practices

1. After generating a test file, you'll need to update the class names and other specifics to match your actual component.
2. Use data-testid attributes for reliable element selection.
3. Test both the happy path and edge cases.
4. Consider using the extended testing utilities for more comprehensive tests.

## Integration with Testing Utilities

The generated tests work well with our extended testing utilities:

```tsx
import { 
  renderWithTestId, 
  testComponentVariants, 
  testComponentSizes,
  testComponentStates,
  testComponentEvents,
  setupUserEvent
} from '@/lib/test-utils-extended';
```

These utilities can help simplify your tests even further.
