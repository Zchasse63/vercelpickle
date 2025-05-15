// Admin User - Authentication Test
describe('Admin User - Authentication', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.fixture('users.json').as('users');
  });

  it('should login successfully as admin', function() {
    // Click login button
    cy.getByTestId('login-button').click();

    // Fill in login form
    cy.getByTestId('login-email').type(this.users.admins[0].email);
    cy.getByTestId('login-password').type(this.users.admins[0].password);
    cy.getByTestId('login-button').click();

    // Verify successful login
    cy.getByTestId('user-menu').should('be.visible');
    cy.contains(this.users.admins[0].name).should('be.visible');

    // Verify redirect to admin dashboard
    cy.url().should('include', '/admin/dashboard');
    cy.getByTestId('admin-dashboard').should('be.visible');
  });

  it('should show admin-specific navigation', function() {
    // Login as admin
    cy.login(this.users.admins[0].email, this.users.admins[0].password);

    // Verify admin navigation
    cy.getByTestId('admin-sidebar').should('be.visible');
    cy.contains('Users').should('be.visible');
    cy.contains('Products').should('be.visible');
    cy.contains('Orders').should('be.visible');
    cy.contains('Analytics').should('be.visible');
    cy.contains('Settings').should('be.visible');
  });

  it('should allow logout', function() {
    // Login first
    cy.login(this.users.admins[0].email, this.users.admins[0].password);

    // Click user menu
    cy.getByTestId('user-menu').click();

    // Click logout
    cy.contains('Logout').click();

    // Verify logged out
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });
});

// Admin User - Dashboard Test
describe('Admin User - Dashboard', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/dashboard');
  });

  it('should display dashboard with key metrics', () => {
    // Verify dashboard sections
    cy.getByTestId('admin-dashboard').should('be.visible');
    cy.getByTestId('platform-metrics').should('be.visible');
    cy.getByTestId('recent-orders').should('be.visible');
    cy.getByTestId('user-activity').should('be.visible');

    // Verify metrics
    cy.getByTestId('total-users').should('be.visible');
    cy.getByTestId('total-products').should('be.visible');
    cy.getByTestId('total-orders').should('be.visible');
    cy.getByTestId('total-revenue').should('be.visible');
  });

  it('should navigate to user management', () => {
    // Click users link
    cy.contains('Users').click();

    // Verify navigation
    cy.url().should('include', '/admin/users');
    cy.getByTestId('users-list').should('be.visible');
  });

  it('should navigate to product management', () => {
    // Click products link
    cy.contains('Products').click();

    // Verify navigation
    cy.url().should('include', '/admin/products');
    cy.getByTestId('products-list').should('be.visible');
  });

  it('should navigate to order management', () => {
    // Click orders link
    cy.contains('Orders').click();

    // Verify navigation
    cy.url().should('include', '/admin/orders');
    cy.getByTestId('orders-list').should('be.visible');
  });

  it('should navigate to analytics', () => {
    // Click analytics link
    cy.contains('Analytics').click();

    // Verify navigation
    cy.url().should('include', '/admin/analytics');
    cy.getByTestId('analytics-dashboard').should('be.visible');
  });
});

// Admin User - User Management Test
describe('Admin User - User Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/users');
  });

  it('should display user list with all user types', () => {
    // Verify user list
    cy.getByTestId('users-list').should('be.visible');
    cy.getByTestId('user-item').should('have.length.at.least', 3);

    // Verify user types
    cy.contains('Admin').should('be.visible');
    cy.contains('Seller').should('be.visible');
    cy.contains('Buyer').should('be.visible');
  });

  it('should filter users by role', () => {
    // Filter by seller role
    cy.getByTestId('role-filter').click();
    cy.contains('Seller').click();

    // Verify filtered users
    cy.getByTestId('active-filters').should('contain', 'Seller');
    cy.getByTestId('user-item').each(($el) => {
      cy.wrap($el).should('contain', 'Seller');
    });

    // Clear filter
    cy.getByTestId('clear-filters').click();

    // Filter by buyer role
    cy.getByTestId('role-filter').click();
    cy.contains('Buyer').click();

    // Verify filtered users
    cy.getByTestId('active-filters').should('contain', 'Buyer');
    cy.getByTestId('user-item').each(($el) => {
      cy.wrap($el).should('contain', 'Buyer');
    });
  });

  it('should search for users', () => {
    // Search for a user
    cy.getByTestId('search-input').type('Restaurant');
    cy.getByTestId('search-button').click();

    // Verify search results
    cy.getByTestId('search-results').should('contain', 'Restaurant');
    cy.getByTestId('user-item').should('have.length.at.least', 1);
  });

  it('should view user details', () => {
    // Click on first user
    cy.getByTestId('user-item').first().click();

    // Verify user details page
    cy.url().should('include', '/admin/users/');
    cy.getByTestId('user-details').should('be.visible');
    cy.getByTestId('user-profile').should('be.visible');
    cy.getByTestId('user-activity').should('be.visible');
    cy.getByTestId('user-orders').should('be.visible');
  });

  it('should edit user details', () => {
    // Click on first user
    cy.getByTestId('user-item').first().click();

    // Click edit button
    cy.getByTestId('edit-user').click();

    // Update user information
    cy.getByTestId('user-name').clear().type('Updated User Name');

    // Save changes
    cy.getByTestId('save-user').click();

    // Verify success message
    cy.contains('User updated successfully').should('be.visible');

    // Verify changes persisted
    cy.getByTestId('user-name').should('have.value', 'Updated User Name');
  });
});

