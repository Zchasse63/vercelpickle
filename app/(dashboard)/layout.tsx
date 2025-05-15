"use client"

import type React from "react"
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";
import { Toaster } from "@/components/ui/toaster"

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create the client outside of the component to ensure it's only created once
// But only initialize it on the client side
let convexClient: ConvexReactClient | null = null;

// Initialize the client on the client side
if (typeof window !== "undefined") {
  convexClient = new ConvexReactClient(convexUrl);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If we're on the server, render without the Convex provider
  if (typeof window === "undefined" || !convexClient) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <ConvexReactProvider client={convexClient}>
      {children}
      <Toaster />
    </ConvexReactProvider>
  )
}
