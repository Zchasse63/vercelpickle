// Seller - Product Management Test
describe('Seller - Product Management', () => {
  beforeEach(() => {
    cy.login('seller@example.com', 'password');
    cy.visit('/seller/products');
  });

  it('should display product listings', () => {
    cy.get('[data-testid="product-item"]').should('have.length.at.least', 1);
  });

  it('should add a new product', () => {
    // Use the custom command to create a test product
    cy.createTestProduct({
      name: 'Organic Carrots',
      description: 'Fresh organic carrots from local farms',
      price: '12.99',
      unit: 'kg',
      category: 'Fresh Produce',
      image: 'carrot.jpg',
      inventory: '100',
      specifications: [
        { key: 'Organic', value: 'Yes' },
        { key: 'Origin', value: 'Local' }
      ]
    });
  });

  it('should edit an existing product', () => {
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="edit-product"]').click();
    });
    
    // Update product information
    cy.get('[data-testid="product-price"]').clear().type('14.99');
    cy.get('[data-testid="save-product"]').click();
    
    // Verify product was updated
    cy.contains('Product updated successfully').should('be.visible');
  });

  it('should delete a product', () => {
    // Get the name of the first product for verification later
    let productName;
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('[data-testid="product-name"]').invoke('text').then(text => {
        productName = text;
      });
      cy.get('[data-testid="delete-product"]').click();
    });
    
    // Confirm deletion
    cy.contains('Are you sure?').should('be.visible');
    cy.contains('Yes, delete product').click();
    
    // Verify product was deleted
    cy.contains('Product deleted successfully').should('be.visible');
    cy.contains(productName).should('not.exist');
  });
});

// Seller - Order Management Test
describe('Seller - Order Management', () => {
  beforeEach(() => {
    cy.login('seller@example.com', 'password');
    cy.visit('/seller/orders');
  });

  it('should display incoming orders', () => {
    cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
  });

  it('should view order details', () => {
    cy.get('[data-testid="order-item"]').first().click();
    cy.get('[data-testid="order-details"]').should('be.visible');
    cy.contains('Order Items').should('be.visible');
    cy.contains('Shipping Information').should('be.visible');
  });

  it('should process an order', () => {
    // Find a new order
    cy.get('[data-testid="order-item"]').contains('New').parent().click();
    
    // Accept the order
    cy.contains('Accept Order').click();
    cy.contains('Order Accepted').should('be.visible');
    
    // Process the order
    cy.contains('Process Order').click();
    
    // Enter shipping information
    cy.get('[data-testid="tracking-number"]').type('TRK123456789');
    cy.get('[data-testid="shipping-carrier"]').select('FedEx');
    cy.get('[data-testid="estimated-delivery"]').type('2025-05-20');
    cy.contains('Mark as Shipped').click();
    
    // Verify order status changed
    cy.contains('Order Shipped').should('be.visible');
  });
});

// Seller - Inventory Management Test
describe('Seller - Inventory Management', () => {
  beforeEach(() => {
    cy.login('seller@example.com', 'password');
    cy.visit('/seller/inventory');
  });

  it('should display inventory levels', () => {
    cy.get('[data-testid="inventory-item"]').should('have.length.at.least', 1);
  });

  it('should update inventory quantity', () => {
    cy.get('[data-testid="inventory-item"]').first().within(() => {
      cy.get('[data-testid="edit-inventory"]').click();
    });
    
    // Update inventory quantity
    cy.get('[data-testid="inventory-quantity"]').clear().type('50');
    cy.contains('Save Changes').click();
    
    // Verify inventory was updated
    cy.contains('Inventory updated successfully').should('be.visible');
  });

  it('should set low inventory alert', () => {
    cy.get('[data-testid="inventory-item"]').first().within(() => {
      cy.get('[data-testid="edit-inventory"]').click();
    });
    
    // Set low inventory alert
    cy.get('[data-testid="low-inventory-threshold"]').clear().type('10');
    cy.contains('Save Changes').click();
    
    // Verify alert was set
    cy.contains('Inventory updated successfully').should('be.visible');
  });
});
