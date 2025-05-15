"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Define ThemeProviderProps interface
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme' | 'data-mode';
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
}

/**
 * Theme provider component for handling dark/light mode
 * @param props - Theme provider props
 * @returns Theme provider component
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
