// Visual Testing with Applitools Eyes
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

describe('Visual Testing - Marketplace', () => {
  beforeEach(() => {
    // Visit the marketplace page
    cy.visit('/marketplace');
  });

  it('should visually validate the marketplace layout', () => {
    // Open Eyes for this test using standard Applitools commands
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Marketplace Layout Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Marketplace Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });

  it('should visually validate product cards', () => {
    // Open Eyes for this test
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Cards Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Product Cards',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});

describe('Visual Testing - Product Details', () => {
  beforeEach(() => {
    // Visit a product detail page
    // Using a conditional approach to handle different environments
    cy.visit('/marketplace').then(() => {
      // Click on the first product to navigate to its details
      cy.get('[data-testid="product-card"]').first().click();
    });
  });

  it('should visually validate the product details page', () => {
    // Open Eyes for this test
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Product Details Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Product Details Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});

describe('Visual Testing - Admin Dashboard', () => {
  beforeEach(() => {
    // For simplicity, just visit the admin page without login for now
    // We'll add proper login later once we confirm Applitools is working
    cy.visit('/admin');
  });

  it('should visually validate the admin dashboard layout', () => {
    // Open Eyes for this test
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Dashboard Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Admin Dashboard Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});

describe('Visual Testing - Cart', () => {
  beforeEach(() => {
    // Visit the marketplace page
    cy.visit('/marketplace');

    // Add a product to the cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Open the cart
    cy.get('[data-testid="cart-button"]').click();
  });

  it('should visually validate the cart', () => {
    // Open Eyes for this test
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Cart Test',
    });

    // Take a screenshot of the cart
    cy.eyesCheckWindow({
      tag: 'Cart Sheet',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});
