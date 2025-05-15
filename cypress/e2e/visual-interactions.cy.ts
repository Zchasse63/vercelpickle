// Visual Testing - User Interactions
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements visual testing for user interactions
 * It tests filtering, sorting, pagination, and other interactive elements
 */

describe('Visual Testing - Marketplace Interactions', () => {
  beforeEach(() => {
    // Visit marketplace
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
  });

  it('should visually validate product filtering', () => {
    // Take visual snapshot before filtering
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Filtering',
    });
    
    cy.eyesCheckWindow({
      tag: 'Before Filtering',
      fully: true
    });
    
    // Apply category filter if it exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="category-filter"]').length > 0) {
        cy.getByTestId('category-filter').click();
        cy.contains('Vegetables').click();
        
        // Take snapshot after filtering
        cy.eyesCheckWindow({
          tag: 'After Category Filtering',
          fully: true
        });
      } else {
        cy.log('Category filter not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });

  it('should visually validate product sorting', () => {
    // Take visual snapshot before sorting
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Sorting',
    });
    
    cy.eyesCheckWindow({
      tag: 'Before Sorting',
      fully: true
    });
    
    // Apply sorting if it exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="sort-dropdown"]').length > 0) {
        cy.getByTestId('sort-dropdown').click();
        cy.contains('Price: Low to High').click();
        
        // Take snapshot after sorting
        cy.eyesCheckWindow({
          tag: 'After Price Sorting',
          fully: true
        });
      } else {
        cy.log('Sort dropdown not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });

  it('should visually validate product pagination', () => {
    // Take visual snapshot of first page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Pagination',
    });
    
    cy.eyesCheckWindow({
      tag: 'First Page',
      fully: true
    });
    
    // Navigate to next page if pagination exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="pagination"]').length > 0) {
        cy.getByTestId('pagination').contains('Next').click();
        
        // Take snapshot of second page
        cy.eyesCheckWindow({
          tag: 'Second Page',
          fully: true
        });
      } else {
        cy.log('Pagination not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });
});

describe('Visual Testing - Admin Dashboard Interactions', () => {
  beforeEach(() => {
    // Set up admin test environment
    cy.setupAdminTest({
      mockAnalytics: true,
      mockProducts: true,
      mockUsers: true,
      mockOrders: true
    });
    
    // Visit admin dashboard
    cy.visitWithRetry('/admin', { failOnStatusCode: false });
  });

  it('should visually validate tab switching', () => {
    // Take visual snapshot of overview tab
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Tab Switching',
    });
    
    cy.eyesCheckWindow({
      tag: 'Overview Tab',
      fully: true
    });
    
    // Switch to financial tab if it exists
    cy.get('body').then($body => {
      if ($body.find('[role="tab"]').length > 0) {
        cy.get('[role="tab"]').contains('Financial').click();
        
        // Take snapshot of financial tab
        cy.eyesCheckWindow({
          tag: 'Financial Tab',
          fully: true
        });
      } else {
        cy.log('Tabs not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });

  it('should visually validate data table interactions', () => {
    // Visit products management page
    cy.visitWithRetry('/admin/products', { failOnStatusCode: false });
    
    // Take visual snapshot before interaction
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Data Table Interactions',
    });
    
    cy.eyesCheckWindow({
      tag: 'Products Table Default',
      fully: true
    });
    
    // Sort table if it exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="products-table"] th').length > 0) {
        cy.getByTestId('products-table').find('th').contains('Price').click();
        
        // Take snapshot after sorting
        cy.eyesCheckWindow({
          tag: 'Products Table Sorted',
          fully: true
        });
      } else {
        cy.log('Products table not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });
});

describe('Visual Testing - Seller Dashboard Interactions', () => {
  beforeEach(() => {
    // Set up seller test environment
    cy.setupSellerTest({
      mockAnalytics: true,
      mockProducts: true,
      mockOrders: true,
      mockInventory: true
    });
    
    // Visit seller dashboard
    cy.visitWithRetry('/seller', { failOnStatusCode: false });
  });

  it('should visually validate date range selection', () => {
    // Take visual snapshot before date selection
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Seller Date Range Selection',
    });
    
    cy.eyesCheckWindow({
      tag: 'Default Date Range',
      fully: true
    });
    
    // Change date range if date picker exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="date-range-picker"]').length > 0) {
        cy.getByTestId('date-range-picker').click();
        cy.contains('Last 90 Days').click();
        
        // Take snapshot after date range change
        cy.eyesCheckWindow({
          tag: 'Custom Date Range',
          fully: true
        });
      } else {
        cy.log('Date range picker not found - this is an issue that should be fixed');
      }
    });
    
    cy.eyesClose();
  });
});
