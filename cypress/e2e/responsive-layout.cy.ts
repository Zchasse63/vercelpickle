describe('Responsive Layout - Buyer Profile', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/settings', { failOnStatusCode: false });
  });

  it('should display correctly on desktop', () => {
    cy.viewport(1280, 800); // Desktop size
    
    // Visual test of profile settings page on desktop
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Profile Settings Desktop',
    });
    
    cy.eyesCheckWindow({
      tag: 'Profile Settings Desktop',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on tablet', () => {
    cy.viewport(768, 1024); // Tablet size
    
    // Visual test of profile settings page on tablet
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Profile Settings Tablet',
    });
    
    cy.eyesCheckWindow({
      tag: 'Profile Settings Tablet',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on mobile', () => {
    cy.viewport(375, 667); // Mobile size
    
    // Visual test of profile settings page on mobile
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Profile Settings Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Profile Settings Mobile',
      fully: true
    });
    
    cy.eyesClose();
  });
});

describe('Responsive Layout - Address Book', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/shipping', { failOnStatusCode: false });
  });

  it('should display correctly on desktop', () => {
    cy.viewport(1280, 800); // Desktop size
    
    // Visual test of address book page on desktop
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Book Desktop',
    });
    
    cy.eyesCheckWindow({
      tag: 'Address Book Desktop',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on tablet', () => {
    cy.viewport(768, 1024); // Tablet size
    
    // Visual test of address book page on tablet
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Book Tablet',
    });
    
    cy.eyesCheckWindow({
      tag: 'Address Book Tablet',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on mobile', () => {
    cy.viewport(375, 667); // Mobile size
    
    // Visual test of address book page on mobile
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Address Book Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Address Book Mobile',
      fully: true
    });
    
    cy.eyesClose();
  });
});

describe('Responsive Layout - Payment Methods', () => {
  beforeEach(() => {
    cy.visitWithRetry('/buyer/payment-methods', { failOnStatusCode: false });
  });

  it('should display correctly on desktop', () => {
    cy.viewport(1280, 800); // Desktop size
    
    // Visual test of payment methods page on desktop
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Methods Desktop',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Methods Desktop',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on tablet', () => {
    cy.viewport(768, 1024); // Tablet size
    
    // Visual test of payment methods page on tablet
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Methods Tablet',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Methods Tablet',
      fully: true
    });
    
    cy.eyesClose();
  });

  it('should display correctly on mobile', () => {
    cy.viewport(375, 667); // Mobile size
    
    // Visual test of payment methods page on mobile
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Payment Methods Mobile',
    });
    
    cy.eyesCheckWindow({
      tag: 'Payment Methods Mobile',
      fully: true
    });
    
    cy.eyesClose();
  });
});
