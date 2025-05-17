/**
 * Rule to enforce the use of the component factory pattern
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce the use of the component factory pattern',
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
          ignoreComponents: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          factoryPath: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useComponentFactory: 'Component "{{name}}" should use the component factory pattern',
      useCompoundComponentFactory: 'Compound component "{{name}}" should use the compound component factory pattern',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const targetComponents = options.components || [];
    const ignoreComponents = options.ignoreComponents || [];
    const factoryPath = options.factoryPath || '@/lib/component-factory';
    
    const sourceCode = context.getSourceCode();
    
    /**
     * Check if a component is a compound component
     * @param {string} componentName - The component name
     * @returns {boolean} - Whether the component is a compound component
     */
    function isCompoundComponent(componentName) {
      const program = sourceCode.ast;
      
      // Look for Object.assign(Component, { SubComponent1, SubComponent2, ... })
      for (const node of program.body) {
        if (
          node.type === 'ExpressionStatement' &&
          node.expression.type === 'AssignmentExpression' &&
          node.expression.right.type === 'CallExpression' &&
          node.expression.right.callee.type === 'MemberExpression' &&
          node.expression.right.callee.object.name === 'Object' &&
          node.expression.right.callee.property.name === 'assign' &&
          node.expression.right.arguments.length >= 2 &&
          node.expression.right.arguments[0].type === 'Identifier' &&
          node.expression.right.arguments[0].name === componentName
        ) {
          return true;
        }
      }
      
      return false;
    }
    
    /**
     * Check if a component already uses the component factory pattern
     * @param {Object} node - The component node
     * @returns {boolean} - Whether the component uses the factory pattern
     */
    function usesComponentFactory(node) {
      // Check if the component is created using createComponent or createCompoundComponent
      if (
        node.type === 'VariableDeclarator' &&
        node.init &&
        node.init.type === 'CallExpression' &&
        node.init.callee.type === 'Identifier' &&
        (node.init.callee.name === 'createComponent' || node.init.callee.name === 'createCompoundComponent')
      ) {
        return true;
      }
      
      // Check for imports from the component factory
      const program = sourceCode.ast;
      
      for (const node of program.body) {
        if (
          node.type === 'ImportDeclaration' &&
          node.source.value === factoryPath &&
          node.specifiers.some(specifier => 
            specifier.type === 'ImportSpecifier' && 
            (specifier.imported.name === 'createComponent' || specifier.imported.name === 'createCompoundComponent')
          )
        ) {
          return true;
        }
      }
      
      return false;
    }

    return {
      // Check variable declarations for components
      'VariableDeclarator[id.type="Identifier"]'(node) {
        const componentName = node.id.name;
        
        // Skip if the component is in the ignore list
        if (ignoreComponents.includes(componentName)) {
          return;
        }
        
        // Skip if the component is not in the target list and the target list is not empty
        if (targetComponents.length > 0 && !targetComponents.includes(componentName)) {
          return;
        }
        
        // Skip if it's not a function or doesn't return JSX
        if (
          !node.init ||
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
        
        // Skip if the component already uses the factory pattern
        if (usesComponentFactory(node)) {
          return;
        }
        
        // Check if it's a compound component
        const isCompound = isCompoundComponent(componentName);
        
        context.report({
          node: node.id,
          messageId: isCompound ? 'useCompoundComponentFactory' : 'useComponentFactory',
          data: {
            name: componentName,
          },
        });
      },
      
      // Check function declarations for components
      'FunctionDeclaration[id.name]'(node) {
        const componentName = node.id.name;
        
        // Skip if the component is in the ignore list
        if (ignoreComponents.includes(componentName)) {
          return;
        }
        
        // Skip if the component is not in the target list and the target list is not empty
        if (targetComponents.length > 0 && !targetComponents.includes(componentName)) {
          return;
        }
        
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
        
        // Skip if the component already uses the factory pattern
        if (usesComponentFactory(node)) {
          return;
        }
        
        // Check if it's a compound component
        const isCompound = isCompoundComponent(componentName);
        
        context.report({
          node: node.id,
          messageId: isCompound ? 'useCompoundComponentFactory' : 'useComponentFactory',
          data: {
            name: componentName,
          },
        });
      },
    };
  },
};
