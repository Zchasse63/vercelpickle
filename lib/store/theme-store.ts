/**
 * Theme Store
 * 
 * This module provides a global state store for theme management using Zustand.
 */

import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler } from '.'

// Define theme type
export type Theme = 'light' | 'dark' | 'system'

// Define theme state
interface ThemeState {
  theme: Theme
  systemTheme: 'light' | 'dark'
  isDarkMode: boolean
}

// Define theme methods
interface ThemeMethods {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSystemTheme: (systemTheme: 'light' | 'dark') => void
}

// Initial state
const initialState: ThemeState = {
  theme: 'system',
  systemTheme: 'light',
  isDarkMode: false,
}

/**
 * Theme store
 */
export const useThemeStore = createPersistedStore<ThemeState, ThemeMethods>(
  'theme',
  initialState,
  (set, get) => {
    // Create reset handler
    const resetHandler = createResetHandler(set, initialState)
    
    return {
      // Set theme
      setTheme: (theme: Theme) => {
        const { systemTheme } = get()
        const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
        
        set({ theme, isDarkMode })
        
        // Update document class for theme
        if (typeof document !== 'undefined') {
          const root = document.documentElement
          
          if (isDarkMode) {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },
      
      // Toggle theme
      toggleTheme: () => {
        const { theme, systemTheme } = get()
        const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
        const newTheme = isDarkMode ? 'light' : 'dark'
        
        get().setTheme(newTheme)
      },
      
      // Set system theme
      setSystemTheme: (systemTheme: 'light' | 'dark') => {
        const { theme } = get()
        const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
        
        set({ systemTheme, isDarkMode })
        
        // Update document class for theme if using system theme
        if (theme === 'system' && typeof document !== 'undefined') {
          const root = document.documentElement
          
          if (isDarkMode) {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
      },
      
      // Reset
      ...resetHandler,
    }
  }
)
