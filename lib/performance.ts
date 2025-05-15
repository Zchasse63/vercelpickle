/**
 * Performance Optimization Utilities
 * 
 * This module provides utilities for optimizing performance in React components.
 * It includes memoization helpers, performance monitoring, and optimization utilities.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { memo, ComponentType, useMemo } from "react";

/**
 * Memoize a component with a custom comparison function
 * 
 * @param Component - The component to memoize
 * @param propsAreEqual - Custom comparison function for props
 * @returns Memoized component
 */
export function memoWithComparison<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  return memo(Component, propsAreEqual);
}

/**
 * Create a deep comparison function for props
 * 
 * @param keys - Optional keys to compare (if not provided, all keys are compared)
 * @returns Comparison function for props
 */
export function createDeepPropsComparison<P extends object>(keys?: (keyof P)[]) {
  return (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    // If keys are provided, only compare those keys
    if (keys) {
      return keys.every(key => {
        return JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key]);
      });
    }
    
    // Otherwise, compare all keys
    const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
    
    return Array.from(allKeys).every(key => {
      return JSON.stringify((prevProps as any)[key]) === JSON.stringify((nextProps as any)[key]);
    });
  };
}

/**
 * Hook for debouncing a value
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for throttling a function
 * 
 * @param callback - The function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  const lastCall = useRef(0);
  const lastCallArgs = useRef<Parameters<T>>();
  const lastCallResult = useRef<ReturnType<T>>();
  
  return useCallback(
    (...args: Parameters<T>): ReturnType<T> | undefined => {
      const now = Date.now();
      
      // Store the args for potential later use
      lastCallArgs.current = args;
      
      // If enough time has passed since the last call, execute the function
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        lastCallResult.current = callback(...args);
        return lastCallResult.current;
      }
      
      // Otherwise, return the result of the last call
      return lastCallResult.current;
    },
    [callback, delay]
  );
}

/**
 * Hook for tracking render count of a component
 * 
 * @param componentName - Name of the component (for logging)
 * @returns Render count
 */
export function useRenderCount(componentName?: string): number {
  const renderCount = useRef(0);
  
  // Increment render count on each render
  renderCount.current += 1;
  
  // Log render count in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Render] ${componentName || "Component"} rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
}

/**
 * Hook for measuring component performance
 * 
 * @param componentName - Name of the component (for logging)
 * @returns Object with start and end functions
 */
export function usePerformanceMeasure(componentName: string) {
  const startTime = useRef(0);
  
  // Start measuring
  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);
  
  // End measuring and log the result
  const end = useCallback((operation = "render") => {
    if (startTime.current === 0) return;
    
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    console.log(`[Performance] ${componentName} ${operation}: ${duration.toFixed(2)}ms`);
    
    // Log a warning if the operation took too long
    if (duration > 16) { // 16ms = 60fps
      console.warn(`[Performance Warning] ${componentName} ${operation} took ${duration.toFixed(2)}ms (> 16ms)`);
    }
    
    startTime.current = 0;
  }, [componentName]);
  
  // Automatically measure render time
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      start();
      
      return () => {
        end();
      };
    }
  }, [start, end]);
  
  return { start, end };
}

/**
 * Hook for memoizing expensive computations with deep comparison
 * 
 * @param factory - Factory function that creates the value
 * @param deps - Dependencies array
 * @returns Memoized value
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const depsString = JSON.stringify(deps);
  return useMemo(factory, [depsString]);
}

/**
 * Hook for detecting when a component is visible in the viewport
 * 
 * @param options - IntersectionObserver options
 * @returns Ref and isVisible flag
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [options]);
  
  return { ref, isVisible };
}
