// Visual Testing - Checkout Flow
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file implements visual testing for the checkout flow
 * It uses conditional testing to handle different environments
 * and gracefully adapts to missing elements
 */

describe('Visual Testing - Checkout Flow', () => {
  beforeEach(() => {
    // Set up test environment with a product in the cart
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

    // Visit marketplace page
    cy.visit('/marketplace', { failOnStatusCode: false });
  });

  it('should visually validate the cart with products', () => {
    // Add a product to cart
    cy.conditionalTest(
      // Condition: Check if product cards exist
      () => cy.elementExists('[data-testid="product-card"]'),
      
      // Full test: Add product to cart through UI
      () => {
        cy.getByTestId('product-card').first().within(() => {
          cy.getByTestId('add-to-cart-button').click();
        });
        
        // Open cart
        cy.getByTestId('cart-button').click();
        
        // Take visual snapshot of cart
        cy.eyesOpen({
          appName: 'Pickle B2B Marketplace',
          testName: 'Cart With Products',
        });
        
        cy.eyesCheckWindow({
          tag: 'Cart Sheet',
          target: 'region',
          selector: '[data-testid="cart-sheet"]',
          fully: true,
          layout: [
            { selector: '.product-price' },
            { selector: '.cart-total' },
            { selector: '.timestamp' }
          ]
        });
        
        cy.eyesClose();
      },
      
      // Fallback test: Add product programmatically
      () => {
        // Programmatically add product to cart
        cy.window().then((win) => {
          const cartKey = 'pickle_cart';
          const cart = {
            items: [{
              id: 'test-cart-item-1',
              productId: 'PROD-001',
              quantity: 1,
              product: {
                _id: 'PROD-001',
                name: 'Organic Carrots',
                price: 9.99,
                unit: 'kg',
                images: ['/placeholder.svg']
              }
            }],
            totals: {
              itemCount: 1,
              subtotal: 9.99,
              tax: 0.99,
              shipping: 5.00,
              total: 15.98
            }
          };
          
          win.localStorage.setItem(cartKey, JSON.stringify(cart));
        });
        
        // Reload page to reflect cart changes
        cy.reload();
        
        // Open cart if button exists
        cy.get('body').then($body => {
          if ($body.find('[data-testid="cart-button"]').length > 0) {
            cy.getByTestId('cart-button').click();
          }
        });
        
        // Take visual snapshot of whatever is available
        cy.eyesOpen({
          appName: 'Pickle B2B Marketplace',
          testName: 'Cart With Products (Fallback)',
        });
        
        cy.eyesCheckWindow({
          tag: 'Current Page',
          fully: true,
        });
        
        cy.eyesClose();
      }
    );
  });

  it('should visually validate the checkout page', () => {
    // Add product to cart programmatically
    cy.window().then((win) => {
      const cartKey = 'pickle_cart';
      const cart = {
        items: [{
          id: 'test-cart-item-1',
          productId: 'PROD-001',
          quantity: 1,
          product: {
            _id: 'PROD-001',
            name: 'Organic Carrots',
            price: 9.99,
            unit: 'kg',
            images: ['/placeholder.svg']
          }
        }],
        totals: {
          itemCount: 1,
          subtotal: 9.99,
          tax: 0.99,
          shipping: 5.00,
          total: 15.98
        }
      };
      
      win.localStorage.setItem(cartKey, JSON.stringify(cart));
    });
    
    // Visit checkout page
    cy.visit('/checkout', { failOnStatusCode: false });
    
    // Take visual snapshot of checkout page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Checkout Page',
    });
    
    cy.eyesCheckWindow({
      tag: 'Checkout Form',
      fully: true,
      layout: [
        { selector: '.product-price' },
        { selector: '.cart-total' },
        { selector: '.timestamp' },
        { selector: '.user-specific-content' }
      ]
    });
    
    cy.eyesClose();
  });

  it('should visually validate the payment step', () => {
    // Visit checkout page directly
    cy.visit('/checkout', { failOnStatusCode: false });
    
    // Proceed to payment step if possible
    cy.conditionalTest(
      // Condition: Check if continue button exists
      () => cy.elementExists('[data-testid="continue-to-payment"]'),
      
      // Full test: Click continue to payment
      () => {
        // Fill shipping info if needed
        cy.get('body').then($body => {
          if ($body.find('[data-testid="shipping-address-form"]').length > 0) {
            cy.getByTestId('shipping-address-form').within(() => {
              cy.get('input[name="name"]').type('John Doe');
              cy.get('input[name="address"]').type('123 Main St');
              cy.get('input[name="city"]').type('New York');
              cy.get('input[name="state"]').type('NY');
              cy.get('input[name="zip"]').type('10001');
            });
          }
        });
        
        // Continue to payment
        cy.getByTestId('continue-to-payment').click();
        
        // Take visual snapshot of payment form
        cy.eyesOpen({
          appName: 'Pickle B2B Marketplace',
          testName: 'Payment Form',
        });
        
        cy.eyesCheckWindow({
          tag: 'Payment Step',
          fully: true,
          layout: [
            { selector: '.product-price' },
            { selector: '.cart-total' },
            { selector: '.timestamp' },
            { selector: '.user-specific-content' }
          ]
        });
        
        cy.eyesClose();
      },
      
      // Fallback test: Take snapshot of current page
      () => {
        cy.eyesOpen({
          appName: 'Pickle B2B Marketplace',
          testName: 'Checkout Page (Fallback)',
        });
        
        cy.eyesCheckWindow({
          tag: 'Current Page',
          fully: true,
        });
        
        cy.eyesClose();
      }
    );
  });

  it('should visually validate the order confirmation page', () => {
    // Visit order confirmation page directly
    cy.visit('/checkout/confirmation', { failOnStatusCode: false });
    
    // Take visual snapshot of order confirmation
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Order Confirmation',
    });
    
    cy.eyesCheckWindow({
      tag: 'Order Confirmation Page',
      fully: true,
      layout: [
        { selector: '.order-number' },
        { selector: '.order-date' },
        { selector: '.product-price' },
        { selector: '.cart-total' },
        { selector: '.timestamp' },
        { selector: '.user-specific-content' }
      ]
    });
    
    cy.eyesClose();
  });
});
