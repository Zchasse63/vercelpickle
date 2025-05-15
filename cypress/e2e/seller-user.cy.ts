// Seller User - Authentication Test
describe('Seller User - Authentication', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.fixture('users.json').as('users');
  });

  it('should login successfully as seller', function() {
    // Click login button
    cy.contains('Login').click();

    // Fill in login form
    cy.getByTestId('login-email').type(this.users.sellers[0].email);
    cy.getByTestId('login-password').type(this.users.sellers[0].password);
    cy.getByTestId('login-button').click();

    // Verify successful login
    cy.getByTestId('user-menu').should('be.visible');
    cy.contains(this.users.sellers[0].name).should('be.visible');

    // Verify redirect to seller dashboard
    cy.url().should('include', '/seller/dashboard');
  });

  it('should show validation errors for invalid login', () => {
    // Click login button
    cy.contains('Login').click();

    // Submit empty form
    cy.getByTestId('login-button').click();

    // Verify validation errors
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should allow logout', function() {
    // Login first
    cy.login(this.users.sellers[0].email, this.users.sellers[0].password);

    // Click user menu
    cy.getByTestId('user-menu').click();

    // Click logout
    cy.contains('Logout').click();

    // Verify logged out
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });
});

// Seller User - Dashboard Test
describe('Seller User - Dashboard', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.sellers[0].email, users.sellers[0].password);
    });
    cy.visit('/seller/dashboard');
  });

  it('should display dashboard with key metrics', () => {
    // Verify dashboard sections
    cy.getByTestId('dashboard-header').should('be.visible');
    cy.getByTestId('sales-metrics').should('be.visible');
    cy.getByTestId('recent-orders').should('be.visible');
    cy.getByTestId('inventory-status').should('be.visible');

    // Verify navigation sidebar
    cy.getByTestId('dashboard-sidebar').should('be.visible');
    cy.contains('Products').should('be.visible');
    cy.contains('Orders').should('be.visible');
    cy.contains('Analytics').should('be.visible');
    cy.contains('Profile').should('be.visible');
  });

  it('should navigate to products page', () => {
    // Click products link
    cy.contains('Products').click();

    // Verify navigation
    cy.url().should('include', '/seller/products');
    cy.getByTestId('products-list').should('be.visible');
  });

  it('should navigate to orders page', () => {
    // Click orders link
    cy.contains('Orders').click();

    // Verify navigation
    cy.url().should('include', '/seller/orders');
    cy.getByTestId('orders-list').should('be.visible');
  });

  it('should navigate to analytics page', () => {
    // Click analytics link
    cy.contains('Analytics').click();

    // Verify navigation
    cy.url().should('include', '/seller/analytics');
    cy.getByTestId('analytics-dashboard').should('be.visible');
  });
});

// Seller User - Product Management Test
describe('Seller User - Product Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.sellers[0].email, users.sellers[0].password);
    });
    cy.visit('/seller/products');
  });

  it('should display product listings', () => {
    // Verify product list
    cy.getByTestId('products-list').should('be.visible');
    cy.getByTestId('product-item').should('have.length.at.least', 1);

    // Verify product details
    cy.getByTestId('product-item').first().within(() => {
      cy.getByTestId('product-name').should('be.visible');
      cy.getByTestId('product-price').should('be.visible');
      cy.getByTestId('product-inventory').should('be.visible');
      cy.getByTestId('product-status').should('be.visible');
    });
  });

  it('should navigate to add product page', () => {
    // Click add product button
    cy.getByTestId('add-product-button').click();

    // Verify navigation
    cy.url().should('include', '/seller/products/new');
    cy.getByTestId('product-form').should('be.visible');
  });

  it('should create a new product', () => {
    // Navigate to add product page
    cy.getByTestId('add-product-button').click();

    // Fill product form
    cy.getByTestId('product-name').type('Organic Test Product');
    cy.getByTestId('product-description').type('This is a test product description');
    cy.getByTestId('product-price').type('24.99');
    cy.getByTestId('product-unit').select('case');
    cy.getByTestId('product-category').select('Fresh Produce');
    cy.getByTestId('product-inventory').type('100');

    // Add specifications
    cy.getByTestId('add-specification').click();
    cy.getByTestId('specification-key').type('Organic');
    cy.getByTestId('specification-value').type('Yes');

    // Submit form
    cy.getByTestId('submit-product').click();

    // Verify success message
    cy.contains('Product created successfully').should('be.visible');

    // Verify redirect to products list
    cy.url().should('include', '/seller/products');
  });

  it('should edit an existing product', () => {
    // Click edit on first product
    cy.getByTestId('product-item').first().within(() => {
      cy.getByTestId('edit-product').click();
    });

    // Verify on edit page
    cy.url().should('include', '/seller/products/edit/');
    cy.getByTestId('product-form').should('be.visible');

    // Update product name
    cy.getByTestId('product-name').clear().type('Updated Product Name');

    // Submit form
    cy.getByTestId('submit-product').click();

    // Verify success message
    cy.contains('Product updated successfully').should('be.visible');

    // Verify product was updated
    cy.getByTestId('product-item').first().should('contain', 'Updated Product Name');
  });

  it('should delete a product', () => {
    // Get initial product count
    cy.getByTestId('product-item').then(($items) => {
      const initialCount = $items.length;

      // Click delete on first product
      cy.getByTestId('product-item').first().within(() => {
        cy.getByTestId('delete-product').click();
      });

      // Confirm deletion
      cy.getByTestId('confirm-delete').click();

      // Verify success message
      cy.contains('Product deleted successfully').should('be.visible');

      // Verify product count decreased
      cy.getByTestId('product-item').should('have.length', initialCount - 1);
    });
  });
});

