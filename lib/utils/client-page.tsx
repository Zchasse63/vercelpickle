"use client";

import React, { ComponentType } from "react";
import { lazyPage } from "./lazy-import";

/**
 * Create a client page component with standardized layout and error handling
 *
 * @param Component - The component to render
 * @param SkeletonComponent - The skeleton component to show while loading
 * @param options - Additional options for the client page
 * @returns A client page component
 *
 * @example
 * ```tsx
 * // Create a client page component
 * const ClientPage = createClientPage(Dashboard, DashboardSkeleton, {
 *   title: "Dashboard",
 *   description: "View your dashboard",
 * });
 *
 * // Use the client page component
 * export default function DashboardPage() {
 *   return <ClientPage />;
 * }
 * ```
 */
export function createClientPage<T extends ComponentType<any>>(
  Component: T,
  SkeletonComponent: React.ComponentType,
  options?: {
    title?: string;
    description?: string;
    className?: string;
  }
) {
  const { title, description, className = "space-y-6" } = options || {};

  // Create the client page component
  function ClientPage(props: React.ComponentProps<T>) {
    return (
      <div className={className}>
        {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
        {description && <p className="text-muted-foreground">{description}</p>}
        <Component {...props} />
      </div>
    );
  }

  // Set the display name
  ClientPage.displayName = `ClientPage(${Component.displayName || Component.name || "Component"})`;

  return ClientPage;
}

/**
 * Create a lazy client page component with standardized layout and error handling
 *
 * @param importFn - The import function that returns the component
 * @param SkeletonComponent - The skeleton component to show while loading
 * @param options - Additional options for the client page
 * @returns A lazy client page component
 *
 * @example
 * ```tsx
 * // Create a lazy client page component
 * const LazyClientPage = createLazyClientPage(
 *   () => import("./Dashboard"),
 *   DashboardSkeleton,
 *   {
 *     title: "Dashboard",
 *     description: "View your dashboard",
 *   }
 * );
 *
 * // Use the lazy client page component
 * export default function DashboardPage() {
 *   return <LazyClientPage />;
 * }
 * ```
 */
export function createLazyClientPage<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  SkeletonComponent: React.ComponentType,
  options?: {
    title?: string;
    description?: string;
    className?: string;
  }
) {
  const { title, description, className = "space-y-6" } = options || {};

  // Create the lazy page component
  const LazyComponent = lazyPage(importFn, SkeletonComponent);

  // Create the client page component
  function ClientPage(props: React.ComponentProps<T>) {
    return (
      <div className={className}>
        {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
        {description && <p className="text-muted-foreground">{description}</p>}
        <LazyComponent {...props} />
      </div>
    );
  }

  // Set the display name
  ClientPage.displayName = `LazyClientPage`;

  return ClientPage;
}
