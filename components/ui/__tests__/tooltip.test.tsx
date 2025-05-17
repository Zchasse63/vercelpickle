import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { Tooltip } from '@/components/ui/tooltip';

describe('Tooltip Component', () => {
  it('renders correctly with default props', () => {
    render(<Tooltip data-testid="test-tooltip">Content</Tooltip>);
    
    const component = screen.getByTestId('test-tooltip');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Content');
  });
  
  it('has the correct ARIA attributes', () => {
    render(
      <Tooltip 
        aria-label="Test label"
        aria-describedby="test-description"
        data-testid="test-tooltip"
      >
        Content
      </Tooltip>
    );
    
    const component = screen.getByTestId('test-tooltip');
    expect(component).toHaveAttribute('aria-label', 'Test label');
    expect(component).toHaveAttribute('aria-describedby', 'test-description');
  });
  
  it('has the correct role attribute', () => {
    render(<Tooltip role="button" data-testid="test-tooltip">Content</Tooltip>);
    
    const component = screen.getByTestId('test-tooltip');
    expect(component).toHaveAttribute('role', 'button');
  });
  
  it('is keyboard navigable', () => {
    const handleKeyDown = jest.fn();
    render(
      <Tooltip 
        onKeyDown={handleKeyDown} 
        tabIndex={0}
        data-testid="test-tooltip"
      >
        Content
      </Tooltip>
    );
    
    const component = screen.getByTestId('test-tooltip');
    expect(component).toHaveAttribute('tabIndex', '0');
    
    component.focus();
    expect(document.activeElement).toBe(component);
  });
  
  it('renders correctly with custom className', () => {
    render(<Tooltip className="custom-class" data-testid="test-tooltip">Content</Tooltip>);
    
    const component = screen.getByTestId('test-tooltip');
    expect(component).toHaveClass('custom-class');
  });
});