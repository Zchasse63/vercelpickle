/// <reference types="cypress" />

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/home');

    // Find and click the login button
    cy.get('button').contains('Login').click();

    // Wait for login modal to appear
    cy.get('[data-testid="login-modal"]').should('be.visible');

    // Fill in login form
    cy.get('[data-testid="login-email"]').type(email);
    cy.get('[data-testid="login-password"]').type(password);
    cy.get('[data-testid="login-submit"]').click();

    // Wait for login to complete
    cy.wait(1000);

    // Verify successful login by checking for user menu
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });
});

// Custom command for adding a product to cart
Cypress.Commands.add('addToCart', (productId: string) => {
  cy.visit(`/marketplace/products/${productId}`);
  cy.getByTestId('add-to-cart-button').click();
  cy.getByTestId('cart-count').should('be.visible');
});

// Custom command for completing checkout
Cypress.Commands.add('completeCheckout', () => {
  // Open cart
  cy.getByTestId('cart-button').click();

  // Go to checkout
  cy.getByTestId('checkout-button').click();

  // Fill shipping information (if not pre-filled)
  cy.getByTestId('shipping-address').should('be.visible');

  // Continue to payment
  cy.getByTestId('continue-to-payment').click();

  // Fill payment information
  cy.getByTestId('payment-form').should('be.visible');
  cy.getByTestId('card-number').type('4242424242424242');
  cy.getByTestId('card-expiry').type('12/25');
  cy.getByTestId('card-cvc').type('123');

  // Complete order
  cy.getByTestId('place-order-button').click();

  // Verify order confirmation
  cy.url().should('include', '/order-confirmation');
  cy.getByTestId('order-confirmation').should('be.visible');
});

// Custom command for filtering products
Cypress.Commands.add('filterProducts', (filterType: string, filterValue: string) => {
  cy.visit('/marketplace');

  // Open filter
  cy.getByTestId(`${filterType}-filter`).click();

  // Select filter value
  if (filterType === 'category') {
    cy.getByTestId(`category-option-${filterValue.toLowerCase().replace(/\s+/g, '-')}`).click();
  } else if (filterType === 'price') {
    const [min, max] = filterValue.split('-');
    cy.getByTestId('min-price-input').clear().type(min);
    cy.getByTestId('max-price-input').clear().type(max);
  }

  // Apply filter
  cy.getByTestId('apply-filters-button').click();
});

// Custom command to add a product to cart
Cypress.Commands.add('addToCart', (productId: string) => {
  cy.visit(`/marketplace/products/${productId}`);
  cy.contains('Add to Cart').click();
  cy.getByTestId('cart-count').should('be.visible');
  // Verify toast notification
  cy.contains('Product added to cart').should('be.visible');
});

// Custom command to checkout
Cypress.Commands.add('checkout', () => {
  cy.getByTestId('cart-button').click();
  cy.contains('Checkout').click();
  // Verify we're on the checkout page
  cy.url().should('include', '/checkout');
});

// Custom command to filter products
Cypress.Commands.add('filterProducts', (filterType: string, filterValue: string) => {
  cy.visit('/marketplace');
  cy.getByTestId(`${filterType}-filter`).click();
  cy.getByTestId(`${filterType}-${filterValue}`).click();
  // Verify filter is applied
  cy.getByTestId('active-filters').should('contain', filterValue);
});

// Custom command to search products
Cypress.Commands.add('searchProducts', (searchTerm: string) => {
  cy.visit('/marketplace');
  cy.getByTestId('search-input').type(searchTerm);
  cy.getByTestId('search-button').click();
  // Verify search results
  cy.getByTestId('search-results').should('be.visible');
});

// Custom command to navigate to product details
Cypress.Commands.add('viewProductDetails', (productId: string) => {
  cy.visit(`/marketplace/products/${productId}`);
  // Verify product details page
  cy.getByTestId('product-detail').should('be.visible');
});

