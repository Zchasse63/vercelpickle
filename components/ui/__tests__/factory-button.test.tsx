import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { FactoryButton, Button } from '@/components/ui/factory-button';

describe('FactoryButton Component', () => {
  it('renders correctly with default props', () => {
    render(<FactoryButton>Click me</FactoryButton>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });
  
  it('renders correctly with different variants', () => {
    const { rerender } = render(<FactoryButton variant="default">Default</FactoryButton>);
    
    let button = screen.getByRole('button', { name: 'Default' });
    expect(button).toHaveClass('bg-primary');
    
    rerender(<FactoryButton variant="destructive">Destructive</FactoryButton>);
    button = screen.getByRole('button', { name: 'Destructive' });
    expect(button).toHaveClass('bg-destructive');
    
    rerender(<FactoryButton variant="outline">Outline</FactoryButton>);
    button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('border');
    
    rerender(<FactoryButton variant="secondary">Secondary</FactoryButton>);
    button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-secondary');
    
    rerender(<FactoryButton variant="ghost">Ghost</FactoryButton>);
    button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toHaveClass('hover:bg-accent');
    
    rerender(<FactoryButton variant="link">Link</FactoryButton>);
    button = screen.getByRole('button', { name: 'Link' });
    expect(button).toHaveClass('text-primary');
  });
  
  it('renders correctly with different sizes', () => {
    const { rerender } = render(<FactoryButton size="default">Default</FactoryButton>);
    
    let button = screen.getByRole('button', { name: 'Default' });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-4');
    
    rerender(<FactoryButton size="sm">Small</FactoryButton>);
    button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
    
    rerender(<FactoryButton size="lg">Large</FactoryButton>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
    
    rerender(<FactoryButton size="icon">Icon</FactoryButton>);
    button = screen.getByRole('button', { name: 'Icon' });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });
  
  it('renders with data-testid attribute', () => {
    render(<FactoryButton>Test Button</FactoryButton>);
    
    const button = screen.getByTestId('factorybutton-element');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });
  
  it('renders with custom data-testid attribute', () => {
    render(<FactoryButton data-testid="custom-button">Test Button</FactoryButton>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });
});

describe('Button Component (with loading state)', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });
  
  it('renders correctly with loading state', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-transparent');
    expect(button).toBeDisabled();
    
    const loader = screen.getByTestId('loader-icon');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin');
  });
  
  it('disables the button when loading', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button', { name: 'Loading' });
    expect(button).toBeDisabled();
  });
});
