// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@applitools/eyes-cypress/commands'


// Import commands.js using ES2015 syntax:
import './commands'

// Import test utilities
import './test-utils'

// Import enhanced test utilities
import './enhanced-test-utils'

// Import Applitools custom commands
import './applitools-commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
// require('./test-utils')

// Load fixtures
beforeEach(() => {
  cy.fixture('users.json').as('users');
  cy.fixture('products.json').as('products');
  cy.fixture('orders.json').as('orders');
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err: Error, runnable: Mocha.Runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add data-testid to elements for easier selection
Cypress.Commands.add('getByTestId', (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

// Log test name before each test
beforeEach(function() {
  const testTitle = Cypress.currentTest.title;
  cy.log(`Running test: ${testTitle}`);
});
