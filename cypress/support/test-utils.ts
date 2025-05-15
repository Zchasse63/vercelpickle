// Test utilities for Cypress tests

/**
 * Setup test environment with appropriate mocks
 * @param options Configuration options for test setup
 */
Cypress.Commands.add('setupTestEnvironment', (options: {
  mockProducts?: boolean;
  mockCategories?: boolean;
  mockCart?: boolean;
  mockSearch?: boolean;
  mockUser?: any;
  mockAddresses?: boolean;
  mockPaymentMethods?: boolean;
  mockOrders?: boolean;
  mockAnalytics?: boolean;
  mockInventory?: boolean;
  mockUsers?: boolean;
  mockProfile?: boolean;
} = {}) => {
  const {
    mockProducts = false,
    mockCategories = false,
    mockCart = false,
    mockSearch = false,
    mockUser = null,
    mockAddresses = false,
    mockPaymentMethods = false,
    mockOrders = false,
    mockAnalytics = false,
    mockInventory = false,
    mockUsers = false,
    mockProfile = false
  } = options;

  // Mock API responses based on options
  if (mockProducts) {
    cy.fixture('products.json').then((products) => {
      cy.intercept('GET', '**/api/products*', {
        statusCode: 200,
        body: products
      }).as('getProducts');
    });
  }

  if (mockCategories) {
    cy.fixture('categories.json').then((categories) => {
      cy.intercept('GET', '**/api/categories*', {
        statusCode: 200,
        body: categories
      }).as('getCategories');
    });
  }

  if (mockCart) {
    cy.fixture('cart.json').then((cart) => {
      cy.intercept('GET', '**/api/cart*', {
        statusCode: 200,
        body: cart
      }).as('getCart');
    });
    cy.intercept('POST', '**/api/cart/add*', { statusCode: 200, body: { success: true } }).as('addToCart');
    cy.intercept('POST', '**/api/cart/update*', { statusCode: 200, body: { success: true } }).as('updateCart');
    cy.intercept('POST', '**/api/cart/remove*', { statusCode: 200, body: { success: true } }).as('removeFromCart');
  }

  if (mockSearch) {
    cy.fixture('search-results.json').then((results) => {
      cy.intercept('GET', '**/api/search*', {
        statusCode: 200,
        body: results
      }).as('getSearchResults');
    });
  }

  if (mockAddresses) {
    cy.fixture('buyer/addresses.json').then((addresses) => {
      cy.intercept('GET', '**/api/addresses*', {
        statusCode: 200,
        body: addresses
      }).as('getAddresses');
    });
    cy.intercept('POST', '**/api/addresses*', { statusCode: 200, body: { success: true, id: 'new-address-id' } }).as('addAddress');
    cy.intercept('PUT', '**/api/addresses/*', { statusCode: 200, body: { success: true } }).as('updateAddress');
    cy.intercept('DELETE', '**/api/addresses/*', { statusCode: 200, body: { success: true } }).as('deleteAddress');
  }

  if (mockPaymentMethods) {
    cy.fixture('buyer/payment-methods.json').then((paymentMethods) => {
      cy.intercept('GET', '**/api/payment-methods*', {
        statusCode: 200,
        body: paymentMethods
      }).as('getPaymentMethods');
    });
    cy.intercept('POST', '**/api/payment-methods*', { statusCode: 200, body: { success: true, id: 'new-payment-id' } }).as('addPaymentMethod');
    cy.intercept('DELETE', '**/api/payment-methods/*', { statusCode: 200, body: { success: true } }).as('deletePaymentMethod');
  }

  if (mockOrders) {
    cy.fixture('orders.json').then((orders) => {
      cy.intercept('GET', '**/api/orders*', {
        statusCode: 200,
        body: orders
      }).as('getOrders');
    });
    cy.fixture('order-details.json').then((orderDetails) => {
      cy.intercept('GET', '**/api/orders/*', {
        statusCode: 200,
        body: orderDetails
      }).as('getOrderDetails');
    });
    cy.intercept('POST', '**/api/orders*', { statusCode: 200, body: { success: true, orderId: 'new-order-id' } }).as('createOrder');
    cy.intercept('PUT', '**/api/orders/*', { statusCode: 200, body: { success: true } }).as('updateOrder');
  }

  if (mockAnalytics) {
    cy.fixture('analytics.json').then((analytics) => {
      cy.intercept('GET', '**/api/analytics*', {
        statusCode: 200,
        body: analytics
      }).as('getAnalytics');
    });
  }

  if (mockInventory) {
    cy.fixture('inventory.json').then((inventory) => {
      cy.intercept('GET', '**/api/inventory*', {
        statusCode: 200,
        body: inventory
      }).as('getInventory');
    });
  }

  if (mockUsers) {
    cy.fixture('users.json').then((users) => {
      cy.intercept('GET', '**/api/users*', {
        statusCode: 200,
        body: users
      }).as('getUsers');
    });
    cy.fixture('user-details.json').then((userDetails) => {
      cy.intercept('GET', '**/api/users/*', {
        statusCode: 200,
        body: userDetails
      }).as('getUserDetails');
    });
  }

  if (mockProfile) {
    cy.fixture('buyer/profile.json').then((profile) => {
      cy.intercept('GET', '**/api/profile*', {
        statusCode: 200,
        body: profile
      }).as('getProfile');
    });
    cy.intercept('PUT', '**/api/profile*', { statusCode: 200, body: { success: true } }).as('updateProfile');
  }

  // Set up user authentication if specified
  if (mockUser) {
    cy.window().then((win) => {
      win.localStorage.setItem('pickle_user', JSON.stringify(mockUser));
    });

    // Also mock the auth session endpoint
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: mockUser,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }).as('authSession');
  }
});

