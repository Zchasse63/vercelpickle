/**
 * ESLint plugin for Pickle B2B Marketplace
 * 
 * This plugin provides custom ESLint rules to enforce consistent component patterns.
 */

'use strict';

// Import rules
const requireDataTestId = require('./rules/require-data-testid');
const requireAriaAttributes = require('./rules/require-aria-attributes');
const enforceComponentNaming = require('./rules/enforce-component-naming');
const enforcePropsInterface = require('./rules/enforce-props-interface');
const enforceComponentFactory = require('./rules/enforce-component-factory');

// Export rules
module.exports = {
  rules: {
    'require-data-testid': requireDataTestId,
    'require-aria-attributes': requireAriaAttributes,
    'enforce-component-naming': enforceComponentNaming,
    'enforce-props-interface': enforcePropsInterface,
    'enforce-component-factory': enforceComponentFactory,
  },
  configs: {
    recommended: {
      plugins: ['pickle'],
      rules: {
        'pickle/require-data-testid': 'warn',
        'pickle/require-aria-attributes': 'warn',
        'pickle/enforce-component-naming': 'warn',
        'pickle/enforce-props-interface': 'warn',
        'pickle/enforce-component-factory': 'warn',
      },
    },
    strict: {
      plugins: ['pickle'],
      rules: {
        'pickle/require-data-testid': 'error',
        'pickle/require-aria-attributes': 'error',
        'pickle/enforce-component-naming': 'error',
        'pickle/enforce-props-interface': 'error',
        'pickle/enforce-component-factory': 'error',
      },
    },
  },
};
