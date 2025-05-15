// Admin - User Management Test
describe('Admin - User Management', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/users');
  });

  it('should display user list', () => {
    cy.get('[data-testid="user-item"]').should('have.length.at.least', 1);
  });

  it('should filter users by role', () => {
    cy.get('[data-testid="role-filter"]').select('Seller');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="user-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Seller');
    });
  });

  it('should view user details', () => {
    cy.get('[data-testid="user-item"]').first().click();
    cy.get('[data-testid="user-details"]').should('be.visible');
    cy.contains('Account Information').should('be.visible');
    cy.contains('Activity History').should('be.visible');
  });

  it('should suspend and reactivate a user', () => {
    cy.get('[data-testid="user-item"]').first().click();
    cy.contains('Suspend User').click();
    cy.contains('Are you sure?').should('be.visible');
    cy.contains('Yes, suspend user').click();
    cy.contains('User suspended successfully').should('be.visible');
    
    // Reactivate the user
    cy.contains('Activate User').click();
    cy.contains('User activated successfully').should('be.visible');
  });
});

// Admin - Product Moderation Test
describe('Admin - Product Moderation', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/products');
  });

  it('should display product list', () => {
    cy.get('[data-testid="product-item"]').should('have.length.at.least', 1);
  });

  it('should filter products by category', () => {
    cy.get('[data-testid="category-filter"]').select('Fresh Produce');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="product-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Fresh Produce');
    });
  });

  it('should approve a pending product', () => {
    // Find a pending product
    cy.get('[data-testid="status-filter"]').select('Pending');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="product-item"]').first().click();
    
    // Approve the product
    cy.contains('Approve Product').click();
    cy.contains('Product approved successfully').should('be.visible');
  });

  it('should reject a pending product', () => {
    // Find a pending product
    cy.get('[data-testid="status-filter"]').select('Pending');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="product-item"]').first().click();
    
    // Reject the product
    cy.contains('Reject Product').click();
    cy.get('[data-testid="rejection-reason"]').type('Product does not meet quality standards');
    cy.contains('Confirm Rejection').click();
    cy.contains('Product rejected successfully').should('be.visible');
  });
});

// Admin - Order Management Test
describe('Admin - Order Management', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/orders');
  });

  it('should display order list', () => {
    cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
  });

  it('should filter orders by status', () => {
    cy.get('[data-testid="status-filter"]').select('Processing');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="order-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Processing');
    });
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="order-details"]').should('be.visible');
    cy.contains('Order Items').should('be.visible');
    cy.contains('Shipping Information').should('be.visible');
    cy.contains('Payment Information').should('be.visible');
  });

  it('should update order status', () => {
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="status-dropdown"]').select('Completed');
    cy.contains('Update Status').click();
    cy.contains('Order status updated successfully').should('be.visible');
  });
});

// Admin - Analytics Test
describe('Admin - Analytics', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/admin/analytics');
  });

  it('should display platform analytics', () => {
    cy.contains('Platform Overview').should('be.visible');
    cy.get('[data-testid="sales-chart"]').should('be.visible');
    cy.get('[data-testid="user-growth-chart"]').should('be.visible');
    cy.get('[data-testid="top-products"]').should('be.visible');
    cy.get('[data-testid="top-sellers"]').should('be.visible');
  });

  it('should filter analytics by date range', () => {
    cy.get('[data-testid="date-range-picker"]').click();
    cy.contains('Last 30 Days').click();
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="date-range-display"]').should('contain', 'Last 30 Days');
  });

  it('should export analytics report', () => {
    cy.contains('Export Report').click();
    cy.get('[data-testid="export-format"]').select('CSV');
    cy.get('[data-testid="export-button"]').click();
    cy.contains('Report exported successfully').should('be.visible');
  });
});
