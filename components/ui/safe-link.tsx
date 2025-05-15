import * as React from "react"
import Link, { LinkProps } from "next/link"

export interface SafeLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

/**
 * A wrapper around the Link component that ensures it always has a single child
 * when used with components that use React.Children.only.
 */
export function SafeLink({
  children,
  className,
  ...props
}: SafeLinkProps) {
  // Extract data-testid from props if it exists
  const { 'data-testid': dataTestId, ...linkProps } = props;

  return (
    <Link {...linkProps} className={className}>
      <span className="flex items-center" data-testid={dataTestId}>
        {children}
      </span>
    </Link>
  )
}
