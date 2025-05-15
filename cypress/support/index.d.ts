/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('user@example.com', 'password')
     */
    login(email: string, password: string): Chainable<void>

    /**
     * Custom command to add a product to cart
     * @example cy.addToCart('product-id')
     */
    addToCart(productId: string): Chainable<void>

    /**
     * Custom command to checkout
     * @example cy.checkout()
     */
    checkout(): Chainable<void>

    /**
     * Custom command to filter products
     * @example cy.filterProducts('category', 'produce')
     */
    filterProducts(filterType: string, filterValue: string): Chainable<void>

    /**
     * Custom command to search products
     * @example cy.searchProducts('apple')
     */
    searchProducts(searchTerm: string): Chainable<void>

    /**
     * Custom command to complete checkout process
     * @example cy.completeCheckout()
     */
    completeCheckout(): Chainable<void>

    /**
     * Custom command to create a test product (for seller)
     * @example cy.createTestProduct({ name: 'Test Product', price: '10.99' })
     */
    createTestProduct(productData: {
      name: string;
      description: string;
      price: string;
      unit: string;
      category: string;
      image?: string;
      inventory: string;
    }): Chainable<void>

    /**
     * Custom command to get element by data-testid
     * @example cy.getByTestId('product-card')
     */
    getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>

    /**
     * Custom command to navigate to product details
     * @example cy.viewProductDetails('product-id')
     */
    viewProductDetails(productId: string): Chainable<void>

    /**
     * Custom command to add product to comparison
     * @example cy.addToComparison('product-id')
     */
    addToComparison(productId: string): Chainable<void>

    /**
     * Custom command to get element by test id
     * @example cy.getByTestId('product-card')
     */
    getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>

    /**
     * Custom command to create a test product (for seller)
     * @example cy.createTestProduct({ name: 'Test Product', price: '10.99', ... })
     */
    createTestProduct(productData: {
      name: string;
      description: string;
      price: string;
      unit: string;
      category: string;
      image?: string;
      inventory: string;
      specifications?: Array<{ key: string; value: string }>;
    }): Chainable<void>

    /**
     * Custom command to set up admin test environment
     * @example cy.setupAdminTest({ mockAnalytics: true })
     */
    setupAdminTest(options?: {
      mockAnalytics?: boolean;
      mockProducts?: boolean;
      mockUsers?: boolean;
      mockOrders?: boolean;
    }): Chainable<void>

    /**
     * Custom command to visit a URL with retry
     * @example cy.visitWithRetry('/admin')
     */
    visitWithRetry(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<void>
  }
}