// Admin User - Product Management Test
describe('Admin User - Product Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/products');
  });

  it('should display product list with categories', () => {
    // Verify product list
    cy.getByTestId('products-list').should('be.visible');
    cy.getByTestId('product-item').should('have.length.at.least', 3);

    // Verify product categories
    cy.contains('Fresh Produce').should('be.visible');
    cy.contains('Meat & Seafood').should('be.visible');
  });

  it('should filter products by category', () => {
    // Filter by category
    cy.getByTestId('category-filter').click();
    cy.contains('Fresh Produce').click();

    // Verify filtered products
    cy.getByTestId('active-filters').should('contain', 'Fresh Produce');
    cy.getByTestId('product-item').should('exist');

    // Clear filter
    cy.getByTestId('clear-filters').click();

    // Filter by another category
    cy.getByTestId('category-filter').click();
    cy.contains('Meat & Seafood').click();

    // Verify filtered products
    cy.getByTestId('active-filters').should('contain', 'Meat & Seafood');
    cy.getByTestId('product-item').should('exist');
  });

  it('should search for products', () => {
    // Search for a product
    cy.getByTestId('search-input').type('apple');
    cy.getByTestId('search-button').click();

    // Verify search results
    cy.getByTestId('search-results').should('contain', 'apple');
    cy.getByTestId('product-item').should('exist');
  });

  it('should view product details', () => {
    // Click on first product
    cy.getByTestId('product-item').first().click();

    // Verify product details page
    cy.url().should('include', '/admin/products/');
    cy.getByTestId('product-details').should('be.visible');
    cy.getByTestId('product-specifications').should('be.visible');
    cy.getByTestId('product-sales').should('be.visible');
  });

  it('should edit product details', () => {
    // Click on first product
    cy.getByTestId('product-item').first().click();

    // Click edit button
    cy.getByTestId('edit-product').click();

    // Update product information
    cy.getByTestId('product-name').clear().type('Updated Product Name');
    cy.getByTestId('product-price').clear().type('29.99');

    // Save changes
    cy.getByTestId('save-product').click();

    // Verify success message
    cy.contains('Product updated successfully').should('be.visible');

    // Verify changes persisted
    cy.getByTestId('product-name').should('have.value', 'Updated Product Name');
    cy.getByTestId('product-price').should('have.value', '29.99');
  });

  it('should add a new product', () => {
    // Click add product button
    cy.getByTestId('add-product-button').click();

    // Fill product form
    cy.getByTestId('product-name').type('New Test Product');
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
    cy.getByTestId('save-product').click();

    // Verify success message
    cy.contains('Product created successfully').should('be.visible');

    // Verify redirect to products list
    cy.url().should('include', '/admin/products');
  });
});

// Admin User - Order Management Test
describe('Admin User - Order Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/orders');
  });

  it('should display order list with status indicators', () => {
    // Verify order list
    cy.getByTestId('orders-list').should('be.visible');
    cy.getByTestId('order-item').should('have.length.at.least', 3);

    // Verify order details
    cy.getByTestId('order-item').first().within(() => {
      cy.getByTestId('order-id').should('be.visible');
      cy.getByTestId('order-date').should('be.visible');
      cy.getByTestId('order-total').should('be.visible');
      cy.getByTestId('order-status').should('be.visible');
      cy.getByTestId('buyer-name').should('be.visible');
    });
  });

  it('should filter orders by status', () => {
    // Filter by status
    cy.getByTestId('status-filter').click();
    cy.contains('Processing').click();

    // Verify filtered orders
    cy.getByTestId('active-filters').should('contain', 'Processing');
    cy.getByTestId('order-item').each(($el) => {
      cy.wrap($el).should('contain', 'Processing');
    });

    // Clear filter
    cy.getByTestId('clear-filters').click();

    // Filter by another status
    cy.getByTestId('status-filter').click();
    cy.contains('Delivered').click();

    // Verify filtered orders
    cy.getByTestId('active-filters').should('contain', 'Delivered');
    cy.getByTestId('order-item').each(($el) => {
      cy.wrap($el).should('contain', 'Delivered');
    });
  });

  it('should search for orders by ID or buyer', () => {
    // Search for an order
    cy.getByTestId('search-input').type('ORDER-001');
    cy.getByTestId('search-button').click();

    // Verify search results
    cy.getByTestId('search-results').should('contain', 'ORDER-001');
    cy.getByTestId('order-item').should('have.length', 1);
  });

  it('should view order details', () => {
    // Click on first order
    cy.getByTestId('order-item').first().click();

    // Verify order details page
    cy.url().should('include', '/admin/orders/');
    cy.getByTestId('order-details').should('be.visible');
    cy.getByTestId('order-items').should('be.visible');
    cy.getByTestId('buyer-info').should('be.visible');
    cy.getByTestId('shipping-info').should('be.visible');
    cy.getByTestId('payment-info').should('be.visible');
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

  it('should export orders', () => {
    // Click export button
    cy.getByTestId('export-button').click();

    // Select export format
    cy.contains('CSV').click();

    // Verify export started
    cy.contains('Export started').should('be.visible');
  });
});

