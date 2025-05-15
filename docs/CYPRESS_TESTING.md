# Cypress Testing Documentation

**Last Updated:** `2025-05-10`

## Overview

This document provides a comprehensive guide to the Cypress testing implementation in the Pickle B2B Marketplace project. The testing strategy focuses on end-to-end testing of key user flows and functionality across different user roles.

## Test Structure

The Cypress tests are organized by user role and functionality:

```
cypress/
├── e2e/
│   ├── guest-user.cy.ts       # Tests for unauthenticated users
│   ├── buyer-user.cy.ts       # Tests for authenticated buyers
│   ├── seller-user.cy.ts      # Tests for authenticated sellers
│   ├── admin-user.cy.ts       # Tests for authenticated admins
│   └── marketplace.cy.ts      # Tests for marketplace functionality
├── fixtures/
│   ├── users.json             # Test user data
│   ├── products.json          # Test product data
│   ├── orders.json            # Test order data
│   └── categories.json        # Test category data
└── support/
    ├── commands.ts            # Custom Cypress commands
    ├── e2e.ts                 # Global test configuration
    └── index.d.ts             # TypeScript definitions for custom commands
```

## User Roles

The testing strategy covers the following user roles:

1. **Guest User**: Unauthenticated users browsing the marketplace
2. **Buyer User**: Authenticated users with buyer role
3. **Seller User**: Authenticated users with seller role
4. **Admin User**: Authenticated users with admin role

## Test Scenarios

### Guest User Tests

- **Home Page**: Verify home page elements, navigation, featured categories, and featured products
- **Marketplace Navigation**: Verify marketplace page elements, product filtering, and search functionality
- **Product Details**: Verify product detail page elements and add to cart functionality
- **Authentication**: Verify login and registration forms and validation
- **About Page**: Verify about page content and team section
- **Cart**: Verify cart functionality for guest users

### Buyer User Tests

- **Authentication**: Verify buyer login, validation, and logout
- **Dashboard**: Verify buyer dashboard elements and navigation
- **Shopping Cart**: Verify cart functionality, quantity updates, and checkout
- **Order Management**: Verify order history, order details, and order filtering

### Seller User Tests

- **Authentication**: Verify seller login, validation, and logout
- **Dashboard**: Verify seller dashboard elements and navigation
- **Product Management**: Verify product listing, creation, editing, and deletion
- **Order Management**: Verify order listing, details, status updates, and filtering
- **Analytics**: Verify analytics dashboard, date filtering, and data export
- **Profile Management**: Verify profile information, updates, and payment methods

### Admin User Tests

- **Authentication**: Verify admin login, validation, and logout
- **Dashboard**: Verify admin dashboard elements and navigation
- **User Management**: Verify user listing, filtering, details, and editing
- **Product Management**: Verify product listing, filtering, details, and editing
- **Order Management**: Verify order listing, filtering, details, and status updates
- **Analytics**: Verify analytics dashboard, date filtering, and data export
- **Settings Management**: Verify platform settings, updates, and API key management

### Marketplace Tests

- **Product Browsing**: Verify product grid, filtering, and sorting
- **Product Details**: Verify product information, specifications, and related products
- **Shopping Cart**: Verify add to cart, quantity updates, and checkout
- **Quick View**: Verify product quick view functionality
- **Comparison**: Verify product comparison functionality

## Custom Commands

The following custom commands are available for use in tests:

| Command | Description | Example |
|---------|-------------|---------|
| `login` | Login with email and password | `cy.login('user@example.com', 'password')` |
| `addToCart` | Add a product to cart | `cy.addToCart('product-id')` |
| `checkout` | Proceed to checkout | `cy.checkout()` |
| `filterProducts` | Filter products by type and value | `cy.filterProducts('category', 'produce')` |
| `searchProducts` | Search for products | `cy.searchProducts('apple')` |
| `viewProductDetails` | Navigate to product details | `cy.viewProductDetails('product-id')` |
| `addToComparison` | Add product to comparison | `cy.addToComparison('product-id')` |
| `getByTestId` | Get element by test ID | `cy.getByTestId('product-card')` |
| `createTestProduct` | Create a test product (for seller) | `cy.createTestProduct({ name: 'Test', price: '10.99' })` |

## Test Data

Test data is stored in fixture files:

- **users.json**: Contains test users for each role (admin, seller, buyer)
- **products.json**: Contains test products with detailed specifications
- **orders.json**: Contains test orders with items, shipping, and payment details
- **categories.json**: Contains product categories and subcategories

## Best Practices

1. **Use data-testid attributes**: Always use data-testid attributes for element selection
   ```html
   <button data-testid="add-to-cart-button">Add to Cart</button>
   ```

2. **Use custom commands**: Use custom commands for common actions
   ```typescript
   cy.login('user@example.com', 'password');
   cy.addToCart('product-id');
   ```

3. **Use fixtures for test data**: Load test data from fixture files
   ```typescript
   cy.fixture('users.json').then((users) => {
     cy.login(users.buyers[0].email, users.buyers[0].password);
   });
   ```

4. **Wait for elements to be visible**: Use assertions to wait for elements
   ```typescript
   cy.getByTestId('product-card').should('be.visible');
   ```

5. **Verify state changes**: Verify that actions result in expected state changes
   ```typescript
   cy.getByTestId('add-to-cart-button').click();
   cy.getByTestId('cart-count').should('contain', '1');
   ```

6. **Clean up after tests**: Reset application state between tests
   ```typescript
   beforeEach(() => {
     cy.clearCookies();
     cy.clearLocalStorage();
   });
   ```

## Running Tests

### Running All Tests

```bash
npm run cypress:run
```

### Running Specific Tests

```bash
npm run cypress:run -- --spec "cypress/e2e/guest-user.cy.ts"
```

### Opening Cypress Test Runner

```bash
npm run cypress:open
```

## CI/CD Integration

The Cypress tests are integrated with the CI/CD pipeline:

1. Tests run automatically on pull requests
2. Tests run automatically on merges to main branch
3. Test results are reported in the CI/CD dashboard

## Future Improvements

1. **Component Testing**: Add component-level tests for UI components
2. **Visual Regression Testing**: Add visual regression tests for UI components
3. **Performance Testing**: Add performance tests for critical user flows
4. **Accessibility Testing**: Add accessibility tests for all pages
5. **API Testing**: Add API-level tests for backend endpoints

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout values or add explicit waits
2. **Selector not found**: Use more specific selectors or add data-testid attributes
3. **State not updated**: Add assertions to wait for state changes
4. **Network errors**: Mock network requests or add retries

### Debugging Tips

1. **Use cy.debug()**: Add `cy.debug()` to pause test execution
2. **Use cy.screenshot()**: Add `cy.screenshot()` to capture screenshots
3. **Use cy.log()**: Add `cy.log('message')` to log messages
4. **Use .then()**: Use `.then()` to debug values
   ```typescript
   cy.get('element').then(($el) => {
     console.log($el.text());
   });
   ```

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript](https://docs.cypress.io/guides/tooling/typescript-support)
- [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/)
