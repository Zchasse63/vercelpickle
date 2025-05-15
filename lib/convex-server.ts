import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/**
 * Creates a Convex HTTP client for use in Server Components
 * 
 * This client allows making Convex queries during server rendering,
 * but does not support subscriptions or mutations.
 * 
 * @returns A Convex HTTP client configured with the project's Convex URL
 */
export function createServerComponentClient() {
  // Get the Convex URL from environment variables
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";
  
  // Create and return a new ConvexHttpClient
  return new ConvexHttpClient(convexUrl) as ConvexHttpClient<typeof api>;
}

/**
 * Type-safe wrapper for Convex queries in Server Components
 * 
 * This function provides a more ergonomic way to make Convex queries
 * in Server Components with proper typing.
 * 
 * @param queryName - The name of the Convex query to execute
 * @param args - The arguments to pass to the query
 * @returns The result of the query
 */
export async function queryConvex<
  QueryName extends keyof typeof api.query
>(
  queryName: QueryName,
  args: Parameters<typeof api.query[QueryName]>[0]
): Promise<Awaited<ReturnType<typeof api.query[QueryName]>>> {
  const client = createServerComponentClient();
  return await client.query(queryName, args);
}
