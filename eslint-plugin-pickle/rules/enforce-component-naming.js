/**
 * Rule to enforce consistent component naming conventions
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent component naming conventions',
      category: 'Stylistic Issues',
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
          ignorePattern: {
            type: 'string',
          },
          checkFilename: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidComponentName: 'Component name "{{name}}" does not match the pattern "{{pattern}}"',
      invalidFilename: 'Component filename "{{filename}}" does not match the component name "{{name}}"',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const pattern = options.pattern || '^[A-Z][a-zA-Z0-9]*$';
    const ignorePattern = options.ignorePattern || '^_';
    const checkFilename = options.checkFilename !== false;
    
    const componentNameRegex = new RegExp(pattern);
    const ignoreRegex = new RegExp(ignorePattern);
    
    /**
     * Convert PascalCase to kebab-case
     * @param {string} str - The string to convert
     * @returns {string} - The converted string
     */
    function pascalToKebab(str) {
      return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
    }
    
    /**
     * Check if a component name is valid
     * @param {string} name - The component name
     * @returns {boolean} - Whether the name is valid
     */
    function isValidComponentName(name) {
      if (ignoreRegex.test(name)) {
        return true;
      }
      
      return componentNameRegex.test(name);
    }
    
    /**
     * Check if a filename matches a component name
     * @param {string} filename - The filename
     * @param {string} componentName - The component name
     * @returns {boolean} - Whether the filename matches
     */
    function isValidFilename(filename, componentName) {
      const expectedFilename = pascalToKebab(componentName);
      const filenameWithoutExt = filename.replace(/\.[^.]+$/, '');
      
      return filenameWithoutExt === expectedFilename;
    }

    return {
      // Check function component declarations
      FunctionDeclaration(node) {
        if (!node.id) return;
        
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
        
        if (!isValidComponentName(componentName)) {
          context.report({
            node: node.id,
            messageId: 'invalidComponentName',
            data: {
              name: componentName,
              pattern,
            },
            fix(fixer) {
              // Convert to PascalCase
              const fixedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
              return fixer.replaceText(node.id, fixedName);
            },
          });
        }
        
        if (checkFilename) {
          const filename = context.getFilename().split('/').pop();
          if (!isValidFilename(filename, componentName)) {
            context.report({
              node: node.id,
              messageId: 'invalidFilename',
              data: {
                filename,
                name: componentName,
              },
            });
          }
        }
      },
      
      // Check variable declarations with arrow functions
      VariableDeclarator(node) {
        if (!node.id || node.id.type !== 'Identifier') return;
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
        
        if (!isValidComponentName(componentName)) {
          context.report({
            node: node.id,
            messageId: 'invalidComponentName',
            data: {
              name: componentName,
              pattern,
            },
            fix(fixer) {
              // Convert to PascalCase
              const fixedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
              return fixer.replaceText(node.id, fixedName);
            },
          });
        }
        
        if (checkFilename) {
          const filename = context.getFilename().split('/').pop();
          if (!isValidFilename(filename, componentName)) {
            context.report({
              node: node.id,
              messageId: 'invalidFilename',
              data: {
                filename,
                name: componentName,
              },
            });
          }
        }
      },
    };
  },
};
