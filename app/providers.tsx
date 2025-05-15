"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { StoreProvider } from "@/providers/store-provider";
import { Toaster } from "@/components/ui/toaster";

// Dynamically import the ConvexProvider to avoid SSR issues
const ConvexProviderClient = dynamic(
  () => import("@/providers/convex-provider").then((mod) => mod.ConvexProvider),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexProviderClient>
      <AuthProvider>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </AuthProvider>
    </ConvexProviderClient>
  );
}
