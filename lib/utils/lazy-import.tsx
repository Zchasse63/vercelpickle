/**
 * Lazy Import Utility
 *
 * This utility provides a standardized way to create lazy-loaded components
 * with consistent loading states and error handling.
 */

import React, { ComponentType, lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

interface LazyImportOptions {
  /**
   * Whether to use server-side rendering
   * @default false
   */
  ssr?: boolean;
  
  /**
   * Whether to use an error boundary
   * @default true
   */
  withErrorBoundary?: boolean;
  
  /**
   * Whether to use a suspense boundary
   * @default true
   */
  withSuspense?: boolean;
  
  /**
   * The fallback component to show while loading
   * If not provided, the Skeleton component will be used
   */
  fallback?: React.ReactNode;
  
  /**
   * The fallback component to show when an error occurs
   * If not provided, a default error component will be used
   */
  errorFallback?: React.ReactNode;
  
  /**
   * The display name for the lazy component
   * If not provided, a default name will be generated
   */
  displayName?: string;
}

/**
 * Create a lazy-loaded component with standardized loading and error states
 *
 * @param importFn - The import function that returns the component
 * @param options - Options for the lazy component
 * @returns A lazy-loaded component with standardized loading and error states
 *
 * @example
 * ```tsx
 * // Create a lazy-loaded component
 * const LazyComponent = lazyImport(() => import('./Component'), {
 *   fallback: <ComponentSkeleton />,
 *   ssr: false,
 * });
 *
 * // Use the lazy-loaded component
 * function App() {
 *   return <LazyComponent prop1="value1" prop2="value2" />;
 * }
 * ```
 */
export function lazyImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyImportOptions = {}
) {
  const {
    ssr = false,
    withErrorBoundary = true,
    withSuspense = true,
    fallback,
    errorFallback,
    displayName,
  } = options;

  // Create the lazy component
  const LazyComponent = lazy(importFn);

  // Set the display name
  if (displayName) {
    LazyComponent.displayName = displayName;
  }

  // Create the wrapped component
  const WrappedComponent = (props: React.ComponentProps<T>) => {
    // Create the component with suspense
    let component = <LazyComponent {...props} />;

    // Wrap with suspense if needed
    if (withSuspense) {
      component = <Suspense fallback={fallback || <div>Loading...</div>}>{component}</Suspense>;
    }

    // Wrap with error boundary if needed
    if (withErrorBoundary) {
      component = (
        <ErrorBoundary fallback={errorFallback || <div>Something went wrong</div>}>
          {component}
        </ErrorBoundary>
      );
    }

    return component;
  };

  // Set the display name for the wrapped component
  WrappedComponent.displayName = `Lazy(${displayName || 'Component'})`;

  return WrappedComponent;
}

/**
 * Create a lazy-loaded component with a skeleton loader
 *
 * @param importFn - The import function that returns the component
 * @param SkeletonComponent - The skeleton component to show while loading
 * @param options - Additional options for the lazy component
 * @returns A lazy-loaded component with a skeleton loader
 *
 * @example
 * ```tsx
 * // Create a lazy-loaded component with a skeleton loader
 * const LazyComponent = lazyWithSkeleton(
 *   () => import('./Component'),
 *   ComponentSkeleton
 * );
 *
 * // Use the lazy-loaded component
 * function App() {
 *   return <LazyComponent prop1="value1" prop2="value2" />;
 * }
 * ```
 */
export function lazyWithSkeleton<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  SkeletonComponent: React.ComponentType,
  options: Omit<LazyImportOptions, 'fallback'> = {}
) {
  return lazyImport(importFn, {
    ...options,
    fallback: <SkeletonComponent />,
  });
}

/**
 * Create a lazy-loaded page component with a skeleton loader
 *
 * @param importFn - The import function that returns the component
 * @param SkeletonComponent - The skeleton component to show while loading
 * @returns A lazy-loaded page component with a skeleton loader
 *
 * @example
 * ```tsx
 * // Create a lazy-loaded page component
 * const LazyPage = lazyPage(
 *   () => import('./Page'),
 *   PageSkeleton
 * );
 *
 * // Use the lazy-loaded page component
 * export default function Page() {
 *   return <LazyPage />;
 * }
 * ```
 */
export function lazyPage<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  SkeletonComponent: React.ComponentType
) {
  return lazyWithSkeleton(importFn, SkeletonComponent, {
    displayName: 'LazyPage',
    ssr: false,
  });
}
