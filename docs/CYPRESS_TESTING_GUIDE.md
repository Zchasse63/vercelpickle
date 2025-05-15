# Cypress Testing Guide for Pickle B2B Marketplace

## Overview

This guide provides best practices and strategies for writing effective Cypress tests for the Pickle B2B Marketplace platform. It focuses on testing modern React components, handling complex UI interactions, and ensuring reliable test execution.

## Test Structure

### File Organization

Tests are organized by feature area and user role:

```
cypress/
├── e2e/
│   ├── marketplace.cy.ts       # Tests for marketplace features
│   ├── product-details.cy.ts   # Tests for product details page
│   ├── cart.cy.ts              # Tests for shopping cart
│   ├── checkout.cy.ts          # Tests for checkout process
│   ├── buyer-dashboard.cy.ts   # Tests for buyer dashboard
│   ├── seller-dashboard.cy.ts  # Tests for seller dashboard
│   └── admin-dashboard.cy.ts   # Tests for admin dashboard
├── fixtures/
│   ├── products.json           # Test data for products
│   ├── users.json              # Test data for users
│   └── orders.json             # Test data for orders
└── support/
    ├── commands.ts             # Custom Cypress commands
    ├── e2e.ts                  # Global test configuration
    └── test-utils.ts           # Utility functions for tests
```

### Test Naming

Use descriptive test names that clearly indicate what is being tested:

```typescript
// Good
describe('Product Details Page', () => {
  it('should display product information correctly', () => {
    // Test code
  });
  
  it('should add product to cart when Add to Cart button is clicked', () => {
    // Test code
  });
});

// Avoid
describe('Product Page', () => {
  it('test 1', () => {
    // Test code
  });
  
  it('test 2', () => {
    // Test code
  });
});
```

## Best Practices

### 1. Use Data-TestId Attributes

Always use data-testid attributes for selecting elements in tests:

```tsx
// In React component
<button data-testid="add-to-cart-button" onClick={addToCart}>
  Add to Cart
</button>

// In Cypress test
cy.getByTestId('add-to-cart-button').click();
```

### 2. Handle Modern React Components

When testing components that use modern React patterns (like Radix UI, shadcn/ui), use `{ force: true }` with click operations:

```typescript
// For components that might be covered or have pointer-events: none
cy.getByTestId('menu-item-products').click({ force: true });

// For select components that use custom dropdowns
cy.getByTestId('category-filter').click({ force: true });
cy.contains('Vegetables').click({ force: true });
```

### 3. Use Custom Commands

Leverage custom commands for common operations:

```typescript
// In cypress/support/commands.ts
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('setupSellerTest', (options = {}) => {
  // Set up seller test environment with mocks
  cy.intercept('GET', '/api/seller/products*', { fixture: 'seller-products.json' }).as('getProducts');
  // Additional setup...
});

// In test file
cy.setupSellerTest();
cy.getByTestId('product-table').should('be.visible');
```

### 4. Implement Resilient Selectors

Use resilient selectors that won't break with minor UI changes:

```typescript
// Good - uses data-testid
cy.getByTestId('product-card').first().click();

// Avoid - brittle selectors
cy.get('.product-list > div:first-child > .card > .card-body > button').click();
```

### 5. Handle Asynchronous Operations

Use proper waiting strategies for asynchronous operations:

```typescript
// Wait for network requests
cy.intercept('GET', '/api/products*').as('getProducts');
cy.visit('/marketplace');
cy.wait('@getProducts');

// Wait for elements to appear
cy.getByTestId('product-list').should('be.visible');
```

### 6. Use Retry-ability for Resilience

Implement retry strategies for flaky operations:

```typescript
// In cypress/support/commands.ts
Cypress.Commands.add('visitWithRetry', (url, options = {}) => {
  const maxRetries = options.maxRetries || 3;
  let retries = 0;
  
  function visit() {
    return cy.visit(url, options)
      .then(() => {
        // Success
      })
      .catch((error) => {
        if (retries < maxRetries) {
          retries++;
          cy.log(`Retrying visit to ${url}, attempt ${retries}`);
          return visit();
        }
        throw error;
      });
  }
  
  return visit();
});

// In test file
cy.visitWithRetry('/seller/dashboard');
```

### 7. Mock Backend Responses

Use mocks for consistent test behavior:

```typescript
// Mock API responses
cy.intercept('GET', '/api/products*', { fixture: 'products.json' }).as('getProducts');
cy.intercept('POST', '/api/cart/add', { statusCode: 200, body: { success: true } }).as('addToCart');

// Visit page and interact
cy.visit('/marketplace');
cy.wait('@getProducts');
cy.getByTestId('add-to-cart-button').first().click();
cy.wait('@addToCart');
```

### 8. Test for Accessibility

Include accessibility checks in your tests:

```typescript
// Install cypress-axe
// npm install --save-dev cypress-axe axe-core

// In cypress/support/e2e.ts
import 'cypress-axe';

// In test file
describe('Product Page Accessibility', () => {
  it('should have no accessibility violations', () => {
    cy.visit('/product/123');
    cy.injectAxe();
    cy.checkA11y();
  });
});
```

## Testing Different User Roles

### Guest User Tests

```typescript
describe('Guest User Experience', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
  });
  
  it('should be able to browse products', () => {
    // Test code
  });
  
  it('should be prompted to sign in when trying to checkout', () => {
    // Test code
  });
});
```

### Buyer Tests

```typescript
describe('Buyer Experience', () => {
  beforeEach(() => {
    cy.setupBuyerTest();
    cy.visit('/marketplace');
  });
  
  it('should be able to add products to cart', () => {
    // Test code
  });
  
  it('should be able to complete checkout', () => {
    // Test code
  });
});
```

### Seller Tests

```typescript
describe('Seller Dashboard', () => {
  beforeEach(() => {
    cy.setupSellerTest({
      mockProducts: true,
      mockOrders: true
    });
    cy.visitWithRetry('/seller', { failOnStatusCode: false });
  });
  
  it('should display seller dashboard with sales metrics', () => {
    // Test code
  });
  
  it('should navigate through seller sidebar menu', () => {
    // Test code
  });
});
```

## Debugging Tips

1. **Use cy.pause()**: Insert `cy.pause()` to pause test execution and inspect the state.
2. **Use cy.debug()**: Insert `cy.debug()` to open the browser's debugger.
3. **Use cy.screenshot()**: Take screenshots at critical points with `cy.screenshot('description')`.
4. **Check Cypress logs**: Review the Cypress command log for detailed information.
5. **Use cy.log()**: Add custom log messages with `cy.log('Custom message')`.

## Common Issues and Solutions

### 1. Element Not Found

**Problem**: `cy.get()` fails with "element not found" error.

**Solution**: 
- Check if the element exists in the DOM
- Use `cy.contains()` instead of `cy.get()`
- Add a timeout: `cy.get('.selector', { timeout: 10000 })`

### 2. Element Not Clickable

**Problem**: Element is covered or has pointer-events: none.

**Solution**:
- Use `{ force: true }`: `cy.get('.button').click({ force: true })`
- Ensure the element is visible: `cy.get('.button').should('be.visible').click()`

### 3. Flaky Tests

**Problem**: Tests pass sometimes and fail other times.

**Solution**:
- Add proper waiting: `cy.wait('@apiCall')`
- Use retry-ability: `cy.get('.element').should('be.visible')`
- Implement custom retry logic for complex operations

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing React Applications](https://docs.cypress.io/guides/component-testing/react/overview)
