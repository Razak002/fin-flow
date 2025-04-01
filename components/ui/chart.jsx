"use client"

import { Cell, Pie, PieChart, Tooltip, Legend } from "recharts"
import { cn } from "@/lib/utils"

export function ChartContainer({ className, ...props }) {
  return <div className={cn("relative", className)} {...props} />
}

export function Chart({ className, ...props }) {
  return <PieChart width={400} height={300} className={cn("mx-auto", className)} {...props} />
}

export function ChartPie({ data, dataKey, nameKey, innerRadius, outerRadius, ...props }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      dataKey={dataKey}
      nameKey={nameKey}
      labelLine={false}
      {...props}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
      ))}
    </Pie>
  )
}

export function ChartTooltip({ content, ...props }) {
  return <Tooltip content={content} {...props} />
}

export function ChartTooltipItem({ label, value }) {
  return (
    <div>
      <span className="font-medium">{label}:</span> {value}
    </div>
  )
}

export function ChartLegend({ className, ...props }) {
  return <Legend className={cn("flex flex-wrap", className)} {...props} />
}

export function ChartLegendItem({ name, color, className, ...props }) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{name}</span>
    </div>
  )
}

