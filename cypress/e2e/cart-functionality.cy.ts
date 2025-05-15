// Cart Functionality Tests
describe('Cart Functionality - Guest User', () => {
  beforeEach(() => {
    cy.visit('/marketplace');
    // Wait for the page to load
    cy.getByTestId('marketplace-layout').should('be.visible');
    cy.getByTestId('product-grid').should('be.visible');
  });

  it('should add product to cart from product listing', () => {
    // Find the first product card
    cy.getByTestId('product-card').first().within(() => {
      // Get product name for later verification
      cy.getByTestId('product-name').invoke('text').as('productName');
      
      // Click add to cart button
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Verify cart count updated
    cy.getByTestId('cart-count').should('be.visible');
    cy.getByTestId('cart-count').should('not.contain', '0');
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Verify cart sidebar opened
    cy.getByTestId('cart-sidebar').should('be.visible');
    
    // Verify product is in cart
    cy.get('@productName').then(productName => {
      cy.getByTestId('cart-items').should('contain', productName);
    });
  });

  it('should add product to cart from product detail page', () => {
    // Click on the first product to go to detail page
    cy.getByTestId('product-card').first().click();
    
    // Wait for product detail page to load
    cy.getByTestId('product-details').should('be.visible');
    
    // Get product name for later verification
    cy.getByTestId('product-title').invoke('text').as('productName');
    
    // Add to cart
    cy.getByTestId('add-to-cart-button').click();
    
    // Verify cart count updated
    cy.getByTestId('cart-count').should('be.visible');
    cy.getByTestId('cart-count').should('not.contain', '0');
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Verify cart sidebar opened
    cy.getByTestId('cart-sidebar').should('be.visible');
    
    // Verify product is in cart
    cy.get('@productName').then(productName => {
      cy.getByTestId('cart-items').should('contain', productName);
    });
  });

  it('should update product quantity in cart', () => {
    // Add a product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Verify initial quantity is 1
    cy.getByTestId('cart-item').first().within(() => {
      cy.getByTestId('item-quantity').should('contain', '1');
      
      // Increase quantity
      cy.getByTestId('increase-quantity').click();
      
      // Verify quantity updated to 2
      cy.getByTestId('item-quantity').should('contain', '2');
      
      // Get item price for subtotal verification
      cy.getByTestId('item-price').invoke('text').then(priceText => {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        
        // Calculate expected subtotal (price * 2)
        const expectedSubtotal = (price * 2).toFixed(2);
        
        // Verify subtotal updated
        cy.getByTestId('item-subtotal').invoke('text').then(subtotalText => {
          const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
          expect(subtotal.toFixed(2)).to.equal(expectedSubtotal);
        });
      });
    });
  });

  it('should remove product from cart', () => {
    // Add a product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Get initial cart item count
    cy.getByTestId('cart-item').its('length').as('initialItemCount');
    
    // Remove the item
    cy.getByTestId('cart-item').first().within(() => {
      cy.getByTestId('remove-item').click();
    });
    
    // Verify item removed
    cy.get('@initialItemCount').then(initialItemCount => {
      if (initialItemCount === 1) {
        // If there was only one item, cart should be empty
        cy.getByTestId('empty-cart').should('be.visible');
      } else {
        // If there were multiple items, count should decrease
        cy.getByTestId('cart-item').should('have.length', initialItemCount - 1);
      }
    });
  });

  it('should calculate cart total correctly', () => {
    // Add first product to cart
    cy.getByTestId('product-card').eq(0).within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Add second product to cart
    cy.getByTestId('product-card').eq(1).within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Calculate expected total from item subtotals
    let expectedTotal = 0;
    cy.getByTestId('cart-item').each($item => {
      cy.wrap($item).within(() => {
        cy.getByTestId('item-subtotal').invoke('text').then(subtotalText => {
          const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
          expectedTotal += subtotal;
        });
      });
    }).then(() => {
      // Verify cart total matches sum of subtotals
      cy.getByTestId('cart-subtotal').invoke('text').then(totalText => {
        const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
        expect(total.toFixed(2)).to.equal(expectedTotal.toFixed(2));
      });
    });
  });

  it('should redirect to login when guest user tries to checkout', () => {
    // Add a product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Click checkout button
    cy.getByTestId('checkout-button').click();
    
    // Verify redirect to login
    cy.getByTestId('login-form').should('be.visible');
    // or if using a modal:
    // cy.getByTestId('login-modal').should('be.visible');
  });
});

describe('Cart Functionality - Authenticated User', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      // Login as a buyer
      cy.login(users.buyers[0].email, users.buyers[0].password);
    });
    cy.visit('/marketplace');
  });

  it('should persist cart between sessions', () => {
    // Add a product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('product-name').invoke('text').as('productName');
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Reload the page to simulate a new session
    cy.reload();
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Verify product is still in cart
    cy.get('@productName').then(productName => {
      cy.getByTestId('cart-items').should('contain', productName);
    });
  });

  it('should proceed to checkout and complete order', () => {
    // Add a product to cart
    cy.getByTestId('product-card').first().within(() => {
      cy.getByTestId('add-to-cart-button').click();
    });
    
    // Open cart
    cy.getByTestId('cart-button').click();
    
    // Click checkout button
    cy.getByTestId('checkout-button').click();
    
    // Verify checkout page loaded
    cy.url().should('include', '/checkout');
    cy.getByTestId('checkout-form').should('be.visible');
    
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
    cy.getByTestId('order-number').should('be.visible');
  });
});
