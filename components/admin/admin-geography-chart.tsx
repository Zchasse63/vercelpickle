"use client"

import { DynamicChart } from "@/components/charts/dynamic-chart"

const data = [
  { region: "California", sales: 28 },
  { region: "New York", sales: 22 },
  { region: "Texas", sales: 18 },
  { region: "Florida", sales: 12 },
  { region: "Illinois", sales: 8 },
  { region: "Washington", sales: 6 },
  { region: "Other US", sales: 6 },
]

export function AdminGeographyChart() {
  // Format data for Chart.js
  const chartData = {
    labels: data.map(item => item.region),
    datasets: [
      {
        label: 'Sales Percentage',
        data: data.map(item => item.sales),
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ]
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value}%`
        },
        grid: {
          drawBorder: false,
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <DynamicChart
        data={chartData}
        type="bar"
        options={options}
        height={300}
        width={500}
        className="w-full h-full"
      />
    </div>
  )
}