// Seller User - Order Management Test
describe('Seller User - Order Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.sellers[0].email, users.sellers[0].password);
    });
    cy.visit('/seller/orders');
  });

  it('should display order listings', () => {
    // Verify order list
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 1);

    // Verify order details
    cy.getByTestId('order-item').first().within(() => {
      cy.getByTestId('order-id').should('be.visible');
      cy.getByTestId('order-date').should('be.visible');
      cy.getByTestId('order-total').should('be.visible');
      cy.getByTestId('order-status').should('be.visible');
    });
  });

  it('should view order details', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();

    // Verify order details page
    cy.url().should('include', '/seller/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('buyer-info').should('be.visible');
    cy.getByTestId('shipping-info').should('be.visible');
  });

  it('should update order status', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();

    // Update status
    cy.getByTestId('status-dropdown').click();
    cy.contains('Shipped').click();
    cy.getByTestId('update-status').click();

    // Verify success message
    cy.contains('Order status updated').should('be.visible');

    // Verify status updated
    cy.getByTestId('order-status').should('contain', 'Shipped');
  });

  it('should filter orders by status', () => {
    // Click status filter
    cy.getByTestId('status-filter').click();
    cy.contains('Processing').click();

    // Verify filtered orders
    cy.getByTestId('active-filters').should('contain', 'Processing');
    cy.getByTestId('order-item').each(($el) => {
      cy.wrap($el).should('contain', 'Processing');
    });
  });

  it('should search for orders', () => {
    // Search for an order
    cy.getByTestId('search-input').type('ORDER-001');
    cy.getByTestId('search-button').click();

    // Verify search results
    cy.getByTestId('search-results').should('be.visible');
    cy.getByTestId('order-item').should('have.length', 1);
    cy.getByTestId('order-item').should('contain', 'ORDER-001');
  });
});

// Seller User - Analytics Test
describe('Seller User - Analytics', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.sellers[0].email, users.sellers[0].password);
    });
    cy.visit('/seller/analytics');
  });

  it('should display analytics dashboard', () => {
    // Verify analytics sections
    cy.getByTestId('analytics-dashboard').should('be.visible');
    cy.getByTestId('sales-chart').should('be.visible');
    cy.getByTestId('revenue-metrics').should('be.visible');
    cy.getByTestId('top-products').should('be.visible');
    cy.getByTestId('customer-insights').should('be.visible');
  });

  it('should filter analytics by date range', () => {
    // Select date range
    cy.getByTestId('date-range-selector').click();
    cy.contains('Last 30 Days').click();

    // Verify filter applied
    cy.getByTestId('active-date-range').should('contain', 'Last 30 Days');
    cy.getByTestId('sales-chart').should('be.visible');

    // Change date range
    cy.getByTestId('date-range-selector').click();
    cy.contains('Last 90 Days').click();

    // Verify filter changed
    cy.getByTestId('active-date-range').should('contain', 'Last 90 Days');
  });

  it('should display product performance metrics', () => {
    // Navigate to product performance tab
    cy.getByTestId('product-performance-tab').click();

    // Verify product metrics
    cy.getByTestId('product-performance').should('be.visible');
    cy.getByTestId('product-sales-chart').should('be.visible');
    cy.getByTestId('product-metrics-table').should('be.visible');
  });

  it('should export analytics data', () => {
    // Click export button
    cy.getByTestId('export-button').click();

    // Select export format
    cy.contains('CSV').click();

    // Verify export started
    cy.contains('Export started').should('be.visible');
  });
});

// Seller User - Profile Management Test
describe('Seller User - Profile Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.sellers[0].email, users.sellers[0].password);
    });
    cy.visit('/seller/profile');
  });

  it('should display seller profile information', () => {
    // Verify profile sections
    cy.getByTestId('profile-form').should('be.visible');
    cy.getByTestId('business-info').should('be.visible');
    cy.getByTestId('contact-info').should('be.visible');
    cy.getByTestId('payment-info').should('be.visible');

    // Verify profile data
    cy.getByTestId('business-name').should('have.value', 'Farm Fresh Foods');
    cy.getByTestId('business-email').should('have.value', 'seller@example.com');
  });

  it('should update profile information', () => {
    // Update business description
    cy.getByTestId('business-description').clear().type('Updated business description for testing');

    // Save changes
    cy.getByTestId('save-profile').click();

    // Verify success message
    cy.contains('Profile updated successfully').should('be.visible');

    // Verify changes persisted
    cy.reload();
    cy.getByTestId('business-description').should('have.value', 'Updated business description for testing');
  });

  it('should update password', () => {
    // Navigate to security tab
    cy.getByTestId('security-tab').click();

    // Fill password form
    cy.getByTestId('current-password').type('Seller123!');
    cy.getByTestId('new-password').type('NewPassword123!');
    cy.getByTestId('confirm-password').type('NewPassword123!');

    // Submit form
    cy.getByTestId('update-password').click();

    // Verify success message
    cy.contains('Password updated successfully').should('be.visible');
  });

  it('should manage payment methods', () => {
    // Navigate to payment methods tab
    cy.getByTestId('payment-tab').click();

    // Add new payment method
    cy.getByTestId('add-payment-method').click();

    // Fill payment form
    cy.getByTestId('account-name').type('Test Bank Account');
    cy.getByTestId('account-number').type('1234567890');
    cy.getByTestId('routing-number').type('987654321');

    // Submit form
    cy.getByTestId('save-payment-method').click();

    // Verify success message
    cy.contains('Payment method added successfully').should('be.visible');

    // Verify new payment method appears in list
    cy.getByTestId('payment-method-item').should('contain', 'Test Bank Account');
  });
});