// Custom command to add product to comparison
Cypress.Commands.add('addToComparison', (productId: string) => {
  cy.visit(`/marketplace/products/${productId}`);
  cy.getByTestId('compare-button').click();
  // Verify product added to comparison
  cy.contains('Product added to comparison').should('be.visible');
});

// Custom command for creating a test product (for seller)
Cypress.Commands.add('createTestProduct', (productData: {
  name: string;
  description: string;
  price: string;
  unit: string;
  category: string;
  image?: string;
  inventory: string;
  specifications?: Array<{ key: string; value: string }>;
}) => {
  cy.visit('/seller/products');
  cy.contains('Add Product').click();

  cy.getByTestId('product-name').type(productData.name);
  cy.getByTestId('product-description').type(productData.description);
  cy.getByTestId('product-price').type(productData.price);
  cy.getByTestId('product-unit').select(productData.unit);
  cy.getByTestId('product-category').select(productData.category);

  if (productData.image) {
    cy.getByTestId('product-image-upload').attachFile(productData.image);
  }

  cy.getByTestId('product-inventory').type(productData.inventory);

  if (productData.specifications) {
    productData.specifications.forEach((spec, index) => {
      if (index > 0) {
        cy.getByTestId('add-specification').click();
      }
      cy.getByTestId(`specification-key-${index}`).type(spec.key);
      cy.getByTestId(`specification-value-${index}`).type(spec.value);
    });
  }

  cy.getByTestId('save-product').click();
  cy.contains('Product created successfully').should('be.visible');
});

// Custom command for filtering products
Cypress.Commands.add('filterProducts', (filters: {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}) => {
  cy.visit('/marketplace');

  if (filters.category) {
    cy.getByTestId('category-filter').select(filters.category);
  }

  if (filters.minPrice) {
    cy.getByTestId('min-price').type(filters.minPrice);
  }

  if (filters.maxPrice) {
    cy.getByTestId('max-price').type(filters.maxPrice);
  }

  if (filters.search) {
    cy.getByTestId('search-input').type(filters.search);
  }

  cy.getByTestId('apply-filter').click();
});

// Custom command for completing checkout
Cypress.Commands.add('completeCheckout', (
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
) => {
  cy.getByTestId('cart-button').click();
  cy.contains('Checkout').click();

  // Fill shipping information
  cy.getByTestId('shipping-name').type(shippingInfo.name);
  cy.getByTestId('shipping-address').type(shippingInfo.address);
  cy.getByTestId('shipping-city').type(shippingInfo.city);
  cy.getByTestId('shipping-zip').type(shippingInfo.zip);
  cy.contains('Continue to Payment').click();

  // Fill payment information
  cy.getByTestId('card-number').type(paymentInfo.cardNumber);
  cy.getByTestId('card-expiry').type(paymentInfo.expiry);
  cy.getByTestId('card-cvc').type(paymentInfo.cvc);
  cy.contains('Complete Order').click();

  // Verify order confirmation
  cy.contains('Order Confirmed').should('be.visible');
});

