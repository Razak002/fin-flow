"use client"

import { create } from "zustand"

// Simulate API call with random success/failure
const simulateApiCall = (data, errorRate = 0.05) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() < errorRate) {
          reject(new Error("Failed to fetch data"))
        } else {
          resolve(data)
        }
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  })
}

// Mock data
const mockUser = {
  id: "user1",
  name: "Alex Johnson",
  email: "alex@example.com",
  totalSavings: 12500,
  totalInvestments: 28750,
  savingsRate: 15,
  investmentReturn: 8.5,
}

const mockTransactions = [
  {
    id: "t1",
    date: "2025-03-28T10:30:00Z",
    description: "Salary Deposit",
    amount: 3200,
    type: "deposit",
    category: "Income",
  },
  {
    id: "t2",
    date: "2025-03-25T14:20:00Z",
    description: "Grocery Shopping",
    amount: 125.5,
    type: "withdrawal",
    category: "Food",
  },
  {
    id: "t3",
    date: "2025-03-22T09:15:00Z",
    description: "Investment Contribution",
    amount: 500,
    type: "withdrawal",
    category: "Investment",
  },
  {
    id: "t4",
    date: "2025-03-20T16:45:00Z",
    description: "Utility Bill",
    amount: 85.75,
    type: "withdrawal",
    category: "Utilities",
  },
  {
    id: "t5",
    date: "2025-03-15T11:30:00Z",
    description: "Freelance Payment",
    amount: 750,
    type: "deposit",
    category: "Income",
  },
  {
    id: "t6",
    date: "2025-03-10T13:20:00Z",
    description: "Restaurant Dinner",
    amount: 68.9,
    type: "withdrawal",
    category: "Dining",
  },
  {
    id: "t7",
    date: "2025-03-05T09:00:00Z",
    description: "Savings Transfer",
    amount: 400,
    type: "withdrawal",
    category: "Savings",
  },
]

const mockSavings = [
  {
    id: "s1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 7500,
    deadline: "2025-06-30T00:00:00Z",
  },
  {
    id: "s2",
    name: "Vacation",
    targetAmount: 3000,
    currentAmount: 2100,
    deadline: "2025-08-15T00:00:00Z",
  },
  {
    id: "s3",
    name: "New Car",
    targetAmount: 15000,
    currentAmount: 2900,
    deadline: "2026-01-01T00:00:00Z",
  },
]

const mockInvestments = [
  {
    id: "i1",
    name: "Tech Stocks",
    type: "stocks",
    initialValue: 5000,
    currentValue: 6250,
    roi: 25,
  },
  {
    id: "i2",
    name: "Government Bonds",
    type: "bonds",
    initialValue: 7500,
    currentValue: 7875,
    roi: 5,
  },
  {
    id: "i3",
    name: "Real Estate Fund",
    type: "realestate",
    initialValue: 10000,
    currentValue: 11200,
    roi: 12,
  },
  {
    id: "i4",
    name: "Cryptocurrency",
    type: "crypto",
    initialValue: 2000,
    currentValue: 3400,
    roi: 70,
  },
  {
    id: "i5",
    name: "Cash Savings",
    type: "cash",
    initialValue: 3000,
    currentValue: 3025,
    roi: 0.8,
  },
]

// Create store
export const useStore = create((set, get) => ({
  userData: null,
  transactions: [],
  savings: [],
  investments: [],

  // Loading states
  isLoadingUser: false,
  isLoadingTransactions: false,
  isLoadingSavings: false,
  isLoadingInvestments: false,

  // Error states
  userError: null,
  transactionsError: null,
  savingsError: null,
  investmentsError: null,

  // Sorting and filtering
  transactionSortField: "date",
  transactionSortDirection: "desc",
  transactionFilter: "",

  // Actions
  fetchUserData: async () => {
    set({ isLoadingUser: true, userError: null })
    try {
      const data = await simulateApiCall(mockUser)
      set({ userData: data, isLoadingUser: false })
    } catch (error) {
      set({
        userError: error instanceof Error ? error.message : "Unknown error",
        isLoadingUser: false,
      })
    }
  },

  fetchTransactions: async () => {
    set({ isLoadingTransactions: true, transactionsError: null })
    try {
      const data = await simulateApiCall(mockTransactions)
      set({ transactions: data, isLoadingTransactions: false })
    } catch (error) {
      set({
        transactionsError: error instanceof Error ? error.message : "Unknown error",
        isLoadingTransactions: false,
      })
    }
  },

  fetchSavings: async () => {
    set({ isLoadingSavings: true, savingsError: null })
    try {
      const data = await simulateApiCall(mockSavings)
      set({ savings: data, isLoadingSavings: false })
    } catch (error) {
      set({
        savingsError: error instanceof Error ? error.message : "Unknown error",
        isLoadingSavings: false,
      })
    }
  },

  fetchInvestments: async () => {
    set({ isLoadingInvestments: true, investmentsError: null })
    try {
      const data = await simulateApiCall(mockInvestments)
      set({ investments: data, isLoadingInvestments: false })
    } catch (error) {
      set({
        investmentsError: error instanceof Error ? error.message : "Unknown error",
        isLoadingInvestments: false,
      })
    }
  },

  setTransactionSort: (field, direction) => {
    set({ transactionSortField: field, transactionSortDirection: direction })
  },

  setTransactionFilter: (filter) => {
    set({ transactionFilter: filter })
  },

  retryFetchUserData: () => {
    const { fetchUserData } = get()
    fetchUserData()
  },

  retryFetchTransactions: () => {
    const { fetchTransactions } = get()
    fetchTransactions()
  },

  retryFetchSavings: () => {
    const { fetchSavings } = get()
    fetchSavings()
  },

  retryFetchInvestments: () => {
    const { fetchInvestments } = get()
    fetchInvestments()
  },
}))

