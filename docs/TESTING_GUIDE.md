# Testing Guide for Pickle B2B Marketplace

**Last Updated:** `2025-05-06`

This guide outlines the testing strategy and practices for the Pickle B2B Marketplace platform. It provides information on how to write, run, and maintain tests to ensure the quality and reliability of the application.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Test Types](#test-types)
3. [Testing Tools](#testing-tools)
4. [Writing Tests](#writing-tests)
5. [Running Tests](#running-tests)
6. [Continuous Integration](#continuous-integration)
7. [Test Coverage](#test-coverage)
8. [Best Practices](#best-practices)

## Testing Strategy

Our testing strategy follows the Testing Pyramid approach, with a focus on:

1. **Unit Tests**: Testing individual components and functions in isolation
2. **Integration Tests**: Testing interactions between components
3. **End-to-End Tests**: Testing complete user flows

We aim for a high level of test coverage, with a focus on critical business logic and user-facing components.

## Test Types

### Unit Tests

Unit tests focus on testing individual components, functions, or modules in isolation. They should be fast, reliable, and focused on a single unit of functionality.

Examples of unit tests include:
- Testing UI components with different props
- Testing utility functions
- Testing hooks with different inputs

### Integration Tests

Integration tests focus on testing the interactions between different parts of the application. They ensure that components work together as expected.

Examples of integration tests include:
- Testing form submissions
- Testing data fetching and rendering
- Testing navigation flows

### End-to-End Tests

End-to-end tests simulate real user interactions with the application. They test complete user flows from start to finish.

Examples of end-to-end tests include:
- Testing the checkout process
- Testing user authentication
- Testing product listing and filtering

## Testing Tools

We use the following tools for testing:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing React components
- **Cypress**: End-to-end testing
- **Mock Service Worker**: API mocking
- **Testing Library User Event**: Simulating user interactions

## Writing Tests

### Unit Tests

Unit tests should be placed in a `__tests__` directory next to the component or function being tested. The file name should match the component or function name with a `.test.tsx` or `.test.ts` extension.

Example unit test for a Button component:

```tsx
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders correctly with primary variant', () => {
    render(<Button variant="default">Primary Button</Button>)
    const button = screen.getByRole('button', { name: /primary button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  // More tests...
})
```

### Integration Tests

Integration tests should focus on testing the interactions between components. They should be placed in a `__tests__` directory at the appropriate level of the component hierarchy.

Example integration test for a form submission:

```tsx
// components/auth/__tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import { LoginForm } from '@/components/auth/login-form'

describe('LoginForm Component', () => {
  it('submits the form with valid data', async () => {
    const mockSubmit = jest.fn()
    render(<LoginForm onSubmit={mockSubmit} />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Wait for the form submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })
  
  // More tests...
})
```

### End-to-End Tests

End-to-end tests should be placed in the `cypress/e2e` directory. They should focus on testing complete user flows.

Example end-to-end test for the checkout process:

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Process', () => {
  beforeEach(() => {
    // Set up the test
    cy.login('buyer@example.com', 'password123')
    cy.visit('/marketplace')
  })
  
  it('completes the checkout process successfully', () => {
    // Add a product to the cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click()
    })
    
    // Go to the cart
    cy.get('[data-testid="cart-button"]').click()
    
    // Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click()
    
    // Fill in shipping information
    cy.get('[data-testid="shipping-form"]').within(() => {
      // Fill in the form...
      cy.get('[data-testid="continue-button"]').click()
    })
    
    // Fill in payment information
    cy.get('[data-testid="payment-form"]').within(() => {
      // Fill in the form...
      cy.get('[data-testid="place-order-button"]').click()
    })
    
    // Verify order confirmation
    cy.url().should('include', '/order-confirmation')
    cy.get('[data-testid="order-confirmation"]').should('be.visible')
  })
})
```

## Running Tests

### Running Unit and Integration Tests

To run unit and integration tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests for a specific file
npm test -- components/ui/button

# Run tests with coverage
npm test -- --coverage
```

### Running End-to-End Tests

To run end-to-end tests, use the following commands:

```bash
# Open Cypress
npm run cypress:open

# Run Cypress tests in headless mode
npm run cypress:run
```

## Continuous Integration

We use GitHub Actions for continuous integration. Tests are run automatically on every pull request and push to the main branch.

The CI pipeline includes:
- Running unit and integration tests
- Running end-to-end tests
- Checking test coverage
- Linting and type checking

## Test Coverage

We aim for a high level of test coverage, with a focus on critical business logic and user-facing components. The coverage thresholds are:

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

To check test coverage, run:

```bash
npm test -- --coverage
```

## Best Practices

### General Best Practices

- Write tests that are easy to understand and maintain
- Focus on testing behavior, not implementation details
- Use descriptive test names that explain what is being tested
- Keep tests independent and isolated
- Use setup and teardown functions to avoid duplication
- Mock external dependencies

### React Testing Best Practices

- Test components as users would interact with them
- Use `getByRole` and other semantic queries when possible
- Avoid testing implementation details
- Test component behavior, not styling
- Use `userEvent` instead of `fireEvent` for user interactions
- Test accessibility

### End-to-End Testing Best Practices

- Focus on critical user flows
- Keep tests independent and isolated
- Use data attributes for test selectors
- Use custom commands for common actions
- Use fixtures for test data
- Test error states and edge cases
