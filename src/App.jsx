import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { 
  ShoppingCart, 
  Bot, 
  Sun, 
  Moon,
  Home,
  Sparkles,
  Wand2
} from 'lucide-react'
import ShoppingList from './components/ShoppingList'
import BudgetTracker from './components/BudgetTracker'
import AIAssistant from './pages/AIAssistant'
import ComparisonSection from './components/ComparisonSection'
import TrendingProducts from './components/TrendingProducts'
import SmartSuggestionsPage from './pages/SmartSuggestionsPage'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [comparison, setComparison] = useState([])

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Add to comparison
  const handleAddToComparison = (item) => {
    if (!comparison.find(i => i.id === item.id)) {
      setComparison([...comparison, item])
    }
  }
  // Remove from comparison
  const handleRemoveFromComparison = (id) => {
    setComparison(comparison.filter(i => i.id !== id))
  }

  // For quick add from trending
  let shoppingListRef = null;
  const handleQuickAdd = (name) => {
    if (shoppingListRef && shoppingListRef.addItem) {
      shoppingListRef.addItem(name);
    }
  }

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-br from-primary-50 via-white to-secondary-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950`}> 
        <nav className="bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">SmartCart</span>
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <Link 
                  to="/smart-suggestions" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  <Wand2 className="h-5 w-5" />
                  <span>Smart Shopping</span>
                </Link>
                <Link 
                  to="/ai-assistant" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                >
                  <Bot className="h-5 w-5" />
                  <span>AI Assistant</span>
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <Routes>
          <Route path="/" element={
            <>
              <section className="relative py-12 md:py-20 flex flex-col items-center text-center">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100/60 via-white/60 to-secondary-100/60 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-gray-900/80 blur-2xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center mb-2 animate-float">
                    <Sparkles className="h-14 w-14 text-primary-600 dark:text-primary-400 drop-shadow-lg" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2 tracking-tight">Your Smart Shopping Companion</h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">Organize, compare, and get AI-powered suggestions for everything you shop—clothes, gadgets, groceries, and more. Experience the future of shopping with SmartCart.</p>
                  <div className="flex flex-wrap gap-4 justify-center mt-2">
                    <Link to="/smart-suggestions" className="btn btn-primary text-lg px-6 py-3 shadow-glow">Try Smart Shopping</Link>
                    <Link to="/ai-assistant" className="btn btn-secondary text-lg px-6 py-3">AI Assistant</Link>
                  </div>
                </div>
              </section>

              <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-12">
                  <ShoppingList onAddToComparison={handleAddToComparison} comparisonIds={comparison.map(i => i.id)} />
                  <BudgetTracker />
                  {/* Extra Features Section */}
                  <div className="space-y-8" id="features">
                    <h2 className="text-xl font-bold gradient-text mb-2">Extra Features</h2>
                    <ComparisonSection products={comparison} onRemove={handleRemoveFromComparison} />
                    <TrendingProducts onQuickAdd={handleQuickAdd} />
                    {/* Why SmartCart Section */}
                    <div className="glass p-6 rounded-xl">
                      <h3 className="text-lg font-bold gradient-text mb-4 flex items-center gap-2">
                        <span role="img" aria-label="info">💡</span> Why SmartCart?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center">
                          <Wand2 className="h-8 w-8 text-primary-500 mb-2" />
                          <div className="font-semibold mb-1">Smart Shopping</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">Get AI-powered product recommendations and comparisons.</div>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <ShoppingCart className="h-8 w-8 text-secondary-500 mb-2" />
                          <div className="font-semibold mb-1">Universal Shopping</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">Shop for clothes, gadgets, groceries, and more—all in one place.</div>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <Bot className="h-8 w-8 text-accent-500 mb-2" />
                          <div className="font-semibold mb-1">AI Assistant</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">Get personalized shopping advice and recommendations.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </>
          } />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/smart-suggestions" element={<SmartSuggestionsPage />} />
        </Routes>

        <Toaster position="bottom-right" />
      </div>
    </Router>
  )
}

export default App