// Custom command to select DOM element by data-testid attribute
Cypress.Commands.add('getByTestId', (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

// Custom command to set up admin test environment
Cypress.Commands.add('setupAdminTest', (options: {
  mockAnalytics?: boolean;
  mockProducts?: boolean;
  mockUsers?: boolean;
  mockOrders?: boolean;
} = {}) => {
  // Mock authentication
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        id: 'admin-123',
        name: 'Test Admin',
        email: 'admin@example.com',
        role: 'admin'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }).as('authSession');

  // Set user in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('pickle_user', JSON.stringify({
      id: 'admin-123',
      name: 'Test Admin',
      email: 'admin@example.com',
      role: 'admin',
      isAuthenticated: true
    }));
  });

  // Mock API responses as needed
  if (options.mockAnalytics) {
    cy.intercept('GET', '**/api/admin/analytics*', { fixture: 'analytics.json' }).as('getAnalytics');
    cy.intercept('GET', '**/api/analytics*', { fixture: 'analytics.json' }).as('getAnalytics');
  }

  if (options.mockProducts) {
    cy.intercept('GET', '**/api/admin/products*', { fixture: 'products.json' }).as('getProducts');
    cy.intercept('GET', '**/api/products*', { fixture: 'products.json' }).as('getProducts');
  }

  if (options.mockUsers) {
    cy.intercept('GET', '**/api/admin/users*', { fixture: 'users.json' }).as('getUsers');
    cy.intercept('GET', '**/api/users*', { fixture: 'users.json' }).as('getUsers');
  }

  if (options.mockOrders) {
    cy.intercept('GET', '**/api/admin/orders*', { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('GET', '**/api/orders*', { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('GET', '**/api/orders/*', { fixture: 'order-details.json' }).as('getOrderDetails');
  }
});

// Custom command to set up buyer test environment
Cypress.Commands.add('setupBuyerTest', (options: {
  mockProducts?: boolean;
  mockCart?: boolean;
  mockAddresses?: boolean;
  mockPaymentMethods?: boolean;
  mockOrders?: boolean;
  mockProfile?: boolean;
} = {}) => {
  // Mock authentication
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        id: 'buyer-123',
        name: 'John Doe',
        email: 'buyer@example.com',
        role: 'buyer'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }).as('authSession');

  // Set user in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('pickle_user', JSON.stringify({
      id: 'buyer-123',
      name: 'John Doe',
      email: 'buyer@example.com',
      role: 'buyer',
      isAuthenticated: true
    }));
  });

  // Mock API responses as needed
  if (options.mockProducts) {
    cy.intercept('GET', '**/api/products*', { fixture: 'products.json' }).as('getProducts');
  }

  if (options.mockCart) {
    cy.intercept('GET', '**/api/cart*', { fixture: 'cart.json' }).as('getCart');
    cy.intercept('POST', '**/api/cart/add*', { statusCode: 200, body: { success: true } }).as('addToCart');
    cy.intercept('POST', '**/api/cart/update*', { statusCode: 200, body: { success: true } }).as('updateCart');
    cy.intercept('POST', '**/api/cart/remove*', { statusCode: 200, body: { success: true } }).as('removeFromCart');
  }

  if (options.mockAddresses) {
    cy.intercept('GET', '**/api/addresses*', { fixture: 'buyer/addresses.json' }).as('getAddresses');
    cy.intercept('POST', '**/api/addresses*', { statusCode: 200, body: { success: true, id: 'new-address-id' } }).as('addAddress');
    cy.intercept('PUT', '**/api/addresses/*', { statusCode: 200, body: { success: true } }).as('updateAddress');
    cy.intercept('DELETE', '**/api/addresses/*', { statusCode: 200, body: { success: true } }).as('deleteAddress');
  }

  if (options.mockPaymentMethods) {
    cy.intercept('GET', '**/api/payment-methods*', { fixture: 'buyer/payment-methods.json' }).as('getPaymentMethods');
    cy.intercept('POST', '**/api/payment-methods*', { statusCode: 200, body: { success: true, id: 'new-payment-id' } }).as('addPaymentMethod');
    cy.intercept('DELETE', '**/api/payment-methods/*', { statusCode: 200, body: { success: true } }).as('deletePaymentMethod');
  }

  if (options.mockOrders) {
    cy.intercept('GET', '**/api/orders*', { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('GET', '**/api/orders/*', { fixture: 'order-details.json' }).as('getOrderDetails');
  }

  if (options.mockProfile) {
    cy.intercept('GET', '**/api/profile*', { fixture: 'buyer/profile.json' }).as('getProfile');
    cy.intercept('PUT', '**/api/profile*', { statusCode: 200, body: { success: true } }).as('updateProfile');
  }
});

