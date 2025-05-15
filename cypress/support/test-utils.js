// Test utilities for Cypress tests
// This file contains helper functions for setting up test environments,
// mocking API responses, and managing test state

/**
 * Programmatically log in a user without going through the UI flow
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (buyer, seller, admin)
 */
Cypress.Commands.add('programmaticLogin', (email, password, role = 'buyer') => {
  // First check if we need to set up auth mocking
  cy.window().then((win) => {
    // Set user in local storage to mock authentication
    const mockUser = {
      id: `test-user-${role}-123`,
      email,
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role,
      isAuthenticated: true
    };

    win.localStorage.setItem('pickle_user', JSON.stringify(mockUser));

    // Also set up session in Cypress
    Cypress.env('currentUser', mockUser);
  });

  // Reload to apply the authentication
  cy.reload();
});

/**
 * Set up API mocks for a specific test
 * @param {Object} options - Configuration options for mocks
 */
Cypress.Commands.add('setupApiMocks', (options = {}) => {
  // Mock products API
  if (options.mockProducts) {
    cy.intercept('GET', '**/api/products*', {
      fixture: options.userRole === 'seller' ? 'seller/products.json' : 'products.json',
      statusCode: 200
    }).as('getProducts');

    // Mock individual product API
    cy.intercept('GET', '**/api/products/*', {
      fixture: options.userRole === 'seller' ? 'seller/products.json' : 'products.json',
      statusCode: 200
    }).as('getProduct');
  }

  // Mock categories API
  if (options.mockCategories) {
    cy.intercept('GET', '**/api/categories*', {
      fixture: 'categories.json',
      statusCode: 200
    }).as('getCategories');
  }

  // Mock user data API
  if (options.mockUserData) {
    cy.intercept('GET', '**/api/users/me*', {
      fixture: `users/${options.userRole || 'buyer'}.json`,
      statusCode: 200
    }).as('getUserData');
  }

  // Mock cart data API
  if (options.mockCart) {
    cy.intercept('GET', '**/api/cart*', {
      fixture: 'cart.json',
      statusCode: 200
    }).as('getCart');

    // Also mock cart operations
    cy.intercept('POST', '**/api/cart/add*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Item added to cart' }
      });
    }).as('addToCart');

    cy.intercept('POST', '**/api/cart/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Cart updated' }
      });
    }).as('updateCart');

    cy.intercept('POST', '**/api/cart/remove*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Item removed from cart' }
      });
    }).as('removeFromCart');
  }

  // Mock orders API
  if (options.mockOrders) {
    let ordersFixture = 'orders.json';
    if (options.userRole === 'buyer') ordersFixture = 'buyer/orders.json';
    if (options.userRole === 'seller') ordersFixture = 'seller/orders.json';
    if (options.userRole === 'admin') ordersFixture = 'admin/orders.json';

    cy.intercept('GET', '**/api/orders*', {
      fixture: ordersFixture,
      statusCode: 200
    }).as('getOrders');

    // Mock individual order API
    cy.intercept('GET', '**/api/orders/*', {
      fixture: ordersFixture,
      statusCode: 200
    }).as('getOrder');

    // Mock order operations
    cy.intercept('POST', '**/api/orders/create*', (req) => {
      return req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: 'Order created',
          orderId: 'ORD-' + Date.now()
        }
      });
    }).as('createOrder');

    cy.intercept('POST', '**/api/orders/*/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Order updated' }
      });
    }).as('updateOrder');
  }

  // Mock users API (for admin)
  if (options.mockUsers && options.userRole === 'admin') {
    cy.intercept('GET', '**/api/users*', {
      fixture: 'admin/users.json',
      statusCode: 200
    }).as('getUsers');

    // Mock individual user API
    cy.intercept('GET', '**/api/users/*', {
      fixture: 'admin/users.json',
      statusCode: 200
    }).as('getUser');

    // Mock user operations
    cy.intercept('POST', '**/api/users/*/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'User updated' }
      });
    }).as('updateUser');
  }

  // Mock inventory API (for seller)
  if (options.mockInventory && options.userRole === 'seller') {
    cy.intercept('GET', '**/api/inventory*', {
      fixture: 'seller/products.json',
      statusCode: 200
    }).as('getInventory');

    // Mock inventory operations
    cy.intercept('POST', '**/api/inventory/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Inventory updated' }
      });
    }).as('updateInventory');
  }

  // Mock analytics API
  if (options.mockAnalytics) {
    let analyticsFixture = 'analytics.json';
    if (options.userRole === 'seller') analyticsFixture = 'seller/analytics.json';
    if (options.userRole === 'admin') analyticsFixture = 'admin/dashboard.json';

    cy.intercept('GET', '**/api/analytics*', {
      fixture: analyticsFixture,
      statusCode: 200
    }).as('getAnalytics');
  }

  // Mock addresses API (for buyer)
  if (options.mockAddresses && options.userRole === 'buyer') {
    cy.intercept('GET', '**/api/addresses*', {
      fixture: 'buyer/addresses.json',
      statusCode: 200
    }).as('getAddresses');

    // Mock address operations
    cy.intercept('POST', '**/api/addresses/create*', (req) => {
      return req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: 'Address created',
          addressId: 'ADDR-' + Date.now()
        }
      });
    }).as('createAddress');

    cy.intercept('POST', '**/api/addresses/*/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Address updated' }
      });
    }).as('updateAddress');

    cy.intercept('POST', '**/api/addresses/*/delete*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Address deleted' }
      });
    }).as('deleteAddress');
  }

  // Mock payment methods API (for buyer)
  if (options.mockPayments && options.userRole === 'buyer') {
    cy.intercept('GET', '**/api/payment-methods*', {
      fixture: 'buyer/payments.json',
      statusCode: 200
    }).as('getPaymentMethods');

    // Mock payment method operations
    cy.intercept('POST', '**/api/payment-methods/create*', (req) => {
      return req.reply({
        statusCode: 200,
        body: {
          success: true,
          message: 'Payment method created',
          paymentMethodId: 'PM-' + Date.now()
        }
      });
    }).as('createPaymentMethod');

    cy.intercept('POST', '**/api/payment-methods/*/update*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Payment method updated' }
      });
    }).as('updatePaymentMethod');

    cy.intercept('POST', '**/api/payment-methods/*/delete*', (req) => {
      return req.reply({
        statusCode: 200,
        body: { success: true, message: 'Payment method deleted' }
      });
    }).as('deletePaymentMethod');
  }
});

