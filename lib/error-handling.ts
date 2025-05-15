/**
 * Error Handling Utilities
 * 
 * This module provides centralized error handling utilities for the application.
 * It includes error categorization, logging, and user feedback mechanisms.
 */

import { toast } from "@/components/ui/use-toast";
import { ErrorCategory } from "./data";

/**
 * Error with additional metadata
 */
export class AppError extends Error {
  category: ErrorCategory;
  code?: string;
  details?: Record<string, any>;
  
  constructor(
    message: string, 
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    code?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
    this.category = category;
    this.code = code;
    this.details = details;
  }
}

/**
 * Log an error to the console with additional context
 */
export function logError(
  error: unknown, 
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, any>;
  }
) {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const category = error instanceof AppError ? error.category : ErrorCategory.UNKNOWN;
  
  // Format the error message
  const formattedMessage = [
    `[ERROR] ${category.toUpperCase()}`,
    context?.component ? `Component: ${context.component}` : null,
    context?.action ? `Action: ${context.action}` : null,
    context?.userId ? `User: ${context.userId}` : null,
    `Message: ${errorObj.message}`,
  ]
    .filter(Boolean)
    .join(" | ");
  
  // Log the error
  console.error(formattedMessage, {
    error: errorObj,
    stack: errorObj.stack,
    ...context?.additionalData,
  });
  
  // In a production environment, you might want to send this to a logging service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to a logging service
    // sendToLoggingService(formattedMessage, errorObj, context);
  }
}

/**
 * Show an error toast to the user
 */
export function showErrorToast(
  error: unknown,
  options?: {
    title?: string;
    retry?: () => Promise<any>;
    retryLabel?: string;
    duration?: number;
  }
) {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const category = error instanceof AppError ? error.category : ErrorCategory.UNKNOWN;
  
  // Get a user-friendly error message based on the category
  const userFriendlyMessage = getUserFriendlyErrorMessage(errorObj, category);
  
  // Show the toast
  toast({
    title: options?.title || "An error occurred",
    description: userFriendlyMessage,
    variant: "destructive",
    duration: options?.duration || 5000,
    action: options?.retry ? {
      label: options.retryLabel || "Retry",
      onClick: options.retry,
    } : undefined,
  });
}

/**
 * Get a user-friendly error message based on the error category
 */
function getUserFriendlyErrorMessage(error: Error, category: ErrorCategory): string {
  // Use the error message if it's already user-friendly
  if (error instanceof AppError && error.details?.userFriendly) {
    return error.message;
  }
  
  // Otherwise, provide a generic message based on the category
  switch (category) {
    case ErrorCategory.NETWORK:
      return "There was a problem connecting to the server. Please check your internet connection and try again.";
    
    case ErrorCategory.VALIDATION:
      return "The information you provided is invalid. Please check your inputs and try again.";
    
    case ErrorCategory.AUTHENTICATION:
      return "You need to be logged in to perform this action. Please log in and try again.";
    
    case ErrorCategory.AUTHORIZATION:
      return "You don't have permission to perform this action.";
    
    case ErrorCategory.NOT_FOUND:
      return "The requested resource could not be found.";
    
    case ErrorCategory.SERVER:
      return "There was a problem with the server. Please try again later.";
    
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
}

/**
 * Create an error handler for a specific component
 */
export function createErrorHandler(componentName: string) {
  return {
    handleError: (
      error: unknown,
      action: string,
      options?: {
        userId?: string;
        additionalData?: Record<string, any>;
        showToast?: boolean;
        retry?: () => Promise<any>;
        retryLabel?: string;
      }
    ) => {
      // Log the error
      logError(error, {
        component: componentName,
        action,
        userId: options?.userId,
        additionalData: options?.additionalData,
      });
      
      // Show a toast if requested
      if (options?.showToast !== false) {
        showErrorToast(error, {
          title: `Error in ${componentName}`,
          retry: options?.retry,
          retryLabel: options?.retryLabel,
        });
      }
      
      // Return the error for further handling
      return error instanceof Error ? error : new Error(String(error));
    },
  };
}

/**
 * Create a try-catch wrapper for async functions
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    component: string;
    action: string;
    onError?: (error: Error) => void;
    showToast?: boolean;
  }
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  const errorHandler = createErrorHandler(options.component);
  
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleError(error, options.action, {
        showToast: options.showToast,
      });
      
      if (options.onError && error instanceof Error) {
        options.onError(error);
      }
      
      return undefined;
    }
  };
}
