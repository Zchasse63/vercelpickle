/**
 * Additional Form Components
 * 
 * This module provides additional specialized form components that integrate with React Hook Form.
 */

import React from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FormFieldProps, SelectOption } from "./types";

/**
 * Form switch component
 */
export function FormSwitch<T extends FieldValues>({
  name,
  label,
  description,
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
      <div className="flex items-center justify-between">
        {label && (
          <Label 
            htmlFor={name} 
            className={cn(error && "text-red-500")}
          >
            {label}
          </Label>
        )}
        
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              data-testid={testId || `${name}-switch`}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              {...props}
            />
          )}
        />
      </div>
      
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
 * Form radio group component
 */
export function FormRadioGroup<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  options = [],
  ...props
}: FormFieldProps<T> & {
  options: SelectOption[];
}) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
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
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
            className="flex flex-col space-y-1"
            data-testid={testId || `${name}-radio-group`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${name}-${option.value}`}
                  data-testid={`${name}-option-${option.value}`}
                />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
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
 * Form phone input component with formatting
 */
export function FormPhoneInput<T extends FieldValues>({
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
  
  const formatPhoneNumber = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (numericValue.length === 0) return '';
    if (numericValue.length <= 3) return `(${numericValue}`;
    if (numericValue.length <= 6) return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
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
            value={formatPhoneNumber(field.value || '')}
            onChange={(e) => {
              const formattedValue = formatPhoneNumber(e.target.value);
              field.onChange(formattedValue);
            }}
            placeholder="(555) 123-4567"
            disabled={disabled}
            className={cn(error && "border-red-500", props.className)}
            data-testid={testId || `${name}-input`}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
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
