#!/usr/bin/env node

/**
 * Script to generate component tests using the test factory
 * 
 * This script generates test files for components using the test factory.
 * It analyzes the component file to determine the component type and properties,
 * and then generates a test file with the appropriate test configuration.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Component types
const COMPONENT_TYPES = [
  'basic',
  'interactive',
  'form',
  'compound',
  'layout',
  'navigation',
  'feedback',
  'data-display',
];

// Specialized component types
const SPECIALIZED_COMPONENTS = {
  'button': 'createButtonTests',
  'input': 'createInputTests',
  'card': 'createCardTests',
  'select': 'createSelectTests',
  'checkbox': 'createCheckboxTests',
  'dialog': 'createDialogTests',
  'tabs': 'createTabsTests',
};

// Helper functions
function pascalCase(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// Function to analyze a component file
function analyzeComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract component name
    const componentNameMatch = content.match(/export\s+(?:const|function)\s+([A-Z][a-zA-Z0-9]*)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : null;
    
    // Check if it's a compound component
    const isCompound = content.includes(`${componentName}.`) || content.includes('Object.assign');
    
    // Check for variants
    const hasVariants = content.includes('variant') || content.includes('variants');
    
    // Check for sizes
    const hasSizes = content.includes('size') || content.includes('sizes');
    
    // Check for form elements
    const isForm = content.includes('<input') || 
                  content.includes('<select') || 
                  content.includes('<textarea') || 
                  content.includes('<form');
    
    // Determine component type
    let componentType = 'basic';
    
    if (isCompound) {
      componentType = 'compound';
    } else if (isForm) {
      componentType = 'form';
    } else if (content.includes('onClick') || content.includes('onPress')) {
      componentType = 'interactive';
    } else if (content.includes('layout') || content.includes('grid') || content.includes('flex')) {
      componentType = 'layout';
    } else if (content.includes('nav') || content.includes('link') || content.includes('route')) {
      componentType = 'navigation';
    } else if (content.includes('alert') || content.includes('toast') || content.includes('notification')) {
      componentType = 'feedback';
    } else if (content.includes('table') || content.includes('list') || content.includes('data')) {
      componentType = 'data-display';
    }
    
    // Check for specialized component
    const fileName = path.basename(filePath, '.tsx');
    const specializedType = SPECIALIZED_COMPONENTS[fileName];
    
    return {
      componentName,
      componentType,
      isCompound,
      hasVariants,
      hasSizes,
      isForm,
      specializedType,
    };
  } catch (error) {
    console.error(`Error analyzing component: ${error.message}`);
    return null;
  }
}

// Function to generate a test file
function generateTestFile(componentPath, options) {
  const {
    componentName,
    componentType,
    isCompound,
    hasVariants,
    hasSizes,
    isForm,
    specializedType,
    testId,
  } = options;
  
  // Determine the import path
  const relativePath = path.relative(
    path.join(process.cwd(), 'components', 'ui', '__tests__'),
    componentPath
  ).replace(/\.tsx$/, '');
  
  // Create the test file content
  let content = `import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
`;

  if (specializedType) {
    content += `import { ${specializedType} } from '@/lib/test-factory-specialized';\n`;
  } else {
    content += `import { createComponentTests } from '@/lib/test-factory';\n`;
  }
  
  content += `import { ${componentName} } from '@/${relativePath}';\n\n`;
  
  if (specializedType) {
    content += `describe('${componentName} Component', () => {
  ${specializedType}(${componentName}, {
    name: '${componentName}',
    testId: '${testId}',
  });
});\n`;
  } else {
    content += `describe('${componentName} Component', () => {
  createComponentTests({
    component: ${componentName},
    name: '${componentName}',
    type: '${componentType}',
    testId: '${testId}',
`;
    
    if (hasVariants) {
      content += `    testVariants: true,
    variantProp: 'variant',
    variants: ['default', 'primary', 'secondary'],
    variantClassNames: {
      default: [],
      primary: [],
      secondary: [],
    },
`;
    }
    
    if (hasSizes) {
      content += `    testSizes: true,
    sizeProp: 'size',
    sizes: ['default', 'sm', 'lg'],
    sizeClassNames: {
      default: [],
      sm: [],
      lg: [],
    },
`;
    }
    
    if (isForm) {
      content += `    testForm: true,
    inputValue: 'Test input',
    expectedValue: 'Test input',
`;
    }
    
    if (isCompound) {
      content += `    testCompound: true,
    subcomponents: [
      {
        name: 'Header',
        children: 'Header Content',
        expectedClassNames: [],
      },
      {
        name: 'Content',
        children: 'Content',
        expectedClassNames: [],
      },
      {
        name: 'Footer',
        children: 'Footer Content',
        expectedClassNames: [],
      },
    ],
`;
    }
    
    content += `  });
});\n`;
  }
  
  return content;
}

// Main function
async function main() {
  console.log('🧪 Component Test Generator 🧪');
  console.log('------------------------------');
  
  // Get component path
  const componentPath = await new Promise(resolve => {
    rl.question('Component path (e.g. components/ui/button.tsx): ', answer => {
      resolve(answer.trim());
    });
  });
  
  if (!componentPath) {
    console.error('Component path is required');
    rl.close();
    return;
  }
  
  // Check if the component file exists
  const fullPath = path.resolve(process.cwd(), componentPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Component file not found: ${fullPath}`);
    rl.close();
    return;
  }
  
  // Analyze the component
  const analysis = analyzeComponent(fullPath);
  if (!analysis) {
    console.error('Failed to analyze component');
    rl.close();
    return;
  }
  
  console.log('\nComponent Analysis:');
  console.log(`- Name: ${analysis.componentName}`);
  console.log(`- Type: ${analysis.componentType}`);
  console.log(`- Compound: ${analysis.isCompound}`);
  console.log(`- Has Variants: ${analysis.hasVariants}`);
  console.log(`- Has Sizes: ${analysis.hasSizes}`);
  console.log(`- Is Form: ${analysis.isForm}`);
  console.log(`- Specialized Type: ${analysis.specializedType || 'None'}`);
  
  // Get component type
  const componentType = await new Promise(resolve => {
    rl.question(`\nComponent type (${COMPONENT_TYPES.join(', ')}): `, answer => {
      const type = answer.trim() || analysis.componentType;
      resolve(COMPONENT_TYPES.includes(type) ? type : analysis.componentType);
    });
  });
  
  // Get test ID
  const fileName = path.basename(fullPath, '.tsx');
  const defaultTestId = `${fileName}-element`;
  
  const testId = await new Promise(resolve => {
    rl.question(`\nTest ID (default: ${defaultTestId}): `, answer => {
      resolve(answer.trim() || defaultTestId);
    });
  });
  
  // Generate the test file
  const testFileContent = generateTestFile(fullPath, {
    ...analysis,
    componentType,
    testId,
  });
  
  // Create the test file
  const testDir = path.join(process.cwd(), 'components', 'ui', '__tests__');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const testFileName = `${fileName}.test.tsx`;
  const testFilePath = path.join(testDir, testFileName);
  
  if (fs.existsSync(testFilePath)) {
    const overwrite = await new Promise(resolve => {
      rl.question(`File ${testFileName} already exists. Overwrite? (y/n): `, answer => {
        resolve(answer.trim().toLowerCase() === 'y');
      });
    });
    
    if (!overwrite) {
      console.log('Operation cancelled');
      rl.close();
      return;
    }
  }
  
  fs.writeFileSync(testFilePath, testFileContent);
  console.log(`\n✅ Test file created: ${testFilePath}`);
  
  // Format the file with Prettier if available
  try {
    execSync(`npx prettier --write ${testFilePath}`);
    console.log('✨ Test file formatted with Prettier');
  } catch (error) {
    console.log('Note: Prettier not available for formatting');
  }
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
});
