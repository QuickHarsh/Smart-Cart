import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Wallet, TrendingUp, AlertTriangle } from 'lucide-react'
import { 
  TextField, 
  Button, 
  Paper,
  LinearProgress,
  Typography,
  Chip
} from '@mui/material'

const BudgetTracker = () => {
  const [budget, setBudget] = useState(0)
  const [spent, setSpent] = useState(0)
  const [expense, setExpense] = useState('')
  const [expenses, setExpenses] = useState([])

  // Calculate remaining budget and percentage spent
  const remaining = budget - spent
  const spentPercentage = budget > 0 ? (spent / budget) * 100 : 0
  const isOverBudget = spent > budget

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!expense) return

    const amount = parseFloat(expense)
    if (isNaN(amount) || amount <= 0) return

    const newExpense = {
      id: Date.now(),
      amount,
      date: new Date().toLocaleDateString()
    }

    setExpenses([...expenses, newExpense])
    setExpense('')
    setSpent(prev => prev + amount)
  }

  const handleRemoveExpense = (id) => {
    const expenseToRemove = expenses.find(exp => exp.id === id)
    if (expenseToRemove) {
      setExpenses(expenses.filter(exp => exp.id !== id))
      setSpent(prev => prev - expenseToRemove.amount)
    }
  }

  return (
    <Paper elevation={0} className="glass p-8 rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-7 w-7 text-primary-600 dark:text-primary-400" />
        <h3 className="text-2xl font-serif font-bold gradient-text">Budget Tracker</h3>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="subtitle1" className="font-serif">Total Budget</Typography>
            <TextField
              type="number"
              size="small"
              value={budget}
              onChange={(e) => setBudget(Math.max(0, parseFloat(e.target.value) || 0))}
              InputProps={{
                startAdornment: <span className="text-gray-500 mr-1">₹</span>
              }}
              className="w-32"
            />
          </div>
          <Typography variant="h4" className="font-serif text-primary-600">
            ₹{budget.toLocaleString()}
          </Typography>
        </div>

        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="subtitle1" className="font-serif">Amount Spent</Typography>
            <Chip 
              label={`${spentPercentage.toFixed(1)}%`}
              color={isOverBudget ? "error" : spentPercentage > 80 ? "warning" : "success"}
              size="small"
            />
          </div>
          <Typography 
            variant="h4" 
            className={`font-serif ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}
          >
            ₹{spent.toLocaleString()}
          </Typography>
        </div>

        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="subtitle1" className="font-serif">Remaining Budget</Typography>
            {isOverBudget && (
              <Chip 
                icon={<AlertTriangle className="h-4 w-4" />}
                label="Over Budget"
                color="error"
                size="small"
              />
            )}
          </div>
          <Typography 
            variant="h4" 
            className={`font-serif ${remaining < 0 ? 'text-red-500' : 'text-blue-600'}`}
          >
            ₹{remaining.toLocaleString()}
          </Typography>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <Typography variant="body2" className="text-gray-600">Budget Utilization</Typography>
          <Typography variant="body2" className="text-gray-600">
            {spentPercentage.toFixed(1)}%
          </Typography>
        </div>
        <LinearProgress
          variant="determinate"
          value={Math.min(spentPercentage, 100)}
          className={`h-2 rounded-full ${
            isOverBudget 
              ? 'bg-red-100 [&>.MuiLinearProgress-bar]:bg-red-500' 
              : spentPercentage > 80
              ? 'bg-yellow-100 [&>.MuiLinearProgress-bar]:bg-yellow-500'
              : 'bg-green-100 [&>.MuiLinearProgress-bar]:bg-green-500'
          }`}
        />
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="flex gap-4 mb-6">
        <TextField
          type="number"
          label="Add Expense"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
          InputProps={{
            startAdornment: <span className="text-gray-500 mr-1">₹</span>
          }}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!expense}
          className="px-8"
        >
          Add
        </Button>
      </form>

      {/* Expenses List */}
      {expenses.length > 0 && (
        <div className="space-y-4">
          <Typography variant="subtitle1" className="font-serif">Recent Expenses</Typography>
          <div className="space-y-2">
            {expenses.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 glass rounded-lg"
              >
                <div>
                  <Typography variant="subtitle2">₹{exp.amount.toLocaleString()}</Typography>
                  <Typography variant="caption" className="text-gray-500">{exp.date}</Typography>
                </div>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveExpense(exp.id)}
                >
                  Remove
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Tips */}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <Typography variant="subtitle2" className="text-red-600 font-serif">
              Budget Alert
            </Typography>
          </div>
          <Typography variant="body2" className="text-red-600">
            You've exceeded your budget by ₹{Math.abs(remaining).toLocaleString()}. 
            Consider reviewing your expenses or adjusting your budget.
          </Typography>
        </motion.div>
      )}
    </Paper>
  )
}

export default BudgetTracker 