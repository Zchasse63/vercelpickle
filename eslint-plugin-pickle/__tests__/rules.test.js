/**
 * Tests for ESLint plugin rules
 */

const { RuleTester } = require('eslint');
const requireDataTestId = require('../rules/require-data-testid');
const requireAriaAttributes = require('../rules/require-aria-attributes');
const enforceComponentNaming = require('../rules/enforce-component-naming');
const enforcePropsInterface = require('../rules/enforce-props-interface');
const enforceComponentFactory = require('../rules/enforce-component-factory');

// Configure RuleTester
RuleTester.setDefaultConfig({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

// Create a new RuleTester
const ruleTester = new RuleTester();

// Test require-data-testid rule
ruleTester.run('require-data-testid', requireDataTestId, {
  valid: [
    {
      code: '<button data-testid="button-element">Click me</button>',
    },
    {
      code: '<div>Not an interactive element</div>',
    },
    {
      code: '<Button data-testid="button-element">Click me</Button>',
      options: [{ components: ['Button'] }],
    },
    {
      code: '<InternalButton>Click me</InternalButton>',
      options: [{ ignore: ['InternalButton'] }],
    },
  ],
  invalid: [
    {
      code: '<button>Click me</button>',
      errors: [{ messageId: 'missingDataTestId' }],
      output: '<button data-testid="button-element">Click me</button>',
    },
    {
      code: '<Button>Click me</Button>',
      options: [{ components: ['Button'] }],
      errors: [{ messageId: 'missingDataTestId' }],
      output: '<Button data-testid="button-element">Click me</Button>',
    },
  ],
});

// Test require-aria-attributes rule
ruleTester.run('require-aria-attributes', requireAriaAttributes, {
  valid: [
    {
      code: '<Skeleton role="status" />',
      options: [{ components: { Skeleton: { roles: ['status'] } } }],
    },
    {
      code: '<Loader2 aria-hidden="true" />',
      options: [{ components: { Loader2: { attributes: { 'aria-hidden': 'true' } } } }],
    },
    {
      code: '<div>Not a component that needs ARIA attributes</div>',
    },
  ],
  invalid: [
    {
      code: '<Skeleton />',
      options: [{ components: { Skeleton: { roles: ['status'] } } }],
      errors: [{ messageId: 'missingRole' }],
      output: '<Skeleton role="status" />',
    },
    {
      code: '<Loader2 />',
      options: [{ components: { Loader2: { attributes: { 'aria-hidden': 'true' } } } }],
      errors: [{ messageId: 'missingAriaAttribute' }],
      output: '<Loader2 aria-hidden="true" />',
    },
  ],
});

// Test enforce-component-naming rule
ruleTester.run('enforce-component-naming', enforceComponentNaming, {
  valid: [
    {
      code: 'const Button = () => <button>Click me</button>;',
    },
    {
      code: 'function Dialog() { return <div>Dialog</div>; }',
    },
    {
      code: 'const _internalComponent = () => <div>Internal</div>;',
      options: [{ ignorePattern: '^_' }],
    },
  ],
  invalid: [
    {
      code: 'const button = () => <button>Click me</button>;',
      errors: [{ messageId: 'invalidComponentName' }],
      output: 'const Button = () => <button>Click me</button>;',
    },
    {
      code: 'function dialog() { return <div>Dialog</div>; }',
      errors: [{ messageId: 'invalidComponentName' }],
      output: 'function Dialog() { return <div>Dialog</div>; }',
    },
  ],
});

// Test enforce-props-interface rule
ruleTester.run('enforce-props-interface', enforcePropsInterface, {
  valid: [
    {
      code: `
        interface ButtonProps {
          label: string;
          className?: string;
        }
        
        const Button = ({ label, className }: ButtonProps) => (
          <button className={className}>{label}</button>
        );
      `,
      options: [{ pattern: '^{{componentName}}Props$', requiredProps: ['className'] }],
    },
  ],
  invalid: [
    {
      code: `
        interface Props {
          label: string;
        }
        
        const Button = ({ label }: Props) => <button>{label}</button>;
      `,
      options: [{ pattern: '^{{componentName}}Props$' }],
      errors: [{ messageId: 'invalidPropsName' }],
    },
    {
      code: `
        interface ButtonProps {
          label: string;
        }
        
        const Button = ({ label }: ButtonProps) => <button>{label}</button>;
      `,
      options: [{ pattern: '^{{componentName}}Props$', requiredProps: ['className'] }],
      errors: [{ messageId: 'missingRequiredProp' }],
    },
  ],
});

// Test enforce-component-factory rule
ruleTester.run('enforce-component-factory', enforceComponentFactory, {
  valid: [
    {
      code: `
        import { createComponent } from '@/lib/component-factory';
        
        const Button = createComponent({
          name: 'Button',
          element: 'button',
          baseClassName: 'inline-flex items-center justify-center rounded-md',
        });
      `,
      options: [{ components: ['Button'], factoryPath: '@/lib/component-factory' }],
    },
    {
      code: `
        const InternalButton = () => <button>Click me</button>;
      `,
      options: [{ ignoreComponents: ['InternalButton'] }],
    },
  ],
  invalid: [
    {
      code: `
        const Button = () => <button>Click me</button>;
      `,
      options: [{ components: ['Button'] }],
      errors: [{ messageId: 'useComponentFactory' }],
    },
  ],
});
