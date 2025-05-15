/**
 * Data Access Layer (DAL)
 *
 * This module provides a centralized interface for interacting with the Convex backend.
 * It implements consistent patterns for data fetching, error handling, and state management.
 *
 * Features:
 * - Enhanced query hooks with loading, error, and success states
 * - Enhanced mutation hooks with optimistic updates
 * - Caching with automatic invalidation
 * - Pagination support
 * - Batch query support
 * - Error handling with categorization and retry capability
 * - Server-side data fetching
 * - Prefetching for improved performance
 */

import { toast } from "@/components/ui/use-toast";
import {
  useQuery as useConvexQuery,
  useMutation as useConvexMutation,
  useAction as useConvexAction,
  usePaginatedQuery as useConvexPaginatedQuery
} from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { FunctionReference } from "convex/server";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";

/**
 * Enhanced cache implementation with automatic invalidation and dependency tracking
 */
class QueryCache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
    dependencies?: string[];
  }>();

  private dependents = new Map<string, Set<string>>();
  private maxSize = 100; // Maximum number of entries in the cache
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Set up automatic cleanup every 5 minutes
    if (typeof window !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string) {
    return this.cache.get(key);
  }

  /**
   * Set a value in the cache with optional dependencies
   */
  set(key: string, value: { data: any; timestamp: number; ttl: number; dependencies?: string[] }) {
    // If the cache is full, remove the oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) this.delete(oldestKey);
    }

    // Store the value in the cache
    this.cache.set(key, value);

    // Register dependencies
    if (value.dependencies) {
      for (const dep of value.dependencies) {
        if (!this.dependents.has(dep)) {
          this.dependents.set(dep, new Set());
        }
        this.dependents.get(dep)?.add(key);
      }
    }

    return this;
  }

  /**
   * Delete a value from the cache and update dependencies
   */
  delete(key: string) {
    // Remove the entry from the cache
    this.cache.delete(key);

    // Remove the key from all dependency lists
    for (const [dep, keys] of this.dependents.entries()) {
      keys.delete(key);
      if (keys.size === 0) {
        this.dependents.delete(dep);
      }
    }

    // Invalidate all dependent keys
    const dependents = this.dependents.get(key);
    if (dependents) {
      for (const depKey of dependents) {
        this.delete(depKey);
      }
      this.dependents.delete(key);
    }

    return this;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
    this.dependents.clear();
    return this;
  }

  /**
   * Get all keys in the cache
   */
  keys() {
    return this.cache.keys();
  }

  /**
   * Get the size of the cache
   */
  get size() {
    return this.cache.size;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string) {
    return this.cache.has(key);
  }

  /**
   * Get the oldest key in the cache
   */
  private getOldestKey() {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTimestamp) {
        oldestKey = key;
        oldestTimestamp = value.timestamp;
      }
    }

    return oldestKey;
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.delete(key);
      }
    }
  }

  /**
   * Dispose of the cache
   */
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Create a singleton instance of the cache
const queryCache = new QueryCache();

/**
 * Error categories for better error handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * Categorize errors for better handling
 */
export const categorizeError = (error: unknown): ErrorCategory => {
  if (!error) return ErrorCategory.UNKNOWN;

  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return ErrorCategory.NETWORK;
  }

  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return ErrorCategory.VALIDATION;
  }

  if (errorMessage.includes('authentication') || errorMessage.includes('login') || errorMessage.includes('credentials')) {
    return ErrorCategory.AUTHENTICATION;
  }

  if (errorMessage.includes('authorization') || errorMessage.includes('permission') || errorMessage.includes('access')) {
    return ErrorCategory.AUTHORIZATION;
  }

  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return ErrorCategory.NOT_FOUND;
  }

  if (errorMessage.includes('server') || errorMessage.includes('500')) {
    return ErrorCategory.SERVER;
  }

  return ErrorCategory.UNKNOWN;
};

/**
 * Common error handling for data operations with retry capability
 */
export const handleError = (
  error: unknown,
  options?: {
    customMessage?: string;
    category?: ErrorCategory;
    silent?: boolean;
    retry?: () => Promise<any>;
    retryLabel?: string;
  }
) => {
  const category = options?.category || categorizeError(error);
  console.error(`Data operation error (${category}):`, error);

  const errorMessage = error instanceof Error
    ? error.message
    : "An unexpected error occurred";

  if (!options?.silent) {
    toast({
      title: options?.customMessage || "Operation Failed",
      description: errorMessage,
      variant: "destructive",
      action: options?.retry ? {
        label: options.retryLabel || "Retry",
        onClick: options.retry
      } : undefined
    });
  }

  return {
    message: errorMessage,
    category
  };
};

