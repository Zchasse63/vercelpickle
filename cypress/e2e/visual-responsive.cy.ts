// Visual Testing - Responsive Layouts
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements visual testing for responsive layouts
 * It tests the application at different viewport sizes to ensure responsive design
 */

describe('Visual Testing - Responsive Layouts', () => {
  beforeEach(() => {
    // Set up test environment with authenticated user
    cy.fixture('users.json').then((users) => {
      // Programmatically login as a buyer
      cy.window().then((win) => {
        win.localStorage.setItem('pickle_user', JSON.stringify({
          id: 'buyer-123',
          email: users.buyers[0].email,
          name: users.buyers[0].name,
          role: 'buyer',
          isAuthenticated: true
        }));
      });
    });
  });

  it('should visually validate the marketplace on mobile', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-x');
    
    // Visit marketplace
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
    
    // Take visual snapshot of marketplace
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Marketplace Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Marketplace Mobile',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.product-price' }
      ]
    });
    
    cy.eyesClose();
  });

  it('should visually validate the marketplace on tablet', () => {
    // Set viewport to tablet size
    cy.viewport('ipad-2');
    
    // Visit marketplace
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
    
    // Take visual snapshot of marketplace
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Marketplace Tablet',
    });
    
    cy.eyesCheckWindow({
      tag: 'Marketplace Tablet',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.product-price' }
      ]
    });
    
    cy.eyesClose();
  });

  it('should visually validate the buyer dashboard on mobile', () => {
    // Set up buyer test environment
    cy.setupBuyerTest({
      mockOrders: true
    });
    
    // Set viewport to mobile size
    cy.viewport('iphone-x');
    
    // Visit buyer dashboard
    cy.visitWithRetry('/buyer', { failOnStatusCode: false });
    
    // Take visual snapshot of buyer dashboard
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Buyer Dashboard Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Buyer Dashboard Mobile',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.order-number' },
        { selector: '.product-price' }
      ]
    });
    
    cy.eyesClose();
  });

  it('should visually validate the seller dashboard on mobile', () => {
    // Set up seller test environment
    cy.setupSellerTest({
      mockAnalytics: true,
      mockProducts: true,
      mockOrders: true,
      mockInventory: true
    });
    
    // Set viewport to mobile size
    cy.viewport('iphone-x');
    
    // Visit seller dashboard
    cy.visitWithRetry('/seller', { failOnStatusCode: false });
    
    // Take visual snapshot of seller dashboard
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Seller Dashboard Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Seller Dashboard Mobile',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.revenue-value' },
        { selector: '.orders-value' },
        { selector: '.products-value' }
      ]
    });
    
    cy.eyesClose();
  });

  it('should visually validate the admin dashboard on mobile', () => {
    // Set up admin test environment
    cy.setupAdminTest({
      mockAnalytics: true,
      mockProducts: true,
      mockUsers: true,
      mockOrders: true
    });
    
    // Set viewport to mobile size
    cy.viewport('iphone-x');
    
    // Visit admin dashboard
    cy.visitWithRetry('/admin', { failOnStatusCode: false });
    
    // Take visual snapshot of admin dashboard
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Dashboard Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Admin Dashboard Mobile',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.revenue-value' },
        { selector: '.orders-value' },
        { selector: '.products-value' },
        { selector: '.users-value' }
      ]
    });
    
    cy.eyesClose();
  });
});
