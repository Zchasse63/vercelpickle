// Integrated Visual and Functional Testing
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

/**
 * This test file demonstrates how to integrate visual testing with functional tests
 * It uses the enhanced test utilities for robust testing across environments
 */

describe('Integrated Visual and Functional Testing - Product Browsing', () => {
  beforeEach(() => {
    // Visit the marketplace page
    cy.visit('/marketplace', { failOnStatusCode: false });
  });

  it('should filter products and validate visual appearance', () => {
    // Define the required features for this test
    const requiredFeatures = [
      '[data-testid="product-grid"]',
      '[data-testid="filter-sidebar"]',
      '[data-testid="product-card"]'
    ];
    
    // Run the test with appropriate mode based on available features
    cy.enhancedTest({
      requiredFeatures,
      
      // Full test with all features
      fullTest: () => {
        // Take a baseline screenshot before filtering
        cy.visualTest({
          testName: 'Product Grid - Before Filtering',
          selector: '[data-testid="product-grid"]',
          layout: [
            { selector: '.product-price' },
            { selector: '.product-name' }
          ]
        });
        
        // Apply a filter
        cy.getByTestId('filter-sidebar').within(() => {
          // Find and click a category filter
          cy.safeInteract(
            '[data-testid="category-filter"]',
            ($filter) => {
              cy.wrap($filter).click();
              // Select the first category option
              cy.get('option').eq(1).then($option => {
                cy.wrap($filter).select($option.val());
              });
            }
          );
          
          // Apply the filter
          cy.safeInteract(
            '[data-testid="apply-filter"]',
            ($button) => {
              cy.wrap($button).click();
            }
          );
        });
        
        // Wait for the filtered results to load
        cy.waitForElement('[data-testid="product-grid"]', { timeout: 5000 });
        
        // Take a screenshot after filtering
        cy.visualTest({
          testName: 'Product Grid - After Filtering',
          selector: '[data-testid="product-grid"]',
          layout: [
            { selector: '.product-price' },
            { selector: '.product-name' }
          ]
        });
        
        // Verify that the filter was applied (functional test)
        cy.getByTestId('active-filters').should('be.visible');
      },
      
      // Basic test with limited features
      basicTest: () => {
        // Take a baseline screenshot of whatever is available
        cy.visualTest({
          testName: 'Product Page - Basic Test',
          layout: [
            { selector: '.product-price' },
            { selector: '.product-name' }
          ]
        });
        
        // Perform basic interaction
        cy.get('select').first().then($select => {
          if ($select.length > 0) {
            cy.wrap($select).select(1);
          }
        });
        
        // Take a screenshot after interaction
        cy.visualTest({
          testName: 'Product Page - After Interaction',
          layout: [
            { selector: '.product-price' },
            { selector: '.product-name' }
          ]
        });
      },
      
      // Minimal test when almost nothing is available
      minimalTest: () => {
        // Just take a screenshot of the page
        cy.visualTest({
          testName: 'Product Page - Minimal Test'
        });
      }
    });
  });
});

describe('Integrated Visual and Functional Testing - Shopping Cart', () => {
  beforeEach(() => {
    // Visit the marketplace page
    cy.visit('/marketplace', { failOnStatusCode: false });
  });

  it('should add a product to cart and validate visual appearance', () => {
    // Define the required features for this test
    const requiredFeatures = [
      '[data-testid="product-card"]',
      '[data-testid="add-to-cart-button"]',
      '[data-testid="cart-button"]'
    ];
    
    // Run the test with appropriate mode based on available features
    cy.enhancedTest({
      requiredFeatures,
      
      // Full test with all features
      fullTest: () => {
        // Take a baseline screenshot of the cart button before adding product
        cy.visualTest({
          testName: 'Cart Button - Empty',
          selector: '[data-testid="cart-button"]'
        });
        
        // Add a product to the cart
        cy.getByTestId('product-card').first().within(() => {
          cy.getByTestId('add-to-cart-button').click();
        });
        
        // Wait for the cart to update
        cy.waitForElement('[data-testid="cart-count"]', { timeout: 5000 });
        
        // Take a screenshot of the cart button after adding product
        cy.visualTest({
          testName: 'Cart Button - With Product',
          selector: '[data-testid="cart-button"]'
        });
        
        // Open the cart
        cy.getByTestId('cart-button').click();
        
        // Wait for the cart to open
        cy.waitForElement('[data-testid="cart-sheet"]', { timeout: 5000 });
        
        // Take a screenshot of the cart
        cy.visualTest({
          testName: 'Cart Sheet',
          selector: '[data-testid="cart-sheet"]',
          layout: [
            { selector: '.product-price' },
            { selector: '.cart-total' }
          ]
        });
        
        // Verify that the product was added (functional test)
        cy.getByTestId('cart-item').should('have.length.at.least', 1);
      },
      
      // Basic test with limited features
      basicTest: () => {
        // Find any product card or link
        cy.get('a').contains('product', { matchCase: false }).first().click();
        
        // Find any add to cart button
        cy.get('button').contains('add', { matchCase: false }).click();
        
        // Take a screenshot after adding to cart
        cy.visualTest({
          testName: 'Page After Adding to Cart',
          layout: [
            { selector: '.product-price' },
            { selector: '.cart-total' }
          ]
        });
      },
      
      // Minimal test when almost nothing is available
      minimalTest: () => {
        // Just take a screenshot of the page
        cy.visualTest({
          testName: 'Product Page - Minimal Test'
        });
      }
    });
  });
});

describe('Integrated Visual and Functional Testing - User Login', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/', { failOnStatusCode: false });
  });

  it('should display login form and validate visual appearance', () => {
    // Define the required features for this test
    const requiredFeatures = [
      'button:contains("Login")',
      '[data-testid="login-modal"]',
      '[data-testid="login-email"]'
    ];
    
    // Run the test with appropriate mode based on available features
    cy.enhancedTest({
      requiredFeatures,
      
      // Full test with all features
      fullTest: () => {
        // Find and click the login button
        cy.contains('button', 'Login').click();
        
        // Wait for the login modal to appear
        cy.waitForElement('[data-testid="login-modal"]', { timeout: 5000 });
        
        // Take a screenshot of the login form
        cy.visualTest({
          testName: 'Login Form',
          selector: '[data-testid="login-modal"]',
          strictMode: true
        });
        
        // Fill in the login form
        cy.getByTestId('login-email').type('test@example.com');
        cy.getByTestId('login-password').type('password');
        
        // Take a screenshot of the filled login form
        cy.visualTest({
          testName: 'Login Form - Filled',
          selector: '[data-testid="login-modal"]',
          layout: [
            { selector: 'input[type="email"]' },
            { selector: 'input[type="password"]' }
          ]
        });
        
        // Verify form validation (functional test)
        cy.getByTestId('login-submit').should('not.be.disabled');
      },
      
      // Basic test with limited features
      basicTest: () => {
        // Find any login link or button
        cy.get('a, button').contains('login', { matchCase: false }).click();
        
        // Take a screenshot of whatever appears
        cy.visualTest({
          testName: 'Login Page',
          layout: [
            { selector: 'input[type="email"]' },
            { selector: 'input[type="password"]' }
          ]
        });
      },
      
      // Minimal test when almost nothing is available
      minimalTest: () => {
        // Just take a screenshot of the page
        cy.visualTest({
          testName: 'Home Page - Minimal Test'
        });
      }
    });
  });
});
