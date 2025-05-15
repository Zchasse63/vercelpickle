"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormField } from "@/components/ui/form"

// Enhanced RadioGroupItem with variants and sizes
const radioGroupItemVariants = cva(
  "aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
        error: "border-destructive focus-visible:ring-destructive text-destructive",
        success: "border-green-500 focus-visible:ring-green-500 text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

// Enhanced RadioGroupItem component
const EnhancedRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof RadioGroupItem> & 
    VariantProps<typeof radioGroupItemVariants> & {
      isError?: boolean
    }
>(({ className, variant, size, state, isError, ...props }, ref) => {
  // Determine if we need to show an error state
  const computedState = isError ? "error" : state
  
  return (
    <RadioGroupItem
      ref={ref}
      className={cn(radioGroupItemVariants({ variant, size, state: computedState }), className)}
      {...props}
    />
  )
})
EnhancedRadioGroupItem.displayName = "EnhancedRadioGroupItem"

// FormRadioGroup component for use with react-hook-form
interface FormRadioGroupProps extends 
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, "defaultValue"> {
  name: string
  label?: string
  description?: string
  options: { value: string; label: string }[]
  variant?: VariantProps<typeof radioGroupItemVariants>["variant"]
  size?: VariantProps<typeof radioGroupItemVariants>["size"]
}

const FormRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  FormRadioGroupProps
>(({ 
  name, 
  label, 
  description, 
  options,
  variant, 
  size, 
  className,
  ...props 
}, ref) => {
  const { error } = useFormField()
  
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("space-y-1", className)}
              {...props}
              ref={ref}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <EnhancedRadioGroupItem 
                    value={option.value} 
                    variant={variant}
                    size={size}
                    isError={!!error}
                  />
                  <label 
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
})
FormRadioGroup.displayName = "FormRadioGroup"

// Standalone RadioGroup component with enhanced features
interface StandaloneRadioGroupProps extends 
  React.ComponentPropsWithoutRef<typeof RadioGroup> {
  label?: string
  helperText?: string
  errorMessage?: string
  options: { value: string; label: string }[]
  variant?: VariantProps<typeof radioGroupItemVariants>["variant"]
  size?: VariantProps<typeof radioGroupItemVariants>["size"]
  isError?: boolean
}

const StandaloneRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  StandaloneRadioGroupProps
>(({ 
  label, 
  helperText, 
  errorMessage, 
  options,
  variant, 
  size, 
  isError,
  id,
  className,
  ...props 
}, ref) => {
  // Generate unique IDs for helper text and error message
  const groupId = id || React.useId()
  const helperId = `${groupId}-helper`
  const errorId = `${groupId}-error`
  
  // Determine aria-describedby based on helper text and error message
  const ariaDescribedBy = [
    helperText ? helperId : null,
    errorMessage ? errorId : null
  ].filter(Boolean).join(" ") || undefined
  
  return (
    <div className="space-y-3">
      {label && (
        <label 
          id={`${groupId}-label`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      
      <RadioGroup
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!errorMessage || isError}
        className={cn("space-y-1", className)}
        {...props}
        ref={ref}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <EnhancedRadioGroupItem 
              id={`${groupId}-${option.value}`}
              value={option.value} 
              variant={variant}
              size={size}
              isError={isError}
            />
            <label 
              htmlFor={`${groupId}-${option.value}`}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      
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
  )
})
StandaloneRadioGroup.displayName = "StandaloneRadioGroup"

export { 
  EnhancedRadioGroupItem, 
  FormRadioGroup, 
  StandaloneRadioGroup,
  radioGroupItemVariants
}
