import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Configuration for creating a component using the factory pattern
 */
export interface ComponentFactoryConfig<T extends React.ElementType = 'div'> {
  /** The name of the component */
  name: string;
  /** The base HTML element to use */
  element: T;
  /** The base class name for the component */
  baseClassName: string;
  /** Variants for the component using class-variance-authority */
  variants?: Record<string, Record<string, string>>;
  /** Default variants for the component */
  defaultVariants?: Record<string, string>;
  /** Whether the component should have a data-testid attribute */
  withTestId?: boolean;
}

/**
 * Creates a component using the factory pattern
 * 
 * @example
 * ```tsx
 * const Button = createComponent({
 *   name: 'Button',
 *   element: 'button',
 *   baseClassName: 'inline-flex items-center justify-center rounded-md text-sm font-medium',
 *   variants: {
 *     variant: {
 *       default: 'bg-primary text-primary-foreground hover:bg-primary/90',
 *       destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
 *       outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
 *     },
 *     size: {
 *       default: 'h-10 py-2 px-4',
 *       sm: 'h-9 px-3',
 *       lg: 'h-11 px-8',
 *     },
 *   },
 *   defaultVariants: {
 *     variant: 'default',
 *     size: 'default',
 *   },
 * });
 * ```
 */
export function createComponent<T extends React.ElementType = 'div'>({
  name,
  element,
  baseClassName,
  variants = {},
  defaultVariants = {},
  withTestId = true,
}: ComponentFactoryConfig<T>) {
  // Create the class variance authority function
  const componentVariants = cva(baseClassName, {
    variants,
    defaultVariants,
  });
  
  // Create the component type
  type ComponentProps = React.ComponentPropsWithoutRef<T> & 
    VariantProps<typeof componentVariants> & {
      asChild?: boolean;
    };
  
  // Create the component
  const Component = React.forwardRef<
    React.ElementRef<T>,
    ComponentProps
  >(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : element;
    
    // Add data-testid if withTestId is true and no data-testid is provided
    const testIdProps = withTestId && !('data-testid' in props) 
      ? { 'data-testid': `${name.toLowerCase()}-element` } 
      : {};
    
    return (
      <Comp
        ref={ref}
        className={cn(componentVariants(props), className)}
        {...testIdProps}
        {...props}
      />
    );
  });
  
  Component.displayName = name;
  
  return Component;
}

/**
 * Configuration for creating a compound component using the factory pattern
 */
export interface CompoundComponentFactoryConfig<
  T extends React.ElementType = 'div',
  Parts extends string = string
> {
  /** The name of the component */
  name: string;
  /** The base HTML element to use */
  element: T;
  /** The base class name for the component */
  baseClassName: string;
  /** Variants for the component using class-variance-authority */
  variants?: Record<string, Record<string, string>>;
  /** Default variants for the component */
  defaultVariants?: Record<string, string>;
  /** The parts of the compound component */
  parts: Record<Parts, {
    element: React.ElementType;
    baseClassName: string;
    variants?: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, string>;
  }>;
  /** Whether the component should have a data-testid attribute */
  withTestId?: boolean;
}

/**
 * Creates a compound component using the factory pattern
 * 
 * @example
 * ```tsx
 * const Card = createCompoundComponent({
 *   name: 'Card',
 *   element: 'div',
 *   baseClassName: 'rounded-lg border bg-card text-card-foreground shadow-sm',
 *   parts: {
 *     Header: {
 *       element: 'div',
 *       baseClassName: 'flex flex-col space-y-1.5 p-6',
 *     },
 *     Title: {
 *       element: 'h3',
 *       baseClassName: 'text-2xl font-semibold leading-none tracking-tight',
 *     },
 *     Description: {
 *       element: 'p',
 *       baseClassName: 'text-sm text-muted-foreground',
 *     },
 *     Content: {
 *       element: 'div',
 *       baseClassName: 'p-6 pt-0',
 *     },
 *     Footer: {
 *       element: 'div',
 *       baseClassName: 'flex items-center p-6 pt-0',
 *     },
 *   },
 * });
 * ```
 */
export function createCompoundComponent<
  T extends React.ElementType = 'div',
  Parts extends string = string
>({
  name,
  element,
  baseClassName,
  variants = {},
  defaultVariants = {},
  parts,
  withTestId = true,
}: CompoundComponentFactoryConfig<T, Parts>) {
  // Create the class variance authority function for the root component
  const rootVariants = cva(baseClassName, {
    variants,
    defaultVariants,
  });
  
  // Create the root component type
  type RootProps = React.ComponentPropsWithoutRef<T> & 
    VariantProps<typeof rootVariants> & {
      asChild?: boolean;
    };
  
  // Create the root component
  const Root = React.forwardRef<
    React.ElementRef<T>,
    RootProps
  >(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : element;
    
    // Add data-testid if withTestId is true and no data-testid is provided
    const testIdProps = withTestId && !('data-testid' in props) 
      ? { 'data-testid': `${name.toLowerCase()}-root` } 
      : {};
    
    return (
      <Comp
        ref={ref}
        className={cn(rootVariants(props), className)}
        {...testIdProps}
        {...props}
      />
    );
  });
  
  Root.displayName = name;
  
  // Create the part components
  const partComponents = {} as Record<
    Parts, 
    React.ForwardRefExoticComponent<
      React.ComponentPropsWithoutRef<React.ElementType> & 
      VariantProps<ReturnType<typeof cva>> & 
      React.RefAttributes<unknown>
    >
  >;
  
  // Create each part component
  for (const [partName, partConfig] of Object.entries(parts)) {
    // Create the class variance authority function for the part
    const partVariants = cva(partConfig.baseClassName, {
      variants: partConfig.variants || {},
      defaultVariants: partConfig.defaultVariants || {},
    });
    
    // Create the part component type
    type PartProps = React.ComponentPropsWithoutRef<typeof partConfig.element> & 
      VariantProps<typeof partVariants> & {
        asChild?: boolean;
      };
    
    // Create the part component
    const PartComponent = React.forwardRef<
      React.ElementRef<typeof partConfig.element>,
      PartProps
    >(({ className, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : partConfig.element;
      
      // Add data-testid if withTestId is true and no data-testid is provided
      const testIdProps = withTestId && !('data-testid' in props) 
        ? { 'data-testid': `${name.toLowerCase()}-${partName.toLowerCase()}` } 
        : {};
      
      return (
        <Comp
          ref={ref}
          className={cn(partVariants(props), className)}
          {...testIdProps}
          {...props}
        />
      );
    });
    
    PartComponent.displayName = `${name}.${partName}`;
    
    // Add the part component to the partComponents object
    partComponents[partName as Parts] = PartComponent as any;
  }
  
  // Return the compound component
  return Object.assign(Root, partComponents);
}
