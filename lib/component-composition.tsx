import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Types of component composition
 */
export type CompositionType = 
  | 'horizontal' // Components are arranged horizontally
  | 'vertical'   // Components are arranged vertically
  | 'layered'    // Components are layered on top of each other
  | 'nested'     // Components are nested inside each other
  | 'conditional' // Components are conditionally rendered
  | 'custom';    // Custom composition

/**
 * Base configuration for component composition
 */
export interface BaseCompositionConfig {
  /** The name of the composed component */
  name: string;
  /** The type of composition */
  type: CompositionType;
  /** The class name for the container */
  className?: string;
  /** Whether the component should have a data-testid attribute */
  withTestId?: boolean;
}

/**
 * Configuration for horizontal composition
 */
export interface HorizontalCompositionConfig extends BaseCompositionConfig {
  type: 'horizontal';
  /** The gap between components */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** The alignment of components */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** The justification of components */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Whether to wrap components */
  wrap?: boolean;
}

/**
 * Configuration for vertical composition
 */
export interface VerticalCompositionConfig extends BaseCompositionConfig {
  type: 'vertical';
  /** The gap between components */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** The alignment of components */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** The justification of components */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

/**
 * Configuration for layered composition
 */
export interface LayeredCompositionConfig extends BaseCompositionConfig {
  type: 'layered';
  /** The position of the container */
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
}

/**
 * Configuration for nested composition
 */
export interface NestedCompositionConfig extends BaseCompositionConfig {
  type: 'nested';
  /** The padding inside the container */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Configuration for conditional composition
 */
export interface ConditionalCompositionConfig extends BaseCompositionConfig {
  type: 'conditional';
  /** The condition to check */
  condition: (props: any) => boolean;
  /** The fallback component to render if the condition is false */
  fallback?: React.ReactNode;
}

/**
 * Configuration for custom composition
 */
export interface CustomCompositionConfig extends BaseCompositionConfig {
  type: 'custom';
  /** The render function for the custom composition */
  render: (props: any) => React.ReactNode;
}

/**
 * Complete composition configuration
 */
export type CompositionConfig = 
  | HorizontalCompositionConfig
  | VerticalCompositionConfig
  | LayeredCompositionConfig
  | NestedCompositionConfig
  | ConditionalCompositionConfig
  | CustomCompositionConfig;

/**
 * Component to compose
 */
export interface ComponentToCompose<P = any> {
  /** The component */
  component: React.ComponentType<P>;
  /** The props to pass to the component */
  props?: Partial<P>;
  /** The key for the component */
  key?: string;
  /** The condition to check for rendering the component */
  condition?: (props: any) => boolean;
}

/**
 * Utility function to get class names for a composition
 */
function getCompositionClassNames(config: CompositionConfig): string {
  const { type, className } = config;
  
  let classNames = '';
  
  switch (type) {
    case 'horizontal':
      classNames = cn(
        'flex flex-row',
        config.wrap && 'flex-wrap',
        config.gap === 'xs' && 'gap-1',
        config.gap === 'sm' && 'gap-2',
        config.gap === 'md' && 'gap-4',
        config.gap === 'lg' && 'gap-6',
        config.gap === 'xl' && 'gap-8',
        config.align === 'start' && 'items-start',
        config.align === 'center' && 'items-center',
        config.align === 'end' && 'items-end',
        config.align === 'stretch' && 'items-stretch',
        config.justify === 'start' && 'justify-start',
        config.justify === 'center' && 'justify-center',
        config.justify === 'end' && 'justify-end',
        config.justify === 'between' && 'justify-between',
        config.justify === 'around' && 'justify-around',
        config.justify === 'evenly' && 'justify-evenly',
      );
      break;
    case 'vertical':
      classNames = cn(
        'flex flex-col',
        config.gap === 'xs' && 'gap-1',
        config.gap === 'sm' && 'gap-2',
        config.gap === 'md' && 'gap-4',
        config.gap === 'lg' && 'gap-6',
        config.gap === 'xl' && 'gap-8',
        config.align === 'start' && 'items-start',
        config.align === 'center' && 'items-center',
        config.align === 'end' && 'items-end',
        config.align === 'stretch' && 'items-stretch',
        config.justify === 'start' && 'justify-start',
        config.justify === 'center' && 'justify-center',
        config.justify === 'end' && 'justify-end',
        config.justify === 'between' && 'justify-between',
        config.justify === 'around' && 'justify-around',
        config.justify === 'evenly' && 'justify-evenly',
      );
      break;
    case 'layered':
      classNames = cn(
        'relative',
        config.position === 'absolute' && 'absolute',
        config.position === 'fixed' && 'fixed',
        config.position === 'sticky' && 'sticky',
      );
      break;
    case 'nested':
      classNames = cn(
        config.padding === 'xs' && 'p-1',
        config.padding === 'sm' && 'p-2',
        config.padding === 'md' && 'p-4',
        config.padding === 'lg' && 'p-6',
        config.padding === 'xl' && 'p-8',
      );
      break;
    case 'conditional':
    case 'custom':
      // No default classes for these types
      break;
  }
  
  return cn(classNames, className);
}

/**
 * Creates a composed component from multiple components
 * 
 * @example
 * ```tsx
 * const FormField = composeComponents({
 *   name: 'FormField',
 *   type: 'vertical',
 *   gap: 'xs',
 *   align: 'start',
 * }, [
 *   { component: Label },
 *   { component: Input },
 *   { component: FormMessage, condition: (props) => !!props.error },
 * ]);
 * ```
 */
export function composeComponents<P = any>(
  config: CompositionConfig,
  components: ComponentToCompose[]
): React.FC<P> {
  // Create the composed component
  const ComposedComponent: React.FC<P> = (props) => {
    // Get the class names for the container
    const containerClassName = getCompositionClassNames(config);
    
    // Add data-testid if withTestId is true
    const testIdProps = config.withTestId !== false 
      ? { 'data-testid': `${config.name.toLowerCase()}-container` } 
      : {};
    
    // Render the components based on the composition type
    switch (config.type) {
      case 'horizontal':
      case 'vertical':
      case 'nested':
        return (
          <div className={containerClassName} {...testIdProps}>
            {components.map((componentToCompose, index) => {
              const { component: Component, props: componentProps = {}, key, condition } = componentToCompose;
              
              // Skip rendering if condition is provided and returns false
              if (condition && !condition(props)) {
                return null;
              }
              
              // Merge props
              const mergedProps = { ...componentProps, ...props };
              
              return <Component key={key || index} {...mergedProps} />;
            })}
          </div>
        );
      
      case 'layered':
        return (
          <div className={containerClassName} {...testIdProps}>
            {components.map((componentToCompose, index) => {
              const { component: Component, props: componentProps = {}, key, condition } = componentToCompose;
              
              // Skip rendering if condition is provided and returns false
              if (condition && !condition(props)) {
                return null;
              }
              
              // Merge props
              const mergedProps = { ...componentProps, ...props };
              
              // Add absolute positioning for layered components
              const style = index > 0 ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } : {};
              
              return <Component key={key || index} style={style} {...mergedProps} />;
            })}
          </div>
        );
      
      case 'conditional':
        // Find the first component that meets the condition
        for (const componentToCompose of components) {
          const { component: Component, props: componentProps = {}, condition } = componentToCompose;
          
          // Use the component's condition if provided, otherwise use the config condition
          const shouldRender = condition 
            ? condition(props) 
            : config.condition(props);
          
          if (shouldRender) {
            // Merge props
            const mergedProps = { ...componentProps, ...props };
            
            return <Component {...mergedProps} />;
          }
        }
        
        // Render fallback if no component meets the condition
        return config.fallback || null;
      
      case 'custom':
        // Use the custom render function
        return config.render(props);
      
      default:
        return null;
    }
  };
  
  ComposedComponent.displayName = config.name;
  
  return ComposedComponent;
}
