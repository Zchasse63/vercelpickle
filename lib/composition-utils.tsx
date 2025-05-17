import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Merges multiple refs into a single ref
 * 
 * @example
 * ```tsx
 * const Component = React.forwardRef((props, ref) => {
 *   const internalRef = React.useRef(null);
 *   const mergedRef = mergeRefs(internalRef, ref);
 *   
 *   return <div ref={mergedRef} {...props} />;
 * });
 * ```
 */
export function mergeRefs<T = any>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}

/**
 * Merges multiple props objects into a single props object
 * 
 * @example
 * ```tsx
 * const mergedProps = mergeProps(
 *   { className: 'text-red-500', disabled: true },
 *   { className: 'bg-blue-500', 'aria-disabled': true }
 * );
 * // { className: 'text-red-500 bg-blue-500', disabled: true, 'aria-disabled': true }
 * ```
 */
export function mergeProps<T extends Record<string, any>>(...propsList: T[]): T {
  const result = {} as T;
  
  for (const props of propsList) {
    for (const key in props) {
      if (key === 'className') {
        result.className = cn(result.className, props.className);
      } else if (key === 'style') {
        result.style = { ...result.style, ...props.style };
      } else if (key.startsWith('on') && typeof props[key] === 'function') {
        const existingHandler = result[key];
        if (existingHandler && typeof existingHandler === 'function') {
          result[key] = (...args: any[]) => {
            existingHandler(...args);
            props[key](...args);
          };
        } else {
          result[key] = props[key];
        }
      } else {
        result[key] = props[key];
      }
    }
  }
  
  return result;
}

/**
 * Creates a component that forwards all props to a child component
 * 
 * @example
 * ```tsx
 * const ButtonWithIcon = forwardProps(Button, (props) => ({
 *   ...props,
 *   leftIcon: <Icon name="check" />,
 * }));
 * ```
 */
export function forwardProps<P = any>(
  Component: React.ComponentType<P>,
  transformProps?: (props: P) => P
): React.FC<P> {
  const ForwardedComponent: React.FC<P> = (props) => {
    const finalProps = transformProps ? transformProps(props) : props;
    return <Component {...finalProps} />;
  };
  
  ForwardedComponent.displayName = `ForwardedProps(${Component.displayName || Component.name || 'Component'})`;
  
  return ForwardedComponent;
}

/**
 * Creates a component that conditionally renders a component
 * 
 * @example
 * ```tsx
 * const ConditionalButton = conditionalRender(Button, (props) => !props.disabled);
 * ```
 */
export function conditionalRender<P = any>(
  Component: React.ComponentType<P>,
  condition: (props: P) => boolean,
  Fallback?: React.ComponentType<P>
): React.FC<P> {
  const ConditionalComponent: React.FC<P> = (props) => {
    if (condition(props)) {
      return <Component {...props} />;
    }
    
    return Fallback ? <Fallback {...props} /> : null;
  };
  
  ConditionalComponent.displayName = `ConditionalRender(${Component.displayName || Component.name || 'Component'})`;
  
  return ConditionalComponent;
}

/**
 * Creates a component that adds props to a child component
 * 
 * @example
 * ```tsx
 * const PrimaryButton = withProps(Button, { variant: 'primary' });
 * ```
 */
export function withProps<P = any>(
  Component: React.ComponentType<P>,
  additionalProps: Partial<P>
): React.FC<P> {
  const WithPropsComponent: React.FC<P> = (props) => {
    const mergedProps = mergeProps(additionalProps, props);
    return <Component {...mergedProps} />;
  };
  
  WithPropsComponent.displayName = `WithProps(${Component.displayName || Component.name || 'Component'})`;
  
  return WithPropsComponent;
}

/**
 * Creates a component that adds a wrapper around a child component
 * 
 * @example
 * ```tsx
 * const ButtonWithTooltip = withWrapper(Button, (children, props) => (
 *   <Tooltip content={props.tooltipContent}>{children}</Tooltip>
 * ));
 * ```
 */
export function withWrapper<P = any>(
  Component: React.ComponentType<P>,
  Wrapper: (children: React.ReactNode, props: P) => React.ReactNode
): React.FC<P> {
  const WithWrapperComponent: React.FC<P> = (props) => {
    return Wrapper(<Component {...props} />, props);
  };
  
  WithWrapperComponent.displayName = `WithWrapper(${Component.displayName || Component.name || 'Component'})`;
  
  return WithWrapperComponent;
}

/**
 * Creates a component that adds a label to a child component
 * 
 * @example
 * ```tsx
 * const LabeledInput = withLabel(Input, (props) => props.label);
 * ```
 */
export function withLabel<P extends { id?: string } = any>(
  Component: React.ComponentType<P>,
  getLabel: (props: P) => React.ReactNode,
  position: 'top' | 'right' | 'bottom' | 'left' = 'top'
): React.FC<P> {
  const WithLabelComponent: React.FC<P> = (props) => {
    const label = getLabel(props);
    
    if (!label) {
      return <Component {...props} />;
    }
    
    const id = props.id || `labeled-component-${Math.random().toString(36).substring(2, 9)}`;
    const componentProps = { ...props, id };
    
    const labelElement = (
      <label 
        htmlFor={id}
        className="text-sm font-medium"
        data-testid="component-label"
      >
        {label}
      </label>
    );
    
    const containerClassName = cn(
      'flex',
      position === 'top' && 'flex-col gap-1',
      position === 'right' && 'flex-row-reverse items-center gap-2',
      position === 'bottom' && 'flex-col-reverse gap-1',
      position === 'left' && 'flex-row items-center gap-2',
    );
    
    return (
      <div className={containerClassName}>
        {labelElement}
        <Component {...componentProps} />
      </div>
    );
  };
  
  WithLabelComponent.displayName = `WithLabel(${Component.displayName || Component.name || 'Component'})`;
  
  return WithLabelComponent;
}

/**
 * Creates a component that adds an error message to a child component
 * 
 * @example
 * ```tsx
 * const InputWithError = withErrorMessage(Input, (props) => props.error);
 * ```
 */
export function withErrorMessage<P = any>(
  Component: React.ComponentType<P>,
  getErrorMessage: (props: P) => React.ReactNode
): React.FC<P> {
  const WithErrorMessageComponent: React.FC<P> = (props) => {
    const errorMessage = getErrorMessage(props);
    
    return (
      <div className="flex flex-col gap-1">
        <Component {...props} />
        {errorMessage && (
          <p 
            className="text-sm text-destructive"
            data-testid="component-error"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  };
  
  WithErrorMessageComponent.displayName = `WithErrorMessage(${Component.displayName || Component.name || 'Component'})`;
  
  return WithErrorMessageComponent;
}