/**
 * Enhanced query hook with loading, error, success states, and caching
 */
export function useQuery<Args extends {}, Result>(
  query: FunctionReference<"query", Args, Result>,
  args: Args | "skip",
  options?: {
    onSuccess?: (data: Result) => void;
    onError?: (error: Error) => void;
    cacheTime?: number; // Time in ms to cache the result (0 to disable)
    staleTime?: number; // Time in ms before the data is considered stale
    retry?: boolean; // Whether to retry failed queries
    retryCount?: number; // Number of retry attempts
    retryDelay?: number; // Delay between retries in ms
  }
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = options?.retryCount || 3;
  const retryDelay = options?.retryDelay || 1000;
  const cacheTime = options?.cacheTime ?? 5 * 60 * 1000; // Default: 5 minutes
  const staleTime = options?.staleTime ?? 60 * 1000; // Default: 1 minute

  // Generate a cache key based on the query and args
  const cacheKey = useMemo(() => {
    if (args === "skip") return "";
    const queryName = (query as any)._functionName || "";
    return `${queryName}:${JSON.stringify(args)}`;
  }, [query, args]);

  // Extract entity type and ID from the query for dependency tracking
  const dependencies = useMemo(() => {
    if (args === "skip" || !cacheKey) return undefined;

    const queryName = (query as any)._functionName || "";
    const parts = queryName.split('.');

    if (parts.length < 2) return undefined;

    const entityType = parts[0]; // e.g., 'users', 'products', etc.

    // Extract IDs from args for dependency tracking
    const extractedIds: string[] = [];

    if (typeof args === 'object') {
      // Look for common ID patterns in args
      for (const [key, value] of Object.entries(args)) {
        if (
          (key === 'id' || key.endsWith('Id')) &&
          typeof value === 'string' &&
          value.startsWith('_')
        ) {
          extractedIds.push(`${entityType}:${value}`);
        }
      }
    }

    return extractedIds.length > 0 ? extractedIds : undefined;
  }, [query, args, cacheKey]);

  // Check if we have a cached result
  const cachedResult = useMemo(() => {
    if (!cacheKey || cacheTime === 0) return null;

    const cached = queryCache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();

    // If the cache has expired, remove it
    if (now - cached.timestamp > cached.ttl) {
      queryCache.delete(cacheKey);
      return null;
    }

    // If the data is stale, we'll still return it but also refetch
    const isStale = now - cached.timestamp > staleTime;

    return {
      data: cached.data,
      isStale
    };
  }, [cacheKey, cacheTime, staleTime]);

  // Use the Convex query hook
  const result = useConvexQuery(query, args);

  // Store the latest result for retry functionality
  const latestResult = useRef<Result | undefined>(undefined);

  // Function to retry the query
  const retry = useCallback(() => {
    if (retryCount >= maxRetries) return;

    setRetryCount(prev => prev + 1);
    setError(null);
    setIsLoading(true);

    // The actual retry is handled by Convex's useQuery hook
    // We just need to reset our state
  }, [retryCount, maxRetries]);

  // Handle loading, error, and success states
  useEffect(() => {
    if (args === "skip") {
      setIsLoading(false);
      return;
    }

    // If we have a cached result and it's not stale, use it
    if (cachedResult && !cachedResult.isStale) {
      setIsLoading(false);
      setError(null);
      latestResult.current = cachedResult.data;
      options?.onSuccess?.(cachedResult.data);
      return;
    }

    if (result === undefined) {
      // Only show loading if we don't have a cached result
      setIsLoading(!cachedResult);
    } else {
      setIsLoading(false);
      setError(null);

      // Cache the result if caching is enabled
      if (cacheKey && cacheTime > 0) {
        queryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTime,
          dependencies
        });
      }

      latestResult.current = result;
      options?.onSuccess?.(result);
    }
  }, [result, args, options, cachedResult, cacheKey, cacheTime]);

  // Handle errors
  useEffect(() => {
    if (!error) return;

    const category = categorizeError(error);

    // For network errors, retry automatically if enabled
    if (category === ErrorCategory.NETWORK && options?.retry && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        retry();
      }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff

      return () => clearTimeout(timer);
    }

    handleError(error, {
      retry: options?.retry ? retry : undefined,
      retryLabel: `Retry (${retryCount}/${maxRetries})`
    });
    options?.onError?.(error);
  }, [error, options, retry, retryCount, maxRetries, retryDelay]);

  return {
    data: result ?? (cachedResult?.data as Result | undefined),
    isLoading,
    error,
    isError: !!error,
    isStale: cachedResult?.isStale || false,
    retry,
    retryCount
  };
}

