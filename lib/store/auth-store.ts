/**
 * Authentication Store
 *
 * This module provides a global state store for authentication using Zustand.
 * It integrates with the Convex backend for authentication operations.
 */

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler, showSuccessNotification, showErrorNotification } from '.'
import { useMutation, useQuery } from 'convex/react'

// Define user type
export interface User {
  id: Id<'users'>
  name: string
  email: string
  role: 'admin' | 'seller' | 'buyer'
  image?: string
}

// Define authentication state
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
}

// Define authentication methods
interface AuthMethods {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<boolean>
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

/**
 * Authentication store
 */
export const useAuthStore = createPersistedStore<AuthState, AuthMethods>(
  'auth',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Set user
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        })

        // Store user ID in localStorage for Convex queries
        if (user) {
          localStorage.setItem('userId', user.id)
        } else {
          localStorage.removeItem('userId')
        }
      },

      // Login
      login: async (email: string, password: string) => {
        loadingHandler.startLoading()

        try {
          // Get the login mutation from Convex
          const loginMutation = useMutation(api.auth.login)

          // Call the login mutation
          const result = await loginMutation({ email, password })

          if (result.success) {
            // Create user data from the result
            const userData: User = {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              role: result.user.role as 'admin' | 'seller' | 'buyer',
              image: result.user.image,
            }

            // Update the state
            set({
              user: userData,
              isAuthenticated: true,
              error: null,
            })

            // Store user ID in localStorage for Convex queries
            localStorage.setItem('userId', userData.id)

            // Show success notification
            showSuccessNotification('Login successful', `Welcome back, ${userData.name}!`)

            return true
          } else {
            // Handle login failure
            const error = new Error(result.message || 'Invalid email or password')
            errorHandler.setError(error)

            // Show error notification
            showErrorNotification('Login failed', result.message || 'Invalid email or password')

            return false
          }
        } catch (error) {
          // Handle unexpected errors
          const err = error instanceof Error ? error : new Error('Failed to login')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Login failed', err.message)

          return false
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Register
      register: async (name: string, email: string, password: string, role: string) => {
        loadingHandler.startLoading()

        try {
          // Get the register mutation from Convex
          const registerMutation = useMutation(api.auth.register)

          // Call the register mutation
          const result = await registerMutation({ name, email, password, role })

          if (result.success) {
            // Create user data from the result
            const userData: User = {
              id: result.user.id,
              name: result.user.name,
              email: result.user.email,
              role: result.user.role as 'admin' | 'seller' | 'buyer',
              image: result.user.image,
            }

            // Update the state
            set({
              user: userData,
              isAuthenticated: true,
              error: null,
            })

            // Store user ID in localStorage for Convex queries
            localStorage.setItem('userId', userData.id)

            // Show success notification
            showSuccessNotification('Registration successful', `Welcome, ${userData.name}!`)

            return true
          } else {
            // Handle registration failure
            const error = new Error(result.message || 'Failed to register')
            errorHandler.setError(error)

            // Show error notification
            showErrorNotification('Registration failed', result.message || 'Failed to register')

            return false
          }
        } catch (error) {
          // Handle unexpected errors
          const err = error instanceof Error ? error : new Error('Failed to register')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Registration failed', err.message)

          return false
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Logout
      logout: () => {
        // Get the current user name for the notification
        const userName = get().user?.name || 'User'

        // Update the state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })

        // Remove user ID from localStorage
        localStorage.removeItem('userId')

        // Show success notification
        showSuccessNotification('Logout successful', `Goodbye, ${userName}!`)
      },

      // Check authentication
      checkAuth: async () => {
        loadingHandler.startLoading()

        try {
          // Get the stored user ID from localStorage
          const storedUserId = localStorage.getItem('userId')

          if (!storedUserId) {
            // No user ID found, user is not authenticated
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            })
            return false
          }

          // Get the current user query from Convex
          const currentUser = useQuery(
            api.auth.me,
            { userId: storedUserId as Id<'users'> }
          )

          if (currentUser) {
            // Create user data from the result
            const userData: User = {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role as 'admin' | 'seller' | 'buyer',
              image: currentUser.image,
            }

            // Update the state
            set({
              user: userData,
              isAuthenticated: true,
              error: null,
            })

            return true
          } else {
            // User not found, user is not authenticated
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            })

            // Remove user ID from localStorage
            localStorage.removeItem('userId')

            return false
          }
        } catch (error) {
          // Handle unexpected errors
          const err = error instanceof Error ? error : new Error('Failed to check authentication')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Authentication check failed', err.message)

          return false
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Reset
      ...resetHandler,
    }
  }
)
