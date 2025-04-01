"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardHeader } from "@/components/dashboard-header"
import { TransactionHistory } from "@/components/transaction-history"
import { TransactionSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"

export default function TransactionsPage() {
    const { fetchTransactions, isLoadingTransactions, transactionsError, retryFetchTransactions, transactions } =
        useStore()

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    // Calculate category totals for expenses
    const categoryTotals = transactions
        .filter((t) => t.type === "withdrawal")
        .reduce((acc, transaction) => {
            const { category, amount } = transaction
            if (!acc[category]) {
                acc[category] = 0
            }
            acc[category] += amount
            return acc
        }, {})

    const categoryData = Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        id: index, // Add unique id for each item
    }))

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-4 md:px-6 py-4 space-y-6 pb-16">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transactions</h1>
                    <ModeToggle />
                </div>

                {isLoadingTransactions ? (
                    <div className="grid gap-6">
                        <TransactionSkeleton />
                        <TransactionSkeleton />
                    </div>
                ) : transactionsError ? (
                    <ErrorState
                        title="Failed to load transactions"
                        description="We couldn't load your transaction history. Please try again."
                        onRetry={retryFetchTransactions}
                    />
                ) : (
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>Spending by Category</CardTitle>
                                    <CardDescription>Your expense distribution</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(value)}
                                                    labelFormatter={(name) => `Category: ${name}`}
                                                />
                                                <Legend 
                                                    layout="horizontal" 
                                                    verticalAlign="bottom" 
                                                    height={36}
                                                    wrapperStyle={{
                                                        paddingTop: '10px'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction Summary</CardTitle>
                                    <CardDescription>Overview of your financial activity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Total Income</p>
                                                <p className="text-2xl font-bold text-green-500">
                                                    {formatCurrency(
                                                        transactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0),
                                                    )}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Total Expenses</p>
                                                <p className="text-2xl font-bold text-red-500">
                                                    {formatCurrency(
                                                        transactions.filter((t) => t.type === "withdrawal").reduce((sum, t) => sum + t.amount, 0),
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h3 className="font-medium mb-2">Top Expenses</h3>
                                            <div className="space-y-2">
                                                {Object.entries(categoryTotals)
                                                    .sort((a, b) => b[1] - a[1])
                                                    .slice(0, 3)
                                                    .map(([category, amount], index) => (
                                                        <div key={`top-expense-${index}`} className="flex justify-between">
                                                            <span className="truncate pr-2">{category}</span>
                                                            <span className="font-medium whitespace-nowrap">{formatCurrency(amount)}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="overflow-x-auto">
                            <TransactionHistory />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}