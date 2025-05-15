# Cypress Testing for Pickle Marketplace

This directory contains end-to-end tests for the Pickle Marketplace application using Cypress.

## Test Structure

Tests are organized by functionality:

- **navigation.cy.ts**: Tests for navigating between different pages of the application
- **product-filtering.cy.ts**: Tests for filtering and sorting products
- **cart-functionality.cy.ts**: Tests for adding products to cart and checkout flow
- **authentication.cy.ts**: Tests for login, registration, and authentication flows
- **admin-dashboard.cy.ts**: Tests for admin dashboard functionality

Additionally, we have tests organized by user role:

- **guest-user.cy.ts**: Tests for unauthenticated users
- **buyer-user.cy.ts**: Tests for authenticated buyers
- **seller-user.cy.ts**: Tests for authenticated sellers
- **admin-user.cy.ts**: Tests for authenticated admins

## Test Data

Test data is stored in fixture files:

- **users.json**: Contains test users for each role (admin, seller, buyer)
- **products.json**: Contains test products with detailed specifications
- **orders.json**: Contains test orders with items, shipping, and payment details
- **categories.json**: Contains product categories and subcategories

## Custom Commands

We've created several custom commands to simplify test writing:

- **login**: Login with email and password
- **addToCart**: Add a product to cart
- **checkout**: Navigate to checkout page
- **completeCheckout**: Complete the checkout process
- **filterProducts**: Filter products by criteria
- **searchProducts**: Search for products
- **createTestProduct**: Create a test product (for seller)
- **getByTestId**: Get element by data-testid attribute

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

## Running Tests

### Running All Tests

```bash
npm run cypress:run
```

### Running Specific Tests

```bash
npm run cypress:run -- --spec "cypress/e2e/navigation.cy.ts"
```

### Opening Cypress Test Runner

```bash
npm run cypress:open
```

## Test Coverage

Our tests cover the following key areas:

1. **Basic Navigation**
   - Navigation between pages (home, marketplace, product details, checkout)
   - Navigation using header and footer links
   - Navigation within authenticated user sections

2. **Product Filtering**
   - Filtering by category
   - Filtering by price range
   - Sorting products
   - Searching products
   - Combining multiple filters

3. **Cart Functionality**
   - Adding products to cart
   - Updating product quantities
   - Removing products from cart
   - Calculating cart totals
   - Checkout process

4. **Authentication**
   - Login as different user roles
   - Registration as buyer and seller
   - Error handling for invalid credentials
   - Logout functionality

5. **Admin Dashboard**
   - Viewing and filtering products, orders, and users
   - Editing product and user details
   - Updating order status
   - Importing products

## Continuous Integration

These tests are integrated with the CI/CD pipeline:

1. Tests run automatically on pull requests
2. Tests run automatically on merges to main branch
3. Test results are reported in the CI/CD dashboard

## Future Improvements

1. **Component Testing**: Add component tests for UI components
2. **Visual Regression Testing**: Add visual regression tests for critical UI components
3. **Performance Testing**: Add performance tests for critical user flows
4. **Accessibility Testing**: Add accessibility tests for critical pages
5. **API Testing**: Add API tests for backend functionality
