"use client"

import React, { ComponentType, lazy } from "react"

interface LazyImportOptions {
  ssr?: boolean
  loading?: () => JSX.Element
}

/**
 * Helper function to lazily import a component
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
  const LazyComponent = lazy(async () => {
    const module = await importFn()
    return { default: module[componentName] }
  })

  const LoadingComponent = options.loading || (() => null)

  const Component = (props: React.ComponentProps<T>) => {
    if (options.ssr === false && typeof window === "undefined") {
      return <LoadingComponent />
    }

    return (
      <React.Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }

  // Copy display name and other statics
  if (process.env.NODE_ENV !== "production") {
    const name = componentName.toString()
    Component.displayName = `Lazy(${name})`
  }

  return Component as unknown as T
}
