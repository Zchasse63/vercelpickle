/**
 * Event Handler Utilities
 *
 * This module provides utilities for optimizing event handlers in React components.
 */

import { useCallback, useRef } from 'react';

/**
 * Creates a debounced version of a function that delays invoking the function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Additional options
 * @returns A debounced version of the function
 *
 * @example
 * ```tsx
 * const handleSearch = useDebounce((value: string) => {
 *   // Search logic here
 * }, 300);
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 300,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
) {
  const { leading = false, trailing = true, maxWait } = options;
  
  // Use refs to persist values without causing re-renders
  const fnRef = useRef(fn);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  
  // Update the function ref when the function changes
  fnRef.current = fn;
  
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const isInvoking = leading && lastCallTimeRef.current === null;
      
      // Store the last call time and arguments
      lastCallTimeRef.current = now;
      lastArgsRef.current = args;
      
      // Function to execute the callback
      const execute = () => {
        if (!lastArgsRef.current) return;
        fnRef.current(...lastArgsRef.current);
      };
      
      // Function to clear the timeout
      const clear = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      // Clear the existing timeout
      clear();
      
      // If leading and this is the first call, execute immediately
      if (isInvoking) {
        execute();
      }
      
      // Set a new timeout for trailing execution
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          lastCallTimeRef.current = leading ? Date.now() : null;
          execute();
        }, wait);
      }
      
      // If maxWait is specified and we've exceeded it, execute immediately
      if (maxWait !== undefined && lastCallTimeRef.current && now - lastCallTimeRef.current >= maxWait) {
        clear();
        execute();
        lastCallTimeRef.current = leading ? now : null;
      }
    },
    [wait, leading, trailing, maxWait]
  );
}

/**
 * Creates a throttled version of a function that only invokes the function
 * at most once per every specified wait period.
 *
 * @param fn - The function to throttle
 * @param wait - The number of milliseconds to throttle
 * @param options - Additional options
 * @returns A throttled version of the function
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   // Scroll logic here
 * }, 100);
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 100,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
) {
  const { leading = true, trailing = true } = options;
  
  // Use refs to persist values without causing re-renders
  const fnRef = useRef(fn);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  
  // Update the function ref when the function changes
  fnRef.current = fn;
  
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = lastCallTimeRef.current ? wait - (now - lastCallTimeRef.current) : 0;
      const isInvoking = leading && lastCallTimeRef.current === null;
      
      // Store the arguments
      lastArgsRef.current = args;
      
      // Function to execute the callback
      const execute = () => {
        if (!lastArgsRef.current) return;
        fnRef.current(...lastArgsRef.current);
      };
      
      // If this is the first call or we've waited long enough, execute
      if (isInvoking || remaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        lastCallTimeRef.current = now;
        execute();
      } else if (trailing && !timeoutRef.current) {
        // Set a timeout for trailing execution
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = leading ? Date.now() : null;
          timeoutRef.current = null;
          execute();
        }, remaining);
      }
    },
    [wait, leading, trailing]
  );
}

/**
 * Creates a memoized version of an event handler that only changes
 * when the dependencies change.
 *
 * @param fn - The event handler function
 * @param deps - Dependencies that should trigger a new handler
 * @returns A memoized event handler
 *
 * @example
 * ```tsx
 * const handleClick = useEventCallback((e) => {
 *   console.log('Clicked', id);
 * }, [id]);
 * ```
 */
export function useEventCallback<T extends (...args: any[]) => any>(
  fn: T,
  deps: React.DependencyList = []
) {
  // Use useCallback to memoize the function
  return useCallback(fn, deps);
}

/**
 * Creates a memoized version of an event handler that prevents the default
 * browser behavior.
 *
 * @param fn - The event handler function
 * @param deps - Dependencies that should trigger a new handler
 * @returns A memoized event handler that prevents default
 *
 * @example
 * ```tsx
 * const handleSubmit = usePreventDefault((e) => {
 *   // Form submission logic here
 * }, [formData]);
 * ```
 */
export function usePreventDefault<T extends React.SyntheticEvent>(
  fn: (event: T) => void,
  deps: React.DependencyList = []
) {
  return useCallback((event: T) => {
    event.preventDefault();
    fn(event);
  }, deps);
}

/**
 * Creates a memoized version of an event handler that stops the event
 * from propagating to parent elements.
 *
 * @param fn - The event handler function
 * @param deps - Dependencies that should trigger a new handler
 * @returns A memoized event handler that stops propagation
 *
 * @example
 * ```tsx
 * const handleClick = useStopPropagation((e) => {
 *   // Click logic here
 * }, [id]);
 * ```
 */
export function useStopPropagation<T extends React.SyntheticEvent>(
  fn: (event: T) => void,
  deps: React.DependencyList = []
) {
  return useCallback((event: T) => {
    event.stopPropagation();
    fn(event);
  }, deps);
}
