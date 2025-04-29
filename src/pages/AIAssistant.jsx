import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Send, 
  Loader2, 
  Sparkles,
  MessageSquare,
  Wand2,
  Trash2
} from 'lucide-react'
import { 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Chip,
  CircularProgress
} from '@mui/material'
import { generateContent } from '../utils/geminiApi'

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    const userMessage = { type: 'user', content: prompt }
    setChatHistory(prev => [...prev, userMessage])
    try {
      const result = await generateContent(prompt)
      const aiResponse = result.candidates[0].content.parts[0].text
      const aiMessage = { type: 'ai', content: aiResponse }
      setChatHistory(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = { type: 'error', content: 'Sorry, there was an error processing your request.' }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setPrompt('')
    }
  }

  const handleClearChat = () => setChatHistory([])

  const examplePrompts = [
    "Create a weekly shopping list for 2 vegetarians",
    "Suggest healthy snacks for kids",
    "What are essential items for a camping trip?",
    "Plan a budget-friendly meal plan for the week",
    "Suggest items for a picnic basket"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-4 bg-gradient-to-br from-primary-50 via-white to-secondary-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div className="max-w-3xl mx-auto">
        {/* Animated Bot Avatar */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            className="relative mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Bot className="h-20 w-20 text-primary-600 dark:text-primary-400 animate-float drop-shadow-xl" />
            <div className="absolute -inset-4 bg-primary-400/20 dark:bg-primary-700/20 rounded-full blur-2xl" />
          </motion.div>
          <h1 className="text-4xl font-serif font-bold gradient-text mb-1 tracking-tight">AI Shopping Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">Get personalized shopping suggestions, plans, and more!</p>
        </div>

        {/* Example Prompts */}
        <Paper elevation={0} className="glass p-6 mb-6 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h6" className="text-gray-900 dark:text-gray-100 flex items-center gap-2 font-serif">
              <Wand2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              Example Prompts
            </Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <Chip
                key={index}
                label={prompt}
                onClick={() => setPrompt(prompt)}
                className="cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all duration-300 font-serif"
                icon={<Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
                sx={{
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  },
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: 'rgb(139, 92, 246)',
                  '&.MuiChip-root': {
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    },
                  },
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: 'rgb(167, 139, 250)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    },
                  },
                }}
              />
            ))}
          </div>
        </Paper>

        {/* Chat UI */}
        <Paper elevation={0} className="glass p-6 rounded-2xl backdrop-blur-xl relative">
          {/* Floating Clear Chat Button */}
          <button
            onClick={handleClearChat}
            title="Clear Chat"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-accent-100 dark:bg-accent-700/40 text-accent-600 dark:text-accent-200 hover:bg-accent-200 dark:hover:bg-accent-600/60 transition-all shadow-soft"
            style={{ boxShadow: '0 2px 8px 0 rgba(249, 115, 22, 0.10)' }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <div className="space-y-4 h-[400px] overflow-y-auto mb-4 custom-scrollbar">
            <AnimatePresence>
              {chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.08 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl font-serif shadow-lg transition-all duration-300 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-primary-600 to-primary-400 text-white shadow-glow' 
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-100'
                      : 'bg-gradient-to-br from-gray-100 to-secondary-100 dark:from-gray-800/70 dark:to-gray-900/70 text-gray-900 dark:text-gray-100'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gradient-to-br from-gray-100 to-secondary-100 dark:from-gray-800/70 dark:to-gray-900/70 p-4 rounded-2xl font-serif flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="text-gray-900 dark:text-gray-100">Thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask for shopping suggestions..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 font-serif"
              InputProps={{
                startAdornment: <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />,
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgb(139, 92, 246)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(139, 92, 246)',
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'rgb(31, 41, 55)',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.1rem',
                    '& input': {
                      color: 'rgb(31, 41, 55)',
                      fontFamily: 'Playfair Display, serif',
                    },
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: 'rgba(31, 41, 55, 0.3)',
                      color: '#fff',
                      '& input': {
                        color: '#fff',
                        fontFamily: 'Playfair Display, serif',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(75, 85, 99, 0.3)',
                      },
                    },
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="h-14 w-14 shadow-glow rounded-full"
              sx={{
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.3rem',
                boxShadow: '0 0 16px 0 rgba(139,92,246,0.25)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                },
                '@media (prefers-color-scheme: dark)': {
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Send />}
            </Button>
          </form>
        </Paper>
      </div>
    </motion.div>
  )
}

export default AIAssistant 