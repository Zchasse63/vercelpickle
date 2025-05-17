import React from 'react';
import { Button } from '@/components/ui/factory-button';

// Create a simpler product card component for testing
export const ProductCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageSrc?: string;
    onAddToCart?: () => void;
    className?: string;
    [key: string]: any;
  }
>(({
  title = 'Product Title',
  description,
  price = 0,
  currency = 'USD',
  imageSrc = 'https://via.placeholder.com/300x200',
  onAddToCart,
  className,
  ...props
}, ref) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden ${className || ''}`}
      data-testid="productcard-root"
      {...props}
    >
      <div className="relative" data-testid="product-card-header">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
          data-testid="product-card-image"
        />
      </div>

      <div className="p-4" data-testid="product-card-content">
        <h3
          className="text-lg font-semibold"
          data-testid="product-card-title"
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-sm text-gray-500 line-clamp-2"
            data-testid="product-card-description"
          >
            {description}
          </p>
        )}

        <p
          className="text-lg font-bold mt-2"
          data-testid="product-card-price"
        >
          {formattedPrice}
        </p>
      </div>

      <div className="p-4 pt-0" data-testid="product-card-footer">
        <Button
          onClick={onAddToCart}
          className="w-full"
          data-testid="product-card-button"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Export the product card props type
export interface ProductCardProps extends React.ComponentProps<typeof ProductCard> {}
