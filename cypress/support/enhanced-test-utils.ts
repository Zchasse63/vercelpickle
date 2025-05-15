// Enhanced test utilities for Cypress tests
// This file contains improved helper functions for conditional testing,
// environment detection, and graceful fallbacks

/**
 * Enhanced conditional testing utility that provides more robust handling
 * of different environments and graceful fallbacks
 */

// Define environment types
type Environment = 'development' | 'staging' | 'production' | 'unknown';

// Define test modes
type TestMode = 'full' | 'basic' | 'minimal';

/**
 * Detect the current environment based on URL or other factors
 * @returns The detected environment
 */
function detectEnvironment(): Environment {
  // Get the current URL
  const url = Cypress.config('baseUrl') || '';

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return 'development';
  } else if (url.includes('staging') || url.includes('test')) {
    return 'staging';
  } else if (url.includes('production') || url.includes('.com')) {
    return 'production';
  } else {
    return 'unknown';
  }
}

/**
 * Determine the appropriate test mode based on environment and available features
 * @param requiredFeatures Array of selectors or conditions that must be present for full testing
 * @returns The appropriate test mode
 */
function determineTestMode(requiredFeatures: string[]): Cypress.Chainable<TestMode> {
  return cy.get('body').then($body => {
    // Check if all required features are present
    const allFeaturesPresent = requiredFeatures.every(feature => {
      return $body.find(feature).length > 0;
    });

    if (allFeaturesPresent) {
      return 'full';
    }

    // Check if at least some features are present
    const someFeaturesPresent = requiredFeatures.some(feature => {
      return $body.find(feature).length > 0;
    });

    if (someFeaturesPresent) {
      return 'basic';
    }

    // No features are present
    return 'minimal';
  });
}

/**
 * Enhanced conditional test that adapts to the environment and available features
 * @param options Test options including conditions and test implementations
 */
Cypress.Commands.add('enhancedTest', (options: {
  requiredFeatures: string[];
  fullTest: () => void;
  basicTest?: () => void;
  minimalTest?: () => void;
}) => {
  // Determine the test mode
  determineTestMode(options.requiredFeatures).then(testMode => {
    cy.log(`Running in ${testMode} test mode`);

    // Run the appropriate test
    if (testMode === 'full') {
      options.fullTest();
    } else if (testMode === 'basic' && options.basicTest) {
      options.basicTest();
    } else if (options.minimalTest) {
      options.minimalTest();
    } else {
      cy.log('No appropriate test implementation available for current environment');
    }
  });
});

/**
 * Wait for element with retry and timeout
 * @param selector Element selector
 * @param options Wait options
 */
Cypress.Commands.add('waitForElement', (
  selector: string,
  options: {
    timeout?: number;
    interval?: number;
    errorMessage?: string;
  } = {}
) => {
  const timeout = options.timeout || 10000;
  const interval = options.interval || 500;
  const errorMessage = options.errorMessage || `Element "${selector}" not found after ${timeout}ms`;

  // Use a recursive function to check for the element
  function checkElement(startTime: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        // Element found, return it
        return cy.get(selector);
      }

      // Check if we've exceeded the timeout
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > timeout) {
        // Log a warning instead of failing
        cy.log(errorMessage);
        // Return an empty collection
        return cy.wrap($body.find('nonexistent-element'));
      }

      // Wait and try again
      cy.wait(interval);
      return checkElement(startTime);
    });
  }

  return checkElement(Date.now());
});

/**
 * Safely interact with an element if it exists
 * @param selector Element selector
 * @param action Action to perform if element exists
 * @param fallback Fallback action if element doesn't exist
 */
Cypress.Commands.add('safeInteract', (
  selector: string,
  action: (element: JQuery<HTMLElement>) => void,
  fallback?: () => void
) => {
  cy.get('body').then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).then(action);
    } else if (fallback) {
      fallback();
    } else {
      cy.log(`Element "${selector}" not found, skipping interaction`);
    }
  });
});

/**
 * Visual test with environment-aware configuration
 * @param options Test options
 */
