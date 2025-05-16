import * as React from "react"
import { cn } from "@/lib/utils"

// Type for responsive values
type ResponsiveValue<T> = T | {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

// Type for grid columns
type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

// Type for grid gap
type GridGap = "sm" | "md" | "lg" | "xl" | string

// Type for grid auto rows/columns
type GridAuto = "auto" | "min" | "max" | "fr" | string

// Props for Grid component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveValue<GridColumns>
  gap?: GridGap
  rowGap?: GridGap
  colGap?: GridGap
  autoRows?: GridAuto
  autoColumns?: GridAuto
  className?: string
  children: React.ReactNode
}

// Props for GridItem component
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: ResponsiveValue<GridColumns>
  rowSpan?: ResponsiveValue<GridColumns>
  colStart?: number
  rowStart?: number
  className?: string
  children: React.ReactNode
}

// Helper function to get responsive classes
const getResponsiveClasses = <T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  prefix: string
): string => {
  if (!value) return ""

  if (typeof value === "string" || typeof value === "number") {
    return `${prefix}-${value}`
  }

  const classes = []

  if (value.base !== undefined) classes.push(`${prefix}-${value.base}`)
  if (value.sm !== undefined) classes.push(`sm:${prefix}-${value.sm}`)
  if (value.md !== undefined) classes.push(`md:${prefix}-${value.md}`)
  if (value.lg !== undefined) classes.push(`lg:${prefix}-${value.lg}`)
  if (value.xl !== undefined) classes.push(`xl:${prefix}-${value.xl}`)
  if (value['2xl'] !== undefined) classes.push(`2xl:${prefix}-${value['2xl']}`)

  return classes.join(" ")
}

// Helper function to get gap classes
const getGapClasses = (gap?: GridGap, prefix: string = "gap"): string => {
  if (!gap) return ""

  switch (gap) {
    case "sm": return `${prefix}-2`
    case "md": return `${prefix}-4`
    case "lg": return `${prefix}-6`
    case "xl": return `${prefix}-8`
    default: return `${prefix}-${gap}`
  }
}

// Helper function to get auto rows/columns classes
const getAutoClasses = (auto?: GridAuto, prefix: string): string => {
  if (!auto) return ""

  switch (auto) {
    case "auto": return `${prefix}-auto`
    case "min": return `${prefix}-min`
    case "max": return `${prefix}-max`
    case "fr": return `${prefix}-fr`
    default: return `${prefix}-${auto}`
  }
}

/**
 * Grid component for creating grid layouts
 */
export function Grid({
  cols,
  gap,
  rowGap,
  colGap,
  autoRows,
  autoColumns,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        // Apply columns classes if cols is provided
        cols && (typeof cols === 'object'
          ? [
              cols.base && `grid-cols-${cols.base}`,
              cols.sm && `sm:grid-cols-${cols.sm}`,
              cols.md && `md:grid-cols-${cols.md}`,
              cols.lg && `lg:grid-cols-${cols.lg}`,
              cols.xl && `xl:grid-cols-${cols.xl}`,
              cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
            ]
          : `grid-cols-${cols}`),

        // Apply gap classes
        gap && (
          gap === 'sm' ? 'gap-2' :
          gap === 'md' ? 'gap-4' :
          gap === 'lg' ? 'gap-6' :
          gap === 'xl' ? 'gap-8' :
          `gap-${gap}`
        ),

        // Apply row gap classes
        rowGap && (
          rowGap === 'sm' ? 'gap-y-2' :
          rowGap === 'md' ? 'gap-y-4' :
          rowGap === 'lg' ? 'gap-y-6' :
          rowGap === 'xl' ? 'gap-y-8' :
          `gap-y-${rowGap}`
        ),

        // Apply column gap classes
        colGap && (
          colGap === 'sm' ? 'gap-x-2' :
          colGap === 'md' ? 'gap-x-4' :
          colGap === 'lg' ? 'gap-x-6' :
          colGap === 'xl' ? 'gap-x-8' :
          `gap-x-${colGap}`
        ),

        // Apply auto rows classes
        autoRows === 'min-content' && 'auto-rows-min',
        autoRows === 'max-content' && 'auto-rows-max',
        autoRows === 'auto' && 'auto-rows-auto',
        autoRows === 'fr' && 'auto-rows-fr',
        autoRows && !['min-content', 'max-content', 'auto', 'fr'].includes(autoRows) && `auto-rows-${autoRows}`,

        // Apply auto columns classes
        autoColumns === 'min-content' && 'auto-cols-min',
        autoColumns === 'max-content' && 'auto-cols-max',
        autoColumns === 'auto' && 'auto-cols-auto',
        autoColumns === 'fr' && 'auto-cols-fr',
        autoColumns && !['min-content', 'max-content', 'auto', 'fr'].includes(autoColumns) && `auto-cols-${autoColumns}`,

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * GridItem component for individual items within a Grid container
 */
export function GridItem({
  colSpan,
  rowSpan,
  colStart,
  rowStart,
  className,
  children,
  ...props
}: GridItemProps) {
  // Create a list of classes to apply
  const classes = [
    // Apply custom class
    className,
  ];

  // Apply column span classes
  if (colSpan) {
    if (typeof colSpan === 'object') {
      if (colSpan.base) classes.push(`col-span-${colSpan.base}`);
      if (colSpan.sm) classes.push(`sm:col-span-${colSpan.sm}`);
      if (colSpan.md) classes.push(`md:col-span-${colSpan.md}`);
      if (colSpan.lg) classes.push(`lg:col-span-${colSpan.lg}`);
      if (colSpan.xl) classes.push(`xl:col-span-${colSpan.xl}`);
      if (colSpan['2xl']) classes.push(`2xl:col-span-${colSpan['2xl']}`);
    } else {
      classes.push(`col-span-${colSpan}`);
    }
  }

  // Apply row span classes
  if (rowSpan) {
    if (typeof rowSpan === 'object') {
      if (rowSpan.base) classes.push(`row-span-${rowSpan.base}`);
      if (rowSpan.sm) classes.push(`sm:row-span-${rowSpan.sm}`);
      if (rowSpan.md) classes.push(`md:row-span-${rowSpan.md}`);
      if (rowSpan.lg) classes.push(`lg:row-span-${rowSpan.lg}`);
      if (rowSpan.xl) classes.push(`xl:row-span-${rowSpan.xl}`);
      if (rowSpan['2xl']) classes.push(`2xl:row-span-${rowSpan['2xl']}`);
    } else {
      classes.push(`row-span-${rowSpan}`);
    }
  }

  // Apply column start class
  if (colStart) {
    classes.push(`col-start-${colStart}`);
  }

  // Apply row start class
  if (rowStart) {
    classes.push(`row-start-${rowStart}`);
  }

  // Filter out any empty strings and join the classes
  const classNames = classes.filter(Boolean).join(" ");

  return (
    <div
      className={classNames}
      {...props}
    >
      {children}
    </div>
  )
}
