"use client";

import { useTheme as useNextTheme } from "next-themes";

/**
 * Custom hook for using the theme
 * @returns Theme utilities
 */
export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark");
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };
  
  return {
    theme,
    setTheme,
    systemTheme,
    isDarkMode,
    toggleTheme,
  };
}
