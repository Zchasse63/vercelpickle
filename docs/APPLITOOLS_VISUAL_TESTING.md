# Applitools Visual Testing Guide

This guide explains how to use Applitools Eyes for visual testing in the Pickle B2B Marketplace project.

## What is Applitools Eyes?

Applitools Eyes is a visual testing and monitoring tool that uses AI to automatically validate the visual appearance of your web application. It captures screenshots of your application and compares them to baseline images to detect visual regressions.

Key benefits:
- Automatically detect visual regressions
- Test across multiple browsers and devices
- AI-powered visual comparison
- Easily manage baselines and test results
- Integrate with your existing Cypress tests

## Setup

### Prerequisites

- Node.js and npm installed
- Cypress installed
- Applitools API key

### Installation

The Applitools Eyes SDK for Cypress has been installed in the project:

```bash
npm install --save-dev @applitools/eyes-cypress
```

### Configuration

The Applitools configuration is stored in `applitools.config.js` in the project root. This file contains settings for:

- API key (from environment variable)
- Application name
- Batch name
- Browser configurations
- Test concurrency
- Match level
- Other Applitools settings

## Running Visual Tests

### Setting the API Key

Before running tests, set your Applitools API key as an environment variable:

```bash
# macOS/Linux
export APPLITOOLS_API_KEY=I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110

# Windows
set APPLITOOLS_API_KEY=I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110
```

Alternatively, you can add it to your `.env` file:

```
APPLITOOLS_API_KEY=I98tZjs0IhFP4EANPq99uT0bq0JANDL34j3nnLon105gWbk110
```

### Running the Tests

We have several options for running visual tests:

#### Option 1: Run the Robust Test (Recommended for Initial Setup)

This is the most reliable test that handles server issues gracefully:

```bash
# Run the robust test with npm script
npm run test:visual:robust

# Run the robust test with the script that starts the server
npm run test:visual:robust:script

# Open Cypress and run the robust test interactively
npm run test:visual:robust:open
```

#### Option 2: Run Specific Feature Tests

We have tests for specific features and areas of the application:

```bash
# Run checkout flow tests
npm run test:visual:checkout

# Run user profile tests
npm run test:visual:profile

# Run admin dashboard tests
npm run test:visual:admin

# Run integrated visual-functional tests
npm run test:visual:integrated
```

Each of these commands has `:open` and `:script` variants for interactive mode and running with the server.

#### Option 3: Run All Visual Tests

Run all visual tests at once:

```bash
# Run all visual tests
npm run test:visual:all

# Run all visual tests with the script that starts the server
npm run test:visual:all:script

# Open Cypress and run all visual tests interactively
npm run test:visual:all:open
```

#### Option 4: Run Basic or Working Tests

These are simpler tests for initial setup and debugging:

```bash
# Run the basic test
npm run test:visual:basic

# Run the working tests
npm run test:visual:working
```

Each of these commands has `:open` and `:script` variants for interactive mode and running with the server.

## Custom Commands

We've added custom Applitools commands to simplify visual testing:

### Basic Commands

#### `cy.eyesOpenWithLayout(testName)`

Opens Eyes for visual testing with standard configuration.

```typescript
cy.eyesOpenWithLayout('My Test Name');
```

#### `cy.eyesCheckWindowWithLayout(tag, ignoreSelectors)`

Checks the entire window with layout regions ignored.

```typescript
// Check the entire window
cy.eyesCheckWindowWithLayout('Home Page');

// Check the entire window with additional ignored regions
cy.eyesCheckWindowWithLayout('Home Page', ['.timestamp', '.user-specific-content']);
```

#### `cy.eyesCheckElementWithLayout(selector, tag, ignoreSelectors)`

Checks a specific element with layout regions ignored.

```typescript
// Check a specific element
cy.eyesCheckElementWithLayout('[data-testid="product-card"]', 'Product Card');

// Check a specific element with additional ignored regions
cy.eyesCheckElementWithLayout('[data-testid="product-card"]', 'Product Card', ['.price', '.stock-level']);
```

#### `cy.eyesCloseWithResults()`

Closes Eyes and logs the test results.

```typescript
cy.eyesCloseWithResults();
```

### Enhanced Commands

We've also added enhanced commands for more robust testing:

#### `cy.visualTest(options)`

Performs a visual test with environment-aware configuration.

