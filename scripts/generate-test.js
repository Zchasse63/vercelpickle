#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Templates
const templates = {
  basic: `import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders correctly with default props', () => {
    render(<{{pascalCase name}} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('renders correctly with custom className', () => {
    render(<{{pascalCase name}} className="custom-class" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('custom-class');
  });
  
  it('passes additional props to the component', () => {
    render(
      <{{pascalCase name}} 
        data-testid="test-{{kebabCase name}}" 
        aria-label="Test component"
      >
        Content
      </{{pascalCase name}}>
    );
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveAttribute('aria-label', 'Test component');
  });
});`,

  withVariants: `import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders correctly with default props', () => {
    render(<{{pascalCase name}} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('renders correctly with different variants', () => {
    const { rerender } = render(<{{pascalCase name}} variant="default" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    let component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-default');
    
    rerender(<{{pascalCase name}} variant="secondary" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-secondary');
    
    rerender(<{{pascalCase name}} variant="destructive" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-destructive');
  });
  
  it('renders correctly with different sizes', () => {
    const { rerender } = render(<{{pascalCase name}} size="default" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    let component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-default-size');
    
    rerender(<{{pascalCase name}} size="sm" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-sm');
    
    rerender(<{{pascalCase name}} size="lg" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('expected-class-for-lg');
  });
  
  it('renders correctly with custom className', () => {
    render(<{{pascalCase name}} className="custom-class" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('custom-class');
  });
  
  it('passes additional props to the component', () => {
    render(
      <{{pascalCase name}} 
        data-testid="test-{{kebabCase name}}" 
        aria-label="Test component"
      >
        Content
      </{{pascalCase name}}>
    );
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveAttribute('aria-label', 'Test component');
  });
});`,

  withEvents: `import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import { setupUserEvent } from '@/lib/test-utils-extended';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders correctly with default props', () => {
    render(<{{pascalCase name}} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('handles click events correctly', () => {
    const handleClick = jest.fn();
    render(<{{pascalCase name}} onClick={handleClick} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    fireEvent.click(component);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('handles click events correctly with UserEvent', async () => {
    const handleClick = jest.fn();
    render(<{{pascalCase name}} onClick={handleClick} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    const user = setupUserEvent();
    
    await user.click(component);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('handles keyboard events correctly', async () => {
    const handleKeyDown = jest.fn();
    render(
      <{{pascalCase name}} 
        onKeyDown={handleKeyDown} 
        data-testid="test-{{kebabCase name}}"
      >
        Content
      </{{pascalCase name}}>
    );
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    component.focus();
    
    const user = setupUserEvent();
    await user.keyboard('{enter}');
    
    expect(handleKeyDown).toHaveBeenCalled();
  });
  
  it('renders correctly with custom className', () => {
    render(<{{pascalCase name}} className="custom-class" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('custom-class');
  });
});`,

  withStates: `import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders correctly with default props', () => {
    render(<{{pascalCase name}} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('renders correctly when disabled', () => {
    render(<{{pascalCase name}} disabled data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeDisabled();
    expect(component).toHaveClass('disabled-class');
  });
  
  it('renders correctly with error state', () => {
    render(<{{pascalCase name}} error="Error message" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('error-class');
    
    const errorMessage = screen.getByText('Error message');
    expect(errorMessage).toBeInTheDocument();
  });
  
  it('renders correctly with loading state', () => {
    render(<{{pascalCase name}} isLoading data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('loading-class');
    
    const loader = screen.getByTestId('loader-icon');
    expect(loader).toBeInTheDocument();
  });
  
  it('renders correctly with custom className', () => {
    render(<{{pascalCase name}} className="custom-class" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('custom-class');
  });
});`,

  withA11y: `import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders correctly with default props', () => {
    render(<{{pascalCase name}} data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('has the correct ARIA attributes', () => {
    render(
      <{{pascalCase name}} 
        aria-label="Test label"
        aria-describedby="test-description"
        data-testid="test-{{kebabCase name}}"
      >
        Content
      </{{pascalCase name}}>
    );
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveAttribute('aria-label', 'Test label');
    expect(component).toHaveAttribute('aria-describedby', 'test-description');
  });
  
  it('has the correct role attribute', () => {
    render(<{{pascalCase name}} role="button" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveAttribute('role', 'button');
  });
  
  it('is keyboard navigable', () => {
    const handleKeyDown = jest.fn();
    render(
      <{{pascalCase name}} 
        onKeyDown={handleKeyDown} 
        tabIndex={0}
        data-testid="test-{{kebabCase name}}"
      >
        Content
      </{{pascalCase name}}>
    );
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveAttribute('tabIndex', '0');
    
    component.focus();
    expect(document.activeElement).toBe(component);
  });
  
  it('renders correctly with custom className', () => {
    render(<{{pascalCase name}} className="custom-class" data-testid="test-{{kebabCase name}}">Content</{{pascalCase name}}>);
    
    const component = screen.getByTestId('test-{{kebabCase name}}');
    expect(component).toHaveClass('custom-class');
  });
});`,

  compound: `import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { {{pascalCase name}} } from '@/components/ui/{{kebabCase name}}';

describe('{{pascalCase name}} Component', () => {
  it('renders the root component correctly', () => {
    render(<{{pascalCase name}}>Content</{{pascalCase name}}>);
    
    const component = screen.getByText('Content');
    expect(component).toBeInTheDocument();
    expect(component.parentElement).toHaveClass('root-class');
  });
  
  it('renders with custom className', () => {
    render(<{{pascalCase name}} className="custom-class">Content</{{pascalCase name}}>);
    
    const component = screen.getByText('Content');
    expect(component.parentElement).toHaveClass('custom-class');
  });
  
  it('renders all subcomponents correctly', () => {
    render(
      <{{pascalCase name}}>
        <{{pascalCase name}}.Header>Header</{{pascalCase name}}.Header>
        <{{pascalCase name}}.Body>Body</{{pascalCase name}}.Body>
        <{{pascalCase name}}.Footer>Footer</{{pascalCase name}}.Footer>
      </{{pascalCase name}}>
    );
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    
    expect(screen.getByText('Header').parentElement).toHaveClass('header-class');
    expect(screen.getByText('Body').parentElement).toHaveClass('body-class');
    expect(screen.getByText('Footer').parentElement).toHaveClass('footer-class');
  });
  
  it('renders subcomponents with custom className', () => {
    render(
      <{{pascalCase name}}>
        <{{pascalCase name}}.Header className="custom-header">Header</{{pascalCase name}}.Header>
        <{{pascalCase name}}.Body className="custom-body">Body</{{pascalCase name}}.Body>
        <{{pascalCase name}}.Footer className="custom-footer">Footer</{{pascalCase name}}.Footer>
      </{{pascalCase name}}>
    );
    
    expect(screen.getByText('Header').parentElement).toHaveClass('custom-header');
    expect(screen.getByText('Body').parentElement).toHaveClass('custom-body');
    expect(screen.getByText('Footer').parentElement).toHaveClass('custom-footer');
  });
});`
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

// Process template
function processTemplate(template, data) {
  return template
    .replace(/{{pascalCase name}}/g, pascalCase(data.name))
    .replace(/{{kebabCase name}}/g, kebabCase(data.name));
}

// Main function
async function main() {
  console.log('🧪 Test Generator 🧪');
  console.log('-------------------');
  
  // Get component name
  const name = await new Promise(resolve => {
    rl.question('Component name (e.g. button, card, dialog): ', answer => {
      resolve(answer.trim());
    });
  });
  
  if (!name) {
    console.error('Component name is required');
    rl.close();
    return;
  }
  
  // Get template type
  const templateType = await new Promise(resolve => {
    console.log('\nTemplate types:');
    console.log('1. Basic');
    console.log('2. With Variants');
    console.log('3. With Events');
    console.log('4. With States');
    console.log('5. With Accessibility');
    console.log('6. Compound Component');
    rl.question('\nSelect template type (1-6): ', answer => {
      resolve(answer.trim());
    });
  });
  
  let template;
  switch (templateType) {
    case '1': template = templates.basic; break;
    case '2': template = templates.withVariants; break;
    case '3': template = templates.withEvents; break;
    case '4': template = templates.withStates; break;
    case '5': template = templates.withA11y; break;
    case '6': template = templates.compound; break;
    default: template = templates.basic;
  }
  
  // Process template
  const processedTemplate = processTemplate(template, { name });
  
  // Create directory if it doesn't exist
  const testDir = path.join(process.cwd(), 'components', 'ui', '__tests__');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Write file
  const fileName = `${kebabCase(name)}.test.tsx`;
  const filePath = path.join(testDir, fileName);
  
  if (fs.existsSync(filePath)) {
    const overwrite = await new Promise(resolve => {
      rl.question(`File ${fileName} already exists. Overwrite? (y/n): `, answer => {
        resolve(answer.trim().toLowerCase() === 'y');
      });
    });
    
    if (!overwrite) {
      console.log('Operation cancelled');
      rl.close();
      return;
    }
  }
  
  fs.writeFileSync(filePath, processedTemplate);
  console.log(`\n✅ Test file created: ${filePath}`);
  
  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
});
