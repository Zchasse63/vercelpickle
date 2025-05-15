/**
 * Payment Form Components
 * 
 * This module provides specialized form components for payment information.
 */

import React from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";

/**
 * Form credit card input component with formatting
 */
export function FormCreditCardInput<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  ...props
}: FormFieldProps<T> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  
  const formatCreditCard = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    return numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={name} 
          className={cn(error && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={name}
            value={formatCreditCard(field.value || '')}
            onChange={(e) => {
              const formattedValue = formatCreditCard(e.target.value);
              field.onChange(formattedValue);
            }}
            placeholder="4242 4242 4242 4242"
            disabled={disabled}
            className={cn(error && "border-red-500", props.className)}
            data-testid={testId || `${name}-input`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            maxLength={19}
          />
        )}
      />
      
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {error && (
        <p 
          className="text-red-500 text-sm mt-1" 
          id={`${name}-error`}
          data-testid={`${name}-error`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Form credit card expiry input component with formatting
 */
export function FormExpiryInput<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  ...props
}: FormFieldProps<T> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  
  const formatExpiry = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (numericValue.length === 0) return '';
    if (numericValue.length <= 2) return numericValue;
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`;
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={name} 
          className={cn(error && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={name}
            value={formatExpiry(field.value || '')}
            onChange={(e) => {
              const formattedValue = formatExpiry(e.target.value);
              field.onChange(formattedValue);
            }}
            placeholder="MM/YY"
            disabled={disabled}
            className={cn(error && "border-red-500", props.className)}
            data-testid={testId || `${name}-input`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            maxLength={5}
          />
        )}
      />
      
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {error && (
        <p 
          className="text-red-500 text-sm mt-1" 
          id={`${name}-error`}
          data-testid={`${name}-error`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Form CVC input component
 */
export function FormCvcInput<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  ...props
}: FormFieldProps<T> & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={name} 
          className={cn(error && "text-red-500")}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={name}
            value={field.value || ''}
            onChange={(e) => {
              // Only allow numbers
              const value = e.target.value.replace(/\D/g, '');
              field.onChange(value);
            }}
            placeholder="123"
            disabled={disabled}
            className={cn(error && "border-red-500", props.className)}
            data-testid={testId || `${name}-input`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            maxLength={4}
          />
        )}
      />
      
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {error && (
        <p 
          className="text-red-500 text-sm mt-1" 
          id={`${name}-error`}
          data-testid={`${name}-error`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