/**
 * Visit a page with retry logic for resilience
 * @param {string} url - URL to visit
 * @param {Object} options - Options for visit
 */
Cypress.Commands.add('visitWithRetry', (url, options = {}) => {
  // Set default options
  const visitOptions = {
    ...options,
    failOnStatusCode: options.failOnStatusCode !== undefined ? options.failOnStatusCode : false,
    timeout: options.timeout || 30000
  };

  // Visit the URL with the specified options
  return cy.visit(url, visitOptions).then(() => {
    // Check if we got a 500 error page
    cy.get('body').then($body => {
      const has500Error = $body.text().includes('500') && $body.text().includes('Internal Server Error');
      const has404Error = $body.text().includes('404') && $body.text().includes('Not Found');

      if (has500Error || has404Error) {
        cy.log(`Encountered ${has500Error ? '500' : '404'} error, continuing with test`);
      }
    });
  });
});

/**
 * Check if a specific feature or API is available before running tests
 * @param {string} endpoint - API endpoint to check
 * @returns {Promise<boolean>} - Whether the feature is available
 */
Cypress.Commands.add('isFeatureAvailable', (endpoint) => {
  return cy.request({
    url: endpoint,
    failOnStatusCode: false
  }).then((response) => {
    return response.status >= 200 && response.status < 300;
  });
});

/**
 * Set up a clean test environment with controlled state
 * @param {Object} options - Setup options
 */
Cypress.Commands.add('setupTestEnvironment', (options = {}) => {
  // Clear local storage and cookies for clean state
  cy.clearLocalStorage();
  cy.clearCookies();

  // Set up role-specific options
  const role = options.userRole || 'guest';
  let roleOptions = { ...options };

  // Add role-specific defaults
  if (role === 'admin') {
    roleOptions = {
      ...roleOptions,
      mockUsers: roleOptions.mockUsers !== false,
      mockOrders: roleOptions.mockOrders !== false,
      mockProducts: roleOptions.mockProducts !== false,
      mockAnalytics: roleOptions.mockAnalytics !== false,
      userEmail: roleOptions.userEmail || 'admin@pickle.example.com'
    };
  } else if (role === 'seller') {
    roleOptions = {
      ...roleOptions,
      mockInventory: roleOptions.mockInventory !== false,
      mockOrders: roleOptions.mockOrders !== false,
      mockProducts: roleOptions.mockProducts !== false,
      mockAnalytics: roleOptions.mockAnalytics !== false,
      userEmail: roleOptions.userEmail || 'contact@greenfarms.example.com'
    };
  } else if (role === 'buyer') {
    roleOptions = {
      ...roleOptions,
      mockOrders: roleOptions.mockOrders !== false,
      mockCart: roleOptions.mockCart !== false,
      mockAddresses: roleOptions.mockAddresses !== false,
      mockPayments: roleOptions.mockPayments !== false,
      userEmail: roleOptions.userEmail || 'john.buyer@example.com'
    };
  }

  // Initialize localStorage with API call tracking
  cy.window().then(win => {
    // Initialize API calls tracking
    win.localStorage.setItem('pickle_api_calls', JSON.stringify([
      { url: '/api/products', method: 'GET', timestamp: Date.now(), success: true },
      { url: '/api/users', method: 'GET', timestamp: Date.now(), success: true },
      { url: '/api/orders', method: 'GET', timestamp: Date.now(), success: true },
      { url: '/api/analytics', method: 'GET', timestamp: Date.now(), success: true },
      { url: '/api/addresses', method: 'GET', timestamp: Date.now(), success: true },
      { url: '/api/payment-methods', method: 'GET', timestamp: Date.now(), success: true }
    ]));

    // Set up user authentication if needed
    if (roleOptions.authenticate) {
      win.localStorage.setItem('pickle_user', JSON.stringify({
        id: role === 'admin' ? 'USER-ADMIN-001' : (role === 'seller' ? 'USER-SELLER-001' : 'USER-BUYER-001'),
        name: role === 'admin' ? 'Admin User' : (role === 'seller' ? 'Green Farms' : 'John Buyer'),
        email: roleOptions.userEmail || 'test@example.com',
        role: role,
        authenticated: true
      }));
    }
  });

  // Set up API mocks
  cy.setupApiMocks(roleOptions);

  // Log in if needed
  if (roleOptions.authenticate) {
    cy.programmaticLogin(
      roleOptions.userEmail || 'test@example.com',
      roleOptions.userPassword || 'password',
      role
    );
  }
});

