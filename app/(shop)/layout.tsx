"use client";

import type React from "react"
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";

import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer"

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create the client outside of the component to ensure it's only created once
// But only initialize it on the client side
let convexClient: ConvexReactClient | null = null;

// Initialize the client on the client side
if (typeof window !== "undefined") {
  convexClient = new ConvexReactClient(convexUrl);
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If we're on the server, render without the Convex provider
  if (typeof window === "undefined" || !convexClient) {
    return (
      <div className="flex min-h-screen flex-col" data-testid="shop-layout">
        <MarketplaceHeader />
        <main className="flex-1 bg-gradient-to-b from-[#F1E5C3]/20 to-white relative" data-testid="shop-content">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
          <div className="relative z-10 w-full mx-auto">{children}</div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  return (
    <ConvexReactProvider client={convexClient}>
      <div className="flex min-h-screen flex-col" data-testid="shop-layout">
        <MarketplaceHeader />
        <main className="flex-1 bg-gradient-to-b from-[#F1E5C3]/20 to-white relative" data-testid="shop-content">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
          <div className="relative z-10 w-full mx-auto">{children}</div>
        </main>
        <MarketplaceFooter />
      </div>
    </ConvexReactProvider>
  )
}
