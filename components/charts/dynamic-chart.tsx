"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type ChartType = "line" | "bar" | "pie" | "doughnut" | "radar" | "polarArea" | "scatter" | "bubble"

interface ChartDataset {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  borderRadius?: number
  barPercentage?: number
  fill?: boolean
  tension?: number
  [key: string]: any
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

interface DynamicChartProps {
  data: ChartData
  type: ChartType
  options?: any
  height?: number | string
  width?: number | string
  className?: string
  onDataLoad?: () => void
  onError?: (error: Error) => void
}

/**
 * A dynamic chart component that only loads Chart.js when needed
 * This component is optimized for use with Convex data by handling loading states
 * and ensuring the chart is only rendered when data is available
 */
export function DynamicChart({
  data,
  type,
  options = {},
  height = 300,
  width = "100%",
  className = "",
  onDataLoad,
  onError,
}: DynamicChartProps) {
  const [ChartComponent, setChartComponent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<any>(null)

  // Determine if we have valid data to display
  const hasValidData = data &&
    data.datasets &&
    data.datasets.length > 0 &&
    data.datasets.some(dataset => dataset.data && dataset.data.length > 0)

  // Load Chart.js and the appropriate chart component
  useEffect(() => {
    let isMounted = true

    const loadChart = async () => {
      if (!hasValidData) return

      try {
        setLoading(true)
        setError(null)

        // Dynamically import Chart.js
        const { Chart, registerables } = await import('chart.js')

        // Register the components we need
        Chart.register(...registerables)

        // Dynamically import the specific chart type from react-chartjs-2
        let ChartModule

        switch (type) {
          case 'line':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Line)
            break
          case 'bar':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Bar)
            break
          case 'pie':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Pie)
            break
          case 'doughnut':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Doughnut)
            break
          case 'radar':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Radar)
            break
          case 'polarArea':
            ChartModule = await import('react-chartjs-2').then(mod => mod.PolarArea)
            break
          case 'scatter':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Scatter)
            break
          case 'bubble':
            ChartModule = await import('react-chartjs-2').then(mod => mod.Bubble)
            break
          default:
            ChartModule = await import('react-chartjs-2').then(mod => mod.Line)
        }

        if (isMounted) {
          setChartComponent(() => ChartModule)
          if (onDataLoad) onDataLoad()
        }
      } catch (error) {
        console.error('Error loading chart:', error)
        if (isMounted) {
          setError(error instanceof Error ? error : new Error('Failed to load chart'))
          if (onError) onError(error instanceof Error ? error : new Error('Failed to load chart'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadChart()

    return () => {
      isMounted = false
      // Clean up chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [type, hasValidData, onDataLoad, onError])

  // Handle loading state
  if (loading || !ChartComponent) {
    return (
      <div
        ref={chartRef}
        className={`relative ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
      >
        <Skeleton className="h-full w-full rounded-md" />
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div
        className={`relative p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-md ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load chart</p>
          <p className="text-red-500 dark:text-red-500 text-sm">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Handle no data state
  if (!hasValidData) {
    return (
      <div
        className={`relative p-4 border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 rounded-md ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    )
  }

  // Default chart options with sensible defaults
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' ? {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    } : undefined,
  }

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options }

  // Render the chart
  return (
    <div
      ref={chartRef}
      className={`relative ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width
      }}
    >
      <ChartComponent
        data={data}
        options={mergedOptions}
        ref={(chartInstance: any) => {
          chartInstanceRef.current = chartInstance
        }}
      />
    </div>
  )
}
