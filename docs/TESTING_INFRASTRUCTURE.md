# Pickle B2B Marketplace - Testing Infrastructure

**Last Updated:** `2023-05-11`

> **Note**: This document provides an overview of the testing infrastructure for the Pickle B2B Marketplace platform. For more detailed information about user flows and test cases, see the [User Flows and Tests](USER_FLOWS_AND_TESTS.md) document.

## Testing Framework

The Pickle B2B Marketplace uses a comprehensive testing approach with multiple layers:

1. **Unit Tests**: Using Jest and React Testing Library for frontend components
2. **Backend Tests**: Using Convex-test and Vitest for Convex functions
3. **Integration Tests**: Using Jest and React Testing Library for component interactions
4. **End-to-End Tests**: Using Cypress for complete user flows

## Test Organization

Tests are organized by user type and feature:

- **Guest User**: Tests for unauthenticated users
- **Buyer**: Tests for registered buyers
- **Seller**: Tests for registered sellers
- **Admin**: Tests for platform administrators

## Running Tests

### Frontend Unit and Integration Tests

```bash
# Run all frontend unit and integration tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### Backend Tests (Convex)

```bash
# Run Convex backend tests in watch mode
npm run test:convex

# Run Convex backend tests once
npm run test:convex:run

# Run Convex backend tests with coverage
npm run test:convex:coverage
```

### End-to-End Tests

```bash
# Open Cypress UI
npm run cypress:open

# Run all Cypress tests headlessly
npm run test:e2e

# Run tests for specific user types
npm run test:e2e:guest
npm run test:e2e:buyer
npm run test:e2e:seller
npm run test:e2e:admin
```

### Running All Tests

```bash
# Run all tests (frontend, backend, and E2E)
npm run test:all

# Run only frontend tests
./scripts/run-tests.sh --unit

# Run only backend tests
./scripts/run-tests.sh --convex

# Run only E2E tests
./scripts/run-tests.sh --e2e

# Run specific combinations
./scripts/run-tests.sh --unit --convex
./scripts/run-tests.sh --e2e --guest --buyer
```

### Using the Test Script

The `run-tests.sh` script provides a flexible way to run different combinations of tests:

```bash
# Run all tests
./scripts/run-tests.sh --all

# Run only unit tests
./scripts/run-tests.sh --unit

# Run only E2E tests
./scripts/run-tests.sh --e2e

# Run E2E tests for specific user types
./scripts/run-tests.sh --guest
./scripts/run-tests.sh --buyer
./scripts/run-tests.sh --seller
./scripts/run-tests.sh --admin

# Run combinations
./scripts/run-tests.sh --unit --guest --buyer
```

## Continuous Integration

GitHub Actions is used for continuous integration. The following workflows are configured:

1. **Test Workflow**: Runs on every push and pull request
   - Linting
   - Type checking
   - Unit and integration tests
   - End-to-end tests

2. **Deploy Workflow**: Runs on pushes to the main branch
   - Deploys the Convex backend
   - Builds and deploys the Next.js application to Vercel

## Convex Backend Testing

The Pickle B2B Marketplace uses the `convex-test` library to test Convex backend functions. This approach allows us to:

1. **Test Backend Logic in Isolation**: Test Convex queries, mutations, and actions without needing to run the full application
2. **Mock Database Operations**: Simulate database operations without affecting the real database
3. **Control Test Environment**: Manage authentication, scheduled functions, and other Convex features in a controlled environment

### Example Convex Test

```typescript
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("fetching products", async () => {
  const t = convexTest(schema);

  // Set up test data
  await t.run(async (ctx) => {
    await ctx.db.insert("products", {
      name: "Organic Apples",
      price: 24.99,
      category: "Fresh Produce"
    });
  });

  // Test the query function
  const products = await t.query(api.products.list);
  expect(products).toHaveLength(1);
  expect(products[0].name).toBe("Organic Apples");
});
```

### Convex Test Features

- **Database Operations**: Use `t.run()` to perform database operations directly
- **Function Testing**: Use `t.query()`, `t.mutation()`, and `t.action()` to test Convex functions
- **Authentication Testing**: Use `t.withIdentity()` to test authenticated functions
- **Scheduled Functions**: Test scheduled functions with Vitest's fake timers

## Test Data

Test data is managed in several ways:

1. **Mock Data**: Used for frontend unit and integration tests
2. **Convex Test Data**: Created programmatically in Convex tests
3. **Fixtures**: Used for Cypress tests
4. **Test Database**: A separate Convex database for end-to-end testing

## Custom Commands

Cypress custom commands are used to simplify test implementation:

- `cy.login(email, password)`: Log in as a specific user
- `cy.addToCart(productId)`: Add a product to the cart
- `cy.createTestProduct(productData)`: Create a test product (for seller tests)
- `cy.filterProducts(filters)`: Apply filters to product listings
- `cy.completeCheckout(shippingInfo, paymentInfo)`: Complete the checkout process

## Test Coverage

We aim for high test coverage across all parts of the application:

- **Unit Tests**: Focus on individual components and functions
- **Integration Tests**: Focus on component interactions
- **E2E Tests**: Focus on user flows and business processes

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests
2. **Realistic Data**: Use realistic test data that mimics production data
3. **Comprehensive Assertions**: Test both positive and negative cases
4. **Performance**: Keep tests fast and efficient
5. **Maintainability**: Use page objects and custom commands to reduce duplication

## Adding New Tests

When adding new features, follow these steps:

1. Add unit tests for new components and functions
2. Add integration tests for component interactions
3. Update or add E2E tests for user flows
4. Verify test coverage

## Troubleshooting

Common issues and their solutions:

1. **Flaky Tests**: Use retry mechanisms and improve test stability
2. **Slow Tests**: Optimize test performance and use parallelization
3. **Test Data Issues**: Use proper test data management and cleanup

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)
- [User Flows and Test Cases](/docs/USER_FLOWS_AND_TESTS.md)
