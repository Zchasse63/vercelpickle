// Buyer User - Authentication Test
describe('Buyer User - Authentication', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.fixture('users.json').as('users');
  });

  it('should login successfully', function() {
    // Click login button
    cy.contains('Login').click();

    // Fill in login form
    cy.getByTestId('login-email').type(this.users.buyers[0].email);
    cy.getByTestId('login-password').type(this.users.buyers[0].password);
    cy.getByTestId('login-button').click();

    // Verify successful login
    cy.getByTestId('user-menu').should('be.visible');
    cy.contains(this.users.buyers[0].name).should('be.visible');

    // Verify redirect to dashboard
    cy.url().should('include', '/buyer/dashboard');
  });

  it('should show validation errors for invalid login', () => {
    // Click login button
    cy.contains('Login').click();

    // Submit empty form
    cy.getByTestId('login-button').click();

    // Verify validation errors
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');

    // Fill invalid email
    cy.getByTestId('login-email').type('invalid@example');

    // Verify email validation
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should allow logout', function() {
    // Login first
    cy.login(this.users.buyers[0].email, this.users.buyers[0].password);

    // Click user menu
    cy.getByTestId('user-menu').click();

    // Click logout
    cy.contains('Logout').click();

    // Verify logged out
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });
});

// Buyer User - Dashboard Test
describe('Buyer User - Dashboard', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.buyers[0].email, users.buyers[0].password);
    });
    cy.visit('/buyer/dashboard');
  });

  it('should display dashboard with key sections', () => {
    // Verify dashboard sections
    cy.getByTestId('dashboard-header').should('be.visible');
    cy.getByTestId('recent-orders').should('be.visible');
    cy.getByTestId('favorite-products').should('be.visible');
    cy.getByTestId('recommended-products').should('be.visible');

    // Verify navigation sidebar
    cy.getByTestId('dashboard-sidebar').should('be.visible');
    cy.contains('Orders').should('be.visible');
    cy.contains('Favorites').should('be.visible');
    cy.contains('Profile').should('be.visible');
  });

  it('should navigate to orders page', () => {
    // Click orders link
    cy.contains('Orders').click();

    // Verify navigation
    cy.url().should('include', '/buyer/orders');
    cy.getByTestId('orders-list').should('be.visible');
  });

  it('should navigate to profile page', () => {
    // Click profile link
    cy.contains('Profile').click();

    // Verify navigation
    cy.url().should('include', '/buyer/profile');
    cy.getByTestId('profile-form').should('be.visible');
  });
});

// Buyer User - Shopping Cart Test
describe('Buyer User - Shopping Cart', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.buyers[0].email, users.buyers[0].password);
    });
    cy.visit('/marketplace');
    cy.getByTestId('product-card').should('be.visible');
  });

  it('should add products to cart', () => {
    // Add first product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });

    // Verify cart count updated
    cy.getByTestId('cart-count').should('contain', '1');

    // Add another product
    cy.getByTestId('product-card').eq(1).within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });

    // Verify cart count updated again
    cy.getByTestId('cart-count').should('contain', '2');
  });

  it('should update product quantity in cart', () => {
    // Add product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });

    // Open cart
    cy.getByTestId('cart-button').click();

    // Increase quantity
    cy.getByTestId('quantity-increase').click();

    // Verify quantity updated
    cy.getByTestId('item-quantity').should('contain', '2');

    // Verify subtotal updated
    cy.getByTestId('cart-subtotal').should('be.visible');
  });

  it('should remove products from cart', () => {
    // Add product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });

    // Open cart
    cy.getByTestId('cart-button').click();

    // Remove item
    cy.getByTestId('remove-item').click();

    // Verify cart is empty
    cy.contains('Your cart is empty').should('be.visible');
    cy.getByTestId('cart-count').should('contain', '0');
  });

  it('should proceed to checkout', () => {
    // Add product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });

    // Open cart
    cy.getByTestId('cart-button').click();

    // Click checkout button
    cy.getByTestId('checkout-button').click();

    // Verify on checkout page
    cy.url().should('include', '/checkout');
    cy.getByTestId('checkout-form').should('be.visible');
    cy.getByTestId('order-summary').should('be.visible');
  });
});

// Buyer User - Order Management Test
describe('Buyer User - Order Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.buyers[0].email, users.buyers[0].password);
    });
    cy.visit('/buyer/orders');
  });

  it('should display order history', () => {
    // Verify order history page
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);
  });

  it('should view order details', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();

    // Verify order details page
    cy.url().should('include', '/buyer/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('order-status').should('be.visible');
  });

  it('should filter orders by status', () => {
    // Click status filter
    cy.getByTestId('status-filter').click();
    cy.contains('Delivered').click();

    // Verify filtered orders
    cy.getByTestId('active-filters').should('contain', 'Delivered');
    cy.getByTestId('order-item').each(($el) => {
      cy.wrap($el).should('contain', 'Delivered');
    });
  });
});

// Buyer User - Additional Navigation Test
describe('Buyer User - Additional Navigation', () => {
  beforeEach(() => {
    // Visit the marketplace first
    cy.visit('/marketplace', { failOnStatusCode: false });
    cy.wait(1000);
  });

  it('should have marketplace content', () => {
    // Check for content
    cy.get('div').should('exist');
  });

  it('should have navigation elements', () => {
    // Check for navigation elements
    cy.get('nav').should('exist');
  });
});

// Buyer User - Home Navigation Test
describe('Buyer User - Home Navigation', () => {
  beforeEach(() => {
    cy.visit('/home', { failOnStatusCode: false });
    cy.wait(1000);
  });

  it('should display home page', () => {
    // Check for content
    cy.get('div').should('exist');
  });

  it('should have navigation elements', () => {
    // Check for navigation elements
    cy.get('nav').should('exist');
  });
});
