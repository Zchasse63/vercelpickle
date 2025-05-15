/**
 * Form Components
 * 
 * This module provides reusable form components that integrate with React Hook Form.
 */

import React from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Form component props
 */
interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

/**
 * Form input component
 */
export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  ...props
}: FormFieldProps<T> & React.InputHTMLAttributes<HTMLInputElement>) {
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
            value={field.value || ""}
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

/**
 * Form textarea component
 */
export function FormTextarea<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  ...props
}: FormFieldProps<T> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
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
          <Textarea
            {...field}
            {...props}
            id={name}
            value={field.value || ""}
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

/**
 * Form checkbox component
 */
export function FormCheckbox<T extends FieldValues>({
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
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              data-testid={testId || `${name}-checkbox`}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              {...props}
            />
          )}
        />
        
        {label && (
          <Label 
            htmlFor={name} 
            className={cn(error && "text-red-500")}
          >
            {label}
          </Label>
        )}
      </div>
      
      {description && !error && (
        <p className="text-sm text-gray-500 ml-6">{description}</p>
      )}
      
      {error && (
        <p 
          className="text-red-500 text-sm mt-1 ml-6" 
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
 * Form select component
 */
export interface SelectOption {
  value: string;
  label: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  testId,
  options = [],
  placeholder = "Select an option",
  ...props
}: FormFieldProps<T> & {
  options: SelectOption[];
  placeholder?: string;
}) {
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
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger 
              id={name}
              className={cn(error && "border-red-500")}
              data-testid={testId || `${name}-select`}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={`${name}-option-${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
