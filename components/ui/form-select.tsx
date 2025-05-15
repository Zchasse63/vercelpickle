"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormField } from "@/components/ui/form"

// Enhanced SelectTrigger with variants and sizes
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "border-transparent bg-muted/50 focus:bg-background",
        outline: "border-2",
        flushed: "border-0 border-b rounded-none px-0 focus:ring-0 focus:ring-offset-0",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus:ring-destructive text-destructive placeholder:text-destructive/60",
        success: "border-green-500 focus:ring-green-500 text-green-500 placeholder:text-green-500/60",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

// Enhanced SelectTrigger component
const EnhancedSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger> &
    VariantProps<typeof selectTriggerVariants> & {
      isError?: boolean
    }
>(({ className, variant, size, state, isError, ...props }, ref) => {
  // Determine if we need to show an error state
  const computedState = isError ? "error" : state

  return (
    <SelectTrigger
      ref={ref}
      className={cn(selectTriggerVariants({ variant, size, state: computedState }), className)}
      {...props}
    />
  )
})
EnhancedSelectTrigger.displayName = "EnhancedSelectTrigger"

// FormSelect component for use with react-hook-form
interface FormSelectProps extends
  Omit<React.ComponentPropsWithoutRef<typeof Select>, "children"> {
  name: string
  label?: string
  description?: string
  options: { value: string; label: string }[]
  placeholder?: string
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
}

const FormSelect = React.forwardRef<
  HTMLSelectElement,
  FormSelectProps
>(({
  name,
  label,
  description,
  options,
  placeholder,
  variant,
  size,
  ...props
}, ref) => {
  const { error } = useFormField()

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              {...props}
            >
              <EnhancedSelectTrigger
                variant={variant}
                size={size}
                isError={!!error}
              >
                <SelectValue placeholder={placeholder} />
              </EnhancedSelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
})
FormSelect.displayName = "FormSelect"

// Standalone Select component with enhanced features
interface StandaloneSelectProps extends
  Omit<React.ComponentPropsWithoutRef<typeof Select>, "children"> {
  label?: string
  helperText?: string
  errorMessage?: string
  options: { value: string; label: string }[]
  placeholder?: string
  variant?: VariantProps<typeof selectTriggerVariants>["variant"]
  size?: VariantProps<typeof selectTriggerVariants>["size"]
  isError?: boolean
  id?: string
}

const StandaloneSelect = React.forwardRef<
  HTMLSelectElement,
  StandaloneSelectProps
>(({
  label,
  helperText,
  errorMessage,
  options,
  placeholder,
  variant,
  size,
  isError,
  id,
  ...props
}, ref) => {
  // Generate unique IDs for helper text and error message
  const selectId = id
  const helperId = `${selectId}-helper`
  const errorId = `${selectId}-error`

  // Determine aria-describedby based on helper text and error message
  const ariaDescribedBy = [
    helperText ? helperId : null,
    errorMessage ? errorId : null
  ].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Select {...props}>
        <EnhancedSelectTrigger
          id={selectId}
          variant={variant}
          size={size}
          isError={isError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!errorMessage || isError}
        >
          <SelectValue placeholder={placeholder} />
        </EnhancedSelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
StandaloneSelect.displayName = "StandaloneSelect"

export {
  EnhancedSelectTrigger,
  FormSelect,
  StandaloneSelect,
  selectTriggerVariants
}
