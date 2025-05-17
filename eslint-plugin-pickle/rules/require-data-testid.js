/**
 * Rule to enforce data-testid attributes on interactive elements
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce data-testid attributes on interactive elements',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          ignore: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingDataTestId: '{{element}} should have a data-testid attribute',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const interactiveElements = [
      'button', 'a', 'input', 'select', 'textarea', 'form',
      'details', 'dialog', 'menu', 'menuitem', 'summary',
    ];
    const interactiveRoles = [
      'button', 'checkbox', 'combobox', 'dialog', 'gridcell',
      'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
      'option', 'radio', 'searchbox', 'slider', 'spinbutton',
      'switch', 'tab', 'textbox',
    ];
    const customComponents = options.components || [
      'Button', 'Link', 'Input', 'Select', 'Textarea', 'Form',
      'Dialog', 'Menu', 'MenuItem', 'Checkbox', 'RadioGroup',
      'Switch', 'Tabs', 'Tab', 'Accordion', 'Popover',
    ];
    const ignoreList = options.ignore || [];

    /**
     * Check if an element has a data-testid attribute
     * @param {Object} node - The AST node
     * @returns {boolean} - Whether the element has a data-testid attribute
     */
    function hasDataTestId(node) {
      if (!node.attributes) return false;
      
      return node.attributes.some(attr => 
        attr.type === 'JSXAttribute' && 
        attr.name.name === 'data-testid'
      );
    }

    /**
     * Check if an element has a role attribute
     * @param {Object} node - The AST node
     * @returns {string|null} - The role value or null
     */
    function getRole(node) {
      if (!node.attributes) return null;
      
      const roleAttr = node.attributes.find(attr => 
        attr.type === 'JSXAttribute' && 
        attr.name.name === 'role'
      );
      
      if (!roleAttr || !roleAttr.value || roleAttr.value.type !== 'Literal') {
        return null;
      }
      
      return roleAttr.value.value;
    }

    /**
     * Generate a data-testid value based on the element
     * @param {Object} node - The AST node
     * @returns {string} - The generated data-testid value
     */
    function generateDataTestId(node) {
      const elementName = node.name.name || node.name.object?.name || 'element';
      const lowerCaseName = elementName.toLowerCase();
      
      // For custom components, use kebab-case
      if (customComponents.includes(elementName)) {
        return `${lowerCaseName}-element`;
      }
      
      // For HTML elements, use element-type
      return `${lowerCaseName}-element`;
    }

    return {
      JSXOpeningElement(node) {
        const elementName = node.name.name || node.name.object?.name;
        
        // Skip if the element is in the ignore list
        if (ignoreList.includes(elementName)) {
          return;
        }
        
        // Check if it's an interactive element or has an interactive role
        const isInteractiveElement = interactiveElements.includes(elementName);
        const role = getRole(node);
        const hasInteractiveRole = role && interactiveRoles.includes(role);
        const isCustomComponent = customComponents.includes(elementName);
        
        if ((isInteractiveElement || hasInteractiveRole || isCustomComponent) && !hasDataTestId(node)) {
          context.report({
            node,
            messageId: 'missingDataTestId',
            data: {
              element: elementName,
            },
            fix(fixer) {
              const dataTestId = generateDataTestId(node);
              const lastAttr = node.attributes[node.attributes.length - 1];
              
              if (!lastAttr) {
                // No attributes, add data-testid as the first attribute
                return fixer.insertTextAfter(
                  node.name,
                  ` data-testid="${dataTestId}"`
                );
              }
              
              // Add data-testid after the last attribute
              return fixer.insertTextAfter(
                lastAttr,
                ` data-testid="${dataTestId}"`
              );
            },
          });
        }
      },
    };
  },
};
