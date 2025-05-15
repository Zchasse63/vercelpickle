// Applitools custom commands for Cypress

// Import Cypress types
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

// Define layout selectors for dynamic content
const DYNAMIC_CONTENT_SELECTORS = {
  // Product prices that might change
  productPrices: '.product-price',
  // Timestamps that will change between test runs
  timestamps: '.timestamp, time, [data-timestamp]',
  // User-specific content
  userContent: '.user-specific-content',
  // Cart totals that might change
  cartTotals: '.cart-total, .subtotal, .tax, .shipping, .grand-total',
  // Inventory numbers that might change
  inventory: '.inventory-count, .stock-level',
  // Random or changing IDs
  randomIds: '[data-random-id]',
};

/**
 * Opens Eyes for visual testing with standard configuration
 * @param testName - Name of the test
 */
Cypress.Commands.add('eyesOpenWithLayout', (testName: string) => {
  cy.eyesOpen({
    testName,
  });
});

/**
 * Checks a window with layout regions ignored
 * @param tag - Tag for the checkpoint
 * @param ignoreSelectors - Additional CSS selectors to ignore
 */
Cypress.Commands.add('eyesCheckWindowWithLayout', (tag: string, ignoreSelectors: string[] = []) => {
  // Combine default dynamic content selectors with any additional ones
  const layoutSelectors = Object.values(DYNAMIC_CONTENT_SELECTORS).concat(ignoreSelectors);
  
  // Create layout regions for each selector
  const layoutRegions = layoutSelectors.map(selector => ({ selector }));
  
  // Check window with layout regions
  cy.eyesCheckWindow({
    tag,
    layout: layoutRegions,
  });
});

/**
 * Checks a specific element with layout regions ignored
 * @param selector - CSS selector for the element to check
 * @param tag - Tag for the checkpoint
 * @param ignoreSelectors - Additional CSS selectors to ignore
 */
Cypress.Commands.add('eyesCheckElementWithLayout', (selector: string, tag: string, ignoreSelectors: string[] = []) => {
  // Combine default dynamic content selectors with any additional ones
  const layoutSelectors = Object.values(DYNAMIC_CONTENT_SELECTORS).concat(ignoreSelectors);
  
  // Create layout regions for each selector
  const layoutRegions = layoutSelectors.map(selector => ({ selector }));
  
  // Check element with layout regions
  cy.eyesCheckWindow({
    tag,
    target: 'region',
    selector,
    layout: layoutRegions,
  });
});

/**
 * Closes Eyes and gets test results
 */
Cypress.Commands.add('eyesCloseWithResults', () => {
  cy.eyesClose().then(testResults => {
    // Log test results
    cy.log(`Visual test results: ${testResults.getStatus()}`);
    
    // If there are differences, log the URL to view them
    if (testResults.getUrl()) {
      cy.log(`View differences at: ${testResults.getUrl()}`);
    }
  });
});

// Add types to Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Opens Eyes for visual testing with standard configuration
       * @param testName - Name of the test
       */
      eyesOpenWithLayout(testName: string): Chainable<void>;
      
      /**
       * Checks a window with layout regions ignored
       * @param tag - Tag for the checkpoint
       * @param ignoreSelectors - Additional CSS selectors to ignore
       */
      eyesCheckWindowWithLayout(tag: string, ignoreSelectors?: string[]): Chainable<void>;
      
      /**
       * Checks a specific element with layout regions ignored
       * @param selector - CSS selector for the element to check
       * @param tag - Tag for the checkpoint
       * @param ignoreSelectors - Additional CSS selectors to ignore
       */
      eyesCheckElementWithLayout(selector: string, tag: string, ignoreSelectors?: string[]): Chainable<void>;
      
      /**
       * Closes Eyes and gets test results
       */
      eyesCloseWithResults(): Chainable<void>;
    }
  }
}
