"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewPanel } from "@/components/overview-panel"
import { SavingsSection } from "@/components/savings-section"
import { InvestmentPortfolio } from "@/components/investment-portfolio"
import { TransactionHistory } from "@/components/transaction-history"
import {
  OverviewSkeleton,
  SavingsSkeleton,
  InvestmentSkeleton,
  TransactionSkeleton,
} from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"

export default function Dashboard() {
  const {
    fetchUserData,
    fetchTransactions,
    fetchSavings,
    fetchInvestments,
    isLoadingUser,
    isLoadingTransactions,
    isLoadingSavings,
    isLoadingInvestments,
    userError,
    transactionsError,
    savingsError,
    investmentsError,
    retryFetchUserData,
    retryFetchTransactions,
    retryFetchSavings,
    retryFetchInvestments,
  } = useStore()

  useEffect(() => {
    // Fetch all data when component mounts
    fetchUserData()
    fetchTransactions()
    fetchSavings()
    fetchInvestments()
  }, [fetchUserData, fetchTransactions, fetchSavings, fetchInvestments])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <ModeToggle />
        </div>

        {/* Overview Panel */}
        {isLoadingUser ? (
          <OverviewSkeleton />
        ) : userError ? (
          <ErrorState
            title="Failed to load overview"
            description="We couldn't load your financial overview. Please try again."
            onRetry={retryFetchUserData}
          />
        ) : (
          <OverviewPanel />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Section */}
          {isLoadingSavings ? (
            <SavingsSkeleton />
          ) : savingsError ? (
            <ErrorState
              title="Failed to load savings"
              description="We couldn't load your savings goals. Please try again."
              onRetry={retryFetchSavings}
            />
          ) : (
            <SavingsSection />
          )}

          {/* Investment Portfolio */}
          {isLoadingInvestments ? (
            <InvestmentSkeleton />
          ) : investmentsError ? (
            <ErrorState
              title="Failed to load investments"
              description="We couldn't load your investment portfolio. Please try again."
              onRetry={retryFetchInvestments}
            />
          ) : (
            <InvestmentPortfolio />
          )}
        </div>

        {/* Transaction History */}
        {isLoadingTransactions ? (
          <TransactionSkeleton />
        ) : transactionsError ? (
          <ErrorState
            title="Failed to load transactions"
            description="We couldn't load your transaction history. Please try again."
            onRetry={retryFetchTransactions}
          />
        ) : (
          <TransactionHistory />
        )}
      </main>
    </div>
  )
}

