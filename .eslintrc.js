module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:pickle/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'pickle'
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    // Custom rule configurations
    'pickle/require-data-testid': ['warn', {
      components: [
        'Button', 'Link', 'Input', 'Select', 'Textarea', 'Form',
        'Dialog', 'Menu', 'MenuItem', 'Checkbox', 'RadioGroup',
        'Switch', 'Tabs', 'Tab', 'Accordion', 'Popover',
      ],
      ignore: ['InternalButton', 'InternalLink']
    }],
    'pickle/require-aria-attributes': ['warn', {
      components: {
        'Skeleton': {
          attributes: {},
          roles: ['status']
        },
        'Progress': {
          attributes: {},
          roles: ['progressbar']
        },
        'Alert': {
          attributes: {},
          roles: ['alert']
        },
        'Button': {
          attributes: {
            'aria-busy': (node) => {
              // Check if the button has an isLoading prop
              const isLoadingProp = node.attributes.find(attr =>
                attr.type === 'JSXAttribute' &&
                attr.name.name === 'isLoading'
              );

              return isLoadingProp ? 'true' : null;
            }
          },
          roles: []
        }
      }
    }],
    'pickle/enforce-component-naming': ['warn', {
      pattern: '^[A-Z][a-zA-Z0-9]*$',
      ignorePattern: '^_',
      checkFilename: true
    }],
    'pickle/enforce-props-interface': ['warn', {
      pattern: '^{{componentName}}Props$',
      requiredProps: ['className']
    }],
    'pickle/enforce-component-factory': ['warn', {
      components: [
        'Button', 'Card', 'Checkbox', 'Dialog', 'Input', 'Select',
        'Textarea', 'Form', 'RadioGroup', 'Switch', 'Tabs', 'Tab',
        'Accordion', 'Popover', 'Alert', 'Badge', 'Tooltip'
      ],
      ignoreComponents: ['InternalButton', 'InternalLink'],
      factoryPath: '@/lib/component-factory'
    }]
  },
  settings: {
    // Add settings for the plugin
    pickle: {
      componentFactory: {
        path: '@/lib/component-factory'
      }
    }
  }
};
