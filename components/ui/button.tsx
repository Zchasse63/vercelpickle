import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Add brand variants to main variant for type compatibility
        dill: "bg-dill-green text-white hover:bg-dill-green/90",
        pickle: "bg-pickle-green text-white hover:bg-pickle-green/90",
        mustard: "bg-golden-mustard text-dill-green hover:bg-golden-mustard/90",
        beige: "bg-brined-beige text-dill-green hover:bg-brined-beige/90",
        olive: "bg-smoked-olive text-white hover:bg-smoked-olive/90",
      },
      // Separate brand variants
      brand: {
        dill: "bg-dill-green text-white hover:bg-dill-green/90",
        pickle: "bg-pickle-green text-white hover:bg-pickle-green/90",
        mustard: "bg-golden-mustard text-dill-green hover:bg-golden-mustard/90",
        beige: "bg-brined-beige text-dill-green hover:bg-brined-beige/90",
        olive: "bg-smoked-olive text-white hover:bg-smoked-olive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      // For backward compatibility with existing code
      {
        variant: "dill",
        brand: null,
        className: "bg-dill-green text-white hover:bg-dill-green/90",
      },
      {
        variant: "pickle",
        brand: null,
        className: "bg-pickle-green text-white hover:bg-pickle-green/90",
      },
      {
        variant: "mustard",
        brand: null,
        className: "bg-golden-mustard text-dill-green hover:bg-golden-mustard/90",
      },
      {
        variant: "beige",
        brand: null,
        className: "bg-brined-beige text-dill-green hover:bg-brined-beige/90",
      },
      {
        variant: "olive",
        brand: null,
        className: "bg-smoked-olive text-white hover:bg-smoked-olive/90",
      },
    ],
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  /**
   * Accessible label for the button when icons are used without text
   * Required when the button has no visible text (e.g., icon-only buttons)
   */
  accessibleLabel?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    brand,
    size,
    asChild = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    accessibleLabel,
    "aria-label": ariaLabel,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Handle icons and loading state
    const iconClasses = "pointer-events-none size-4 shrink-0"

    // Determine if this is an icon-only button
    const hasVisibleText = React.Children.count(children) > 0;
    const isIconOnly = !hasVisibleText && (leftIcon || rightIcon);

    // Ensure icon-only buttons have an accessible label
    const accessibilityProps: React.AriaAttributes = {};

    if (isIconOnly) {
      if (!accessibleLabel && !ariaLabel) {
        console.warn(
          "Button: Icon-only buttons must have an accessible label. " +
          "Please provide either 'accessibleLabel' or 'aria-label' prop."
        );
      }

      accessibilityProps["aria-label"] = accessibleLabel || ariaLabel;
    }

    // Wrap children in a span if asChild is true to avoid React.Children.only error
    const wrappedChildren = asChild ? (
      <span className="flex items-center">
        {isLoading && (
          <Loader2 className={cn(iconClasses, "animate-spin")} aria-hidden="true" data-testid="loader-icon" />
        )}
        {!isLoading && leftIcon && (
          <span className={iconClasses} aria-hidden="true">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={iconClasses} aria-hidden="true">{rightIcon}</span>
        )}
      </span>
    ) : (
      <>
        {isLoading && (
          <Loader2 className={cn(iconClasses, "animate-spin")} aria-hidden="true" data-testid="loader-icon" />
        )}
        {!isLoading && leftIcon && (
          <span className={iconClasses} aria-hidden="true">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className={iconClasses} aria-hidden="true">{rightIcon}</span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, brand, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...accessibilityProps}
        {...props}
      >
        {wrappedChildren}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
