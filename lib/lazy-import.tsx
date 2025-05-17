"use client"

import React, { ComponentType, lazy, Suspense, useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazyImportOptions {
  ssr?: boolean
  loading?: React.ReactNode | (() => React.ReactNode)
  errorComponent?: React.ReactNode | ((error: Error, retry: () => void) => React.ReactNode)
  onError?: (error: Error) => void
  retry?: boolean
  preload?: boolean
}

/**
 * Enhanced error boundary component for lazy-loaded components
 */
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback: React.ReactNode | ((error: Error, retry: () => void) => React.ReactNode)
    onError?: (error: Error) => void
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in lazy-loaded component:", error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error!, this.retry)
      }
      return this.props.fallback
    }

    return this.props.children
  }
}

/**
 * Default loading component that provides a standardized skeleton UI
 */
const DefaultLoadingComponent = () => (
  <div className="w-full space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-1/2" />
  </div>
)

/**
 * Default error component that provides a standardized error UI with retry functionality
 */
const DefaultErrorComponent = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
      Failed to load component
    </h3>
    <p className="text-red-600 dark:text-red-400 mb-4">
      {error.message || "An unexpected error occurred"}
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
    >
      Retry
    </button>
  </div>
)

/**
 * Enhanced helper function to lazily import a component with improved error handling and loading states
 * @param importFn - The import function
 * @param componentName - The name of the component to import
 * @param options - Options for the lazy import
 * @returns The lazily imported component
 */
export function lazyImport<T extends ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
  importFn: () => Promise<I>,
  componentName: K,
  options: LazyImportOptions = {}
): T {
  // Create the lazy component
  const LazyComponent = lazy(async () => {
    try {
      const module = await importFn()
      return { default: module[componentName] }
    } catch (error) {
      console.error(`Error loading component ${String(componentName)}:`, error)
      throw error
    }
  })

  // Determine loading component
  const LoadingComponent = options.loading
    ? (typeof options.loading === "function" ? options.loading : () => options.loading)
    : DefaultLoadingComponent

  // Determine error component
  const ErrorComponent = options.errorComponent
    ? (typeof options.errorComponent === "function"
        ? (error: Error, retry: () => void) => options.errorComponent as any
        : () => options.errorComponent)
    : DefaultErrorComponent

  // Create the wrapper component
  const Component = (props: React.ComponentProps<T>) => {
    const [key, setKey] = useState(0)

    // Handle SSR case
    if (options.ssr === false && typeof window === "undefined") {
      return <>{LoadingComponent()}</>
    }

    // Preload the component if specified
    useEffect(() => {
      if (options.preload) {
        importFn().catch(console.error)
      }
    }, [])

    // Reset key to force remount when retrying
    const handleRetry = () => {
      setKey(prev => prev + 1)
    }

    return (
      <ErrorBoundary
        key={key}
        fallback={(error, retry) =>
          typeof ErrorComponent === "function"
            ? ErrorComponent(error, retry)
            : ErrorComponent
        }
        onError={options.onError}
      >
        <Suspense fallback={<>{LoadingComponent()}</>}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  // Copy display name and other statics
  if (process.env.NODE_ENV !== "production") {
    const name = String(componentName)
    Component.displayName = `Lazy(${name})`
  }

  return Component as unknown as T
}

/**
 * Preload a component without rendering it
 * @param importFn - The import function
 * @param componentName - The name of the component to preload
 */
export function preloadComponent<I extends Record<K, ComponentType<any>>, K extends keyof I>(
  importFn: () => Promise<I>,
  componentName: K
): void {
  importFn()
    .then(module => {
      // Just accessing the component is enough to preload it
      const _ = module[componentName]
    })
    .catch(error => {
      console.error(`Error preloading component ${String(componentName)}:`, error)
    })
}
