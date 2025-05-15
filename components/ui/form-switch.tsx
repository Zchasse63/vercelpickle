"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormField } from "@/components/ui/form"

// Enhanced Switch with variants and sizes
const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-primary data-[state=unchecked]:border-input",
        subtle: "data-[state=unchecked]:bg-muted",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
      state: {
        default: "",
        error: "data-[state=checked]:bg-destructive focus-visible:ring-destructive",
        success: "data-[state=checked]:bg-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

// Enhanced Switch thumb styles
const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        md: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// Enhanced Switch component
const EnhancedSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  React.ComponentPropsWithoutRef<typeof Switch> & 
    VariantProps<typeof switchVariants> & {
      isError?: boolean
      thumbClassName?: string
    }
>(({ className, variant, size, state, isError, thumbClassName, ...props }, ref) => {
  // Determine if we need to show an error state
  const computedState = isError ? "error" : state
  
  return (
    <Switch
      ref={ref}
      className={cn(switchVariants({ variant, size, state: computedState }), className)}
      {...props}
    >
      <span className={cn(switchThumbVariants({ size }), thumbClassName)} />
    </Switch>
  )
})
EnhancedSwitch.displayName = "EnhancedSwitch"

// FormSwitch component for use with react-hook-form
interface FormSwitchProps extends 
  Omit<React.ComponentPropsWithoutRef<typeof Switch>, "checked" | "defaultChecked"> {
  name: string
  label: string
  description?: string
  variant?: VariantProps<typeof switchVariants>["variant"]
  size?: VariantProps<typeof switchVariants>["size"]
  thumbClassName?: string
}

const FormSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  FormSwitchProps
>(({ 
  name, 
  label, 
  description, 
  variant, 
  size, 
  thumbClassName,
  ...props 
}, ref) => {
  const { error } = useFormField()
  
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {label}
            </FormLabel>
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <EnhancedSwitch
              checked={field.value}
              onCheckedChange={field.onChange}
              variant={variant}
              size={size}
              isError={!!error}
              thumbClassName={thumbClassName}
              {...props}
              ref={ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
})
FormSwitch.displayName = "FormSwitch"

// Standalone Switch component with enhanced features
interface StandaloneSwitchProps extends 
  React.ComponentPropsWithoutRef<typeof Switch> {
  label: string
  helperText?: string
  errorMessage?: string
  variant?: VariantProps<typeof switchVariants>["variant"]
  size?: VariantProps<typeof switchVariants>["size"]
  isError?: boolean
  thumbClassName?: string
}

const StandaloneSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  StandaloneSwitchProps
>(({ 
  label, 
  helperText, 
  errorMessage, 
  variant, 
  size, 
  isError,
  thumbClassName,
  id,
  ...props 
}, ref) => {
  // Generate unique IDs for helper text and error message
  const switchId = id || React.useId()
  const helperId = `${switchId}-helper`
  const errorId = `${switchId}-error`
  
  // Determine aria-describedby based on helper text and error message
  const ariaDescribedBy = [
    helperText ? helperId : null,
    errorMessage ? errorId : null
  ].filter(Boolean).join(" ") || undefined
  
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <label 
          htmlFor={switchId}
          className="text-base font-medium"
        >
          {label}
        </label>
        
        {helperText && !errorMessage && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        
        {errorMessage && (
          <p id={errorId} className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
      
      <EnhancedSwitch
        id={switchId}
        variant={variant}
        size={size}
        isError={isError}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!errorMessage || isError}
        thumbClassName={thumbClassName}
        ref={ref}
        {...props}
      />
    </div>
  )
})
StandaloneSwitch.displayName = "StandaloneSwitch"

export { 
  EnhancedSwitch, 
  FormSwitch, 
  StandaloneSwitch,
  switchVariants,
  switchThumbVariants
}
