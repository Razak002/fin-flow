"use client"

import { ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronUp, Download, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

export function TransactionHistory() {
  const {
    transactions,
    transactionSortField,
    transactionSortDirection,
    setTransactionSort,
    transactionFilter,
    setTransactionFilter,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState("")

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setTransactionFilter(e.target.value)
  }

  // Handle sort change
  const handleSortChange = (field) => {
    if (transactionSortField === field) {
      // Toggle direction if same field
      setTransactionSort(field, transactionSortDirection === "asc" ? "desc" : "asc")
    } else {
      // Default to descending for new field
      setTransactionSort(field, "desc")
    }
  }

  // Get sort icon
  const getSortIcon = (field) => {
    if (transactionSortField !== field) return null

    return transactionSortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    // First filter
    const filtered = transactions.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(transactionFilter.toLowerCase()) ||
        transaction.category.toLowerCase().includes(transactionFilter.toLowerCase()),
    )

    // Then sort
    if (!transactionSortField) return filtered

    return [...filtered].sort((a, b) => {
      const aValue = a[transactionSortField]
      const bValue = b[transactionSortField]

      // Handle different types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return transactionSortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle numbers and dates
      const aNum = typeof aValue === "number" ? aValue : new Date(aValue).getTime()
      const bNum = typeof bValue === "number" ? bValue : new Date(bValue).getTime()

      return transactionSortDirection === "asc" ? aNum - bNum : bNum - aNum
    })
  }, [transactions, transactionSortField, transactionSortDirection, transactionFilter])

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleExport = () => {
    toast.success("Transactions exported to CSV")
  }

  const handleFilter = () => {
    toast.success("Advanced filtering coming soon")
  }

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent financial activity</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select defaultValue="date" onValueChange={(value) => handleSortChange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTransactionSort(transactionSortField, transactionSortDirection === "asc" ? "desc" : "asc")
                }
              >
                {transactionSortDirection === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("date")}>
                    <div className="flex items-center">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("description")}>
                    <div className="flex items-center">
                      Description
                      {getSortIcon("description")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSortChange("category")}>
                    <div className="flex items-center">
                      Category
                      {getSortIcon("category")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSortChange("amount")}>
                    <div className="flex items-center justify-end">
                      Amount
                      {getSortIcon("amount")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredAndSortedTransactions.length > 0 ? (
                    filteredAndSortedTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tableRowVariants}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1">
                            {transaction.type === "deposit" ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-red-500" />
                            )}
                            <span className={transaction.type === "deposit" ? "text-green-500" : "text-red-500"}>
                              {transaction.type === "deposit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

