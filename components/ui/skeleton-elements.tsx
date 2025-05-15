"use client";

import React from "react";
import { Skeleton } from "./skeleton";
import { 
  skeletonSizes, 
  skeletonShapes, 
  skeletonMargins, 
  skeletonClass,
  skeletonArray
} from "@/lib/styles/skeleton-styles";
import { cn } from "@/lib/utils";

/**
 * Text Skeleton - for headings, paragraphs, and other text elements
 */
export function TextSkeleton({
  size = "md",
  width = "md",
  lines = 1,
  className = "",
  ...props
}: {
  size?: keyof typeof skeletonSizes.text;
  width?: keyof typeof skeletonSizes.width | string;
  lines?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  if (lines === 1) {
    return (
      <Skeleton
        className={skeletonClass({ height: size, width, className })}
        {...props}
      />
    );
  }

  return (
    <div className="space-y-2">
      {skeletonArray(lines).map((item) => (
        <Skeleton
          key={item.id}
          className={skeletonClass({ 
            height: size, 
            width: index => index === lines - 1 ? "sm" : "md", 
            className 
          })}
          {...props}
        />
      ))}
    </div>
  );
}

/**
 * Heading Skeleton - for page titles and section headings
 */
export function HeadingSkeleton({
  level = 1,
  withSubheading = false,
  className = "",
  ...props
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  withSubheading?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const sizes: Record<number, keyof typeof skeletonSizes.text> = {
    1: "xl",
    2: "lg",
    3: "md",
    4: "sm",
    5: "sm",
    6: "xs",
  };

  const widths: Record<number, keyof typeof skeletonSizes.width> = {
    1: "xxl",
    2: "xl",
    3: "lg",
    4: "md",
    5: "sm",
    6: "xs",
  };

  return (
    <div className="space-y-2">
      <Skeleton
        className={skeletonClass({ 
          height: sizes[level], 
          width: widths[level], 
          className 
        })}
        {...props}
      />
      {withSubheading && (
        <Skeleton
          className={skeletonClass({ 
            height: "sm", 
            width: widths[level + 1 > 6 ? 6 : level + 1], 
            className: "mt-1" 
          })}
        />
      )}
    </div>
  );
}

/**
 * Avatar Skeleton - for user avatars and profile pictures
 */
export function AvatarSkeleton({
  size = "md",
  className = "",
  ...props
}: {
  size?: keyof typeof skeletonSizes.avatar;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(skeletonSizes.avatar[size], skeletonShapes.circle, className)}
      {...props}
    />
  );
}

/**
 * Button Skeleton - for buttons and action elements
 */
export function ButtonSkeleton({
  size = "md",
  shape = "rounded",
  className = "",
  ...props
}: {
  size?: keyof typeof skeletonSizes.button;
  shape?: keyof typeof skeletonShapes;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(skeletonSizes.button[size], skeletonShapes[shape], className)}
      {...props}
    />
  );
}

/**
 * Input Skeleton - for form inputs and text fields
 */
export function InputSkeleton({
  size = "md",
  className = "",
  ...props
}: {
  size?: keyof typeof skeletonSizes.input;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(skeletonSizes.input[size], "w-full", skeletonShapes.rounded, className)}
      {...props}
    />
  );
}

/**
 * Card Skeleton - for card layouts
 */
export function CardSkeleton({
  header = true,
  headerSize = "md",
  description = true,
  content = true,
  contentLines = 3,
  footer = false,
  className = "",
  ...props
}: {
  header?: boolean;
  headerSize?: keyof typeof skeletonSizes.text;
  description?: boolean;
  content?: boolean;
  contentLines?: number;
  footer?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-4", className)} {...props}>
      {header && (
        <div className="space-y-2">
          <Skeleton className={skeletonClass({ height: headerSize, width: "lg" })} />
          {description && (
            <Skeleton className={skeletonClass({ height: "sm", width: "xl" })} />
          )}
        </div>
      )}
      
      {content && (
        <div className="space-y-2">
          {skeletonArray(contentLines).map((item) => (
            <Skeleton
              key={item.id}
              className={skeletonClass({ height: "sm", width: "full" })}
            />
          ))}
        </div>
      )}
      
      {footer && (
        <div className="flex justify-end space-x-2 pt-2">
          <ButtonSkeleton size="sm" />
          <ButtonSkeleton size="sm" />
        </div>
      )}
    </div>
  );
}

/**
 * Table Skeleton - for table layouts
 */
export function TableSkeleton({
  columns = 4,
  rows = 5,
  className = "",
  ...props
}: {
  columns?: number;
  rows?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-md border", className)} {...props}>
      <div className="border-b p-4">
        <div className="flex space-x-4">
          {skeletonArray(columns).map((item) => (
            <Skeleton
              key={item.id}
              className={skeletonClass({ height: "sm", width: "md" })}
            />
          ))}
        </div>
      </div>
      
      <div className="divide-y">
        {skeletonArray(rows).map((row) => (
          <div key={row.id} className="p-4">
            <div className="flex justify-between">
              {skeletonArray(columns).map((col) => (
                <Skeleton
                  key={col.id}
                  className={skeletonClass({ height: "sm", width: "sm" })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Chart Skeleton - for charts and graphs
 */
export function ChartSkeleton({
  height = "md",
  className = "",
  ...props
}: {
  height?: "sm" | "md" | "lg" | "xl";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const heights = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
    xl: "h-96",
  };
  
  return (
    <Skeleton
      className={cn(heights[height], "w-full rounded-md", className)}
      {...props}
    />
  );
}
