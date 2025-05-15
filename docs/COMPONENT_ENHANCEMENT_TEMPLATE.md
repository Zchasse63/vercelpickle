# Component Enhancement Template

**Last Updated:** `2025-05-06`

This document provides a standardized template for enhancing UI components in the Pickle B2B Marketplace platform. All components should follow this pattern to ensure consistency across the application.

## Enhancement Checklist

For each component, ensure the following enhancements are implemented:

- [ ] Create explicit TypeScript interface for props
- [ ] Add variants using class-variance-authority
- [ ] Add size options
- [ ] Add state handling (error, success, loading where applicable)
- [ ] Add accessibility attributes (aria-*)
- [ ] Add helper text support
- [ ] Add proper documentation
- [ ] Create usage examples

## Standard Component Structure

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// 1. Define variants using cva
const componentVariants = cva(
  "base-styles-here",
  {
    variants: {
      variant: {
        default: "default-variant-styles",
        // Add other variants
      },
      size: {
        sm: "small-size-styles",
        md: "medium-size-styles",
        lg: "large-size-styles",
      },
      state: {
        default: "",
        error: "error-state-styles",
        success: "success-state-styles",
      },
      // Add component-specific variants
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
)

// 2. Define component props interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Add component-specific props
  isError?: boolean
  errorMessage?: string
  helperText?: string
}

// 3. Implement the component
const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    isError = false,
    errorMessage,
    helperText,
    // Add other component-specific props
    ...props 
  }, ref) => {
    // Generate unique IDs for helper text and error message
    const componentId = props.id || React.useId()
    const helperId = `${componentId}-helper`
    const errorId = `${componentId}-error`
    
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
        {/* Main component element */}
        <element
          className={cn(
            componentVariants({ variant, size, state: computedState }),
            className
          )}
          ref={ref}
          aria-invalid={showError}
          aria-describedby={ariaDescribedBy}
          id={componentId}
          {...props}
        />
        
        {/* Helper text */}
        {helperText && !showError && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
        
        {/* Error message */}
        {showError && (
          <p id={errorId} className="text-xs text-destructive">
            {errorMessage || "This field is invalid"}
          </p>
        )}
      </div>
    )
  }
)
Component.displayName = "Component"

export { Component, componentVariants }
```

## Documentation Template

For each enhanced component, create documentation following this structure:

```md
# Component Name Usage Examples

**Last Updated:** `2025-05-06`

This document provides examples of how to use the enhanced Component in the Pickle B2B Marketplace platform.

## Basic Usage

```tsx
import { Component } from "@/components/ui/component"

// Default component
<Component />

// Component with variant
<Component variant="variant-name" />

// Component with size
<Component size="size-name" />
```

## Variants

Examples of all variants...

## Sizes

Examples of all sizes...

## States

Examples of all states...

## Helper Text and Error States

Examples of helper text and error states...

## Best Practices

1. When to use each variant
2. When to use each size
3. How to handle errors
4. Accessibility considerations
```

## Implementation Process

For each component:

1. **Audit**: Review the current implementation and identify enhancement opportunities
2. **Enhance**: Apply the standard template with component-specific adjustments
3. **Document**: Create usage examples and documentation
4. **Update**: Update the UI Migration Progress Tracker

## Batch Processing Groups

To efficiently enhance components, we'll process them in these functional groups:

### Group 1: Form Components
- Select
- Checkbox
- Radio
- Switch

### Group 2: Layout Components
- Card
- Dialog
- Drawer
- Sheet
- Tabs
- Accordion

### Group 3: Data Display Components
- Table
- Avatar
- Badge
- Calendar
- Chart

### Group 4: Feedback Components
- Alert
- Progress
- Skeleton
- Toast

### Group 5: Navigation Components
- Breadcrumb
- Dropdown
- Pagination
- Tooltip