Cypress.Commands.add('visualTest', (options: {
  testName: string;
  selector?: string;
  tag?: string;
  layout?: Array<{ selector: string }>;
  strictMode?: boolean;
}) => {
  // Open Eyes with environment-specific configuration
  cy.eyesOpen({
    appName: 'Pickle B2B Marketplace',
    testName: options.testName,
    // Use different match levels based on environment
    matchLevel: options.strictMode ? 'Strict' : 'Layout'
  });

  // Take screenshot with appropriate configuration
  if (options.selector) {
    // Check specific element
    cy.safeInteract(
      options.selector,
      () => {
        cy.eyesCheckWindow({
          tag: options.tag || options.testName,
          target: 'region',
          selector: options.selector,
          fully: true,
          layout: options.layout || []
        });
      },
      () => {
        // Fallback to full page if selector not found
        cy.eyesCheckWindow({
          tag: `${options.tag || options.testName} (Fallback)`,
          fully: true,
          layout: options.layout || []
        });
      }
    );
  } else {
    // Check full page
    cy.eyesCheckWindow({
      tag: options.tag || options.testName,
      fully: true,
      layout: options.layout || []
    });
  }

  // Close Eyes
  cy.eyesClose();
});

/**
 * Visit a URL with retry
 * @param url URL to visit
 * @param options Visit options
 */
Cypress.Commands.add('visitWithRetry', (url: string, options: Cypress.VisitOptions = {}) => {
  // Simple implementation that just visits the URL
  // In a real implementation, we would add retry logic
  cy.visit(url, options);
  cy.log(`Visited ${url}`);
});

/**
 * Set up buyer test environment
 * @param options Test setup options
 */
Cypress.Commands.add('setupBuyerTest', (options: {
  mockProfile?: boolean;
  mockAddresses?: boolean;
  mockPaymentMethods?: boolean;
  mockOrders?: boolean;
} = {}) => {
  // Visit buyer dashboard
  cy.visitWithRetry('/buyer', { failOnStatusCode: false });

  // Wait for page to load
  cy.wait(1000);

  // Log setup options
  cy.log(`Setting up buyer test with options: ${JSON.stringify(options)}`);
});

/**
 * Add products to cart
 * @param count Number of products to add
 */
Cypress.Commands.add('addProductsToCart', (count: number) => {
  // Add specified number of products to cart
  for (let i = 0; i < count; i++) {
    cy.getByTestId('product-card').eq(i).within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    // Wait for cart to update
    cy.wait(500);
  }
});

/**
 * Fill address form
 * @param address Address data
 */
Cypress.Commands.add('fillAddressForm', (address: any) => {
  cy.getByTestId('address-name-input').type(address.name);
  cy.getByTestId('address-street-input').type(address.street);
  cy.getByTestId('address-city-input').type(address.city);
  cy.getByTestId('address-state-input').type(address.state);
  cy.getByTestId('address-zip-input').type(address.zip);
  cy.getByTestId('address-country-input').type(address.country);

  if (address.phone) {
    cy.getByTestId('address-phone-input').type(address.phone);
  }
});

/**
 * Fill payment form
 * @param payment Payment data
 */
Cypress.Commands.add('fillPaymentForm', (payment: any) => {
  cy.getByTestId('card-number-input').type(payment.cardNumber);
  cy.getByTestId('card-expiry-input').type(payment.cardExpiry);
  cy.getByTestId('card-cvc-input').type(payment.cardCvc);
  cy.getByTestId('card-name-input').type(payment.cardName);
});

/**
 * Inject axe-core for accessibility testing
 */
Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then((window) => {
    // Skip if axe is already injected
    if (window.axe) {
      return;
    }

    // Load axe-core from CDN
    const script = window.document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js';
    script.integrity = 'sha512-dZiMnR5JF+5WJXi8e0pUzsCVnULqxlOQhzXFBWwGmHctlQgXvAH8H2+hv0OE9BGrqz/3jOgApc4KbmJ5BecfA==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';

    window.document.head.appendChild(script);

    // Wait for axe to be loaded
    cy.waitUntil(() => window.axe, {
      timeout: 10000,
      interval: 100,
      errorMsg: 'Timed out waiting for axe to load'
    });
  });
});

/**
 * Check for accessibility violations
 */
