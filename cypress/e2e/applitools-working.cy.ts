// Working Applitools Tests
/// <reference types="cypress" />
/// <reference types="@applitools/eyes-cypress" />

describe('Visual Testing - Home Page', () => {
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

describe('Visual Testing - Marketplace', () => {
  beforeEach(() => {
    // Visit the marketplace page with failOnStatusCode: false to handle server issues
    cy.visit('/marketplace', { failOnStatusCode: false });
  });

  it('should visually validate the marketplace layout', () => {
    // Open Eyes for this test using standard Applitools commands
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Marketplace Layout Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Marketplace Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});

describe('Visual Testing - Admin', () => {
  beforeEach(() => {
    // Visit the admin page with failOnStatusCode: false to handle server issues
    cy.visit('/admin', { failOnStatusCode: false });
  });

  it('should visually validate the admin page', () => {
    // Open Eyes for this test
    cy.eyesOpen({
      appName: 'Pickle B2B Marketplace',
      testName: 'Admin Page Test',
    });

    // Take a screenshot of the entire page
    cy.eyesCheckWindow({
      tag: 'Admin Page',
      fully: true,
    });

    // Close Eyes
    cy.eyesClose();
  });
});
