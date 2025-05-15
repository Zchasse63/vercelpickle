"use client"

import { DynamicChart } from "@/components/charts/dynamic-chart"

const data = [
  { name: "Produce", value: 32 },
  { name: "Dairy", value: 18 },
  { name: "Meat", value: 22 },
  { name: "Bakery", value: 15 },
  { name: "Beverages", value: 8 },
  { name: "Other", value: 5 },
]

const COLORS = ["#16a34a", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#6b7280"]

export function AdminCategoryChart() {
  // Format data for Chart.js
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS.map(color => color.replace(')', ', 0.8)')),
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <DynamicChart
        data={chartData}
        type="pie"
        options={options}
        height={300}
        width={500}
        className="w-full h-full"
      />
    </div>
  )
}
