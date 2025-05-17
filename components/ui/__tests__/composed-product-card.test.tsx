import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import { ProductCard } from '@/components/ui/composed-product-card';

describe('ProductCard Component', () => {
  const defaultProps = {
    title: 'Test Product',
    description: 'This is a test product description.',
    price: 19.99,
    currency: 'USD',
    imageSrc: 'https://via.placeholder.com/300x200',
    onAddToCart: jest.fn(),
  };
  
  it('renders correctly with default props', () => {
    render(<ProductCard {...defaultProps} />);
    
    expect(screen.getByTestId('product-card-image')).toHaveAttribute('src', defaultProps.imageSrc);
    expect(screen.getByTestId('product-card-image')).toHaveAttribute('alt', defaultProps.title);
    
    expect(screen.getByTestId('product-card-title')).toHaveTextContent(defaultProps.title);
    expect(screen.getByTestId('product-card-description')).toHaveTextContent(defaultProps.description);
    expect(screen.getByTestId('product-card-price')).toHaveTextContent('$19.99');
    
    expect(screen.getByTestId('product-card-button')).toHaveTextContent('Add to Cart');
  });
  
  it('renders correctly without description', () => {
    const propsWithoutDescription = { ...defaultProps, description: undefined };
    render(<ProductCard {...propsWithoutDescription} />);
    
    expect(screen.getByTestId('product-card-title')).toHaveTextContent(defaultProps.title);
    expect(screen.queryByTestId('product-card-description')).not.toBeInTheDocument();
    expect(screen.getByTestId('product-card-price')).toHaveTextContent('$19.99');
  });
  
  it('formats price correctly with different currency', () => {
    const propsWithEuro = { ...defaultProps, currency: 'EUR' };
    render(<ProductCard {...propsWithEuro} />);
    
    expect(screen.getByTestId('product-card-price')).toHaveTextContent('€19.99');
  });
  
  it('calls onAddToCart when button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    
    const button = screen.getByTestId('product-card-button');
    fireEvent.click(button);
    
    expect(defaultProps.onAddToCart).toHaveBeenCalledTimes(1);
  });
  
  it('renders with default values when props are not provided', () => {
    render(<ProductCard />);
    
    expect(screen.getByTestId('product-card-image')).toHaveAttribute('src', 'https://via.placeholder.com/300x200');
    expect(screen.getByTestId('product-card-title')).toHaveTextContent('Product Title');
    expect(screen.getByTestId('product-card-price')).toHaveTextContent('$0.00');
  });
  
  it('applies custom className to the root element', () => {
    render(<ProductCard {...defaultProps} className="custom-class" />);
    
    const root = screen.getByTestId('productcard-root');
    expect(root).toHaveClass('custom-class');
  });
});
