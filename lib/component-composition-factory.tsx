import React from 'react';
import { 
  createComponent, 
  createCompoundComponent, 
  ComponentFactoryConfig, 
  CompoundComponentFactoryConfig 
} from '@/lib/component-factory';
import { 
  composeComponents, 
  ComponentToCompose, 
  CompositionConfig 
} from '@/lib/component-composition';
import { mergeProps } from '@/lib/composition-utils';

/**
 * Configuration for creating a composed component using the factory pattern
 */
export interface ComposedComponentFactoryConfig<T extends React.ElementType = 'div'> {
  /** The component factory configuration */
  factory: ComponentFactoryConfig<T>;
  /** The composition configuration */
  composition: CompositionConfig;
  /** The components to compose */
  components: ComponentToCompose[];
}

/**
 * Creates a composed component using the factory pattern
 * 
 * @example
 * ```tsx
 * const FormField = createComposedComponent({
 *   factory: {
 *     name: 'FormField',
 *     element: 'div',
 *     baseClassName: 'space-y-2',
 *   },
 *   composition: {
 *     name: 'FormField',
 *     type: 'vertical',
 *     gap: 'xs',
 *     align: 'start',
 *   },
 *   components: [
 *     { component: Label },
 *     { component: Input },
 *     { component: FormMessage, condition: (props) => !!props.error },
 *   ],
 * });
 * ```
 */
export function createComposedComponent<T extends React.ElementType = 'div'>({
  factory,
  composition,
  components,
}: ComposedComponentFactoryConfig<T>) {
  // Create the base component using the factory pattern
  const BaseComponent = createComponent(factory);
  
  // Create the composed component
  const ComposedComponent = composeComponents(composition, components);
  
  // Create the final component that combines the base component and the composed component
  const FinalComponent = React.forwardRef<
    React.ElementRef<T>,
    React.ComponentPropsWithoutRef<typeof BaseComponent>
  >((props, ref) => {
    return (
      <BaseComponent ref={ref} {...props}>
        <ComposedComponent {...props} />
      </BaseComponent>
    );
  });
  
  FinalComponent.displayName = factory.name;
  
  return FinalComponent;
}

/**
 * Configuration for creating a composed compound component using the factory pattern
 */
export interface ComposedCompoundComponentFactoryConfig<
  T extends React.ElementType = 'div',
  Parts extends string = string
> {
  /** The compound component factory configuration */
  factory: CompoundComponentFactoryConfig<T, Parts>;
  /** The composition configuration for the root component */
  rootComposition: CompositionConfig;
  /** The components to compose for the root component */
  rootComponents: ComponentToCompose[];
  /** The composition configurations for the part components */
  partCompositions?: Partial<Record<Parts, CompositionConfig>>;
  /** The components to compose for the part components */
  partComponents?: Partial<Record<Parts, ComponentToCompose[]>>;
}

/**
 * Creates a composed compound component using the factory pattern
 * 
 * @example
 * ```tsx
 * const Card = createComposedCompoundComponent({
 *   factory: {
 *     name: 'Card',
 *     element: 'div',
 *     baseClassName: 'rounded-lg border bg-card text-card-foreground shadow-sm',
 *     parts: {
 *       Header: {
 *         element: 'div',
 *         baseClassName: 'flex flex-col space-y-1.5 p-6',
 *       },
 *       Content: {
 *         element: 'div',
 *         baseClassName: 'p-6 pt-0',
 *       },
 *       Footer: {
 *         element: 'div',
 *         baseClassName: 'flex items-center p-6 pt-0',
 *       },
 *     },
 *   },
 *   rootComposition: {
 *     name: 'Card',
 *     type: 'vertical',
 *     gap: 'none',
 *   },
 *   rootComponents: [
 *     { component: CardHeader },
 *     { component: CardContent },
 *     { component: CardFooter },
 *   ],
 *   partCompositions: {
 *     Header: {
 *       name: 'CardHeader',
 *       type: 'vertical',
 *       gap: 'xs',
 *     },
 *     Footer: {
 *       name: 'CardFooter',
 *       type: 'horizontal',
 *       gap: 'sm',
 *       justify: 'end',
 *     },
 *   },
 *   partComponents: {
 *     Header: [
 *       { component: CardTitle },
 *       { component: CardDescription },
 *     ],
 *   },
 * });
 * ```
 */
