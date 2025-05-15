# Pickle B2B Marketplace - User Flows and Test Cases

**Last Updated:** `2025-05-11`

This document outlines comprehensive user flows and test cases for all user types in the Pickle B2B Marketplace platform. It serves as a reference for development and testing.

## Platform Context
- **Project Name**: Pickle B2B Marketplace
- **Description**: A specialized B2B food marketplace platform connecting food producers and suppliers with business buyers such as restaurants, grocery stores, and catering services.
- **Key Features**: Product catalog, order management, user management, payment processing, analytics dashboard, communication system, specialized listing tools
- **Platform Type**: B2B Marketplace

## User Types

1. [Guest User (Unauthenticated)](#1-guest-user-unauthenticated)
2. [Registered Buyer](#2-registered-buyer)
3. [Registered Seller](#3-registered-seller)
4. [Admin (Platform Controller)](#4-admin-platform-controller)

## 1. Guest User (Unauthenticated)

### Major Goals/Use Cases:
- Browse the marketplace
- View product details
- Register as a buyer or seller
- Learn about the platform

### Detailed Flow Maps:

#### 1.1 Browse the Marketplace
```
- User navigates to the home page
  - Success: Home page loads with header, featured products, and categories
  - Error: Display error message if content fails to load
- User clicks on "Browse Products" or "Marketplace" in the navigation
  - Success: Redirect to marketplace page with product listings
  - Error: Display error message if navigation fails
- User browses product categories
  - Success: Display products filtered by selected category
  - Error: Show "No products found" message if category is empty
- User uses search functionality
  - Success: Display search results matching query
  - Error: Show "No results found" message if search yields no results
- User applies filters (price, specifications, etc.)
  - Success: Display filtered products
  - Error: Show "No products match your filters" message
```

#### 1.2 View Product Details
```
- User clicks on a product card
  - Success: Redirect to product detail page
  - Error: Display error message if product details fail to load
- User views product information (description, price, specifications)
  - Success: Display complete product information
  - Error: Show placeholder or error message for missing information
- User attempts to add product to cart
  - Redirect: Prompt user to login or register
```

#### 1.3 Register as a Buyer or Seller
```
- User clicks "Register" button in header
  - Success: Display registration modal
  - Error: Display error message if modal fails to open
- User selects account type (buyer or seller)
  - Success: Display appropriate registration form
- User completes registration form
  - Success: Create account and redirect to appropriate dashboard
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if registration fails (e.g., email already exists)
```

#### 1.4 Learn About the Platform
```
- User navigates to "About" page
  - Success: Display platform information
  - Error: Display error message if page fails to load
- User views customer testimonials on home page
  - Success: Display testimonials section
- User submits contact form
  - Success: Display confirmation message
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if submission fails
```

### Test Cases (Cypress):

```javascript
// Guest User - Browse Marketplace Test
describe('Guest User - Browse Marketplace', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should display the home page with header and featured content', () => {
    cy.get('header').should('be.visible');
    cy.contains('Fresh Ingredients for Your Business').should('be.visible');
    cy.contains('Browse Products').should('be.visible');
  });

  it('should navigate to marketplace page', () => {
    cy.contains('Browse Products').click();
    cy.url().should('include', '/marketplace');
    cy.contains('All Products').should('be.visible');
  });

  it('should filter products by category', () => {
    cy.visit('/marketplace');
    cy.contains('Fresh Produce').click();
    cy.url().should('include', '/categories/fresh-produce');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
  });

  it('should search for products', () => {
    cy.visit('/marketplace');
    cy.get('[data-testid="search-input"]').type('apple{enter}');
    cy.contains('Search results for "apple"').should('be.visible');
  });

  it('should prompt login when trying to add product to cart', () => {
    cy.visit('/marketplace/products/PROD-001');
    cy.contains('Add to Cart').click();
    cy.contains('Login').should('be.visible');
  });
});

// Guest User - Registration Test
describe('Guest User - Registration', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should open registration modal', () => {
    cy.contains('Register').click();
    cy.get('[data-testid="register-modal"]').should('be.visible');
  });

  it('should validate registration form', () => {
    cy.contains('Register').click();
    cy.get('[data-testid="register-button"]').click();
    cy.contains('Email is required').should('be.visible');
  });

  it('should register as a buyer', () => {
    const email = `test-buyer-${Date.now()}@example.com`;
    cy.contains('Register').click();
    cy.get('[data-testid="register-email"]').type(email);
    cy.get('[data-testid="register-password"]').type('Password123!');
    cy.get('[data-testid="register-name"]').type('Test Buyer');
    cy.get('[data-testid="register-role-buyer"]').check();
    cy.get('[data-testid="register-button"]').click();
    cy.url().should('include', '/buyer');
  });
});
```

## 2. Registered Buyer

### Major Goals/Use Cases:
- Browse and search products
- Add products to cart and checkout
- Manage orders and order history
- Manage account settings
- Communicate with sellers

### Detailed Flow Maps:

#### 2.1 Browse and Search Products
```
- Buyer logs in to account
  - Success: Redirect to buyer dashboard
  - Error: Display error message for invalid credentials
- Buyer navigates to marketplace
  - Success: Display marketplace with product listings
  - Error: Display error message if content fails to load
- Buyer searches for specific products
  - Success: Display search results
  - Error: Show "No results found" message
- Buyer applies filters
  - Success: Display filtered products
  - Error: Show "No products match your filters" message
- Buyer views product details
  - Success: Display product detail page
  - Error: Display error message if product details fail to load
```

#### 2.2 Add Products to Cart and Checkout
```
- Buyer adds product to cart
  - Success: Product added to cart, update cart count
  - Error: Display error message if action fails
- Buyer views cart
  - Success: Display cart with added products
  - Error: Display error message if cart fails to load
- Buyer updates product quantities
  - Success: Update quantities and totals
  - Error: Display error message if update fails
- Buyer removes product from cart
  - Success: Remove product and update totals
  - Error: Display error message if removal fails
- Buyer proceeds to checkout
  - Success: Navigate to checkout page
  - Error: Display error message if navigation fails
- Buyer enters shipping information
  - Success: Save shipping information
  - Error: Display validation errors for invalid inputs
- Buyer enters payment information
  - Success: Process payment
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if payment processing fails
- Buyer completes order
  - Success: Display order confirmation, send confirmation email
  - Error: Display error message if order completion fails
```

#### 2.3 Manage Orders and Order History
```
- Buyer navigates to orders page
  - Success: Display list of orders
  - Error: Display error message if orders fail to load
- Buyer views order details
  - Success: Display detailed order information
  - Error: Display error message if order details fail to load
- Buyer tracks order status
  - Success: Display current order status and timeline
  - Error: Display error message if tracking information fails to load
- Buyer cancels order (if applicable)
  - Success: Update order status to cancelled
  - Error: Display error message if cancellation fails
  - Edge Case: Cannot cancel if order is already processed/shipped
```

#### 2.4 Manage Account Settings
```
- Buyer navigates to account settings
  - Success: Display account settings page
  - Error: Display error message if settings fail to load
- Buyer updates profile information
  - Success: Save updated information
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if update fails
- Buyer changes password
  - Success: Update password
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if password change fails
- Buyer manages payment methods
  - Success: Display saved payment methods
  - Error: Display error message if payment methods fail to load
- Buyer adds new payment method
  - Success: Save new payment method
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if addition fails
- Buyer removes payment method
  - Success: Remove payment method
  - Error: Display error message if removal fails
```

#### 2.5 Communicate with Sellers
```
- Buyer navigates to messaging center
  - Success: Display messaging interface
  - Error: Display error message if messaging center fails to load
- Buyer views conversation history
  - Success: Display previous messages
  - Error: Display error message if messages fail to load
- Buyer sends message to seller
  - Success: Send message and update conversation
  - Error: Display error message if message fails to send
- Buyer receives notification for new message
  - Success: Display notification
  - Error: Display error message if notification system fails
```

### Test Cases (Cypress):

```javascript
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

    // Proceed to checkout
    cy.get('[data-testid="cart-button"]').click();
    cy.contains('Checkout').click();

    // Fill shipping information
    cy.get('[data-testid="shipping-name"]').type('John Doe');
    cy.get('[data-testid="shipping-address"]').type('123 Main St');
    cy.get('[data-testid="shipping-city"]').type('New York');
    cy.get('[data-testid="shipping-zip"]').type('10001');
    cy.contains('Continue to Payment').click();

    // Fill payment information
    cy.get('[data-testid="card-number"]').type('4242424242424242');
    cy.get('[data-testid="card-expiry"]').type('1225');
    cy.get('[data-testid="card-cvc"]').type('123');
    cy.contains('Complete Order').click();

    // Verify order confirmation
    cy.contains('Order Confirmed').should('be.visible');
    cy.contains('Thank you for your order').should('be.visible');
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
```

## 3. Registered Seller

### Major Goals/Use Cases:
- Manage product listings
- Process and fulfill orders
- Manage inventory
- View analytics and reports
- Communicate with buyers
- Manage account settings

### Detailed Flow Maps:

#### 3.1 Manage Product Listings
```
- Seller logs in to account
  - Success: Redirect to seller dashboard
  - Error: Display error message for invalid credentials
- Seller views product listings
  - Success: Display list of seller's products
  - Error: Display error message if products fail to load
- Seller adds new product
  - Success: Create new product listing
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if product creation fails
  - Edge Case: Duplicate product detection
- Seller edits existing product
  - Success: Update product information
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if update fails
- Seller uploads product images
  - Success: Upload and associate images with product
  - Error: Display error message if upload fails
  - Error: Display error message if file size/type is invalid
- Seller deletes product
  - Success: Remove product from listings
  - Error: Display error message if deletion fails
  - Edge Case: Cannot delete if product has pending orders
```

#### 3.2 Process and Fulfill Orders
```
- Seller views incoming orders
  - Success: Display list of orders
  - Error: Display error message if orders fail to load
- Seller views order details
  - Success: Display detailed order information
  - Error: Display error message if order details fail to load
- Seller accepts/rejects order
  - Success: Update order status
  - Error: Display error message if status update fails
- Seller processes order
  - Success: Mark order as processing
  - Error: Display error message if status update fails
- Seller arranges shipping
  - Success: Enter shipping information
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if shipping arrangement fails
- Seller marks order as shipped
  - Success: Update order status to shipped
  - Error: Display error message if status update fails
- Seller handles returns/refunds (if applicable)
  - Success: Process return/refund
  - Error: Display error message if processing fails
```

#### 3.3 Manage Inventory
```
- Seller views inventory levels
  - Success: Display current inventory for all products
  - Error: Display error message if inventory fails to load
- Seller updates inventory quantities
  - Success: Update inventory levels
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if update fails
- Seller sets low inventory alerts
  - Success: Configure alert thresholds
  - Error: Display error message if configuration fails
- Seller receives low inventory notifications
  - Success: Display notification when inventory falls below threshold
  - Error: Display error message if notification system fails
```

#### 3.4 View Analytics and Reports
```
- Seller navigates to analytics dashboard
  - Success: Display analytics overview
  - Error: Display error message if analytics fail to load
- Seller views sales reports
  - Success: Display sales data and charts
  - Error: Display error message if reports fail to load
- Seller filters reports by date range
  - Success: Update reports based on selected date range
  - Error: Display error message if filtering fails
- Seller exports reports
  - Success: Generate and download report file
  - Error: Display error message if export fails
```

### Test Cases (Cypress):

```javascript
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
    cy.contains('Add Product').click();

    // Fill product information
    cy.get('[data-testid="product-name"]').type('Organic Carrots');
    cy.get('[data-testid="product-description"]').type('Fresh organic carrots from local farms');
    cy.get('[data-testid="product-price"]').type('12.99');
    cy.get('[data-testid="product-unit"]').select('kg');
    cy.get('[data-testid="product-category"]').select('Fresh Produce');

    // Upload product image
    cy.get('[data-testid="product-image-upload"]').attachFile('carrot.jpg');

    // Set inventory
    cy.get('[data-testid="product-inventory"]').type('100');

    // Add specifications
    cy.get('[data-testid="add-specification"]').click();
    cy.get('[data-testid="specification-key"]').type('Organic');
    cy.get('[data-testid="specification-value"]').type('Yes');

    // Save product
    cy.get('[data-testid="save-product"]').click();

    // Verify product was added
    cy.contains('Product created successfully').should('be.visible');
    cy.contains('Organic Carrots').should('be.visible');
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
```

## 4. Admin (Platform Controller)

### Major Goals/Use Cases:
- Manage users (buyers and sellers)
- Moderate product listings
- Monitor and manage orders
- View platform analytics
- Configure platform settings
- Manage support tickets

### Detailed Flow Maps:

#### 4.1 Manage Users
```
- Admin logs in to account
  - Success: Redirect to admin dashboard
  - Error: Display error message for invalid credentials
- Admin views user list
  - Success: Display list of all users
  - Error: Display error message if users fail to load
- Admin filters users by role/status
  - Success: Display filtered user list
  - Error: Display error message if filtering fails
- Admin views user details
  - Success: Display detailed user information
  - Error: Display error message if user details fail to load
- Admin edits user information
  - Success: Update user information
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if update fails
- Admin suspends/activates user
  - Success: Update user status
  - Error: Display error message if status update fails
- Admin deletes user
  - Success: Remove user from platform
  - Error: Display error message if deletion fails
  - Edge Case: Cannot delete if user has active orders/listings
```

#### 4.2 Moderate Product Listings
```
- Admin views all product listings
  - Success: Display list of all products
  - Error: Display error message if products fail to load
- Admin filters products by category/seller/status
  - Success: Display filtered product list
  - Error: Display error message if filtering fails
- Admin views product details
  - Success: Display detailed product information
  - Error: Display error message if product details fail to load
- Admin approves/rejects product listing
  - Success: Update product status
  - Error: Display error message if status update fails
- Admin edits product information
  - Success: Update product information
  - Error: Display validation errors for invalid inputs
  - Error: Display error message if update fails
- Admin removes product listing
  - Success: Remove product from platform
  - Error: Display error message if removal fails
  - Edge Case: Cannot remove if product has pending orders
```

#### 4.3 Monitor and Manage Orders
```
- Admin views all orders
  - Success: Display list of all orders
  - Error: Display error message if orders fail to load
- Admin filters orders by status/buyer/seller
  - Success: Display filtered order list
  - Error: Display error message if filtering fails
- Admin views order details
  - Success: Display detailed order information
  - Error: Display error message if order details fail to load
- Admin updates order status
  - Success: Update order status
  - Error: Display error message if status update fails
- Admin cancels order
  - Success: Cancel order and notify parties
  - Error: Display error message if cancellation fails
  - Edge Case: Cannot cancel if order is already shipped
- Admin resolves order disputes
  - Success: Mark dispute as resolved
  - Error: Display error message if resolution fails
```

### Test Cases (Cypress):

```javascript
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
});
```

## Edge Cases and Error Handling

For each user flow, I've included common edge cases and error handling scenarios. Here are additional edge cases that should be considered across all user types:

1. **Network Connectivity Issues**
   - Handle offline/online state transitions
   - Implement retry mechanisms for failed API calls
   - Cache critical data for offline access

2. **Session Management**
   - Handle session timeouts gracefully
   - Provide session renewal options
   - Secure logout process

3. **Concurrent Actions**
   - Handle multiple users updating the same resource
   - Implement optimistic UI updates with rollback capability
   - Use locking mechanisms for critical operations

4. **Data Validation**
   - Validate all user inputs on both client and server
   - Handle special characters and potential injection attacks
   - Implement proper error messages for validation failures

5. **Performance Degradation**
   - Handle slow API responses
   - Implement loading states for all actions
   - Provide feedback for long-running operations

## Implementation Recommendations

1. **Testing Framework**
   - Continue using Cypress for end-to-end testing as it's already set up in the project
   - Add Jest and React Testing Library for component-level testing
   - Consider adding Playwright for cross-browser testing if needed

2. **Test Organization**
   - Organize tests by user role and feature
   - Create reusable custom commands for common actions
   - Implement proper test data management

3. **Continuous Integration**
   - Set up automated testing in CI/CD pipeline
   - Implement visual regression testing
   - Create test reports and dashboards