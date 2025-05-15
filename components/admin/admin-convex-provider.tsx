"use client";

import { ReactNode, useState, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";
import { Loading } from "@/components/ui/loading";

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create a singleton client instance
let clientSingleton: ConvexReactClient | null = null;

const getConvexClient = () => {
  // Always create a new client on the server
  if (typeof window === "undefined") return null;

  // Return the singleton if it exists
  if (clientSingleton) return clientSingleton;

  // Create a new client
  clientSingleton = new ConvexReactClient(convexUrl);
  return clientSingleton;
};

interface AdminConvexProviderProps {
  children: ReactNode;
}

export function AdminConvexProvider({ children }: AdminConvexProviderProps) {
  const [client, setClient] = useState<ConvexReactClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the client on the client side
    const convexClient = getConvexClient();
    setClient(convexClient);

    // Set loading to false after a short delay to ensure the client is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // If we're still loading or don't have a client, show a loading indicator
  if (isLoading || !client) {
    return <Loading />;
  }

  return (
    <ConvexReactProvider client={client}>
      {children}
    </ConvexReactProvider>
  );
}
