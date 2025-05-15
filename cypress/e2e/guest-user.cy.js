// Guest User - Browse Marketplace Test
describe('Guest User - Browse Marketplace', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should display the home page with header and featured content', () => {
    cy.get('header').should('be.visible');
    cy.contains('Fresh Ingredients for Your Business').should('be.visible');
    cy.contains('Browse Products').should('be.visible');
  });

  it('should navigate to marketplace page', () => {
    cy.contains('Browse Products').click();
    cy.url().should('include', '/marketplace');
    cy.contains('All Products').should('be.visible');
  });

  it('should filter products by category', () => {
    cy.visit('/marketplace');
    cy.contains('Fresh Produce').click();
    cy.url().should('include', '/categories/fresh-produce');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should search for products', () => {
    cy.visit('/marketplace');
    cy.get('[data-testid="search-input"]').type('apple{enter}');
    cy.contains('Search results for "apple"').should('be.visible');
  });

  it('should prompt login when trying to add product to cart', () => {
    cy.visit('/marketplace/products/PROD-001');
    cy.contains('Add to Cart').click();
    cy.contains('Login').should('be.visible');
  });
});

// Guest User - Registration Test
describe('Guest User - Registration', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should open registration modal', () => {
    cy.contains('Register').click();
    cy.get('[data-testid="register-modal"]').should('be.visible');
  });

  it('should validate registration form', () => {
    cy.contains('Register').click();
    cy.get('[data-testid="register-button"]').click();
    cy.contains('Email is required').should('be.visible');
  });

  it('should register as a buyer', () => {
    const email = `test-buyer-${Date.now()}@example.com`;
    cy.contains('Register').click();
    cy.get('[data-testid="register-email"]').type(email);
    cy.get('[data-testid="register-password"]').type('Password123!');
    cy.get('[data-testid="register-name"]').type('Test Buyer');
    cy.get('[data-testid="register-role-buyer"]').check();
    cy.get('[data-testid="register-button"]').click();
    cy.url().should('include', '/buyer');
  });
});