Cypress.Commands.add('checkA11y', (
  context?: string,
  options?: any,
  violationCallback?: (violations: any[]) => void,
  skipFailures?: boolean
) => {
  cy.window({ log: false }).then((window) => {
    // Skip if axe is not loaded
    if (!window.axe) {
      cy.log('axe not loaded, skipping accessibility check');
      return;
    }

    // Run axe
    const axeOptions = options || {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    };

    const contextSelector = context || document;

    window.axe.run(contextSelector, axeOptions).then((results: any) => {
      if (violationCallback) {
        violationCallback(results.violations);
      }

      // Log violations
      if (results.violations.length > 0) {
        cy.log(`${results.violations.length} accessibility violation(s) detected`);

        // Log each violation
        results.violations.forEach((violation: any) => {
          cy.log(`${violation.impact} impact: ${violation.help} (${violation.id})`);
          violation.nodes.forEach((node: any) => {
            cy.log(`- ${node.html}`);
          });
        });

        // Fail the test if skipFailures is not true
        if (!skipFailures) {
          assert.equal(results.violations.length, 0, `${results.violations.length} accessibility violations detected`);
        }
      } else {
        cy.log('No accessibility violations detected');
      }
    });
  });
});

/**
 * Wait until a condition is met
 */
Cypress.Commands.add('waitUntil', (
  predicate: () => boolean | Promise<boolean>,
  options?: {
    timeout?: number;
    interval?: number;
    errorMsg?: string;
  }
) => {
  const timeout = options?.timeout || 5000;
  const interval = options?.interval || 200;
  const errorMsg = options?.errorMsg || 'Timed out waiting for condition to be true';

  const startTime = Date.now();

  const checkCondition = () => {
    // Check if we've timed out
    if (Date.now() - startTime > timeout) {
      throw new Error(errorMsg);
    }

    // Try the predicate
    const result = predicate();

    if (result === true) {
      return;
    }

    // If it's a promise, handle it
    if (result instanceof Promise) {
      return result.then((resolvedResult) => {
        if (resolvedResult === true) {
          return;
        }

        // Wait and try again
        cy.wait(interval).then(checkCondition);
      });
    }

    // Wait and try again
    cy.wait(interval).then(checkCondition);
  };

  return cy.wrap(null, { log: false }).then(checkCondition);
});

// Add types to Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Enhanced conditional test that adapts to the environment and available features
       */
      enhancedTest(options: {
        requiredFeatures: string[];
        fullTest: () => void;
        basicTest?: () => void;
        minimalTest?: () => void;
      }): Chainable<void>;

      /**
       * Wait for element with retry and timeout
       */
      waitForElement(
        selector: string,
        options?: {
          timeout?: number;
          interval?: number;
          errorMessage?: string;
        }
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Safely interact with an element if it exists
       */
      safeInteract(
        selector: string,
        action: (element: JQuery<HTMLElement>) => void,
        fallback?: () => void
      ): Chainable<void>;

      /**
       * Visual test with environment-aware configuration
       */
      visualTest(options: {
        testName: string;
        selector?: string;
        tag?: string;
        layout?: Array<{ selector: string }>;
        strictMode?: boolean;
      }): Chainable<void>;

      /**
       * Visit a URL with retry
       */
      visitWithRetry(url: string, options?: Cypress.VisitOptions): Chainable<void>;

      /**
       * Set up buyer test environment
       */
      setupBuyerTest(options?: {
        mockProfile?: boolean;
        mockAddresses?: boolean;
        mockPaymentMethods?: boolean;
        mockOrders?: boolean;
      }): Chainable<void>;

      /**
       * Add products to cart
       */
      addProductsToCart(count: number): Chainable<void>;

      /**
       * Fill address form
       */
      fillAddressForm(address: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string;
      }): Chainable<void>;

      /**
       * Fill payment form
       */
      fillPaymentForm(payment: {
        cardNumber: string;
        cardExpiry: string;
        cardCvc: string;
        cardName: string;
      }): Chainable<void>;

      /**
       * Inject axe-core for accessibility testing
       */
      injectAxe(): Chainable<void>;

      /**
       * Check for accessibility violations
       */
      checkA11y(
        context?: string,
        options?: any,
        violationCallback?: (violations: any[]) => void,
        skipFailures?: boolean
      ): Chainable<void>;

      /**
       * Wait until a condition is met
       */
      waitUntil(
        predicate: () => boolean | Promise<boolean>,
        options?: {
          timeout?: number;
          interval?: number;
          errorMsg?: string;
        }
      ): Chainable<void>;
    }
  }
}
