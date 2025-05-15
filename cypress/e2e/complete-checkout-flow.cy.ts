// Complete Checkout Flow Tests
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements comprehensive testing for the complete checkout flow
 * including cart management, shipping, payment, and order confirmation.
 * 
 * It uses a combination of functional and visual testing to ensure both
 * functionality and appearance are correct.
 */

describe('Complete Checkout Flow - Authenticated Buyer', () => {
  beforeEach(() => {
    // Set up buyer test environment with appropriate mocks
    cy.setupBuyerTest({
      mockProducts: true,
      mockCart: true,
      mockAddresses: true,
      mockPaymentMethods: true,
      mockOrders: true
    });

    // Visit marketplace with retry for resilience
    cy.visitWithRetry('/marketplace', { failOnStatusCode: false });
  });

  it('should complete the entire checkout process from product selection to order confirmation', () => {
    // Step 1: Add products to cart
    cy.log('Step 1: Adding products to cart');
    cy.addProductsToCart(2);
    
    // Verify cart count updated
    cy.getByTestId('cart-count').should('be.visible');
    cy.getByTestId('cart-count').should('not.contain', '0');
    
    // Open cart
    cy.getByTestId('cart-button').click();
    cy.getByTestId('cart-sidebar').should('be.visible');
    
    // Take visual snapshot of cart
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Flow - Cart',
    });
    
    cy.eyesCheckWindow({
      tag: 'Cart with Products',
      target: 'region',
      selector: '[data-testid="cart-sidebar"]',
      fully: true
    });
    
    cy.eyesClose();
    
    // Proceed to checkout
    cy.getByTestId('checkout-button').click();
    
    // Step 2: Shipping Information
    cy.log('Step 2: Shipping Information');
    cy.url().should('include', '/checkout');
    
    // Verify checkout page elements
    cy.getByTestId('checkout-form').should('be.visible');
    cy.getByTestId('shipping-section').should('be.visible');
    
    // Take visual snapshot of shipping step
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Flow - Shipping',
    });
    
    cy.eyesCheckWindow({
      tag: 'Shipping Step',
      fully: true
    });
    
    cy.eyesClose();
    
    // Select shipping address (or add new one if needed)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="address-list"]').length > 0) {
        // Select existing address
        cy.getByTestId('address-list').within(() => {
          cy.getByTestId('address-option').first().click();
        });
      } else if ($body.find('[data-testid="add-address-button"]').length > 0) {
        // Add new address
        cy.getByTestId('add-address-button').click();
        cy.getByTestId('address-form').should('be.visible');
        cy.fillAddressForm({
          name: 'Test Address',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          country: 'Test Country'
        });
        cy.getByTestId('save-address-button').click();
      }
    });
    
    // Select shipping method
    cy.get('body').then($body => {
      if ($body.find('[data-testid="shipping-methods"]').length > 0) {
        cy.getByTestId('shipping-methods').within(() => {
          cy.getByTestId('shipping-option').first().click();
        });
      }
    });
    
    // Continue to payment
    cy.getByTestId('continue-to-payment-button').click();
    
    // Step 3: Payment Information
    cy.log('Step 3: Payment Information');
    cy.getByTestId('payment-section').should('be.visible');
    
    // Take visual snapshot of payment step
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Flow - Payment',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Step',
      fully: true
    });
    
    cy.eyesClose();
    
    // Select payment method (or add new one if needed)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="payment-methods-list"]').length > 0) {
        // Select existing payment method
        cy.getByTestId('payment-methods-list').within(() => {
          cy.getByTestId('payment-method-option').first().click();
        });
      } else if ($body.find('[data-testid="add-payment-method-button"]').length > 0) {
        // Add new payment method
        cy.getByTestId('add-payment-method-button').click();
        cy.getByTestId('payment-form').should('be.visible');
        
        // Fill payment form
        cy.fillPaymentForm({
          cardNumber: '4242424242424242',
          cardExpiry: '12/30',
          cardCvc: '123',
          cardName: 'Test User'
        });
        
        cy.getByTestId('save-payment-button').click();
      }
    });
    
    // Review order
    cy.getByTestId('review-order-button').click();
    
    // Step 4: Order Review
    cy.log('Step 4: Order Review');
    cy.getByTestId('order-review-section').should('be.visible');
    
    // Take visual snapshot of order review step
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Flow - Order Review',
    });
    
    cy.eyesCheckWindow({
      tag: 'Order Review Step',
      fully: true
    });
    
    cy.eyesClose();
    
    // Verify order summary
    cy.getByTestId('order-summary').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('order-total').should('be.visible');
    
    // Place order
    cy.getByTestId('place-order-button').click();
    
    // Step 5: Order Confirmation
    cy.log('Step 5: Order Confirmation');
    cy.url().should('include', '/order-confirmation');
    
    // Verify confirmation page elements
    cy.getByTestId('order-confirmation').should('be.visible');
    cy.getByTestId('order-number').should('be.visible');
    cy.getByTestId('order-details').should('be.visible');
    
    // Take visual snapshot of confirmation page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Flow - Order Confirmation',
    });
    
    cy.eyesCheckWindow({
      tag: 'Order Confirmation Page',
      fully: true
    });
    
    cy.eyesClose();
    
    // Verify order is added to order history
    cy.getByTestId('view-order-history-button').click();
    cy.url().should('include', '/buyer/orders');
    
    // Verify the new order appears in the order history
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').first().should('be.visible');
  });
});

// Add custom command for adding multiple products to cart
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

// Add custom command for filling address form
Cypress.Commands.add('fillAddressForm', (address: any) => {
  cy.getByTestId('address-name-input').type(address.name);
  cy.getByTestId('address-street-input').type(address.street);
  cy.getByTestId('address-city-input').type(address.city);
  cy.getByTestId('address-state-input').type(address.state);
  cy.getByTestId('address-zip-input').type(address.zip);
  cy.getByTestId('address-country-input').type(address.country);
});

// Add custom command for filling payment form
Cypress.Commands.add('fillPaymentForm', (payment: any) => {
  cy.getByTestId('card-number-input').type(payment.cardNumber);
  cy.getByTestId('card-expiry-input').type(payment.cardExpiry);
  cy.getByTestId('card-cvc-input').type(payment.cardCvc);
  cy.getByTestId('card-name-input').type(payment.cardName);
});
