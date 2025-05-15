import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "border-transparent bg-muted/50 focus:bg-background",
        outline: "border-2",
        flushed: "border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0",
      },
      size: {
        sm: "h-8 px-2 py-1 text-sm",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/60",
        success: "border-green-500 focus-visible:ring-green-500 text-green-500 placeholder:text-green-500/60",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = "text",
    variant,
    size,
    state,
    leftIcon,
    rightIcon,
    isLoading = false,
    isError = false,
    errorMessage,
    helperText,
    disabled,
    id,
    ...props
  }, ref) => {
    // Generate unique IDs for helper text and error message
    const inputId = id || React.useId()
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    // Determine if we need to show an error state
    const showError = isError || !!errorMessage
    const computedState = showError ? "error" : state

    // Determine aria-describedby based on helper text and error message
    const ariaDescribedBy = [
      helperText ? helperId : null,
      showError ? errorId : null
    ].filter(Boolean).join(" ") || undefined

    return (
      <div className="w-full space-y-1.5">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ variant, size, state: computedState }),
              leftIcon && "pl-10",
              (rightIcon || isLoading) && "pr-10",
              className
            )}
            ref={ref}
            disabled={disabled || isLoading}
            aria-invalid={showError}
            aria-describedby={ariaDescribedBy}
            id={inputId}
            {...props}
          />

          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}

          {!isLoading && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}

          {!isLoading && showError && !rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {helperText && !showError && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}

        {showError && (
          <p id={errorId} className="text-xs text-destructive">
            {errorMessage || "This field is invalid"}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
