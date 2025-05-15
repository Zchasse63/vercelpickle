"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as ConvexReactProvider } from "convex/react";
import { Toaster } from "@/components/ui/toaster";

// Create a Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://avid-dove-899.convex.cloud";

// Create the client outside of the component to ensure it's only created once
// But only initialize it on the client side
let convexClient: ConvexReactClient | null = null;

// Initialize the client on the client side
if (typeof window !== "undefined") {
  convexClient = new ConvexReactClient(convexUrl);
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If we're on the server, render without the Convex provider
  if (typeof window === "undefined" || !convexClient) {
    return (
      <div className="flex min-h-screen flex-col bg-background" data-testid="checkout-layout">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Pickle"
                width={100}
                height={32}
                priority
              />
            </Link>
            <div className="text-sm text-muted-foreground">
              Secure Checkout
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.
              </div>
              <div className="flex space-x-4 text-sm">
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </div>
    );
  }

  return (
    <ConvexReactProvider client={convexClient}>
      <div className="flex min-h-screen flex-col bg-background" data-testid="checkout-layout">
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Pickle"
                width={100}
                height={32}
                priority
              />
            </Link>
            <div className="text-sm text-muted-foreground">
              Secure Checkout
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Pickle B2B Marketplace. All rights reserved.
              </div>
              <div className="flex space-x-4 text-sm">
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </ConvexReactProvider>
  );
}
