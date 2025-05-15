"use client";

import { Loader2, LoaderCircle, RefreshCw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

// Define loading variants using class-variance-authority
const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "",
        dots: "",
        pulse: "",
        skeleton: "animate-pulse",
        progress: "relative overflow-hidden",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        full: "h-full w-full",
      },
      alignment: {
        center: "flex-col items-center justify-center",
        left: "flex-row items-center justify-start",
        right: "flex-row-reverse items-center justify-start",
      },
      color: {
        default: "text-dill-green",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "md",
      alignment: "center",
      color: "default",
    },
  }
);

// Define loading props
export interface LoadingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  textPosition?: "top" | "bottom" | "left" | "right";
  icon?: "spinner" | "circle" | "refresh" | "rotate";
  progress?: number; // 0-100 for progress variant
  repeat?: number; // Number of skeleton items to show
  fullPage?: boolean; // Whether to display as a full-page overlay
}

/**
 * Enhanced loading component with multiple variants and configuration options
 * @param props - Loading component props
 * @returns Loading component
 */
export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({
    className,
    variant = "spinner",
    size = "md",
    alignment = "center",
    color = "default",
    text,
    textPosition = "bottom",
    icon = "spinner",
    progress = 0,
    repeat = 1,
    fullPage = false,
    ...props
  }, ref) => {
    // Get the appropriate icon component
    const IconComponent = {
      spinner: Loader2,
      circle: LoaderCircle,
      refresh: RefreshCw,
      rotate: RotateCw,
    }[icon];

    // Size classes for the icon
    const sizeClasses = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
      full: "h-full w-full",
    };

    // Text position classes
    const textPositionClasses = {
      top: "flex-col-reverse",
      bottom: "flex-col",
      left: "flex-row-reverse",
      right: "flex-row",
    };

    // Text margin classes based on position
    const textMarginClasses = {
      top: "mb-2",
      bottom: "mt-2",
      left: "ml-2",
      right: "mr-2",
    };

    // Render different loading variants
    const renderLoadingContent = () => {
      switch (variant) {
        case "spinner":
          return (
            <IconComponent
              className={cn(
                "animate-spin",
                sizeClasses[size as keyof typeof sizeClasses]
              )}
            />
          );

        case "dots":
          return (
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full bg-current",
                    sizeClasses[size as keyof typeof sizeClasses],
                    `animate-bounce [animation-delay:${i * 100}ms]`
                  )}
                />
              ))}
            </div>
          );

        case "pulse":
          return (
            <div
              className={cn(
                "rounded-full bg-current animate-pulse",
                sizeClasses[size as keyof typeof sizeClasses]
              )}
            />
          );

        case "skeleton":
          return (
            <div className="w-full space-y-2">
              {[...Array(repeat)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-muted rounded"
                />
              ))}
            </div>
          );

        case "progress":
          return (
            <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-dill-green h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          );

        default:
          return (
            <IconComponent
              className={cn(
                "animate-spin",
                sizeClasses[size as keyof typeof sizeClasses]
              )}
            />
          );
      }
    };

    // Full page overlay
    if (fullPage) {
      return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div
            ref={ref}
            className={cn(
              loadingVariants({ variant, size, alignment, color }),
              textPositionClasses[textPosition],
              className
            )}
            {...props}
          >
            {renderLoadingContent()}
            {text && (
              <p className={cn(
                "text-sm text-muted-foreground",
                textMarginClasses[textPosition]
              )}>
                {text}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Regular loading component
    return (
      <div
        ref={ref}
        className={cn(
          loadingVariants({ variant, size, alignment, color }),
          textPositionClasses[textPosition],
          className
        )}
        {...props}
      >
        {renderLoadingContent()}
        {text && (
          <p className={cn(
            "text-sm text-muted-foreground",
            textMarginClasses[textPosition]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }
);

Loading.displayName = "Loading";

/**
 * Skeleton loading component for product cards
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden", className)}>
      <div className="aspect-square w-full bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-8 w-full bg-muted rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for product grid
 */
export function ProductGridSkeleton({
  count = 8,
  viewMode = "grid"
}: {
  count?: number;
  viewMode?: "grid" | "list";
}) {
  return (
    <div className={cn(
      "grid gap-4",
      viewMode === "grid"
        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        : "grid-cols-1"
    )}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loading component for forms
 */
export function FormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4 w-full">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>
      ))}
      <div className="h-10 w-1/4 bg-muted rounded animate-pulse mt-6" />
    </div>
  );
}