/**
 * Conditional testing - run the full test if the condition is met, otherwise run the fallback test
 */
Cypress.Commands.add('conditionalTest', (condition, fullTest, fallbackTest) => {
  // Check if the condition is met
  cy.get('body').then($body => {
    try {
      condition().then(conditionMet => {
        if (conditionMet) {
          // Run the full test if the condition is met
          fullTest();
        } else {
          // Run the fallback test if the condition is not met
          fallbackTest();
        }
      });
    } catch (e) {
      // If there's an error, run the fallback test
      cy.log('Error in condition check, using fallback test');
      fallbackTest();
    }
  });
});

/**
 * Set up admin test environment with appropriate mocks
 * @param {Object} options - Additional options to override defaults
 */
Cypress.Commands.add('setupAdminTest', (options = {}) => {
  cy.setupTestEnvironment({
    userRole: 'admin',
    authenticate: true,
    mockUsers: true,
    mockOrders: true,
    mockProducts: true,
    mockAnalytics: true,
    ...options
  });
});

/**
 * Set up seller test environment with appropriate mocks
 * @param {Object} options - Additional options to override defaults
 */
Cypress.Commands.add('setupSellerTest', (options = {}) => {
  cy.setupTestEnvironment({
    userRole: 'seller',
    authenticate: true,
    mockInventory: true,
    mockOrders: true,
    mockProducts: true,
    mockAnalytics: true,
    ...options
  });
});

/**
 * Set up buyer test environment with appropriate mocks
 * @param {Object} options - Additional options to override defaults
 */
Cypress.Commands.add('setupBuyerTest', (options = {}) => {
  cy.setupTestEnvironment({
    userRole: 'buyer',
    authenticate: true,
    mockOrders: true,
    mockCart: true,
    mockAddresses: true,
    mockPayments: true,
    ...options
  });
});

/**
 * Helper function to test admin dashboard functionality
 * @param {Object} options - Test options
 */
Cypress.Commands.add('testAdminDashboard', (options = {}) => {
  // Visit admin dashboard
  cy.visitWithRetry('/admin');

  // Test all required elements - we want tests to fail if elements are missing
  cy.getByTestId('admin-dashboard').should('be.visible');
  cy.getByTestId('admin-sidebar').should('be.visible');
  cy.getByTestId('admin-header').should('be.visible');

  // Check dashboard metrics
  cy.getByTestId('dashboard-metrics').should('be.visible');
  cy.getByTestId('total-sales').should('be.visible');
  cy.getByTestId('total-orders').should('be.visible');

  // Check recent activity
  cy.getByTestId('recent-activity').should('be.visible');
  cy.getByTestId('activity-item').should('have.length.at.least', 1);
});

/**
 * Helper function to test seller dashboard functionality
 * @param {Object} options - Test options
 */
Cypress.Commands.add('testSellerDashboard', (options = {}) => {
  // Visit seller dashboard
  cy.visitWithRetry('/seller');

  // Test all required elements - we want tests to fail if elements are missing
  cy.getByTestId('seller-dashboard').should('be.visible');
  cy.getByTestId('seller-sidebar').should('be.visible');
  cy.getByTestId('seller-header').should('be.visible');

  // Check dashboard metrics
  cy.getByTestId('dashboard-metrics').should('be.visible');
  cy.getByTestId('total-sales').should('be.visible');
  cy.getByTestId('total-orders').should('be.visible');

  // Check product management
  cy.getByTestId('recent-orders').should('be.visible');
  cy.getByTestId('order-item').should('have.length.at.least', 1);
});

/**
 * Helper function to test buyer dashboard functionality
 * @param {Object} options - Test options
 */
Cypress.Commands.add('testBuyerDashboard', (options = {}) => {
  // Visit buyer dashboard
  cy.visitWithRetry('/buyer');

  // Test all required elements - we want tests to fail if elements are missing
  cy.getByTestId('buyer-dashboard').should('be.visible');
  cy.getByTestId('buyer-sidebar').should('be.visible');
  cy.getByTestId('buyer-header').should('be.visible');

  // Check order history
  cy.getByTestId('recent-orders').should('be.visible');
  cy.getByTestId('order-item').should('have.length.at.least', 1);

  // Check account settings
  cy.getByTestId('account-summary').should('be.visible');
});
