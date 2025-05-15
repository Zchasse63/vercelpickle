"use client"

import { DynamicChart } from "@/components/charts/dynamic-chart"

const data = [
  { month: "Jan", revenue: 15000, orders: 120 },
  { month: "Feb", revenue: 23000, orders: 180 },
  { month: "Mar", revenue: 32000, orders: 250 },
  { month: "Apr", revenue: 45000, orders: 310 },
  { month: "May", revenue: 42000, orders: 290 },
  { month: "Jun", revenue: 58000, orders: 380 },
  { month: "Jul", revenue: 61000, orders: 410 },
  { month: "Aug", revenue: 54000, orders: 350 },
  { month: "Sep", revenue: 68000, orders: 450 },
  { month: "Oct", revenue: 72000, orders: 480 },
  { month: "Nov", revenue: 81000, orders: 520 },
  { month: "Dec", revenue: 95000, orders: 580 },
]

export function AdminSalesChart() {
  // Format data for Chart.js
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.revenue),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'Orders',
        data: data.map(item => item.orders),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
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
          callback: (value: number) => `$${value / 1000}k`
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
            return label === 'Revenue' ? `${label}: $${value.toLocaleString()}` : `${label}: ${value}`;
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <DynamicChart
        data={chartData}
        type="line"
        options={options}
        height={300}
        width={500}
        className="w-full h-full"
      />
    </div>
  )
}
