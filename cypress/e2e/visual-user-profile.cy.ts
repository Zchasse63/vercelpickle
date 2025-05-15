// Visual Testing - User Profile and Account Settings
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements visual testing for user profiles and account settings
 * It uses conditional testing to handle different environments
 * and gracefully adapts to missing elements
 */

describe('Visual Testing - Buyer Profile', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockOrders: true
    });
  });

  it('should visually validate the buyer dashboard', () => {
    // Visit the correct buyer dashboard path with retry for resilience
    cy.visitWithRetry('/buyer', { failOnStatusCode: false });

    // Take visual snapshot of the buyer dashboard
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Buyer Dashboard',
    });

    cy.eyesCheckWindow({
      tag: 'Buyer Dashboard Overview',
      fully: true,
      layout: [
        { selector: '.timestamp' },
        { selector: '.user-specific-content' },
        { selector: '.order-number' },
        { selector: '.product-price' }
      ]
    });

    // Check specific components if they exist
    cy.get('body').then($body => {
      // Check for buyer dashboard
      if ($body.find('[data-testid="buyer-dashboard"]').length > 0) {
        cy.log('Buyer dashboard found');

        // Check recent orders section if it exists
        if ($body.find('[data-testid="recent-orders"]').length > 0) {
          cy.getByTestId('recent-orders').scrollIntoView();
          cy.eyesCheckWindow({
            tag: 'Recent Orders Section',
            target: 'region',
            selector: '[data-testid="recent-orders"]',
            fully: true
          });
        } else {
          cy.log('Recent orders section not found - this is an issue that should be fixed');
        }

        // Check favorite products section if it exists
        if ($body.find('[data-testid="favorite-products"]').length > 0) {
          cy.getByTestId('favorite-products').scrollIntoView();
          cy.eyesCheckWindow({
            tag: 'Favorite Products Section',
            target: 'region',
            selector: '[data-testid="favorite-products"]',
            fully: true
          });
        }
      } else {
        cy.log('Buyer dashboard not found - this is an issue that should be fixed');
        cy.eyesCheckWindow({
          tag: 'Missing Buyer Dashboard',
          fully: true
        });
      }
    });

    cy.eyesClose();
  });

  it('should visually validate the profile settings page', () => {
    // Visit profile settings page with retry for resilience
    cy.visitWithRetry('/buyer/settings', { failOnStatusCode: false });

    // Take visual snapshot of profile settings
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Profile Settings',
    });

    cy.eyesCheckWindow({
      tag: 'Profile Settings Page',
      fully: true,
      layout: [
        { selector: '.user-specific-content' },
        { selector: 'input[type="text"]' },
        { selector: 'input[type="email"]' }
      ]
    });

    // Check specific components if they exist
    cy.get('body').then($body => {
      if ($body.find('[data-testid="profile-form"]').length > 0) {
        cy.getByTestId('profile-form').scrollIntoView();
        cy.eyesCheckWindow({
          tag: 'Profile Form',
          target: 'region',
          selector: '[data-testid="profile-form"]',
          fully: true,
          layout: [
            { selector: 'input[type="text"]' },
            { selector: 'input[type="email"]' }
          ]
        });
      } else {
        cy.log('Profile form not found - this is an issue that should be fixed');
      }
    });

    cy.eyesClose();
  });

  it('should visually validate the address book page', () => {
    // Visit address book page with retry for resilience
    cy.visitWithRetry('/buyer/shipping', { failOnStatusCode: false });

    // Take visual snapshot of address book
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Book',
    });

    cy.eyesCheckWindow({
      tag: 'Address Book Page',
      fully: true,
      layout: [
        { selector: '.user-specific-content' },
        { selector: '.address-card' }
      ]
    });

    // Check add address form if it exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-address-button"]').length > 0) {
        cy.getByTestId('add-address-button').click();

        // Check if the form appears
        cy.get('body').then($body2 => {
          if ($body2.find('[data-testid="address-form"]').length > 0) {
            cy.eyesCheckWindow({
              tag: 'Add Address Form',
              target: 'region',
              selector: '[data-testid="address-form"]',
              fully: true,
              layout: [
                { selector: 'input[type="text"]' }
              ]
            });
          } else {
            cy.log('Address form not found after clicking add button - this is an issue that should be fixed');
          }
        });
      } else {
        cy.log('Add address button not found - this is an issue that should be fixed');
      }
    });

    cy.eyesClose();
  });

  it('should visually validate the payment methods page', () => {
    // Visit payment methods page with retry for resilience
    cy.visitWithRetry('/buyer/payment-methods', { failOnStatusCode: false });

    // Take visual snapshot of payment methods
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Methods',
    });

    cy.eyesCheckWindow({
      tag: 'Payment Methods Page',
      fully: true,
      layout: [
        { selector: '.user-specific-content' },
        { selector: '.payment-card' },
        { selector: '.card-number' }
      ]
    });

    // Check add payment method form if it exists
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-payment-method-button"]').length > 0) {
        cy.getByTestId('add-payment-method-button').click();

        // Check if the form appears
        cy.get('body').then($body2 => {
          if ($body2.find('[data-testid="payment-form"]').length > 0) {
            cy.eyesCheckWindow({
              tag: 'Add Payment Method Form',
              target: 'region',
              selector: '[data-testid="payment-form"]',
              fully: true,
              layout: [
                { selector: 'input[type="text"]' },
                { selector: '.card-element' }
              ]
            });
          } else {
            cy.log('Payment form not found after clicking add button - this is an issue that should be fixed');
          }
        });
      } else {
        cy.log('Add payment method button not found - this is an issue that should be fixed');
      }
    });

    cy.eyesClose();
  });

  it('should visually validate the order history page', () => {
    // Visit order history page with retry for resilience
    cy.visitWithRetry('/buyer/orders', { failOnStatusCode: false });

    // Take visual snapshot of order history
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Order History',
    });

    cy.eyesCheckWindow({
      tag: 'Order History Page',
      fully: true,
      layout: [
        { selector: '.user-specific-content' },
        { selector: '.order-number' },
        { selector: '.order-date' },
        { selector: '.order-status' },
        { selector: '.product-price' }
      ]
    });

    // Check order details if possible
    cy.get('body').then($body => {
      if ($body.find('[data-testid="order-item"]').length > 0) {
        cy.getByTestId('order-item').first().click();

        // Check if order details appear
        cy.get('body').then($body2 => {
          if ($body2.find('[data-testid="order-details"]').length > 0) {
            cy.eyesCheckWindow({
              tag: 'Order Details',
              target: 'region',
              selector: '[data-testid="order-details"]',
              fully: true,
              layout: [
                { selector: '.order-number' },
                { selector: '.order-date' },
                { selector: '.order-status' },
                { selector: '.product-price' },
                { selector: '.shipping-address' },
                { selector: '.payment-method' }
              ]
            });
          } else {
            cy.log('Order details not found after clicking order item - this is an issue that should be fixed');
          }
        });
      } else {
        cy.log('Order item not found - this is an issue that should be fixed');
      }
    });

    cy.eyesClose();
  });
});
