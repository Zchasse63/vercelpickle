/**
 * Auth Data Access Layer
 * 
 * This module provides hooks and utilities for authentication with Convex.
 */

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "./index";
import { useCallback, useEffect, useState } from "react";

/**
 * User data structure
 */
export interface User {
  id: Id<"users">;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  image?: string;
}

/**
 * Hook for getting the current user
 */
export function useCurrentUser() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  
  // Load userId from localStorage on mount
  useEffect(() => {
    const storedUserId = typeof window !== 'undefined' 
      ? localStorage.getItem("userId") 
      : null;
    
    if (storedUserId) {
      setUserId(storedUserId as Id<"users">);
    }
  }, []);
  
  // Fetch user data from Convex
  const { data, isLoading, error } = useQuery(
    api.auth.me,
    userId ? { userId } : "skip"
  );
  
  return {
    user: data as User | null,
    userId,
    isLoading,
    error,
    isAuthenticated: !!data,
  };
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Hook for logging in
 */
export function useLogin() {
  const mutation = useMutation(api.auth.login);
  
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await mutation.execute(credentials);
        
        if (result.success) {
          // Store userId in localStorage
          localStorage.setItem("userId", result.user.id);
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${result.user.name}!`,
          });
          
          return {
            success: true,
            user: result.user as User,
          };
        } else {
          toast({
            title: "Login failed",
            description: result.message || "Invalid email or password",
            variant: "destructive",
          });
          
          return {
            success: false,
            message: result.message,
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unexpected error occurred";
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [mutation]
  );
  
  return {
    login,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Registration data
 */
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Hook for registering a new user
 */
export function useRegister() {
  const mutation = useMutation(api.auth.register);
  
  const register = useCallback(
    async (data: RegistrationData) => {
      try {
        const result = await mutation.execute(data);
        
        if (result.success) {
          // Store userId in localStorage
          localStorage.setItem("userId", result.user.id);
          
          toast({
            title: "Registration successful",
            description: `Welcome, ${result.user.name}!`,
          });
          
          return {
            success: true,
            user: result.user as User,
          };
        } else {
          toast({
            title: "Registration failed",
            description: result.message || "Could not create account",
            variant: "destructive",
          });
          
          return {
            success: false,
            message: result.message,
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unexpected error occurred";
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [mutation]
  );
  
  return {
    register,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}

/**
 * Hook for logging out
 */
export function useLogout() {
  const logout = useCallback(() => {
    // Remove userId from localStorage
    localStorage.removeItem("userId");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    // Reload the page to clear any state
    window.location.href = "/";
  }, []);
  
  return { logout };
}
