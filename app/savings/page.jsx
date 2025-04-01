"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardHeader } from "@/components/dashboard-header"
import { SavingsSection } from "@/components/savings-section"
import { SavingsSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"

export default function SavingsPage() {
  const { fetchSavings, isLoadingSavings, savingsError, retryFetchSavings } = useStore()

  useEffect(() => {
    fetchSavings()
  }, [fetchSavings])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Savings</h1>
          <ModeToggle />
        </div>

        {isLoadingSavings ? (
          <SavingsSkeleton />
        ) : savingsError ? (
          <ErrorState
            title="Failed to load savings"
            description="We couldn't load your savings goals. Please try again."
            onRetry={retryFetchSavings}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SavingsSection />
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Savings Tips</h2>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium mb-2">Emergency Fund</h3>
                  <p className="text-sm text-muted-foreground">
                    Aim to save 3-6 months of expenses in an easily accessible account.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium mb-2">50/30/20 Rule</h3>
                  <p className="text-sm text-muted-foreground">
                    Allocate 50% of income to needs, 30% to wants, and 20% to savings.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium mb-2">Automate Your Savings</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up automatic transfers to your savings account on payday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