// Admin User - Analytics Test
describe('Admin User - Analytics', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/analytics');
  });

  it('should display analytics dashboard with key metrics', () => {
    // Verify analytics sections
    cy.getByTestId('analytics-dashboard').should('be.visible');
    cy.getByTestId('sales-chart').should('be.visible');
    cy.getByTestId('revenue-metrics').should('be.visible');
    cy.getByTestId('user-growth').should('be.visible');
    cy.getByTestId('top-products').should('be.visible');
    cy.getByTestId('top-sellers').should('be.visible');

    // Verify metrics
    cy.getByTestId('total-revenue').should('be.visible');
    cy.getByTestId('average-order-value').should('be.visible');
    cy.getByTestId('conversion-rate').should('be.visible');
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

  it('should display user analytics', () => {
    // Navigate to user analytics tab
    cy.getByTestId('user-analytics-tab').click();

    // Verify user analytics
    cy.getByTestId('user-analytics').should('be.visible');
    cy.getByTestId('user-growth-chart').should('be.visible');
    cy.getByTestId('user-demographics').should('be.visible');
    cy.getByTestId('user-activity-metrics').should('be.visible');
  });

  it('should display product analytics', () => {
    // Navigate to product analytics tab
    cy.getByTestId('product-analytics-tab').click();

    // Verify product analytics
    cy.getByTestId('product-analytics').should('be.visible');
    cy.getByTestId('product-sales-chart').should('be.visible');
    cy.getByTestId('category-distribution').should('be.visible');
    cy.getByTestId('top-selling-products').should('be.visible');
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

// Admin User - Settings Management Test
describe('Admin User - Settings Management', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      cy.login(users.admins[0].email, users.admins[0].password);
    });
    cy.visit('/admin/settings');
  });

  it('should display platform settings', () => {
    // Verify settings sections
    cy.getByTestId('settings-dashboard').should('be.visible');
    cy.getByTestId('general-settings').should('be.visible');
    cy.getByTestId('payment-settings').should('be.visible');
    cy.getByTestId('notification-settings').should('be.visible');
    cy.getByTestId('security-settings').should('be.visible');
  });

  it('should update general settings', () => {
    // Navigate to general settings tab
    cy.getByTestId('general-settings-tab').click();

    // Update platform name
    cy.getByTestId('platform-name').clear().type('Pickle B2B Marketplace');

    // Update contact email
    cy.getByTestId('contact-email').clear().type('support@picklemarket.com');

    // Save changes
    cy.getByTestId('save-general-settings').click();

    // Verify success message
    cy.contains('Settings updated successfully').should('be.visible');

    // Verify changes persisted
    cy.reload();
    cy.getByTestId('platform-name').should('have.value', 'Pickle B2B Marketplace');
    cy.getByTestId('contact-email').should('have.value', 'support@picklemarket.com');
  });

  it('should update payment settings', () => {
    // Navigate to payment settings tab
    cy.getByTestId('payment-settings-tab').click();

    // Update payment gateway
    cy.getByTestId('payment-gateway').select('Stripe');

    // Update currency
    cy.getByTestId('currency').select('USD');

    // Save changes
    cy.getByTestId('save-payment-settings').click();

    // Verify success message
    cy.contains('Payment settings updated successfully').should('be.visible');
  });

  it('should update notification settings', () => {
    // Navigate to notification settings tab
    cy.getByTestId('notification-settings-tab').click();

    // Toggle email notifications
    cy.getByTestId('email-notifications-toggle').click();

    // Toggle SMS notifications
    cy.getByTestId('sms-notifications-toggle').click();

    // Save changes
    cy.getByTestId('save-notification-settings').click();

    // Verify success message
    cy.contains('Notification settings updated successfully').should('be.visible');
  });

  it('should manage API keys', () => {
    // Navigate to API settings tab
    cy.getByTestId('api-settings-tab').click();

    // Generate new API key
    cy.getByTestId('generate-api-key').click();

    // Verify API key generated
    cy.getByTestId('api-key').should('be.visible');

    // Copy API key
    cy.getByTestId('copy-api-key').click();

    // Verify copy success message
    cy.contains('API key copied to clipboard').should('be.visible');
  });
});