// Custom command to set up seller test environment
Cypress.Commands.add('setupSellerTest', (options: {
  mockProducts?: boolean;
  mockOrders?: boolean;
  mockInventory?: boolean;
  mockAnalytics?: boolean;
} = {}) => {
  // Mock authentication
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        id: 'seller-123',
        name: 'Test Seller',
        email: 'seller@example.com',
        role: 'seller'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }).as('authSession');

  // Set user in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('pickle_user', JSON.stringify({
      id: 'seller-123',
      name: 'Test Seller',
      email: 'seller@example.com',
      role: 'seller',
      isAuthenticated: true
    }));
  });

  // Mock API responses as needed
  if (options.mockProducts) {
    cy.intercept('GET', '**/api/products*', { fixture: 'products.json' }).as('getProducts');
  }

  if (options.mockOrders) {
    cy.intercept('GET', '**/api/orders*', { fixture: 'orders.json' }).as('getOrders');
    cy.intercept('GET', '**/api/orders/*', { fixture: 'order-details.json' }).as('getOrderDetails');
  }

  if (options.mockInventory) {
    cy.intercept('GET', '**/api/inventory*', { fixture: 'inventory.json' }).as('getInventory');
  }

  if (options.mockAnalytics) {
    cy.intercept('GET', '**/api/analytics*', { fixture: 'analytics.json' }).as('getAnalytics');
  }
});

// Custom command to visit a URL with retry
Cypress.Commands.add('visitWithRetry', (url: string, options?: Partial<Cypress.VisitOptions>) => {
  cy.visit(url, options);
  // Wait for the page to load
  cy.get('body', { timeout: 10000 }).should('be.visible');
});

// Custom command to add products to cart
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

// Custom command to fill address form
Cypress.Commands.add('fillAddressForm', (address: any) => {
  cy.getByTestId('address-name-input').type(address.name);
  cy.getByTestId('address-street-input').type(address.street);
  cy.getByTestId('address-city-input').type(address.city);
  cy.getByTestId('address-state-input').type(address.state);
  cy.getByTestId('address-zip-input').type(address.zip);
  cy.getByTestId('address-country-input').type(address.country);

  if (address.phone) {
    cy.getByTestId('address-phone-input').type(address.phone);
  }
});

// Custom command to fill payment form
Cypress.Commands.add('fillPaymentForm', (payment: any) => {
  cy.getByTestId('card-number-input').type(payment.cardNumber);
  cy.getByTestId('card-expiry-input').type(payment.cardExpiry);
  cy.getByTestId('card-cvc-input').type(payment.cardCvc);
  cy.getByTestId('card-name-input').type(payment.cardName);
});

// Extend Cypress types
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>;
      addToCart(productId: string): Chainable<Element>;
      completeCheckout(): Chainable<Element>;
      filterProducts(filterType: string, filterValue: string): Chainable<Element>;
      searchProducts(searchTerm: string): Chainable<Element>;
      viewProductDetails(productId: string): Chainable<Element>;
      addToComparison(productId: string): Chainable<Element>;
      createTestProduct(productData: {
        name: string;
        description: string;
        price: string;
        unit: string;
        category: string;
        image?: string;
        inventory: string;
        specifications?: Array<{ key: string; value: string }>;
      }): Chainable<Element>;
      getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery<HTMLElement>>;
      setupAdminTest(options?: {
        mockAnalytics?: boolean;
        mockProducts?: boolean;
        mockUsers?: boolean;
        mockOrders?: boolean;
      }): Chainable<Element>;
      setupBuyerTest(options?: {
        mockProducts?: boolean;
        mockCart?: boolean;
        mockAddresses?: boolean;
        mockPaymentMethods?: boolean;
        mockOrders?: boolean;
        mockProfile?: boolean;
      }): Chainable<Element>;
      setupSellerTest(options?: {
        mockProducts?: boolean;
        mockOrders?: boolean;
        mockInventory?: boolean;
        mockAnalytics?: boolean;
      }): Chainable<Element>;
      visitWithRetry(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<Element>;
      addProductsToCart(count: number): Chainable<void>;
      fillAddressForm(address: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string;
      }): Chainable<void>;
      fillPaymentForm(payment: {
        cardNumber: string;
        cardExpiry: string;
        cardCvc: string;
        cardName: string;
      }): Chainable<void>;
    }
  }
}