/**
 * Setup buyer test environment
 * @param options Configuration options for buyer test setup
 */
Cypress.Commands.add('setupBuyerTest', (options: {
  mockProducts?: boolean;
  mockCart?: boolean;
  mockAddresses?: boolean;
  mockPaymentMethods?: boolean;
  mockOrders?: boolean;
  mockProfile?: boolean;
} = {}) => {
  cy.fixture('users.json').then((users) => {
    const buyerUser = {
      id: 'buyer-123',
      email: users.buyers[0].email,
      name: users.buyers[0].name,
      role: 'buyer',
      isAuthenticated: true
    };

    cy.setupTestEnvironment({
      ...options,
      mockUser: buyerUser
    });
  });
});

/**
 * Setup seller test environment
 * @param options Configuration options for seller test setup
 */
Cypress.Commands.add('setupSellerTest', (options: {
  mockProducts?: boolean;
  mockOrders?: boolean;
  mockInventory?: boolean;
  mockAnalytics?: boolean;
} = {}) => {
  cy.fixture('users.json').then((users) => {
    const sellerUser = {
      id: 'seller-123',
      email: users.sellers[0].email,
      name: users.sellers[0].name,
      role: 'seller',
      isAuthenticated: true
    };

    cy.setupTestEnvironment({
      ...options,
      mockUser: sellerUser
    });
  });
});

/**
 * Setup admin test environment
 * @param options Configuration options for admin test setup
 */
Cypress.Commands.add('setupAdminTest', (options: {
  mockProducts?: boolean;
  mockOrders?: boolean;
  mockUsers?: boolean;
  mockAnalytics?: boolean;
} = {}) => {
  cy.fixture('users.json').then((users) => {
    const adminUser = {
      id: 'admin-123',
      email: users.admins[0].email,
      name: users.admins[0].name,
      role: 'admin',
      isAuthenticated: true
    };

    cy.setupTestEnvironment({
      ...options,
      mockUser: adminUser
    });
  });
});

// Add custom command to visit a page with retry
Cypress.Commands.add('visitWithRetry', (url: string, options?: Partial<Cypress.VisitOptions>) => {
  const maxRetries = 3;
  let retries = 0;

  function visit() {
    return cy.visit(url, { ...options, timeout: 30000 }).then(
      () => {
        // Success, do nothing
      },
      (error) => {
        if (retries < maxRetries) {
          retries++;
          cy.log(`Retrying visit to ${url}, attempt ${retries}/${maxRetries}`);
          cy.wait(1000); // Wait before retry
          return visit();
        }
        throw error;
      }
    );
  }

  return visit();
});