export function createComposedCompoundComponent<
  T extends React.ElementType = 'div',
  Parts extends string = string
>({
  factory,
  rootComposition,
  rootComponents,
  partCompositions = {},
  partComponents = {},
}: ComposedCompoundComponentFactoryConfig<T, Parts>) {
  // Create the base compound component using the factory pattern
  const BaseCompoundComponent = createCompoundComponent(factory);
  
  // Create the composed root component
  const ComposedRootComponent = composeComponents(rootComposition, rootComponents);
  
  // Create the final root component that combines the base root component and the composed root component
  const FinalRootComponent = React.forwardRef<
    React.ElementRef<T>,
    React.ComponentPropsWithoutRef<typeof BaseCompoundComponent>
  >((props, ref) => {
    return (
      <BaseCompoundComponent ref={ref} {...props}>
        <ComposedRootComponent {...props} />
      </BaseCompoundComponent>
    );
  });
  
  FinalRootComponent.displayName = factory.name;
  
  // Create the composed part components
  const composedPartComponents = {} as Record<
    Parts, 
    React.ForwardRefExoticComponent<
      React.ComponentPropsWithoutRef<React.ElementType> & 
      React.RefAttributes<unknown>
    >
  >;
  
  // Create each composed part component
  for (const partName in factory.parts) {
    const partConfig = factory.parts[partName as Parts];
    const BasePart = BaseCompoundComponent[partName as keyof typeof BaseCompoundComponent];
    
    // Check if we have a composition configuration for this part
    const partComposition = partCompositions[partName as Parts];
    const componentsForPart = partComponents[partName as Parts];
    
    if (partComposition && componentsForPart) {
      // Create a composed part component
      const ComposedPartComponent = composeComponents(partComposition, componentsForPart);
      
      // Create the final part component that combines the base part component and the composed part component
      const FinalPartComponent = React.forwardRef<
        React.ElementRef<typeof partConfig.element>,
        React.ComponentPropsWithoutRef<typeof BasePart>
      >((props, ref) => {
        return (
          <BasePart ref={ref} {...props}>
            <ComposedPartComponent {...props} />
          </BasePart>
        );
      });
      
      FinalPartComponent.displayName = `${factory.name}.${partName}`;
      
      composedPartComponents[partName as Parts] = FinalPartComponent as any;
    } else {
      // Just use the base part component
      composedPartComponents[partName as Parts] = BasePart as any;
    }
  }
  
  // Return the compound component
  return Object.assign(FinalRootComponent, composedPartComponents);
}

/**
 * Creates a composed component from multiple factory components
 * 
 * @example
 * ```tsx
 * const FormField = composeFactoryComponents({
 *   name: 'FormField',
 *   type: 'vertical',
 *   gap: 'xs',
 *   align: 'start',
 * }, [
 *   { component: Label, factory: true },
 *   { component: Input, factory: true },
 *   { component: FormMessage, factory: true, condition: (props) => !!props.error },
 * ]);
 * ```
 */
export function composeFactoryComponents<P = any>(
  config: CompositionConfig,
  components: Array<ComponentToCompose & { factory?: boolean }>
): React.FC<P> {
  // Filter out factory components
  const factoryComponents = components.filter(c => c.factory);
  const nonFactoryComponents = components.filter(c => !c.factory);
  
  // Create the composed component for non-factory components
  const ComposedNonFactoryComponent = nonFactoryComponents.length > 0
    ? composeComponents(config, nonFactoryComponents)
    : null;
  
  // Create the final component that combines all components
  const FinalComponent: React.FC<P> = (props) => {
    return (
      <div className="space-y-2">
        {factoryComponents.map((componentToCompose, index) => {
          const { component: Component, props: componentProps = {}, key, condition, factory } = componentToCompose;
          
          // Skip rendering if condition is provided and returns false
          if (condition && !condition(props)) {
            return null;
          }
          
          // Merge props
          const mergedProps = mergeProps(componentProps, props);
          
          return <Component key={key || index} {...mergedProps} />;
        })}
        
        {ComposedNonFactoryComponent && <ComposedNonFactoryComponent {...props} />}
      </div>
    );
  };
  
  FinalComponent.displayName = config.name;
  
  return FinalComponent;
}
