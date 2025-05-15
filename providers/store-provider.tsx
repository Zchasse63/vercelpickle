"use client"

import { ReactNode, useEffect } from "react"
import { useAuthStore, useThemeStore } from "@/lib/store"
import { StoreInitializer } from "@/lib/store/store-initializer"
import { useAuth } from "@/providers/auth-provider"
import { Id } from "@/convex/_generated/dataModel"

interface StoreProviderProps {
  children: ReactNode
}

/**
 * Store provider component
 *
 * This component initializes all global stores and handles synchronization with the backend.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Get the authenticated user from the auth provider
  const { user } = useAuth()

  // Get the setUser method from the auth store
  const { setUser } = useAuthStore()

  // Get the theme store methods
  const { setTheme, setSystemTheme } = useThemeStore()

  // Sync the auth store with the auth provider
  useEffect(() => {
    if (user) {
      setUser({
        id: user.id as Id<'users'>,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      })
    } else {
      setUser(null)
    }
  }, [user, setUser])

  // Initialize theme
  useEffect(() => {
    // Set the initial theme
    const theme = localStorage.getItem('theme') || 'system'
    setTheme(theme as 'light' | 'dark' | 'system')

    // Set the initial system theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setSystemTheme(systemTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [setTheme, setSystemTheme])

  return (
    <>
      <StoreInitializer />
      {children}
    </>
  )
}
