#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration for component transformations
const COMPONENTS_DIR = path.join(process.cwd(), 'components', 'ui');
const TEST_ID_MAP = {
  'button.tsx': [
    { element: 'Loader2', testId: 'loader-icon' }
  ],
  'checkbox.tsx': [
    { element: 'Check', testId: 'check-icon' },
    { element: 'Minus', testId: 'minus-icon' }
  ],
  'dialog.tsx': [
    { element: 'X', testId: 'close-icon' }
  ],
  'input.tsx': [
    { element: 'Loader2', testId: 'loader-icon' },
    { element: 'AlertCircle', testId: 'alert-icon' }
  ],
  'radio-group.tsx': [
    { element: 'Circle', testId: 'circle-icon' }
  ],
  'select.tsx': [
    { element: 'ChevronDown', testId: 'chevron-down-icon' },
    { element: 'Check', testId: 'check-icon' }
  ],
  'textarea.tsx': [
    { element: 'AlertCircle', testId: 'alert-icon' }
  ],
  'toast.tsx': [
    { element: 'X', testId: 'close-icon' }
  ],
  'tooltip.tsx': [
    { element: 'TooltipArrow', testId: 'tooltip-arrow' }
  ],
  'accordion.tsx': [
    { element: 'ChevronDown', testId: 'chevron-down-icon' }
  ],
  'alert-dialog.tsx': [
    { element: 'X', testId: 'close-icon' }
  ],
  'command.tsx': [
    { element: 'Search', testId: 'search-icon' },
    { element: 'ChevronsUpDown', testId: 'chevrons-updown-icon' }
  ],
  'dropdown-menu.tsx': [
    { element: 'Check', testId: 'check-icon' },
    { element: 'Circle', testId: 'circle-icon' },
    { element: 'ChevronRight', testId: 'chevron-right-icon' }
  ],
  'popover.tsx': [
    { element: 'X', testId: 'close-icon' }
  ],
  'tabs.tsx': [
    { element: 'TabsList', testId: 'tabs-list' },
    { element: 'TabsTrigger', testId: 'tabs-trigger' },
    { element: 'TabsContent', testId: 'tabs-content' }
  ]
};

// Helper function to add data-testid attributes to components
function addTestIdAttributes(content, elementsToModify) {
  let modifiedContent = content;

  for (const { element, testId } of elementsToModify) {
    // Regular expression to find the element without data-testid
    const regex = new RegExp(`<${element}([^>]*?)(?!data-testid)([^>]*?)>`, 'g');

    // Check if the element already has a data-testid attribute
    const hasTestId = new RegExp(`<${element}[^>]*?data-testid[^>]*?>`, 'g').test(modifiedContent);

    if (!hasTestId) {
      // Replace with the element that has data-testid
      modifiedContent = modifiedContent.replace(
        regex,
        `<${element}$1$2 data-testid="${testId}">`
      );
    }
  }

  return modifiedContent;
}

// Helper function to add role attributes to components
function addRoleAttributes(content) {
  let modifiedContent = content;

  // Add role="status" to Skeleton component
  modifiedContent = modifiedContent.replace(
    /(<div\s+className={cn\(\s*"relative overflow-hidden rounded-md",\s*gradientClass,\s*animationClasses\[animation\],\s*className\s*\)}\s*)([^>]*?>)/g,
    '$1 role="status" $2'
  );

  // Add role="progressbar" to Progress component
  modifiedContent = modifiedContent.replace(
    /(<div\s+className={cn\(\s*"relative h-\d+ w-full overflow-hidden rounded-full bg-secondary",\s*className\s*\)}\s*)([^>]*?>)/g,
    '$1 role="progressbar" $2'
  );

  // Add role="alert" to Alert component
  modifiedContent = modifiedContent.replace(
    /(<div\s+className={cn\(\s*"relative w-full rounded-lg border p-4",\s*variantStyles\[variant\],\s*className\s*\)}\s*)([^>]*?>)/g,
    '$1 role="alert" $2'
  );

  return modifiedContent;
}

// Helper function to add aria attributes to components
function addAriaAttributes(content) {
  let modifiedContent = content;

  // Add aria-busy to Button component when loading
  modifiedContent = modifiedContent.replace(
    /(<Loader2\s+[^>]*?)(?!aria-hidden)([^>]*?)>/g,
    '$1$2 aria-hidden="true">'
  );

  // Add aria-hidden to icons
  modifiedContent = modifiedContent.replace(
    /(<(Check|X|ChevronDown|Circle|AlertCircle|Search|ChevronsUpDown)\s+[^>]*>)/g,
    '$1 aria-hidden="true"'
  );

  return modifiedContent;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  // Read the file content
  const content = fs.readFileSync(filePath, 'utf-8');

  // Get the file name
  const fileName = path.basename(filePath);

  // Get the elements to modify for this file
  const elementsToModify = TEST_ID_MAP[fileName] || [];

  if (elementsToModify.length === 0) {
    console.log(`No transformations defined for ${fileName}`);
    return;
  }

  // Apply transformations
  let modifiedContent = content;
  modifiedContent = addTestIdAttributes(modifiedContent, elementsToModify);
  modifiedContent = addRoleAttributes(modifiedContent);
  modifiedContent = addAriaAttributes(modifiedContent);

  // Check if the content was modified
  if (modifiedContent === content) {
    console.log(`No changes made to ${fileName}`);
    return;
  }

  // Write the modified content back to the file
  fs.writeFileSync(filePath, modifiedContent);
  console.log(`✅ Updated ${fileName}`);
}

// Process all files in the components directory
function processAllFiles() {
  // Get all component files
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'))
    .map(file => path.join(COMPONENTS_DIR, file));

  // Process each file
  let processedCount = 0;
  for (const file of files) {
    const fileName = path.basename(file);
    if (TEST_ID_MAP[fileName]) {
      processFile(file);
      processedCount++;
    }
  }

  console.log(`\nProcessed ${processedCount} files`);
}

// Process a specific file
function processSpecificFile(fileName) {
  const filePath = path.join(COMPONENTS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist`);
    return;
  }

  processFile(filePath);
}

// Main function
async function main() {
  console.log('🔄 Component Transformation Script 🔄');
  console.log('------------------------------------');

  const mode = await new Promise(resolve => {
    console.log('\nSelect mode:');
    console.log('1. Process all components');
    console.log('2. Process specific component');
    rl.question('\nSelect mode (1-2): ', answer => {
      resolve(answer.trim());
    });
  });

  if (mode === '1') {
    processAllFiles();
  } else if (mode === '2') {
    const fileName = await new Promise(resolve => {
      rl.question('\nEnter component file name (e.g., button.tsx): ', answer => {
        resolve(answer.trim());
      });
    });

    processSpecificFile(fileName);
  } else {
    console.error('Invalid mode');
  }

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
});
