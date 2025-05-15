// Buyer Dashboard Tests
describe('Buyer Dashboard - Overview', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockOrders: true
    });

    // Visit buyer dashboard with retry for resilience
    cy.visitWithRetry('/buyer', { failOnStatusCode: false });
  });

  it('should display buyer dashboard with order summary', () => {
    // Verify buyer dashboard - we want tests to fail if elements are missing
    cy.getByTestId('buyer-dashboard').should('be.visible');
    cy.getByTestId('buyer-sidebar').should('be.visible');
    cy.getByTestId('buyer-header').should('be.visible');

    // Check dashboard components
    cy.getByTestId('order-summary').should('be.visible');
    cy.getByTestId('recent-orders').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);
  });

  it('should navigate through buyer sidebar menu', () => {
    // Check sidebar navigation items - we want tests to fail if elements are missing
    cy.getByTestId('buyer-sidebar').should('be.visible');
    cy.getByTestId('menu-item-dashboard').should('be.visible');
    cy.getByTestId('menu-item-orders').should('be.visible');
    cy.getByTestId('menu-item-addresses').should('be.visible');
    cy.getByTestId('menu-item-payment-methods').should('be.visible');
    cy.getByTestId('menu-item-settings').should('be.visible');

    // Navigate to orders page
    cy.getByTestId('menu-item-orders').click();
    cy.url().should('include', '/buyer/orders');

    // Navigate to addresses page
    cy.getByTestId('menu-item-addresses').click();
    cy.url().should('include', '/buyer/addresses');

    // Navigate to payment methods page
    cy.getByTestId('menu-item-payment-methods').click();
    cy.url().should('include', '/buyer/payment-methods');

    // Navigate to settings page
    cy.getByTestId('menu-item-settings').click();
    cy.url().should('include', '/buyer/settings');

    // Navigate back to dashboard
    cy.getByTestId('menu-item-dashboard').click();
    cy.url().should('include', '/buyer');
  });
});

describe('Buyer Dashboard - Order Management', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockOrders: true
    });

    // Visit buyer orders page with retry for resilience
    cy.visitWithRetry('/buyer/orders', { failOnStatusCode: false });
  });

  it('should display order history', () => {
    // Verify orders table - we want tests to fail if elements are missing
    cy.getByTestId('orders-table').should('be.visible');
    cy.getByTestId('order-row').should('have.length.at.least', 1);

    // Test status filter
    cy.getByTestId('status-filter').select('processing');
    cy.getByTestId('order-row').should('have.length.at.least', 1);

    // Test date filter
    cy.getByTestId('date-filter').select('Last 30 days');
    cy.getByTestId('order-row').should('have.length.at.least', 1);
  });

  it('should view order details', () => {
    // Click on first order - we want tests to fail if elements are missing
    cy.getByTestId('order-row').first().within(() => {
      cy.getByTestId('view-order-button').click();
    });

    // Verify order details page
    cy.url().should('include', '/buyer/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-id').should('be.visible');
    cy.getByTestId('order-status').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('order-timeline').should('be.visible');
  });

  it('should reorder previous order', () => {
    // Click on first completed order - we want tests to fail if elements are missing
    cy.getByTestId('status-filter').select('completed');
    cy.getByTestId('order-row').first().within(() => {
      cy.getByTestId('view-order-button').click();
    });

    // Click reorder button
    cy.getByTestId('reorder-button').click();

    // Verify items added to cart
    cy.getByTestId('cart-notification').should('be.visible');
    cy.getByTestId('cart-count').should('be.visible');

    // Open cart
    cy.getByTestId('cart-button').click();
    cy.getByTestId('cart-sheet').should('be.visible');
    cy.getByTestId('cart-items').should('be.visible');
  });
});

describe('Buyer Dashboard - Address Management', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockAddresses: true
    });

    // Visit buyer addresses page with retry for resilience
    cy.visitWithRetry('/buyer/addresses', { failOnStatusCode: false });
  });

  it('should display saved addresses', () => {
    // Verify addresses list - we want tests to fail if elements are missing
    cy.getByTestId('addresses-list').should('be.visible');
    cy.getByTestId('address-card').should('have.length.at.least', 1);

    // Check default address indicator
    cy.getByTestId('default-address-badge').should('be.visible');
  });

  it('should add a new address', () => {
    // Click add address button - we want tests to fail if elements are missing
    cy.getByTestId('add-address-button').click();

    // Fill address form
    cy.getByTestId('address-form').should('be.visible');
    cy.getByTestId('address-name-input').type('New Office');
    cy.getByTestId('address-street-input').type('789 Business Ave');
    cy.getByTestId('address-city-input').type('San Francisco');
    cy.getByTestId('address-state-input').type('CA');
    cy.getByTestId('address-zip-input').type('94107');
    cy.getByTestId('address-country-input').type('USA');
    cy.getByTestId('address-phone-input').type('555-987-6543');

    // Save address
    cy.getByTestId('save-address-button').click();

    // Verify success message
    cy.contains('Address added successfully').should('be.visible');

    // Verify new address in list
    cy.getByTestId('address-card').should('have.length.at.least', 3);
    cy.contains('New Office').should('be.visible');
  });

  it('should edit an existing address', () => {
    // Click edit on first address - we want tests to fail if elements are missing
    cy.getByTestId('address-card').first().within(() => {
      cy.getByTestId('edit-address-button').click();
    });

    // Edit address form
    cy.getByTestId('address-form').should('be.visible');
    cy.getByTestId('address-name-input').clear().type('Updated Address');

    // Save changes
    cy.getByTestId('save-address-button').click();

    // Verify success message
    cy.contains('Address updated successfully').should('be.visible');

    // Verify updated address in list
    cy.contains('Updated Address').should('be.visible');
  });
});

describe('Buyer Dashboard - Payment Methods', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockPayments: true
    });

    // Visit buyer payment methods page with retry for resilience
    cy.visitWithRetry('/buyer/payment-methods', { failOnStatusCode: false });
  });

  it('should display saved payment methods', () => {
    // Verify payment methods list - we want tests to fail if elements are missing
    cy.getByTestId('payment-methods-list').should('be.visible');
    cy.getByTestId('payment-method-card').should('have.length.at.least', 1);

    // Check default payment method indicator
    cy.getByTestId('default-payment-badge').should('be.visible');
  });

  it('should add a new payment method', () => {
    // Click add payment method button - we want tests to fail if elements are missing
    cy.getByTestId('add-payment-button').click();

    // Fill payment method form
    cy.getByTestId('payment-form').should('be.visible');
    cy.getByTestId('card-number-input').type('4242424242424242');
    cy.getByTestId('card-expiry-input').type('1225');
    cy.getByTestId('card-cvc-input').type('123');
    cy.getByTestId('card-name-input').type('John Buyer');

    // Save payment method
    cy.getByTestId('save-payment-button').click();

    // Verify success message
    cy.contains('Payment method added successfully').should('be.visible');

    // Verify new payment method in list
    cy.getByTestId('payment-method-card').should('have.length.at.least', 3);
    cy.contains('Visa ending in 4242').should('be.visible');
  });
});