"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormField } from "@/components/ui/form"

// Enhanced Checkbox with variants and sizes
const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  {
    variants: {
      variant: {
        default: "border-primary",
        outline: "border-2",
        filled: "bg-muted/20",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive data-[state=checked]:bg-destructive",
        success: "border-green-500 focus-visible:ring-green-500 data-[state=checked]:bg-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

// Enhanced Checkbox component
const EnhancedCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  React.ComponentPropsWithoutRef<typeof Checkbox> & 
    VariantProps<typeof checkboxVariants> & {
      isError?: boolean
    }
>(({ className, variant, size, state, isError, ...props }, ref) => {
  // Determine if we need to show an error state
  const computedState = isError ? "error" : state
  
  return (
    <Checkbox
      ref={ref}
      className={cn(checkboxVariants({ variant, size, state: computedState }), className)}
      {...props}
    />
  )
})
EnhancedCheckbox.displayName = "EnhancedCheckbox"

// FormCheckbox component for use with react-hook-form
interface FormCheckboxProps extends 
  Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, "checked" | "defaultChecked"> {
  name: string
  label: string
  description?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
}

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  FormCheckboxProps
>(({ 
  name, 
  label, 
  description, 
  variant, 
  size, 
  ...props 
}, ref) => {
  const { error } = useFormField()
  
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
          <FormControl>
            <EnhancedCheckbox
              checked={field.value}
              onCheckedChange={field.onChange}
              variant={variant}
              size={size}
              isError={!!error}
              {...props}
              ref={ref}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal">
              {label}
            </FormLabel>
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
})
FormCheckbox.displayName = "FormCheckbox"

// Standalone Checkbox component with enhanced features
interface StandaloneCheckboxProps extends 
  React.ComponentPropsWithoutRef<typeof Checkbox> {
  label: string
  helperText?: string
  errorMessage?: string
  variant?: VariantProps<typeof checkboxVariants>["variant"]
  size?: VariantProps<typeof checkboxVariants>["size"]
  isError?: boolean
}

const StandaloneCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  StandaloneCheckboxProps
>(({ 
  label, 
  helperText, 
  errorMessage, 
  variant, 
  size, 
  isError,
  id,
  ...props 
}, ref) => {
  // Generate unique IDs for helper text and error message
  const checkboxId = id || React.useId()
  const helperId = `${checkboxId}-helper`
  const errorId = `${checkboxId}-error`
  
  // Determine aria-describedby based on helper text and error message
  const ariaDescribedBy = [
    helperText ? helperId : null,
    errorMessage ? errorId : null
  ].filter(Boolean).join(" ") || undefined
  
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
      <EnhancedCheckbox
        id={checkboxId}
        variant={variant}
        size={size}
        isError={isError}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!errorMessage || isError}
        ref={ref}
        {...props}
      />
      <div className="space-y-1 leading-none">
        <label 
          htmlFor={checkboxId}
          className="text-sm font-normal"
        >
          {label}
        </label>
        
        {helperText && !errorMessage && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        
        {errorMessage && (
          <p id={errorId} className="text-xs text-destructive flex items-center gap-2">
            <span className="h-4 w-4">⚠️</span> {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
})
StandaloneCheckbox.displayName = "StandaloneCheckbox"

export { 
  EnhancedCheckbox, 
  FormCheckbox, 
  StandaloneCheckbox,
  checkboxVariants
}