/**
 * Enhanced mutation hook with loading, error, success states, optimistic updates, and retry capability
 */
export function useMutation<Args extends {}, Result>(
  mutation: FunctionReference<"mutation", Args, Result>,
  options?: {
    onSuccess?: (data: Result) => void;
    onError?: (error: Error) => void;
    retry?: boolean; // Whether to retry failed mutations
    retryCount?: number; // Number of retry attempts
    retryDelay?: number; // Delay between retries in ms
    invalidateQueries?: string[]; // Query cache keys to invalidate on success
    optimisticUpdate?: {
      queryKey: string; // The query cache key to update optimistically
      updateFn: (currentData: any, args: Args) => any; // Function to update the data optimistically
    }[];
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = options?.retryCount || 3;
  const retryDelay = options?.retryDelay || 1000;

  // Use the Convex mutation hook
  const mutate = useConvexMutation(mutation);

  // Store the latest args for retry functionality
  const latestArgs = useRef<Args | null>(null);

  // Store the original data for rollback in case of error
  const originalData = useRef<Map<string, any>>(new Map());

  // Function to retry the mutation
  const retry = useCallback(async () => {
    if (retryCount >= maxRetries || !latestArgs.current) return;

    setRetryCount(prev => prev + 1);
    setError(null);

    return execute(latestArgs.current);
  }, [retryCount, maxRetries]);

  // Create a wrapped mutation function with loading, error, success handling, and optimistic updates
  const execute = useCallback(
    async (args: Args): Promise<Result | undefined> => {
      setIsLoading(true);
      setError(null);
      latestArgs.current = args;

      // Store original data for rollback and apply optimistic updates
      if (options?.optimisticUpdate) {
        originalData.current.clear();

        for (const update of options.optimisticUpdate) {
          const { queryKey, updateFn } = update;
          const currentData = queryCache.get(queryKey)?.data;

          if (currentData) {
            // Store the original data for rollback
            originalData.current.set(queryKey, currentData);

            // Apply optimistic update
            const updatedData = updateFn(currentData, args);

            // Update the cache with the optimistic data
            queryCache.set(queryKey, {
              data: updatedData,
              timestamp: Date.now(),
              ttl: queryCache.get(queryKey)?.ttl || 5 * 60 * 1000
            });
          }
        }
      }

      try {
        const result = await mutate(args);

        // Invalidate queries if specified
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach(key => {
            queryCache.delete(key);
          });
        }

        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        // Rollback optimistic updates
        if (options?.optimisticUpdate) {
          for (const [queryKey, data] of originalData.current.entries()) {
            queryCache.set(queryKey, {
              data,
              timestamp: Date.now(),
              ttl: queryCache.get(queryKey)?.ttl || 5 * 60 * 1000
            });
          }
        }

        const category = categorizeError(error);

        // For network errors, retry automatically if enabled
        if (category === ErrorCategory.NETWORK && options?.retry && retryCount < maxRetries) {
          const timer = setTimeout(() => {
            retry();
          }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff

          // Clear the timeout if the component unmounts
          return undefined;
        }

        handleError(error, {
          retry: options?.retry ? retry : undefined,
          retryLabel: `Retry (${retryCount}/${maxRetries})`
        });
        options?.onError?.(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, options, retry, retryCount, maxRetries, retryDelay]
  );

  return {
    execute,
    isLoading,
    error,
    isError: !!error,
    retry,
    retryCount
  };
}

/**
 * Enhanced action hook with loading, error, and success states
 */
export function useAction<Args extends {}, Result>(
  action: FunctionReference<"action", Args, Result>,
  options?: {
    onSuccess?: (data: Result) => void;
    onError?: (error: Error) => void;
    retry?: boolean;
    retryCount?: number;
    retryDelay?: number;
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = options?.retryCount || 3;
  const retryDelay = options?.retryDelay || 1000;

  // Use the Convex action hook
  const act = useConvexAction(action);

  // Store the latest args for retry functionality
  const latestArgs = useRef<Args | null>(null);

  // Function to retry the action
  const retry = useCallback(async () => {
    if (retryCount >= maxRetries || !latestArgs.current) return;

    setRetryCount(prev => prev + 1);
    setError(null);

    return execute(latestArgs.current);
  }, [retryCount, maxRetries]);

  // Create a wrapped action function with loading, error, and success handling
  const execute = useCallback(
    async (args: Args): Promise<Result | undefined> => {
      setIsLoading(true);
      setError(null);
      latestArgs.current = args;

      try {
        const result = await act(args);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        const category = categorizeError(error);

        // For network errors, retry automatically if enabled
        if (category === ErrorCategory.NETWORK && options?.retry && retryCount < maxRetries) {
          const timer = setTimeout(() => {
            retry();
          }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff

          // Clear the timeout if the component unmounts
          return undefined;
        }

        handleError(error, {
          retry: options?.retry ? retry : undefined,
          retryLabel: `Retry (${retryCount}/${maxRetries})`
        });
        options?.onError?.(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [act, options, retry, retryCount, maxRetries, retryDelay]
  );

  return {
    execute,
    isLoading,
    error,
    isError: !!error,
    retry,
    retryCount
  };
}

/**
 * Type for pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

/**
 * Type for pagination result
 */
export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
  pageCount?: number;
  currentPage?: number;
}

/**
 * Hook for paginated queries
 */
export function usePaginatedQuery<Args extends PaginationParams, Result extends PaginatedResult<any>>(
  query: FunctionReference<"query", Args, Result>,
  args: Omit<Args, 'cursor'> | "skip",
  options?: {
    onSuccess?: (data: Result) => void;
    onError?: (error: Error) => void;
    cacheTime?: number;
    staleTime?: number;
    retry?: boolean;
    retryCount?: number;
    retryDelay?: number;
  }
) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Combine the args with the cursor
  const queryArgs = useMemo(() => {
    if (args === "skip") return "skip";
    return {
      ...args,
      cursor
    } as Args;
  }, [args, cursor]);

  // Use the enhanced query hook
  const query$ = useQuery(query, queryArgs, options);

  // Update the state when the query result changes
  useEffect(() => {
    if (!query$.data) return;

    const paginatedResult = query$.data as Result;

    if (cursor) {
      // Append the new items to the existing ones
      setAllItems(prev => [...prev, ...paginatedResult.items]);
    } else {
      // Replace the items if this is the first page
      setAllItems(paginatedResult.items);
    }

    setHasMore(paginatedResult.hasMore);

    // If there are more items, update the cursor
    if (paginatedResult.hasMore && paginatedResult.nextCursor) {
      setCursor(paginatedResult.nextCursor);
    }
  }, [query$.data, cursor]);

  // Function to load the next page
  const loadNextPage = useCallback(() => {
    if (!hasMore || query$.isLoading) return;

    // The cursor is already set, so the next query will fetch the next page
    // We just need to trigger a re-render
    setCursor(prev => prev);
  }, [hasMore, query$.isLoading]);

  // Function to reset the pagination
  const reset = useCallback(() => {
    setCursor(undefined);
    setAllItems([]);
    setHasMore(true);
  }, []);

  return {
    ...query$,
    allItems,
    hasMore,
    loadNextPage,
    reset
  };
}

/**
 * Hook for batch queries
 */
export function useBatchQuery<Args extends {}, Result>(
  queries: Array<{
    query: FunctionReference<"query", Args, Result>;
    args: Args | "skip";
    key: string;
  }>,
  options?: {
    onSuccess?: (data: Record<string, Result>) => void;
    onError?: (error: Error) => void;
    cacheTime?: number;
    staleTime?: number;
    retry?: boolean;
    retryCount?: number;
    retryDelay?: number;
  }
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Record<string, Result>>({});

  // Execute all queries in parallel
  const queryResults = queries.map(({ query, args, key }) => {
    const result = useQuery(query, args, {
      ...options,
      onError: (err) => {
        setError(err);
        options?.onError?.(err);
      }
    });

    return { result, key };
  });

  // Update the loading state and data when all queries complete
  useEffect(() => {
    const isAnyLoading = queryResults.some(({ result }) => result.isLoading);
    setIsLoading(isAnyLoading);

    if (!isAnyLoading) {
      const newData = queryResults.reduce((acc, { result, key }) => {
        if (result.data !== undefined) {
          acc[key] = result.data;
        }
        return acc;
      }, {} as Record<string, Result>);

      setData(newData);

      // Check if all queries have data
      const allQueriesHaveData = queryResults.every(
        ({ result }) => result.data !== undefined
      );

      if (allQueriesHaveData) {
        options?.onSuccess?.(newData);
      }
    }
  }, [queryResults, options]);

  return {
    data,
    isLoading,
    error,
    isError: !!error,
    // Individual query results for more granular control
    queries: queryResults.reduce((acc, { result, key }) => {
      acc[key] = result;
      return acc;
    }, {} as Record<string, ReturnType<typeof useQuery<Args, Result>>>)
  };
}

/**
 * Utility to clear the entire query cache
 */
export function clearQueryCache() {
  queryCache.clear();
}

/**
 * Utility to invalidate specific queries by key pattern or entity ID
 *
 * @param keyPattern - A string pattern or RegExp to match cache keys, or an entity ID (e.g., 'users:_123')
 * @param options - Additional options for invalidation
 */
export function invalidateQueries(
  keyPattern: string | RegExp,
  options?: {
    exact?: boolean; // If true, only invalidate exact matches
    invalidateDependents?: boolean; // If true, also invalidate dependent queries
  }
) {
  const { exact = false, invalidateDependents = true } = options || {};

  // If it looks like an entity ID (e.g., 'users:_123'), invalidate all dependent queries
  if (typeof keyPattern === 'string' && keyPattern.includes(':') && invalidateDependents) {
    // This will automatically invalidate all dependent queries
    queryCache.delete(keyPattern);
    return;
  }

  // Otherwise, use pattern matching
  const pattern = typeof keyPattern === 'string'
    ? exact
      ? new RegExp(`^${keyPattern}$`)
      : new RegExp(`^${keyPattern.replace(/\*/g, '.*')}$`)
    : keyPattern;

  for (const key of queryCache.keys()) {
    if (pattern.test(key)) {
      queryCache.delete(key);
    }
  }
}

/**
 * Utility to invalidate queries by entity type and ID
 *
 * @param entityType - The type of entity (e.g., 'users', 'products')
 * @param entityId - The ID of the entity
 */
export function invalidateEntity(entityType: string, entityId: string) {
  invalidateQueries(`${entityType}:${entityId}`);
}

/**
 * Create a Convex HTTP client for server-side data fetching
 */
export function createServerClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";
  return new ConvexHttpClient(convexUrl);
}

/**
 * Fetch data from Convex on the server side
 *
 * This function can be used in Server Components or in getServerSideProps
 */
export async function fetchFromServer<
  QueryName extends keyof typeof api.query
>(
  queryName: QueryName,
  args: Parameters<typeof api.query[QueryName]>[0]
): Promise<Awaited<ReturnType<typeof api.query[QueryName]>>> {
  const client = createServerClient();
  return await client.query(api.query[queryName as string], args);
}

/**
 * Prefetch a query to warm up the cache
 *
 * This function can be used to prefetch data that will be needed soon
 */
export async function prefetchQuery<
  QueryName extends keyof typeof api.query
>(
  queryName: QueryName,
  args: Parameters<typeof api.query[QueryName]>[0],
  options?: {
    cacheTime?: number;
    dependencies?: string[];
  }
): Promise<void> {
  try {
    const client = createServerClient();
    const data = await client.query(api.query[queryName as string], args);

    // Generate a cache key
    const cacheKey = `${queryName as string}:${JSON.stringify(args)}`;

    // Extract entity type and ID from the query for dependency tracking
    let dependencies = options?.dependencies;

    if (!dependencies) {
      const parts = (queryName as string).split('.');

      if (parts.length >= 2) {
        const entityType = parts[0]; // e.g., 'users', 'products', etc.
        const extractedIds: string[] = [];

        if (typeof args === 'object') {
          // Look for common ID patterns in args
          for (const [key, value] of Object.entries(args)) {
            if (
              (key === 'id' || key.endsWith('Id')) &&
              typeof value === 'string' &&
              value.startsWith('_')
            ) {
              extractedIds.push(`${entityType}:${value}`);
            }
          }
        }

        if (extractedIds.length > 0) {
          dependencies = extractedIds;
        }
      }
    }

    // Store the result in the cache
    queryCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: options?.cacheTime ?? 5 * 60 * 1000, // Default: 5 minutes
      dependencies
    });
  } catch (error) {
    console.error(`Error prefetching query ${queryName as string}:`, error);
  }
}

// Re-export from individual modules
export * from "./users";
export * from "./cart";
export * from "./products";
export * from "./orders";
export * from "./reviews";
export * from "./categories";
