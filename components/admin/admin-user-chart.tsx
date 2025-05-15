"use client"

import { DynamicChart } from "@/components/charts/dynamic-chart"

const data = [
  { month: "Jan", newUsers: 85, activeUsers: 320 },
  { month: "Feb", newUsers: 92, activeUsers: 380 },
  { month: "Mar", newUsers: 130, activeUsers: 450 },
  { month: "Apr", newUsers: 140, activeUsers: 520 },
  { month: "May", newUsers: 110, activeUsers: 580 },
  { month: "Jun", newUsers: 125, activeUsers: 650 },
  { month: "Jul", newUsers: 150, activeUsers: 720 },
  { month: "Aug", newUsers: 135, activeUsers: 780 },
  { month: "Sep", newUsers: 160, activeUsers: 850 },
  { month: "Oct", newUsers: 175, activeUsers: 920 },
  { month: "Nov", newUsers: 190, activeUsers: 980 },
  { month: "Dec", newUsers: 145, activeUsers: 1050 },
]

export function AdminUserChart() {
  // Format data for Chart.js
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'New Users',
        data: data.map(item => item.newUsers),
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Active Users',
        data: data.map(item => item.activeUsers),
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
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
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
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
