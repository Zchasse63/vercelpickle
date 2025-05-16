import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        filled: "border-transparent bg-muted/50 focus:bg-background",
        outline: "border-2",
        flushed: "border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/60",
        success: "border-green-500 focus-visible:ring-green-500 text-green-500 placeholder:text-green-500/60",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
      resize: "vertical",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  isError?: boolean
  errorMessage?: string
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    size,
    state,
    resize,
    isError = false,
    errorMessage,
    helperText,
    disabled,
    id,
    ...props
  }, ref) => {
    // Generate unique IDs for helper text and error message
    const textareaId = id || React.useId()
    const helperId = `${textareaId}-helper`
    const errorId = `${textareaId}-error`

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
        <textarea
          className={cn(
            textareaVariants({ variant, size, state: computedState, resize }),
            "min-h-[80px]",
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={showError}
          aria-describedby={ariaDescribedBy}
          id={textareaId}
          {...props}
        />

        {helperText && !showError && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}

        {showError && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" data-testid="alert-icon" />
            <p id={errorId} className="text-xs">
              {errorMessage || "This field is invalid"}
            </p>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
