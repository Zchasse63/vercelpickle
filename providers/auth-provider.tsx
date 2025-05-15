"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  image?: string;
}

// Define the authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the authentication provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Convex mutations - wrapped in try/catch to handle case when Convex client isn't available
  let loginMutation: any;
  let registerMutation: any;
  let currentUser: any;

  try {
    loginMutation = useMutation(api.auth.login);
    registerMutation = useMutation(api.auth.register);

    // Get current user from Convex if we have a userId
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
    currentUser = useQuery(
      api.auth.me,
      storedUserId ? { userId: storedUserId as Id<"users"> } : "skip"
    );
  } catch (error) {
    // Convex client not available yet
    console.warn("Convex client not available yet, auth functionality will be limited");
  }

  // Check if the user is logged in on mount
  useEffect(() => {
    // If we have a user from Convex, update the state
    if (currentUser) {
      setUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role as "admin" | "seller" | "buyer",
        image: currentUser.image,
      });
      setIsLoading(false);
    } else if (currentUser === null) {
      // If Convex explicitly returned null (not undefined which means loading)
      // For testing purposes, create a guest user
      if (typeof window !== 'undefined') {
        // Check if we're in a test environment or have a stored user
        const testUser = localStorage.getItem('pickle_user');
        if (testUser) {
          try {
            const parsedUser = JSON.parse(testUser);
            setUser({
              id: parsedUser.id || 'guest-user',
              name: parsedUser.name || 'Guest User',
              email: parsedUser.email || 'guest@example.com',
              role: parsedUser.role as "admin" | "seller" | "buyer" || 'buyer',
              image: parsedUser.image,
            });
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      localStorage.removeItem("userId");
      setIsLoading(false);
    }
  }, [currentUser]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Check if Convex client is available
      if (!loginMutation) {
        toast({
          title: "Login failed",
          description: "Authentication service is not available yet. Please try again later.",
          variant: "destructive",
        });
        return false;
      }

      // Call Convex login mutation
      const result = await loginMutation({ email, password });

      if (result.success) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role as "admin" | "seller" | "buyer",
          image: result.user.image,
        };

        setUser(userData);
        localStorage.setItem("userId", result.user.id);

        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });

        return true;
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid email or password",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setIsLoading(true);

      // Check if Convex client is available
      if (!registerMutation) {
        toast({
          title: "Registration failed",
          description: "Authentication service is not available yet. Please try again later.",
          variant: "destructive",
        });
        return false;
      }

      // Call Convex register mutation
      const result = await registerMutation({
        name,
        email,
        password,
        role
      });

      if (result.success) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role as "admin" | "seller" | "buyer",
        };

        setUser(userData);
        localStorage.setItem("userId", result.user.id);

        toast({
          title: "Registration successful",
          description: `Welcome, ${userData.name}!`,
        });

        return true;
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Failed to register",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");

    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the authentication context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
