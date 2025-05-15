// Buyer - Shopping and Checkout Test
describe('Buyer - Shopping and Checkout', () => {
  beforeEach(() => {
    // Custom command to login as buyer
    cy.login('buyer@example.com', 'password');
    cy.visit('/marketplace');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should update cart quantities', () => {
    // Add product to cart first
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    
    // Open cart and update quantity
    cy.get('[data-testid="cart-button"]').click();
    cy.get('[data-testid="quantity-input"]').clear().type('2');
    cy.get('[data-testid="update-quantity"]').click();
    cy.get('[data-testid="item-total"]').should('contain', '$49.98'); // Assuming $24.99 per item
  });

  it('should complete checkout process', () => {
    // Add product to cart first
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Add to Cart').click();
    });
    
    // Use the custom command to complete checkout
    cy.completeCheckout(
      {
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        zip: '10001'
      },
      {
        cardNumber: '4242424242424242',
        expiry: '1225',
        cvc: '123'
      }
    );
  });
});

// Buyer - Order Management Test
describe('Buyer - Order Management', () => {
  beforeEach(() => {
    cy.login('buyer@example.com', 'password');
    cy.visit('/buyer/orders');
  });

  it('should display order history', () => {
    cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="order-details"]').should('be.visible');
    cy.contains('Order Items').should('be.visible');
    cy.contains('Order Timeline').should('be.visible');
  });

  it('should cancel an order', () => {
    // Find an order that can be cancelled
    cy.get('[data-testid="order-item"]').contains('Processing').parent().click();
    cy.contains('Cancel Order').click();
    cy.contains('Are you sure?').should('be.visible');
    cy.contains('Yes, cancel order').click();
    cy.contains('Order Cancelled').should('be.visible');
  });
});

// Buyer - Account Management Test
describe('Buyer - Account Management', () => {
  beforeEach(() => {
    cy.login('buyer@example.com', 'password');
    cy.visit('/buyer/account');
  });

  it('should display account information', () => {
    cy.contains('Account Information').should('be.visible');
    cy.get('[data-testid="user-name"]').should('contain', 'John Doe');
    cy.get('[data-testid="user-email"]').should('contain', 'buyer@example.com');
  });

  it('should update profile information', () => {
    cy.contains('Edit Profile').click();
    cy.get('[data-testid="profile-name"]').clear().type('John Updated');
    cy.get('[data-testid="profile-phone"]').clear().type('555-123-4567');
    cy.contains('Save Changes').click();
    cy.contains('Profile updated successfully').should('be.visible');
    cy.get('[data-testid="user-name"]').should('contain', 'John Updated');
  });

  it('should add a new payment method', () => {
    cy.contains('Payment Methods').click();
    cy.contains('Add Payment Method').click();
    cy.get('[data-testid="card-number"]').type('4242424242424242');
    cy.get('[data-testid="card-expiry"]').type('1225');
    cy.get('[data-testid="card-cvc"]').type('123');
    cy.get('[data-testid="card-name"]').type('John Doe');
    cy.contains('Add Card').click();
    cy.contains('Payment method added successfully').should('be.visible');
  });
});
