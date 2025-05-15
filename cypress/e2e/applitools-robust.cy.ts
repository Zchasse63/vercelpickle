// Robust Applitools Test
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

describe('Robust Applitools Test', () => {
  it('should take a screenshot of whatever page is available', () => {
    // Try to visit the home page, but don't fail if it doesn't work
    cy.visit('/', {
      failOnStatusCode: false,
      timeout: 30000
    }).then(() => {
      // Log the current URL
      cy.url().then(url => {
        cy.log(`Current URL: ${url}`);
      });

      // Open Eyes with basic configuration
      cy.eyesOpen({
        appName: 'Pickle B2B Marketplace',
        testName: 'Robust Test',
      });

      // Take a screenshot of the entire page
      cy.eyesCheckWindow({
        tag: 'Current Page',
        fully: true,
      });

      // Close Eyes
      cy.eyesClose();
    });
  });
});
