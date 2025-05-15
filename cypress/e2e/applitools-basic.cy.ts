// Basic Applitools Test
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

describe('Basic Applitools Test', () => {
  it('should take a screenshot of the home page', () => {
    // Visit the home page with failOnStatusCode: false to handle server issues
    cy.visit('/', { failOnStatusCode: false });

    // Open Eyes with basic configuration
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Home Page Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Home Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});
