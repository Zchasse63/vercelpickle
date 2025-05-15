describe('Form Validation - Address Form', () => {
  beforeEach(() => {
    // Visit the shipping page
    cy.visitWithRetry('/buyer/shipping', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load

    // Check if we're on the right page
    cy.url().should('include', '/buyer/shipping');

    // Try to find and click the add address button
    cy.get('body').then($body => {
      // Look for any button that might be the add address button
      const addButtonExists =
        $body.find('[data-testid="add-address-button"]').length > 0 ||
        $body.find('button:contains("Add Address")').length > 0 ||
        $body.find('button:contains("Add")').length > 0;

      if (!addButtonExists) {
        cy.log('No add address button found, skipping test');
        return;
      }

      // Try to click the button
      if ($body.find('[data-testid="add-address-button"]').length > 0) {
        cy.getByTestId('add-address-button').click();
      } else if ($body.find('button:contains("Add Address")').length > 0) {
        cy.contains('button', 'Add Address').click();
      } else if ($body.find('button:contains("Add")').length > 0) {
        cy.contains('button', 'Add').click();
      }
    });

    // Wait for form to appear
    cy.wait(1000);
  });

  it('should validate required fields in address form', () => {
    // Try to submit the form without filling any fields
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-address-button"]').length > 0) {
        cy.getByTestId('save-address-button').click();
      } else {
        cy.contains('button', 'Add Address').click();
      }
    });

    // Check for validation errors
    cy.get('body').then($body => {
      // Look for any validation error messages
      const hasErrors = $body.find('.text-red-500').length > 0 ||
                        $body.find('[data-testid$="-error"]').length > 0;

      expect(hasErrors).to.be.true;
    });

    // Visual test of validation errors
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Form Validation Errors',
    });

    cy.eyesCheckWindow({
      tag: 'Address Form Validation Errors',
      fully: true
    });

    cy.eyesClose();
  });

  it('should validate zip code format', () => {
    // Fill form with invalid zip code
    cy.get('body').then($body => {
      if ($body.find('[data-testid="address-name-input"]').length > 0) {
        cy.getByTestId('address-name-input').type('John Doe');
        cy.getByTestId('address-street-input').type('123 Main St');
        cy.getByTestId('address-city-input').type('San Francisco');
        cy.getByTestId('address-state-input').click();
        cy.contains('California').click();
        cy.getByTestId('address-zip-input').type('ABC'); // Invalid zip code
        cy.getByTestId('address-phone-input').type('555-123-4567');
      } else {
        // Fallback to generic selectors
        cy.get('#name').type('John Doe');
        cy.get('#street').type('123 Main St');
        cy.get('#city').type('San Francisco');
        cy.get('#state').click();
        cy.contains('California').click();
        cy.get('#zip').type('ABC'); // Invalid zip code
        cy.get('#phone').type('555-123-4567');
      }
    });

    // Try to submit the form
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-address-button"]').length > 0) {
        cy.getByTestId('save-address-button').click();
      } else {
        cy.contains('button', 'Add Address').click();
      }
    });

    // Check for zip code validation error
    cy.get('body').then($body => {
      const hasZipError = $body.find('.text-red-500:contains("ZIP")').length > 0 ||
                          $body.find('[data-testid="zip-error"]').length > 0;

      expect(hasZipError).to.be.true;
    });
  });
});

