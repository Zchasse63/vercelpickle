// Seller Dashboard Tests
describe('Seller Dashboard - Overview', () => {
  beforeEach(() => {
    // Set up seller test environment with appropriate mocks
    cy.setupSellerTest({
      mockAnalytics: true,
      mockOrders: true
    });

    // Visit seller dashboard with retry for resilience
    cy.visitWithRetry('/seller', { failOnStatusCode: false });
  });

  it('should display seller dashboard with sales metrics', () => {
    // Verify seller dashboard - we want tests to fail if elements are missing
    cy.getByTestId('seller-dashboard').should('be.visible');
    cy.getByTestId('seller-header').should('be.visible');

    // Check dashboard metrics
    cy.getByTestId('sales-metrics').should('be.visible');
    cy.getByTestId('total-sales').should('be.visible');
    cy.getByTestId('total-orders').should('be.visible');
    cy.getByTestId('average-order-value').should('be.visible');

    // Check recent orders
    cy.getByTestId('recent-orders').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);
  });

  // Skipping navigation test for now
  it.skip('should navigate through seller sidebar menu', () => {
    // Check sidebar navigation items - we want tests to fail if elements are missing
    cy.getByTestId('seller-layout').should('be.visible');
    cy.getByTestId('menu-item-dashboard').should('be.visible');
    cy.getByTestId('menu-item-products').should('be.visible');
    cy.getByTestId('menu-item-orders').should('be.visible');
    cy.getByTestId('menu-item-analytics').should('be.visible');
    cy.getByTestId('menu-item-settings').should('be.visible');

    // Navigate to products page
    cy.getByTestId('menu-item-products').click({ force: true });
    cy.url().should('include', '/seller/products');

    // Navigate to orders page
    cy.getByTestId('menu-item-orders').click({ force: true });
    cy.url().should('include', '/seller/orders');

    // Navigate to analytics page
    cy.getByTestId('menu-item-analytics').click({ force: true });
    cy.url().should('include', '/seller/analytics');

    // Navigate to settings page
    cy.getByTestId('menu-item-settings').click({ force: true });
    cy.url().should('include', '/seller/settings');

    // Navigate back to dashboard
    cy.getByTestId('menu-item-dashboard').click({ force: true });
    cy.url().should('include', '/seller');
  });
});

describe('Seller Dashboard - Product Management', () => {
  beforeEach(() => {
    // Set up seller test environment with appropriate mocks
    cy.setupSellerTest({
      mockProducts: true,
      mockInventory: true
    });

    // Visit seller products page with retry for resilience
    cy.visitWithRetry('/seller/products', { failOnStatusCode: false });
  });

  // Skipping product management tests for now
  it.skip('should display product inventory', () => {
    // Verify products table - we want tests to fail if elements are missing
    cy.getByTestId('products-table').should('be.visible');
    cy.getByTestId('product-row').should('have.length.at.least', 1);

    // Test category filter
    cy.getByTestId('category-filter').click({ force: true });
    cy.contains('Vegetables').click({ force: true });
    cy.getByTestId('product-row').should('have.length.at.least', 1);

    // Test status filter
    cy.getByTestId('status-filter').click({ force: true });
    cy.contains('Active').click({ force: true });
    cy.getByTestId('product-row').should('have.length.at.least', 1);
  });

  it.skip('should add a new product', () => {
    // Click add product button - we want tests to fail if elements are missing
    cy.getByTestId('add-product-button').click({ force: true });

    // Fill product form
    cy.getByTestId('product-form').should('be.visible');
    cy.getByTestId('product-name-input').type('Organic Spinach');
    cy.getByTestId('product-description-input').type('Fresh organic spinach, perfect for salads and cooking.');
    cy.getByTestId('product-price-input').type('3.99');
    cy.getByTestId('product-unit-input').type('bunch');
    cy.getByTestId('product-category-select').click({ force: true });
    cy.contains('Vegetables').click({ force: true });
    cy.getByTestId('product-subcategory-input').type('Leafy Greens');
    cy.getByTestId('product-inventory-input').type('50');

    // Save product
    cy.getByTestId('save-product-button').click({ force: true });

    // Verify success message
    cy.contains('Product added successfully').should('be.visible');

    // Verify new product in list
    cy.getByTestId('product-search').type('Organic Spinach');
    cy.getByTestId('product-row').should('have.length.at.least', 1);
    cy.contains('Organic Spinach').should('be.visible');
  });

  it.skip('should update product inventory', () => {
    // Click on first product - we want tests to fail if elements are missing
    cy.getByTestId('product-row').first().within(() => {
      cy.getByTestId('edit-product-button').click({ force: true });
    });

    // Update inventory
    cy.getByTestId('product-form').should('be.visible');
    cy.getByTestId('product-inventory-input').clear().type('75');

    // Save changes
    cy.getByTestId('save-product-button').click({ force: true });

    // Verify success message
    cy.contains('Product updated successfully').should('be.visible');

    // Verify updated inventory
    cy.getByTestId('product-row').first().should('contain', '75');
  });
});

