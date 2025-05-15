import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"

export interface SafeButtonProps extends ButtonProps {
  children: React.ReactNode
}

/**
 * A wrapper around the Button component that ensures it always has a single child
 * when using asChild prop, to avoid React.Children.only errors.
 */
export function SafeButton({
  children,
  asChild,
  ...props
}: SafeButtonProps) {
  // If asChild is true, ensure we wrap the children in a single span
  if (asChild) {
    return (
      <Button asChild {...props}>
        {React.isValidElement(children) ? (
          React.cloneElement(children as React.ReactElement, {}, 
            <span className="flex items-center">
              {(children as React.ReactElement).props.children}
            </span>
          )
        ) : (
          <span className="flex items-center">{children}</span>
        )}
      </Button>
    )
  }

  // If not using asChild, just pass through normally
  return <Button {...props}>{children}</Button>
}