describe('Form Validation - Payment Method Form', () => {
  beforeEach(() => {
    // Visit the payment methods page
    cy.visitWithRetry('/buyer/payment-methods', { failOnStatusCode: false });
    cy.wait(1000); // Wait for page to load

    // Check if we're on the right page
    cy.url().should('include', '/buyer/payment-methods');

    // Try to find and click the add payment method button
    cy.get('body').then($body => {
      // Look for any button that might be the add payment method button
      const addButtonExists =
        $body.find('[data-testid="add-payment-method-button"]').length > 0 ||
        $body.find('button:contains("Add Method")').length > 0 ||
        $body.find('button:contains("Add Payment")').length > 0 ||
        $body.find('button:contains("Add")').length > 0;

      if (!addButtonExists) {
        cy.log('No add payment method button found, skipping test');
        return;
      }

      // Try to click the button
      if ($body.find('[data-testid="add-payment-method-button"]').length > 0) {
        cy.getByTestId('add-payment-method-button').click();
      } else if ($body.find('button:contains("Add Method")').length > 0) {
        cy.contains('button', 'Add Method').click();
      } else if ($body.find('button:contains("Add Payment")').length > 0) {
        cy.contains('button', 'Add Payment').click();
      } else if ($body.find('button:contains("Add")').length > 0) {
        cy.contains('button', 'Add').click();
      }
    });

    // Wait for form to appear
    cy.wait(1000);
  });

  it('should validate required fields in payment form', () => {
    // Try to submit the form without filling any fields
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-payment-button"]').length > 0) {
        cy.getByTestId('save-payment-button').click();
      } else {
        cy.contains('button', 'Add Card').click();
      }
    });

    // Check for validation errors
    cy.get('body').then($body => {
      // Look for any validation error messages
      const hasErrors = $body.find('.text-red-500').length > 0 ||
                        $body.find('[data-testid$="-error"]').length > 0;

      expect(hasErrors).to.be.true;
    });

    // Visual test of validation errors
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Form Validation Errors',
    });

    cy.eyesCheckWindow({
      tag: 'Payment Form Validation Errors',
      fully: true
    });

    cy.eyesClose();
  });

  it('should validate card number format', () => {
    // Fill form with invalid card number
    cy.get('body').then($body => {
      if ($body.find('[data-testid="card-name-input"]').length > 0) {
        cy.getByTestId('card-name-input').type('John Doe');
        cy.getByTestId('card-number-input').type('1234567890'); // Invalid card number (too short)
        cy.getByTestId('card-expiry-input').type('1230');
        cy.getByTestId('card-cvc-input').type('123');
      } else {
        // Fallback to generic selectors
        cy.get('#cardName').type('John Doe');
        cy.get('#cardNumber').type('1234567890');
        cy.get('#expiry').type('1230');
        cy.get('#cvc').type('123');
      }
    });

    // Try to submit the form
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-payment-button"]').length > 0) {
        cy.getByTestId('save-payment-button').click();
      } else {
        cy.contains('button', 'Add Card').click();
      }
    });

    // Check for card number validation error
    cy.get('body').then($body => {
      const hasCardNumberError = $body.find('.text-red-500:contains("card number")').length > 0 ||
                                $body.find('[data-testid="card-number-error"]').length > 0;

      expect(hasCardNumberError).to.be.true;
    });
  });

  it('should validate expiry date format and not allow expired cards', () => {
    // Fill form with expired card
    cy.get('body').then($body => {
      if ($body.find('[data-testid="card-name-input"]').length > 0) {
        cy.getByTestId('card-name-input').type('John Doe');
        cy.getByTestId('card-number-input').type('4242424242424242');
        cy.getByTestId('card-expiry-input').type('0120'); // Expired date (Jan 2020)
        cy.getByTestId('card-cvc-input').type('123');
      } else {
        // Fallback to generic selectors
        cy.get('#cardName').type('John Doe');
        cy.get('#cardNumber').type('4242424242424242');
        cy.get('#expiry').type('0120');
        cy.get('#cvc').type('123');
      }
    });

    // Try to submit the form
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-payment-button"]').length > 0) {
        cy.getByTestId('save-payment-button').click();
      } else {
        cy.contains('button', 'Add Card').click();
      }
    });

    // Check for expiry date validation error
    cy.get('body').then($body => {
      const hasExpiryError = $body.find('.text-red-500:contains("expiry")').length > 0 ||
                            $body.find('[data-testid="card-expiry-error"]').length > 0;

      expect(hasExpiryError).to.be.true;
    });
  });
});