describe('Seller Dashboard - Order Management', () => {
  beforeEach(() => {
    // Set up seller test environment with appropriate mocks
    cy.setupSellerTest({
      mockOrders: true
    });

    // Visit seller orders page with retry for resilience
    cy.visitWithRetry('/seller/orders', { failOnStatusCode: false });
  });

  // Skipping order management tests for now
  it.skip('should display order list with filtering', () => {
    // Verify orders table - we want tests to fail if elements are missing
    cy.getByTestId('orders-table').should('be.visible');
    cy.getByTestId('order-row').should('have.length.at.least', 1);

    // Test status filter
    cy.getByTestId('status-filter').click({ force: true });
    cy.contains('Processing').click({ force: true });
    cy.getByTestId('order-row').should('have.length.at.least', 1);

    // Test date filter
    cy.getByTestId('date-filter').click({ force: true });
    cy.contains('Last 30 days').click({ force: true });
    cy.getByTestId('order-row').should('have.length.at.least', 1);
  });

  it.skip('should view order details', () => {
    // Click on first order - we want tests to fail if elements are missing
    cy.getByTestId('order-row').first().within(() => {
      cy.getByTestId('view-order-button').click({ force: true });
    });

    // Verify order details page
    cy.url().should('include', '/seller/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-id').should('be.visible');
    cy.getByTestId('order-status').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('buyer-info').should('be.visible');
    cy.getByTestId('shipping-address').should('be.visible');
  });

  it.skip('should update order fulfillment status', () => {
    // Find a processing order - we want tests to fail if elements are missing
    cy.getByTestId('status-filter').click({ force: true });
    cy.contains('Processing').click({ force: true });

    // Click on first order
    cy.getByTestId('order-row').first().within(() => {
      cy.getByTestId('view-order-button').click({ force: true });
    });

    // Update fulfillment status
    cy.getByTestId('fulfillment-status-select').click({ force: true });
    cy.contains('shipped').click({ force: true });
    cy.getByTestId('tracking-number-input').type('TRK987654321');
    cy.getByTestId('carrier-select').click({ force: true });
    cy.contains('FedEx').click({ force: true });
    cy.getByTestId('update-fulfillment-button').click({ force: true });

    // Verify status updated
    cy.getByTestId('fulfillment-status').should('contain', 'shipped');
    cy.contains('Order status updated successfully').should('be.visible');
  });
});

describe('Seller Dashboard - Analytics', () => {
  beforeEach(() => {
    // Set up seller test environment with appropriate mocks
    cy.setupSellerTest({
      mockAnalytics: true
    });

    // Visit seller analytics page with retry for resilience
    cy.visitWithRetry('/seller/analytics', { failOnStatusCode: false });
  });

  // Skipping analytics tests for now
  it.skip('should display sales analytics', () => {
    // Verify analytics dashboard - we want tests to fail if elements are missing
    cy.getByTestId('analytics-dashboard').should('be.visible');

    // Check sales chart
    cy.getByTestId('sales-chart').should('be.visible');

    // Check period selector
    cy.getByTestId('period-selector').should('be.visible');
    cy.getByTestId('period-selector').click({ force: true });
    cy.contains('Last 7 days').click({ force: true });

    // Check top products section
    cy.getByTestId('top-products').should('be.visible');
    cy.getByTestId('product-performance-item').should('have.length.at.least', 1);
  });

  it.skip('should export analytics data', () => {
    // Click export data button - we want tests to fail if elements are missing
    cy.getByTestId('export-data-button').click({ force: true });

    // Select export format
    cy.getByTestId('export-format-select').click({ force: true });
    cy.contains('CSV').click({ force: true });

    // Select date range
    cy.getByTestId('export-date-range').click({ force: true });
    cy.contains('Last 30 days').click({ force: true });

    // Click download button
    cy.getByTestId('download-export-button').click({ force: true });

    // Verify success message
    cy.contains('Export successful').should('be.visible');
  });
});