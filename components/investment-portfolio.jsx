"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartPie,
  ChartTooltip,
  ChartTooltipItem,
} from "@/components/ui/chart"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import toast from "react-hot-toast"

export function InvestmentPortfolio() {
  const { investments } = useStore()

  // Calculate total investment value - memoized to avoid recalculation
  const totalValue = useMemo(() => investments.reduce((sum, inv) => sum + inv.currentValue, 0), [investments])

  // Prepare data for pie chart
  const pieData = useMemo(
    () =>
      investments.map((inv) => ({
        name: inv.name,
        value: inv.currentValue,
        fill: getColorForAssetType(inv.type),
      })),
    [investments],
  )

  // Get performance color based on ROI
  function getPerformanceColor(roi) {
    if (roi > 5) return "text-green-500"
    if (roi > 0) return "text-green-400"
    if (roi === 0) return "text-gray-500"
    if (roi > -5) return "text-red-400"
    return "text-red-500"
  }

  // Get color for asset type
  function getColorForAssetType(type) {
    switch (type) {
      case "stocks":
        return "#4f46e5"
      case "bonds":
        return "#0ea5e9"
      case "crypto":
        return "#f59e0b"
      case "realestate":
        return "#10b981"
      case "cash":
        return "#6b7280"
      default:
        return "#8b5cf6"
    }
  }

  const handleAddInvestment = () => {
    toast.success("Feature coming soon: Add Investment")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <Card className="col-span-1 overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Your investment allocation and performance</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={handleAddInvestment}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </CardHeader>
      <CardContent>
        {investments.length > 0 ? (
          <motion.div initial="hidden" animate="show" variants={containerVariants}>
            <motion.div className="h-60 w-full" variants={itemVariants}>
              <ChartContainer>
                <Chart className="h-60">
                  <ChartPie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} />
                  <ChartTooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null
                      const data = payload[0]?.payload
                      if (!data) return null

                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <ChartTooltipItem label="Asset" value={data.name} />
                            <ChartTooltipItem label="Value" value={formatCurrency(data.value)} />
                            <ChartTooltipItem
                              label="Allocation"
                              value={`${((data.value / totalValue) * 100).toFixed(1)}%`}
                            />
                          </div>
                        </div>
                      )
                    }}
                  />
                </Chart>
              </ChartContainer>
            </motion.div>

            <motion.div className="mt-4 space-y-4" variants={itemVariants}>
              <ChartLegend className="justify-center gap-4">
                {investments.map((inv) => (
                  <ChartLegendItem
                    key={inv.id}
                    name={inv.name}
                    color={getColorForAssetType(inv.type)}
                    className="items-center gap-1.5"
                  />
                ))}
              </ChartLegend>

              <motion.div className="mt-4 space-y-2" variants={itemVariants}>
                <h4 className="text-sm font-medium">Performance</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {investments.map((inv, index) => (
                    <motion.div
                      key={inv.id}
                      className="flex flex-col rounded-lg border p-2 transition-all duration-200 hover:shadow-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span className="text-xs text-muted-foreground">{inv.name}</span>
                      <span className="text-sm font-medium">{formatCurrency(inv.currentValue)}</span>
                      <span className={`text-xs ${getPerformanceColor(inv.roi)}`}>
                        {inv.roi > 0 ? "+" : ""}
                        {inv.roi}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">No investments yet</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleAddInvestment}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Investment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

