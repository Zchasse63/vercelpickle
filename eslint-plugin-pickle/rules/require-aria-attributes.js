/**
 * Rule to enforce ARIA attributes on elements that need them
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce ARIA attributes on elements that need them',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          components: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                attributes: {
                  type: 'object',
                  additionalProperties: {
                    type: 'string',
                  },
                },
                roles: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingAriaAttribute: '{{element}} should have {{attribute}}="{{value}}" attribute',
      missingRole: '{{element}} should have role="{{role}}" attribute',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    
    // Default component configurations
    const defaultComponents = {
      'Skeleton': {
        attributes: {},
        roles: ['status'],
      },
      'Progress': {
        attributes: {},
        roles: ['progressbar'],
      },
      'Alert': {
        attributes: {},
        roles: ['alert'],
      },
      'Loader2': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'AlertCircle': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'Check': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'X': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'ChevronDown': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'Circle': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'Search': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'ChevronsUpDown': {
        attributes: {
          'aria-hidden': 'true',
        },
        roles: [],
      },
      'Button': {
        attributes: {
          'aria-busy': (node) => {
            // Check if the button has an isLoading prop
            const isLoadingProp = node.attributes.find(attr => 
              attr.type === 'JSXAttribute' && 
              attr.name.name === 'isLoading' &&
              (!attr.value || attr.value.type === 'JSXExpressionContainer' && attr.value.expression.value !== false)
            );
            
            return isLoadingProp ? 'true' : null;
          },
        },
        roles: [],
      },
    };
    
    // Merge with user-provided configurations
    const components = {
      ...defaultComponents,
      ...(options.components || {}),
    };

    /**
     * Check if an element has a specific attribute
     * @param {Object} node - The AST node
     * @param {string} attributeName - The attribute name
     * @returns {boolean} - Whether the element has the attribute
     */
    function hasAttribute(node, attributeName) {
      if (!node.attributes) return false;
      
      return node.attributes.some(attr => 
        attr.type === 'JSXAttribute' && 
        attr.name.name === attributeName
      );
    }

    /**
     * Check if an element has a role attribute with a specific value
     * @param {Object} node - The AST node
     * @param {string} roleName - The role name
     * @returns {boolean} - Whether the element has the role
     */
    function hasRole(node, roleName) {
      if (!node.attributes) return false;
      
      const roleAttr = node.attributes.find(attr => 
        attr.type === 'JSXAttribute' && 
        attr.name.name === 'role'
      );
      
      if (!roleAttr || !roleAttr.value || roleAttr.value.type !== 'Literal') {
        return false;
      }
      
      return roleAttr.value.value === roleName;
    }

    return {
      JSXOpeningElement(node) {
        const elementName = node.name.name || node.name.object?.name;
        
        // Skip if the element is not in our components list
        if (!components[elementName]) {
          return;
        }
        
        const config = components[elementName];
        
        // Check for required ARIA attributes
        if (config.attributes) {
          Object.entries(config.attributes).forEach(([attribute, value]) => {
            // Skip if the element already has this attribute
            if (hasAttribute(node, attribute)) {
              return;
            }
            
            // If value is a function, call it with the node
            const attributeValue = typeof value === 'function' ? value(node) : value;
            
            // Skip if the function returned null (attribute not needed)
            if (attributeValue === null) {
              return;
            }
            
            context.report({
              node,
              messageId: 'missingAriaAttribute',
              data: {
                element: elementName,
                attribute,
                value: attributeValue,
              },
              fix(fixer) {
                const lastAttr = node.attributes[node.attributes.length - 1];
                
                if (!lastAttr) {
                  // No attributes, add aria attribute as the first attribute
                  return fixer.insertTextAfter(
                    node.name,
                    ` ${attribute}="${attributeValue}"`
                  );
                }
                
                // Add aria attribute after the last attribute
                return fixer.insertTextAfter(
                  lastAttr,
                  ` ${attribute}="${attributeValue}"`
                );
              },
            });
          });
        }
        
        // Check for required roles
        if (config.roles && config.roles.length > 0) {
          // Skip if the element already has a role attribute
          if (hasAttribute(node, 'role')) {
            return;
          }
          
          // Use the first role in the list
          const role = config.roles[0];
          
          context.report({
            node,
            messageId: 'missingRole',
            data: {
              element: elementName,
              role,
            },
            fix(fixer) {
              const lastAttr = node.attributes[node.attributes.length - 1];
              
              if (!lastAttr) {
                // No attributes, add role as the first attribute
                return fixer.insertTextAfter(
                  node.name,
                  ` role="${role}"`
                );
              }
              
              // Add role after the last attribute
              return fixer.insertTextAfter(
                lastAttr,
                ` role="${role}"`
              );
            },
          });
        }
      },
    };
  },
};
