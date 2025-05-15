"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface DynamicChartProps {
  data: any[]
  type: "line" | "bar" | "pie" | "doughnut"
  options?: any
  height?: number
  width?: number
  className?: string
}

export function DynamicChart({
  data,
  type,
  options,
  height = 300,
  width = 500,
  className,
}: DynamicChartProps) {
  const [ChartComponent, setChartComponent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamically import Chart.js only when the component is mounted
    const loadChart = async () => {
      try {
        setLoading(true)
        
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
          default:
            ChartModule = await import('react-chartjs-2').then(mod => mod.Line)
        }
        
        setChartComponent(() => ChartModule)
      } catch (error) {
        console.error('Error loading chart:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadChart()
  }, [type])

  if (loading || !ChartComponent) {
    return (
      <div className={className} style={{ height, width }}>
        <Skeleton className="h-full w-full rounded-md" />
      </div>
    )
  }

  return (
    <div className={className} style={{ height, width }}>
      <ChartComponent data={data} options={options} />
    </div>
  )
}
