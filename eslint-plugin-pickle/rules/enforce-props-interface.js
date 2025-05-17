/**
 * Rule to enforce consistent props interface naming and structure
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent props interface naming and structure',
      category: 'TypeScript',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
          },
          requiredProps: {
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
      invalidPropsName: 'Props interface name "{{name}}" does not match the pattern "{{pattern}}"',
      missingPropsInterface: 'Component "{{name}}" should have a props interface',
      missingRequiredProp: 'Props interface "{{name}}" is missing required prop "{{prop}}"',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const pattern = options.pattern || '^{{componentName}}Props$';
    const requiredProps = options.requiredProps || ['className'];
    
    const sourceCode = context.getSourceCode();
    
    /**
     * Check if a props interface name is valid for a component
     * @param {string} interfaceName - The interface name
     * @param {string} componentName - The component name
     * @returns {boolean} - Whether the name is valid
     */
    function isValidPropsName(interfaceName, componentName) {
      const expectedPattern = pattern.replace('{{componentName}}', componentName);
      const regex = new RegExp(expectedPattern);
      
      return regex.test(interfaceName);
    }
    
    /**
     * Generate a valid props interface name for a component
     * @param {string} componentName - The component name
     * @returns {string} - The generated interface name
     */
    function generatePropsName(componentName) {
      return pattern.replace('{{componentName}}', componentName);
    }
    
    /**
     * Check if a props interface has all required props
     * @param {Object} node - The interface node
     * @returns {string[]} - The missing required props
     */
    function getMissingRequiredProps(node) {
      if (!node.body || !node.body.body) return requiredProps;
      
      const props = node.body.body.map(prop => {
        if (prop.key && prop.key.name) {
          return prop.key.name;
        }
        return null;
      }).filter(Boolean);
      
      return requiredProps.filter(prop => !props.includes(prop));
    }
    
    /**
     * Find a props interface for a component
     * @param {string} componentName - The component name
     * @returns {Object|null} - The interface node or null
     */
    function findPropsInterface(componentName) {
      const program = sourceCode.ast;
      
      for (const node of program.body) {
        if (
          node.type === 'TSInterfaceDeclaration' &&
          isValidPropsName(node.id.name, componentName)
        ) {
          return node;
        }
      }
      
      return null;
    }

    return {
      // Check function component declarations
      'FunctionDeclaration[id.name]'(node) {
        const componentName = node.id.name;
        
        // Skip if the function doesn't return JSX
        const returnsJSX = context.getScope().childScopes.some(scope => {
          return scope.block === node && scope.variables.some(variable => {
            return variable.references.some(ref => {
              const id = ref.identifier;
              return id.parent && id.parent.type === 'JSXElement';
            });
          });
        });
        
        if (!returnsJSX) return;
        
        // Check if the component has a props parameter with a type annotation
        const hasPropsParam = node.params.length > 0 && 
          node.params[0].typeAnnotation && 
          node.params[0].typeAnnotation.typeAnnotation;
        
        if (!hasPropsParam) {
          // Look for a props interface
          const propsInterface = findPropsInterface(componentName);
          
          if (!propsInterface) {
            context.report({
              node: node.id,
              messageId: 'missingPropsInterface',
              data: {
                name: componentName,
              },
            });
          } else {
            // Check if the props interface has all required props
            const missingProps = getMissingRequiredProps(propsInterface);
            
            if (missingProps.length > 0) {
              missingProps.forEach(prop => {
                context.report({
                  node: propsInterface,
                  messageId: 'missingRequiredProp',
                  data: {
                    name: propsInterface.id.name,
                    prop,
                  },
                });
              });
            }
          }
        } else {
          // Check if the props type is a valid interface
          const typeAnnotation = node.params[0].typeAnnotation.typeAnnotation;
          
          if (
            typeAnnotation.type === 'TSTypeReference' && 
            typeAnnotation.typeName && 
            typeAnnotation.typeName.type === 'Identifier'
          ) {
            const propsTypeName = typeAnnotation.typeName.name;
            
            if (!isValidPropsName(propsTypeName, componentName)) {
              context.report({
                node: typeAnnotation,
                messageId: 'invalidPropsName',
                data: {
                  name: propsTypeName,
                  pattern: pattern.replace('{{componentName}}', componentName),
                },
                fix(fixer) {
                  const validName = generatePropsName(componentName);
                  return fixer.replaceText(typeAnnotation.typeName, validName);
                },
              });
            }
            
            // Look for the props interface
            const propsInterface = findPropsInterface(componentName);
            
            if (propsInterface) {
              // Check if the props interface has all required props
              const missingProps = getMissingRequiredProps(propsInterface);
              
              if (missingProps.length > 0) {
                missingProps.forEach(prop => {
                  context.report({
                    node: propsInterface,
                    messageId: 'missingRequiredProp',
                    data: {
                      name: propsInterface.id.name,
                      prop,
                    },
                  });
                });
              }
            }
          }
        }
      },
      
      // Check variable declarations with arrow functions
      'VariableDeclarator[id.type="Identifier"]'(node) {
        if (!node.init) return;
        
        const componentName = node.id.name;
        
        // Skip if it's not a function or doesn't return JSX
        if (
          (node.init.type !== 'ArrowFunctionExpression' && node.init.type !== 'FunctionExpression') ||
          !node.init.body
        ) {
          return;
        }
        
        // Check if the function returns JSX
        let returnsJSX = false;
        
        if (node.init.body.type === 'JSXElement' || node.init.body.type === 'JSXFragment') {
          returnsJSX = true;
        } else if (node.init.body.type === 'BlockStatement') {
          // Look for return statements with JSX
          const returnStatements = node.init.body.body.filter(stmt => stmt.type === 'ReturnStatement');
          returnsJSX = returnStatements.some(stmt => 
            stmt.argument && 
            (stmt.argument.type === 'JSXElement' || stmt.argument.type === 'JSXFragment')
          );
        }
        
        if (!returnsJSX) return;
        
        // Check if the component has a props parameter with a type annotation
        const hasPropsParam = node.init.params.length > 0 && 
          node.init.params[0].typeAnnotation && 
          node.init.params[0].typeAnnotation.typeAnnotation;
        
        if (!hasPropsParam) {
          // Look for a props interface
          const propsInterface = findPropsInterface(componentName);
          
          if (!propsInterface) {
            context.report({
              node: node.id,
              messageId: 'missingPropsInterface',
              data: {
                name: componentName,
              },
            });
          } else {
            // Check if the props interface has all required props
            const missingProps = getMissingRequiredProps(propsInterface);
            
            if (missingProps.length > 0) {
              missingProps.forEach(prop => {
                context.report({
                  node: propsInterface,
                  messageId: 'missingRequiredProp',
                  data: {
                    name: propsInterface.id.name,
                    prop,
                  },
                });
              });
            }
          }
        } else {
          // Check if the props type is a valid interface
          const typeAnnotation = node.init.params[0].typeAnnotation.typeAnnotation;
          
          if (
            typeAnnotation.type === 'TSTypeReference' && 
            typeAnnotation.typeName && 
            typeAnnotation.typeName.type === 'Identifier'
          ) {
            const propsTypeName = typeAnnotation.typeName.name;
            
            if (!isValidPropsName(propsTypeName, componentName)) {
              context.report({
                node: typeAnnotation,
                messageId: 'invalidPropsName',
                data: {
                  name: propsTypeName,
                  pattern: pattern.replace('{{componentName}}', componentName),
                },
                fix(fixer) {
                  const validName = generatePropsName(componentName);
                  return fixer.replaceText(typeAnnotation.typeName, validName);
                },
              });
            }
            
            // Look for the props interface
            const propsInterface = findPropsInterface(componentName);
            
            if (propsInterface) {
              // Check if the props interface has all required props
              const missingProps = getMissingRequiredProps(propsInterface);
              
              if (missingProps.length > 0) {
                missingProps.forEach(prop => {
                  context.report({
                    node: propsInterface,
                    messageId: 'missingRequiredProp',
                    data: {
                      name: propsInterface.id.name,
                      prop,
                    },
                  });
                });
              }
            }
          }
        }
      },
    };
  },
};
