describe('Accessibility - Buyer Profile', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/settings', { failOnStatusCode: false });
    cy.injectAxe(); // Inject axe-core for accessibility testing
  });

  it('should have no accessibility violations on profile settings page', () => {
    // Run accessibility audit
    cy.checkA11y();
    
    // Visual test of profile settings page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Profile Settings Accessibility',
    });
    
    cy.eyesCheckWindow({
      tag: 'Profile Settings Page',
      fully: true
    });
    
    cy.eyesClose();
  });
});

describe('Accessibility - Address Book', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/shipping', { failOnStatusCode: false });
    cy.injectAxe(); // Inject axe-core for accessibility testing
  });

  it('should have no accessibility violations on address book page', () => {
    // Run accessibility audit
    cy.checkA11y();
    
    // Visual test of address book page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Book Accessibility',
    });
    
    cy.eyesCheckWindow({
      tag: 'Address Book Page',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should have no accessibility violations in address form', () => {
    // Open the add address form
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-address-button"]').length > 0) {
        cy.getByTestId('add-address-button').click();
      } else {
        cy.contains('button', 'Add Address').click();
      }
    });
    
    // Wait for form to appear
    cy.wait(500);
    
    // Run accessibility audit on the form
    cy.checkA11y();
    
    // Visual test of address form
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Form Accessibility',
    });
    
    cy.eyesCheckWindow({
      tag: 'Address Form',
      fully: true
    });
    
    cy.eyesClose();
  });
});

describe('Accessibility - Payment Methods', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/payment-methods', { failOnStatusCode: false });
    cy.injectAxe(); // Inject axe-core for accessibility testing
  });

  it('should have no accessibility violations on payment methods page', () => {
    // Run accessibility audit
    cy.checkA11y();
    
    // Visual test of payment methods page
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Methods Accessibility',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Methods Page',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should have no accessibility violations in payment form', () => {
    // Open the add payment method form
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-payment-method-button"]').length > 0) {
        cy.getByTestId('add-payment-method-button').click();
      } else {
        cy.contains('button', 'Add Method').click();
      }
    });
    
    // Wait for form to appear
    cy.wait(500);
    
    // Run accessibility audit on the form
    cy.checkA11y();
    
    // Visual test of payment form
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Form Accessibility',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Form',
      fully: true
    });
    
    cy.eyesClose();
  });
});
