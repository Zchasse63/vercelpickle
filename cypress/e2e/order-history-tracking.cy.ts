// Order History and Tracking Tests
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements comprehensive testing for order history and tracking
 * for all user roles (buyer, seller, admin).
 * 
 * It uses a combination of functional and visual testing to ensure both
 * functionality and appearance are correct.
 */

describe('Order History - Buyer', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockOrders: true
    });

    // Visit buyer orders page with retry for resilience
    cy.visitWithRetry('/buyer/orders', { failOnStatusCode: false });
  });

  it('should display order history list', () => {
    // Verify orders list
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);
    
    // Take visual snapshot of orders list
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Buyer Order History',
    });
    
    cy.eyesCheckWindow({
      tag: 'Order History List',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should filter orders by status', () => {
    // Verify filter controls
    cy.getByTestId('order-filters').should('be.visible');
    
    // Filter by "Delivered" status
    cy.getByTestId('status-filter').click();
    cy.contains('Delivered').click();
    
    // Verify filtered results
    cy.getByTestId('order-item').each($order => {
      cy.wrap($order).within(() => {
        cy.getByTestId('order-status').should('contain', 'Delivered');
      });
    });
    
    // Take visual snapshot of filtered orders
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Buyer Filtered Orders',
    });
    
    cy.eyesCheckWindow({
      tag: 'Filtered Order History',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should search orders by order number', () => {
    // Get first order number
    cy.getByTestId('order-item').first().within(() => {
      cy.getByTestId('order-number').invoke('text').as('orderNumber');
    });
    
    // Search for that order number
    cy.get('@orderNumber').then(orderNumber => {
      cy.getByTestId('order-search').type(orderNumber);
      cy.getByTestId('search-button').click();
      
      // Verify search results
      cy.getByTestId('order-item').should('have.length', 1);
      cy.getByTestId('order-item').first().within(() => {
        cy.getByTestId('order-number').should('contain', orderNumber);
      });
    });
  });

  it('should view order details', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();
    
    // Verify order details page
    cy.url().should('include', '/buyer/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('order-summary').should('be.visible');
    cy.getByTestId('order-status').should('be.visible');
    
    // Take visual snapshot of order details
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Buyer Order Details',
    });
    
    cy.eyesCheckWindow({
      tag: 'Order Details Page',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should track order shipment', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();
    
    // Click track shipment button if available
    cy.get('body').then($body => {
      if ($body.find('[data-testid="track-shipment-button"]').length > 0) {
        cy.getByTestId('track-shipment-button').click();
        
        // Verify tracking modal/page
        cy.getByTestId('tracking-info').should('be.visible');
        cy.getByTestId('tracking-timeline').should('be.visible');
        
        // Take visual snapshot of tracking info
        cy.eyesOpen({
          appName: 'Pickle B2B Marketplace',
          testName: 'Order Tracking',
        });
        
        cy.eyesCheckWindow({
          tag: 'Tracking Information',
          fully: true
        });
        
        cy.eyesClose();
      } else {
        cy.log('Tracking button not available for this order');
      }
    });
  });
});

describe('Order Management - Seller', () => {
  beforeEach(() => {
    // Set up seller test environment with appropriate mocks
    cy.setupSellerTest({
      mockOrders: true,
      mockProducts: true
    });

    // Visit seller orders page with retry for resilience
    cy.visitWithRetry('/seller/orders', { failOnStatusCode: false });
  });

  it('should display orders list', () => {
    // Verify orders list
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);
    
    // Take visual snapshot of orders list
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Seller Orders List',
    });
    
    cy.eyesCheckWindow({
      tag: 'Seller Orders List',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should view order details', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();
    
    // Verify order details page
    cy.url().should('include', '/seller/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('buyer-info').should('be.visible');
    cy.getByTestId('order-actions').should('be.visible');
    
    // Take visual snapshot of order details
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Seller Order Details',
    });
    
    cy.eyesCheckWindow({
      tag: 'Seller Order Details',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should update order status', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();
    
    // Click update status button
    cy.getByTestId('update-status-button').click();
    
    // Select new status
    cy.getByTestId('status-dropdown').click();
    cy.contains('Shipped').click();
    
    // Add tracking information if required
    cy.get('body').then($body => {
      if ($body.find('[data-testid="tracking-number-input"]').length > 0) {
        cy.getByTestId('tracking-number-input').type('TRK123456789');
        cy.getByTestId('carrier-input').type('Test Carrier');
      }
    });
    
    // Save status update
    cy.getByTestId('save-status-button').click();
    
    // Verify success message
    cy.contains('Order status updated successfully').should('be.visible');
    
    // Verify status updated
    cy.getByTestId('order-status').should('contain', 'Shipped');
  });
});

describe('Order Management - Admin', () => {
  beforeEach(() => {
    // Set up admin test environment with appropriate mocks
    cy.setupAdminTest({
      mockOrders: true,
      mockUsers: true,
      mockProducts: true
    });

    // Visit admin orders page with retry for resilience
    cy.visitWithRetry('/admin/orders', { failOnStatusCode: false });
  });

  it('should display all orders across the platform', () => {
    // Verify orders table
    cy.getByTestId('orders-table').should('be.visible');
    cy.getByTestId('order-row').should('have.length.at.least', 1);
    
    // Take visual snapshot of orders table
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Orders Table',
    });
    
    cy.eyesCheckWindow({
      tag: 'Admin Orders Table',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should filter orders by multiple criteria', () => {
    // Open filters
    cy.getByTestId('filter-button').click();
    
    // Apply filters
    cy.getByTestId('status-filter').select('Processing');
    cy.getByTestId('date-range-filter').select('Last 7 days');
    cy.getByTestId('apply-filters-button').click();
    
    // Verify filtered results
    cy.getByTestId('order-row').each($order => {
      cy.wrap($order).within(() => {
        cy.getByTestId('order-status').should('contain', 'Processing');
      });
    });
    
    // Take visual snapshot of filtered orders
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Filtered Orders',
    });
    
    cy.eyesCheckWindow({
      tag: 'Admin Filtered Orders',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should view detailed order information', () => {
    // Click on first order
    cy.getByTestId('order-row').first().click();
    
    // Verify order details page
    cy.url().should('include', '/admin/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('buyer-info').should('be.visible');
    cy.getByTestId('seller-info').should('be.visible');
    cy.getByTestId('payment-info').should('be.visible');
    cy.getByTestId('order-timeline').should('be.visible');
    
    // Take visual snapshot of order details
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Order Details',
    });
    
    cy.eyesCheckWindow({
      tag: 'Admin Order Details',
      fully: true
    });
    
    cy.eyesClose();
  });
});
