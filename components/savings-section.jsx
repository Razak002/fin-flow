"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import toast from "react-hot-toast"

export function SavingsSection() {
  const { savings } = useStore()
  const [progressValues, setProgressValues] = useState(savings.map(() => 0))

  // Animate progress bars on mount
  useEffect(() => {
    const timeouts = savings.map((goal, index) => {
      const progressPercentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)

      return setTimeout(
        () => {
          setProgressValues((prev) => {
            const newValues = [...prev]
            newValues[index] = progressPercentage
            return newValues
          })
        },
        300 + index * 200,
      ) // Stagger the animations
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [savings])

  const handleAddGoal = () => {
    toast.success("Feature coming soon: Add Savings Goal")
  }

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

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: {
      x: 0,
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
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Track your progress towards financial goals</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={handleAddGoal}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
          {savings.map((goal, index) => {
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))

            return (
              <motion.div key={goal.id} className="space-y-2" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"})
                      </span>
                    </p>
                  </div>
                  <motion.span
                    className="text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                  >
                    {progressValues[index]}%
                  </motion.span>
                </div>
                <Progress value={progressValues[index]} className="h-2 transition-all duration-500" />
              </motion.div>
            )
          })}

          {savings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground">No savings goals yet</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleAddGoal}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}

