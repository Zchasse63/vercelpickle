import React from 'react';
import { render, screen } from '@/lib/test-utils';
import { Card } from '@/components/ui/factory-card';

describe('Card Compound Component', () => {
  it('renders the root component correctly', () => {
    render(<Card>Card Content</Card>);
    
    const card = screen.getByTestId('card-root');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveTextContent('Card Content');
  });
  
  it('renders with custom className', () => {
    render(<Card className="custom-class">Card Content</Card>);
    
    const card = screen.getByTestId('card-root');
    expect(card).toHaveClass('custom-class');
  });
  
  it('renders all subcomponents correctly', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>Card Content</Card.Content>
        <Card.Footer>Card Footer</Card.Footer>
      </Card>
    );
    
    // Check header
    const header = screen.getByTestId('card-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
    
    // Check title
    const title = screen.getByTestId('card-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveTextContent('Card Title');
    
    // Check description
    const description = screen.getByTestId('card-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveTextContent('Card Description');
    
    // Check content
    const content = screen.getByTestId('card-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
    expect(content).toHaveTextContent('Card Content');
    
    // Check footer
    const footer = screen.getByTestId('card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
    expect(footer).toHaveTextContent('Card Footer');
  });
  
  it('renders subcomponents with custom className', () => {
    render(
      <Card>
        <Card.Header className="custom-header">Header</Card.Header>
        <Card.Title className="custom-title">Title</Card.Title>
        <Card.Description className="custom-description">Description</Card.Description>
        <Card.Content className="custom-content">Content</Card.Content>
        <Card.Footer className="custom-footer">Footer</Card.Footer>
      </Card>
    );
    
    expect(screen.getByTestId('card-header')).toHaveClass('custom-header');
    expect(screen.getByTestId('card-title')).toHaveClass('custom-title');
    expect(screen.getByTestId('card-description')).toHaveClass('custom-description');
    expect(screen.getByTestId('card-content')).toHaveClass('custom-content');
    expect(screen.getByTestId('card-footer')).toHaveClass('custom-footer');
  });
  
  it('renders with custom data-testid attributes', () => {
    render(
      <Card data-testid="custom-card">
        <Card.Header data-testid="custom-header">Header</Card.Header>
        <Card.Title data-testid="custom-title">Title</Card.Title>
        <Card.Description data-testid="custom-description">Description</Card.Description>
        <Card.Content data-testid="custom-content">Content</Card.Content>
        <Card.Footer data-testid="custom-footer">Footer</Card.Footer>
      </Card>
    );
    
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    expect(screen.getByTestId('custom-description')).toBeInTheDocument();
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });
});
