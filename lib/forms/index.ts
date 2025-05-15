/**
 * Form State Management
 * 
 * This module provides utilities and components for form state management
 * using React Hook Form and Zod validation.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn, FieldValues, SubmitHandler, FieldErrors } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ZodSchema } from "zod";

/**
 * Enhanced useForm hook with error handling and loading state
 */
export function useFormWithErrorHandling<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(props: UseFormProps<TFieldValues, TContext> & {
  onSubmit?: SubmitHandler<TFieldValues>;
  onError?: (errors: FieldErrors<TFieldValues>) => void;
}) {
  const { onSubmit, onError, ...formProps } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use React Hook Form
  const methods = useForm<TFieldValues, TContext>({
    ...formProps,
  });
  
  // Create a submit handler with error handling
  const handleSubmit = async (data: TFieldValues) => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form errors
  const handleError = (errors: FieldErrors<TFieldValues>) => {
    console.error("Form validation errors:", errors);
    
    // Show toast for validation errors
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(errors);
    }
  };
  
  return {
    ...methods,
    handleSubmit: methods.handleSubmit(handleSubmit, handleError),
    isSubmitting,
    reset: methods.reset,
  };
}

/**
 * Create a form with Zod validation
 */
export function useZodForm<TSchema extends ZodSchema<any>>(
  schema: TSchema,
  options?: Omit<UseFormProps<any>, "resolver"> & {
    onSubmit?: SubmitHandler<any>;
    onError?: (errors: FieldErrors<any>) => void;
  }
) {
  return useFormWithErrorHandling({
    ...options,
    resolver: zodResolver(schema),
  });
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: FieldErrors<any>): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  Object.entries(errors).forEach(([key, value]) => {
    if (value && "message" in value) {
      formattedErrors[key] = value.message as string;
    }
  });
  
  return formattedErrors;
}

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^\(\d{3}\) \d{3}-\d{4}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  canadianPostalCode: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  creditCard: /^(\d{4} ){3}\d{4}$|^(\d{4} ){2}\d{4}$/,
  expiryDate: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvc: /^\d{3,4}$/,
};

/**
 * Common validation functions
 */
export const validationFunctions = {
  /**
   * Validate a phone number
   */
  validatePhoneNumber: (value: string) => {
    // Remove non-numeric characters for validation
    const numericValue = value.replace(/\D/g, '');
    return numericValue.length === 10;
  },
  
  /**
   * Validate a ZIP/postal code (US or Canadian)
   */
  validateZipCode: (value: string) => {
    // US ZIP code
    if (/^\d{5}(-\d{4})?$/.test(value)) {
      return true;
    }
    
    // Canadian postal code
    if (/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value)) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Validate a credit card number
   */
  validateCardNumber: (value: string) => {
    // Remove spaces for validation
    const numericValue = value.replace(/\s/g, '');
    
    // Check length (13-19 digits)
    if (numericValue.length < 13 || numericValue.length > 19) {
      return false;
    }
    
    // Luhn algorithm for credit card validation
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = numericValue.length - 1; i >= 0; i--) {
      let digit = parseInt(numericValue.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  },
  
  /**
   * Validate a credit card expiry date
   */
  validateExpiryDate: (value: string) => {
    // Check format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return false;
    }
    
    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10) + 2000; // Convert to 4-digit year
    
    // Check if month is valid
    if (month < 1 || month > 12) {
      return false;
    }
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();
    
    // Check if the card is not expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  },
};
