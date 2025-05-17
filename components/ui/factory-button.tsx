import { Loader2 } from 'lucide-react';
import { createComponent } from '@/lib/component-factory';

/**
 * Button component created using the component factory pattern
 */
export const FactoryButton = createComponent({
  name: 'FactoryButton',
  element: 'button',
  baseClassName: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
    isLoading: {
      true: 'relative text-transparent transition-none hover:text-transparent disabled:pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    isLoading: false,
  },
});

/**
 * Button component with loading state
 */
export interface ButtonProps extends React.ComponentProps<typeof FactoryButton> {
  isLoading?: boolean;
}

export const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  // Extract the isLoading prop to avoid passing it to the DOM element
  const buttonProps = { ...props };

  return (
    <FactoryButton
      isLoading={isLoading}
      disabled={isLoading || props.disabled}
      {...buttonProps}
    >
      {isLoading && (
        <Loader2
          className="absolute h-4 w-4 animate-spin"
          data-testid="loader-icon"
        />
      )}
      {children}
    </FactoryButton>
  );
};

Button.displayName = 'Button';