// Add command to check if element exists
Cypress.Commands.add('elementExists', (selector: string) => {
  return cy.get('body').then($body => {
    return $body.find(selector).length > 0;
  });
});

// Add command to wait for page to load completely
Cypress.Commands.add('waitForPageLoad', () => {
  return cy.window().then(win => {
    return new Cypress.Promise(resolve => {
      if (win.document.readyState === 'complete') {
        resolve();
      } else {
        win.addEventListener('load', resolve);
      }
    });
  });
});

/**
 * Run a test conditionally based on element existence
 * @param condition Function that returns a boolean or a promise resolving to a boolean
 * @param fullTest Function to run if condition is true
 * @param fallbackTest Function to run if condition is false
 */
Cypress.Commands.add('conditionalTest', (
  condition: () => Cypress.Chainable<boolean>,
  fullTest: () => void,
  fallbackTest: () => void
) => {
  condition().then(exists => {
    if (exists) {
      fullTest();
    } else {
      fallbackTest();
    }
  });
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
 * Enhanced test with visual testing integration
 * @param options Test options
 */
Cypress.Commands.add('enhancedTest', (options: {
  requiredFeatures: string[];
  fullTest: () => void;
  fallbackTest: () => void;
  visualTest?: {
    appName: string;
    testName: string;
    tag: string;
    selector?: string;
  };
}) => {
  // Check if all required features exist
  const checkFeatures = () => {
    return cy.get('body').then($body => {
      return options.requiredFeatures.every(selector => $body.find(selector).length > 0);
    });
  };

  // Run the test conditionally
  cy.conditionalTest(
    checkFeatures,
    () => {
      // Run full test
      options.fullTest();

      // Run visual test if specified
      if (options.visualTest) {
        cy.eyesOpen({
          appName: options.visualTest.appName,
          testName: options.visualTest.testName,
        });

        if (options.visualTest.selector) {
          cy.eyesCheckWindow({
            tag: options.visualTest.tag,
            target: 'region',
            selector: options.visualTest.selector,
            fully: true
          });
        } else {
          cy.eyesCheckWindow({
            tag: options.visualTest.tag,
            fully: true
          });
        }

        cy.eyesClose();
      }
    },
    options.fallbackTest
  );
});

// Extend Cypress types
declare global {
  namespace Cypress {
    interface Chainable {
      visitWithRetry(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<Element>;
      setupTestEnvironment(options?: {
        mockProducts?: boolean;
        mockCategories?: boolean;
        mockCart?: boolean;
        mockSearch?: boolean;
        mockUser?: any;
        mockAddresses?: boolean;
        mockPaymentMethods?: boolean;
        mockOrders?: boolean;
        mockAnalytics?: boolean;
        mockInventory?: boolean;
        mockUsers?: boolean;
        mockProfile?: boolean;
      }): Chainable<Element>;
      setupBuyerTest(options?: {
        mockProducts?: boolean;
        mockCart?: boolean;
        mockAddresses?: boolean;
        mockPaymentMethods?: boolean;
        mockOrders?: boolean;
        mockProfile?: boolean;
      }): Chainable<Element>;
      setupSellerTest(options?: {
        mockProducts?: boolean;
        mockOrders?: boolean;
        mockInventory?: boolean;
        mockAnalytics?: boolean;
      }): Chainable<Element>;
      setupAdminTest(options?: {
        mockProducts?: boolean;
        mockOrders?: boolean;
        mockUsers?: boolean;
        mockAnalytics?: boolean;
      }): Chainable<Element>;
      getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>;
      elementExists(selector: string): Chainable<boolean>;
      waitForPageLoad(): Chainable<void>;
      conditionalTest(
        condition: () => Chainable<boolean>,
        fullTest: () => void,
        fallbackTest: () => void
      ): Chainable<void>;
      addProductsToCart(count: number): Chainable<void>;
      fillAddressForm(address: any): Chainable<void>;
      fillPaymentForm(payment: any): Chainable<void>;
      enhancedTest(options: {
        requiredFeatures: string[];
        fullTest: () => void;
        fallbackTest: () => void;
        visualTest?: {
          appName: string;
          testName: string;
          tag: string;
          selector?: string;
        };
      }): Chainable<void>;
    }
  }
}
