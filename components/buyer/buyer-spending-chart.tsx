"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SpendingChartProps {
  detailed?: boolean
}

export function BuyerSpendingChart({ detailed = false }: SpendingChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const data = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 900 },
    { name: "Mar", total: 1500 },
    { name: "Apr", total: 1800 },
    { name: "May", total: 2000 },
    { name: "Jun", total: 1700 },
  ]

  const detailedData = [
    {
      name: "Jan",
      Produce: 500,
      Dairy: 300,
      Bakery: 200,
      Meat: 200,
    },
    {
      name: "Feb",
      Produce: 400,
      Dairy: 200,
      Bakery: 100,
      Meat: 200,
    },
    {
      name: "Mar",
      Produce: 600,
      Dairy: 400,
      Bakery: 300,
      Meat: 200,
    },
    {
      name: "Apr",
      Produce: 700,
      Dairy: 500,
      Bakery: 300,
      Meat: 300,
    },
    {
      name: "May",
      Produce: 800,
      Dairy: 600,
      Bakery: 300,
      Meat: 300,
    },
    {
      name: "Jun",
      Produce: 700,
      Dairy: 500,
      Bakery: 200,
      Meat: 300,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={detailed ? 400 : 250}>
      {detailed ? (
        <BarChart data={detailedData}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip formatter={(value: number) => [`$${value}`, "Amount"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          <Bar dataKey="Produce" fill="#4ade80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Dairy" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Bakery" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Meat" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip formatter={(value: number) => [`$${value}`, "Total"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  )
}
