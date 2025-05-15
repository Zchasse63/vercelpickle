/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @example cy.login('user@example.com', 'password')
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Custom command to add a product to cart
     * @example cy.addToCart('PROD-001')
     */
    addToCart(productId: string): Chainable<void>;

    /**
     * Custom command to proceed to checkout
     * @example cy.checkout()
     */
    checkout(): Chainable<void>;

    /**
     * Custom command to create a test product (for seller)
     * @example cy.createTestProduct({ name: 'Test Product', ... })
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
    }): Chainable<void>;

    /**
     * Custom command to filter products
     * @example cy.filterProducts({ category: 'Fresh Produce', minPrice: '10', maxPrice: '50' })
     */
    filterProducts(filters: {
      category?: string;
      minPrice?: string;
      maxPrice?: string;
      search?: string;
    }): Chainable<void>;

    /**
     * Custom command to complete checkout
     * @example cy.completeCheckout({ name: 'John Doe', ... }, { cardNumber: '4242...', ... })
     */
    completeCheckout(
      shippingInfo: {
        name: string;
        address: string;
        city: string;
        zip: string;
      },
      paymentInfo: {
        cardNumber: string;
        expiry: string;
        cvc: string;
      }
    ): Chainable<void>;

    /**
     * Custom command to select DOM element by data-testid attribute
     * @example cy.getByTestId('greeting')
     */
    getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>;
  }
}
