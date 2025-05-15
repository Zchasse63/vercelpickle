"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { DynamicChart } from "@/components/charts/dynamic-chart"

// This is a simplified version of the chart component that uses our DynamicChart component
// instead of Recharts directly. This helps reduce bundle size and improve performance.

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    color?: string
    icon?: React.ComponentType
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    data: any
    type: "line" | "bar" | "pie" | "doughnut"
    options?: any
    height?: number
  }
>(({ className, config, data, type, options, height = 300, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    >
      <DynamicChart
        data={data}
        type={type}
        options={options}
        height={height}
        className="w-full h-full"
      />
    </div>
  )
})
ChartContainer.displayName = "Chart"

// Export simplified components for backward compatibility
export {
  ChartContainer
}
