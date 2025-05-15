import dynamic from 'next/dynamic';
import { ComponentType, lazy } from 'react';

/**
 * Utility function for lazy loading components with Next.js dynamic imports
 * This helps reduce the initial bundle size by code splitting
 *
 * @param importFn - Function that imports the component
 * @param options - Options for dynamic import
 * @returns Dynamically imported component
 */
export function lazyImport<T extends ComponentType<any>, I extends { [K in N]: T }, N extends string>(
  importFn: () => Promise<I>,
  name: N,
  options: {
    ssr?: boolean;
    loading?: ComponentType;
    suspense?: boolean;
  } = {}
): I {
  const LazyComponent = dynamic(() => importFn().then((module) => ({ default: module[name] })), {
    ssr: options.ssr ?? true,
    loading: options.loading as any,
    // suspense option is not supported in DynamicOptions
    // suspense: options.suspense,
  }) as unknown as I;

  return LazyComponent;
}

/**
 * Utility function for lazy loading React components
 * This is a simpler version for client components
 *
 * @param importFn - Function that imports the component
 * @returns Lazy loaded component
 */
export function lazyLoad<T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>): T {
  return lazy(importFn) as unknown as T;
}
