"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardHeader } from "@/components/dashboard-header"
import { InvestmentPortfolio } from "@/components/investment-portfolio"
import { InvestmentSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function InvestmentsPage() {
  const { fetchInvestments, isLoadingInvestments, investmentsError, retryFetchInvestments, investments } = useStore()

  useEffect(() => {
    fetchInvestments()
  }, [fetchInvestments])

  // Sample historical data for investments
  const historicalData = [
    { month: "Jan", value: 25000 },
    { month: "Feb", value: 26200 },
    { month: "Mar", value: 25800 },
    { month: "Apr", value: 27300 },
    { month: "May", value: 28100 },
    { month: "Jun", value: 27900 },
    { month: "Jul", value: 29500 },
    { month: "Aug", value: 30200 },
    { month: "Sep", value: 31000 },
    { month: "Oct", value: 30500 },
    { month: "Nov", value: 31800 },
    { month: "Dec", value: investments.reduce((sum, inv) => sum + inv.currentValue, 0) },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Investments</h1>
          <ModeToggle />
        </div>

        {isLoadingInvestments ? (
          <div className="grid gap-6">
            <InvestmentSkeleton />
            <InvestmentSkeleton />
          </div>
        ) : investmentsError ? (
          <ErrorState
            title="Failed to load investments"
            description="We couldn't load your investment portfolio. Please try again."
            onRetry={retryFetchInvestments}
          />
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Your investment growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <InvestmentPortfolio />
          </div>
        )}
      </main>
    </div>
  )
}

