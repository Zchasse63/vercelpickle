# Component Testing Guide

**Last Updated:** `2023-06-01`

> **Note**: This document provides guidance on testing React components in the Pickle B2B Marketplace project. For more detailed information, see the [Documentation Index](DOCUMENTATION_INDEX.md) and [Testing Guide](TESTING_GUIDE.md).

## Introduction

Testing React components is essential for ensuring the reliability and maintainability of the Pickle B2B Marketplace project. This guide provides information on how to test React components, including setting up the testing environment, writing tests, and handling common testing scenarios.

## Testing Environment

The Pickle B2B Marketplace project uses the following testing tools:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Cypress**: End-to-end testing framework

### Jest Configuration

Jest is configured in `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### React Testing Library Setup

React Testing Library is set up in `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

## Writing Component Tests

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass('border');
  });
  
  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });
});
```

### Testing User Interactions

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Testing Asynchronous Components

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from '@/components/marketplace/product-list';
import { useQuery } from 'convex/react';

// Mock Convex hooks
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

describe('ProductList', () => {
  it('shows loading state initially', () => {
    (useQuery as jest.Mock).mockReturnValue(undefined);
    
    render(<ProductList />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('renders products when loaded', async () => {
    const mockProducts = [
      { _id: '1', name: 'Product 1', price: 9.99 },
      { _id: '2', name: 'Product 2', price: 19.99 },
    ];
    
    (useQuery as jest.Mock).mockReturnValue(mockProducts);
    
    render(<ProductList />);
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
  
  it('shows error message when loading fails', async () => {
    (useQuery as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to load products');
    });
    
    render(<ProductList />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Testing Complex Components

### Testing Components with Context

```tsx
import { render, screen } from '@testing-library/react';
import { CartProvider } from '@/context/cart-context';
import { AddToCartButton } from '@/components/marketplace/add-to-cart-button';

describe('AddToCartButton', () => {
  it('adds product to cart when clicked', () => {
    const product = { _id: '1', name: 'Product 1', price: 9.99 };
    
    render(
      <CartProvider>
        <AddToCartButton product={product} />
      </CartProvider>
    );
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    // Verify that the product was added to the cart
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });
});
```

### Testing Components with Routing

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProductDetail } from '@/components/marketplace/product-detail';

describe('ProductDetail', () => {
  it('renders product details', () => {
    const product = { _id: '1', name: 'Product 1', price: 9.99 };
    
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail product={product} />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });
});
```

### Testing Modal Components

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductQuickViewModal } from '@/components/marketplace/product-quick-view-modal';

describe('ProductQuickViewModal', () => {
  it('renders product information', () => {
    const product = {
      _id: '1',
      name: 'Product 1',
      description: 'Product description',
      price: 9.99,
      category: 'Category',
      images: ['/image.jpg'],
      unit: 'each',
    };
    
    render(
      <ProductQuickViewModal
        isOpen={true}
        setIsOpen={() => {}}
        product={product}
      />
    );
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product description')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });
  
  it('closes when close button is clicked', () => {
    const setIsOpen = jest.fn();
    const product = {
      _id: '1',
      name: 'Product 1',
      description: 'Product description',
      price: 9.99,
      category: 'Category',
      images: ['/image.jpg'],
      unit: 'each',
    };
    
    render(
      <ProductQuickViewModal
        isOpen={true}
        setIsOpen={setIsOpen}
        product={product}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

Focus on testing the component's behavior from the user's perspective, not its internal implementation details. This makes your tests more resilient to refactoring.

```tsx
// Good: Testing behavior
test('shows success message when form is submitted', () => {
  render(<ContactForm />);
  
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
});

// Bad: Testing implementation details
test('sets formData state when inputs change', () => {
  const { result } = renderHook(() => useState({}));
  const [formData, setFormData] = result.current;
  
  // This test is coupled to the implementation and will break if the component is refactored
});
```

### 2. Use Accessible Queries

Use queries that reflect how users interact with your application, such as `getByRole`, `getByLabelText`, and `getByText`.

```tsx
// Good: Using accessible queries
const submitButton = screen.getByRole('button', { name: /submit/i });
const nameInput = screen.getByLabelText(/name/i);

// Bad: Using non-accessible queries
const submitButton = screen.getByTestId('submit-button');
const nameInput = container.querySelector('input[name="name"]');
```

### 3. Test Edge Cases

Test edge cases such as empty states, loading states, error states, and boundary conditions.

```tsx
test('shows empty state when no products are available', () => {
  (useQuery as jest.Mock).mockReturnValue([]);
  
  render(<ProductList />);
  
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
});

test('shows error message when API call fails', () => {
  (useQuery as jest.Mock).mockImplementation(() => {
    throw new Error('API error');
  });
  
  render(<ProductList />);
  
  expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
});
```

### 4. Use Mock Data

Use mock data that closely resembles the real data your component will receive.

```tsx
const mockProduct = {
  _id: '1',
  name: 'Organic Heirloom Tomatoes',
  description: 'Juicy, flavorful organic heirloom tomatoes.',
  price: 4.99,
  category: 'Fruits & Vegetables',
  subcategory: 'Vegetables',
  unit: 'lb',
  inventory: 150,
  images: ['/images/products/tomatoes.jpg'],
  features: [
    'Grown without synthetic pesticides',
    'Harvested at peak ripeness',
  ],
  specifications: {
    dietary: {
      organic: true,
      vegan: true,
    },
  },
  origin: {
    country: 'USA',
    region: 'California',
  },
  certifications: ['USDA Organic'],
};
```

## Conclusion

By following this guide, you can effectively test React components in the Pickle B2B Marketplace project. The combination of Jest, React Testing Library, and Cypress provides a powerful foundation for ensuring the reliability and maintainability of the application.

For more detailed information on testing, see the [Testing Guide](TESTING_GUIDE.md) and [Testing Infrastructure](TESTING_INFRASTRUCTURE.md) documentation.
