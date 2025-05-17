"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create the client outside of the component to ensure it's only created once
// But only initialize it on the client side
let convexClient: ConvexReactClient | null = null;

// Initialize the client on the client side
if (typeof window !== "undefined") {
  convexClient = new ConvexReactClient(convexUrl);
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If we're on the server, render without the Convex provider
  if (typeof window === "undefined" || !convexClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F1E5C3]/20 to-white relative" data-testid="auth-layout">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
        
        <div className="relative z-10 w-full max-w-md mx-auto p-6">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Pickle"
                width={120}
                height={40}
                priority
              />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border">
            {children}
          </div>
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ConvexReactProvider client={convexClient}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F1E5C3]/20 to-white relative" data-testid="auth-layout">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5 z-0"></div>
        
        <div className="relative z-10 w-full max-w-md mx-auto p-6">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Pickle"
                width={120}
                height={40}
                priority
              />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border">
            {children}
          </div>
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.</p>
          </div>
        </div>
      </div>
    </ConvexReactProvider>
  );
}