```typescript
// Test a specific element
cy.visualTest({
  testName: 'Product Card',
  selector: '[data-testid="product-card"]',
  layout: [
    { selector: '.product-price' },
    { selector: '.product-name' }
  ]
});

// Test the entire page
cy.visualTest({
  testName: 'Home Page',
  layout: [
    { selector: '.timestamp' },
    { selector: '.user-specific-content' }
  ]
});
```

#### `cy.enhancedTest(options)`

Runs a test with different implementations based on available features.

```typescript
cy.enhancedTest({
  // Features required for full test
  requiredFeatures: [
    '[data-testid="product-grid"]',
    '[data-testid="filter-sidebar"]'
  ],

  // Full test implementation
  fullTest: () => {
    // Full test with all assertions
  },

  // Basic test implementation
  basicTest: () => {
    // Simplified test for limited environments
  },

  // Minimal test implementation
  minimalTest: () => {
    // Minimal test when almost nothing is available
  }
});
```

#### `cy.waitForElement(selector, options)`

Waits for an element with retry and timeout.

```typescript
cy.waitForElement('[data-testid="product-grid"]', {
  timeout: 10000,
  interval: 500,
  errorMessage: 'Product grid not found'
});
```

#### `cy.safeInteract(selector, action, fallback)`

Safely interacts with an element if it exists.

```typescript
cy.safeInteract(
  '[data-testid="add-to-cart-button"]',
  ($button) => {
    cy.wrap($button).click();
  },
  () => {
    cy.log('Add to cart button not found, skipping');
  }
);
```

## Best Practices

### 1. Use Descriptive Test and Checkpoint Names

Use descriptive names for your tests and checkpoints to make it easier to identify them in the Applitools dashboard:

```typescript
cy.eyesOpenWithLayout('Marketplace - Product Grid Layout');
cy.eyesCheckWindowWithLayout('Product Grid - Default View');
```

### 2. Handle Dynamic Content

Use the layout match level for regions with dynamic content:

```typescript
cy.eyesCheckWindow({
  tag: 'Dashboard',
  layout: [
    { selector: '.timestamp' },
    { selector: '.user-specific-content' },
    { selector: '.product-price' }
  ]
});
```

### 3. Test Responsive Layouts

Test your application at different viewport sizes:

```typescript
// Test on desktop
cy.viewport(1280, 720);
cy.eyesCheckWindowWithLayout('Desktop View');

// Test on tablet
cy.viewport(768, 1024);
cy.eyesCheckWindowWithLayout('Tablet View');

// Test on mobile
cy.viewport(375, 667);
cy.eyesCheckWindowWithLayout('Mobile View');
```

### 4. Organize Tests by Feature

Organize your visual tests by feature or page to make them easier to maintain:

```typescript
describe('Visual Testing - Product Details', () => {
  // Tests for product details page
});

describe('Visual Testing - Checkout', () => {
  // Tests for checkout flow
});
```

### 5. Integrate with CI/CD

Configure your CI/CD pipeline to run visual tests automatically:

```yaml
# Example GitHub Actions workflow
- name: Run Visual Tests
  run: npm run cypress:run -- --spec "cypress/e2e/visual-testing.cy.ts"
  env:
    APPLITOOLS_API_KEY: ${{ secrets.APPLITOOLS_API_KEY }}
```

## Reviewing Test Results

After running tests, you can review the results in the Applitools dashboard:

1. Go to [https://eyes.applitools.com/](https://eyes.applitools.com/)
2. Log in with your Applitools account
3. Select the batch you want to review
4. Review the test results and approve or reject changes

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Make sure the `APPLITOOLS_API_KEY` environment variable is set correctly

2. **Tests Not Running**
   - Check that the Applitools configuration is correct in `applitools.config.js`
   - Verify that the Applitools commands are imported in `cypress/support/e2e.ts`

3. **Baseline Issues**
   - If you're seeing unexpected differences, you may need to update your baselines
   - Use the Applitools dashboard to review and approve changes

## Resources

- [Applitools Eyes for Cypress Documentation](https://applitools.com/tutorials/sdks/cypress)
- [Applitools Dashboard](https://eyes.applitools.com/)
- [Applitools API Reference](https://applitools.com/docs/api-ref/sdk-api/cypress/cypress-sdk-api.html)
