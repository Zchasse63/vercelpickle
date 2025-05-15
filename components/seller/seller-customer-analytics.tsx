"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend)

export function SellerCustomerAnalytics() {
  // This would typically come from your data fetching logic
  const customerData = {
    labels: ["Restaurants", "Grocery Stores", "Catering Services", "Cafes", "Other"],
    datasets: [
      {
        data: [42, 28, 15, 10, 5],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    cutout: "60%",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
        <CardDescription>Distribution of sales by customer type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square">
          <Doughnut data={customerData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
