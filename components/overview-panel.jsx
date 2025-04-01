"use client"

import { ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function OverviewPanel() {
  const { userData, transactions } = useStore()

  // Calculate total savings
  const totalSavings = userData?.totalSavings || 0

  // Calculate total investments
  const totalInvestments = userData?.totalInvestments || 0

  // Calculate monthly change - memoized to avoid recalculation
  const lastMonthTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const date = new Date(t.date)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
      .reduce((acc, t) => acc + (t.type === "deposit" ? t.amount : -t.amount), 0)
  }, [transactions])

  const isPositiveChange = lastMonthTransactions >= 0

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
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
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={cardVariants}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {formatCurrency(totalSavings + totalInvestments)}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {isPositiveChange ? (
                      <motion.span
                        className="flex items-center text-green-500"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        {formatCurrency(Math.abs(lastMonthTransactions))} this month
                      </motion.span>
                    ) : (
                      <motion.span
                        className="flex items-center text-red-500"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                        {formatCurrency(Math.abs(lastMonthTransactions))} this month
                      </motion.span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your total financial assets</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <motion.div variants={cardVariants}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {formatCurrency(totalSavings)}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {userData?.savingsRate ? `${userData.savingsRate}% of income` : "No savings rate set"}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your total savings across all accounts</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>

      <motion.div variants={cardVariants}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {formatCurrency(totalInvestments)}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {userData?.investmentReturn ? (
                      <span className={userData.investmentReturn >= 0 ? "text-green-500" : "text-red-500"}>
                        {userData.investmentReturn > 0 ? "+" : ""}
                        {userData.investmentReturn}% overall return
                      </span>
                    ) : (
                      "No return data"
                    )}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your total investment portfolio value</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </motion.div>
  )
}

