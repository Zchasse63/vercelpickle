"use client"

import { DynamicChart } from "@/components/charts/dynamic-chart"

const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 4200 },
  { name: "Jun", total: 5800 },
  { name: "Jul", total: 6100 },
  { name: "Aug", total: 5400 },
  { name: "Sep", total: 6800 },
  { name: "Oct", total: 7200 },
  { name: "Nov", total: 8100 },
  { name: "Dec", total: 9500 },
]

export function AdminRevenueChart() {
  // Format data for Chart.js
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.total),
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`
        },
        grid: {
          drawBorder: false,
        }
      },
      x: {
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
            return `${label}: $${value}`;
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-[300px]">
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
