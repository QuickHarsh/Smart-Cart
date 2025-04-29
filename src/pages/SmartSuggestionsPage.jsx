import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Wand2, ShoppingCart, Star, ExternalLink, Filter, SlidersHorizontal, Search, X } from 'lucide-react'
import { 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip,
  Drawer,
  IconButton,
  Slider,
  FormControlLabel,
  Switch,
  Divider,
  Grid,
  Box
} from '@mui/material'
import { products } from '../data/products'

const categories = [...new Set(products.map(product => product.category))]
const brands = [...new Set(products.map(product => product.brand))]

const SmartSuggestionsPage = () => {
  const [inputs, setInputs] = useState({
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    minRating: ''
  })
  const [loading, setLoading] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [showPrimeOnly, setShowPrimeOnly] = useState(false)

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue)
    setInputs(prev => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    }))
  }

  const searchProducts = (query) => {
    let results = products.filter(product => {
      const searchMatch = !query || 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())

      const categoryMatch = !inputs.category || product.category === inputs.category
      const brandMatch = !inputs.brand || inputs.brand === 'Any' || product.brand === inputs.brand
      const priceMatch = (!inputs.minPrice || product.price >= inputs.minPrice) &&
                        (!inputs.maxPrice || product.price <= inputs.maxPrice)
      const ratingMatch = !inputs.minRating || product.rating >= inputs.minRating
      const primeMatch = !showPrimeOnly || product.prime

      return searchMatch && categoryMatch && brandMatch && priceMatch && ratingMatch && primeMatch
    })

    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        results.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    return results
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    setLoading(true)
    setError('')

    try {
      const searchQuery = inputs.type || ''
      const results = searchProducts(searchQuery)

      if (results.length === 0) {
        setError('No products found matching your criteria. Try adjusting your filters.')
      }

      setFilteredProducts(results)
    } catch (err) {
      setError('Failed to search products. Please try again.')
      console.error('Error searching products:', err)
    } finally {
      setLoading(false)
      setDrawerOpen(false)
    }
  }

  const clearFilters = () => {
    setInputs({
      type: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      minRating: ''
    })
    setPriceRange([0, 200000])
    setShowPrimeOnly(false)
    setSortBy('relevance')
  }

  useEffect(() => {
    handleSubmit()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-float" />
            <h1 className="text-3xl font-serif font-bold gradient-text">Smart Shopping Assistant</h1>
          </div>
          <div className="flex gap-4">
            <IconButton onClick={() => setDrawerOpen(true)}>
              <SlidersHorizontal className="h-6 w-6" />
            </IconButton>
            <IconButton onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
            </IconButton>
          </div>
        </div>

        {/* Search Bar */}
        <Paper className="mb-8 p-4 glass">
          <div className="flex gap-4">
            <TextField
              label="What are you looking for?"
              name="type"
              value={inputs.type}
              onChange={handleChange}
              placeholder="e.g. Wireless Earbuds, Running Shoes"
              className="flex-1 bg-white/80 dark:bg-gray-800/60 rounded-lg"
              InputProps={{
                className: 'font-serif',
                startAdornment: <Search className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
              }}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              className="btn btn-primary px-8 py-3 text-lg rounded-full font-serif shadow-glow whitespace-nowrap"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={22} /> : <Sparkles />}
              onClick={handleSubmit}
            >
              {loading ? 'Searching...' : 'Smart Search'}
            </Button>
          </div>
        </Paper>

        {/* Filters Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            className: 'w-full sm:w-96 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h6" className="font-serif">Filters & Sort</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <X className="h-5 w-5" />
            </IconButton>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <TextField
              select
              label="Category"
              name="category"
              value={inputs.category}
              onChange={handleChange}
              className="w-full"
              InputProps={{ className: 'font-serif' }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            {/* Brand */}
            <TextField
              select
              label="Brand"
              name="brand"
              value={inputs.brand}
              onChange={handleChange}
              className="w-full"
              InputProps={{ className: 'font-serif' }}
            >
              {brands.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </TextField>

            {/* Price Range */}
            <div>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={200000}
                step={1000}
              />
              <div className="flex gap-4">
                <TextField
                  label="Min Price"
                  value={priceRange[0]}
                  size="small"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <span className="text-gray-500 dark:text-gray-400">₹</span>
                  }}
                />
                <TextField
                  label="Max Price"
                  value={priceRange[1]}
                  size="small"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <span className="text-gray-500 dark:text-gray-400">₹</span>
                  }}
                />
              </div>
            </div>

            {/* Rating */}
            <TextField
              label="Minimum Rating"
              name="minRating"
              type="number"
              value={inputs.minRating}
              onChange={handleChange}
              InputProps={{ 
                className: 'font-serif',
                inputProps: { min: 0, max: 5, step: 0.5 }
              }}
              fullWidth
            />

            <Divider />

            {/* Sort Options */}
            <TextField
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full"
              InputProps={{ className: 'font-serif' }}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="reviews">Most Reviewed</MenuItem>
            </TextField>

            {/* Prime Only */}
            <FormControlLabel
              control={
                <Switch
                  checked={showPrimeOnly}
                  onChange={(e) => setShowPrimeOnly(e.target.checked)}
                />
              }
              label="Prime Only"
            />

            <div className="flex gap-4">
              <Button
                variant="outlined"
                color="primary"
                onClick={clearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="flex-1"
                disabled={loading}
              >
                Apply
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`glass hover:shadow-glow transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  className={`object-contain bg-white p-4 ${
                    viewMode === 'list' ? 'w-48' : 'w-full'
                  }`}
                />
                <CardContent className="flex-1">
                  <Typography variant="h6" className="font-serif line-clamp-2 mb-2">
                    {product.title}
                  </Typography>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Chip
                      icon={<Star className="h-4 w-4" />}
                      label={product.rating || 'N/A'}
                      size="small"
                      className="bg-primary-100 text-primary-600"
                    />
                    {product.prime && (
                      <Chip
                        label="Prime"
                        size="small"
                        className="bg-blue-100 text-blue-600"
                      />
                    )}
                    <Chip
                      label={`${product.offers} offers`}
                      size="small"
                      className="bg-secondary-100 text-secondary-600"
                    />
                    <Chip
                      label={`${product.reviews} reviews`}
                      size="small"
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <Typography variant="h6" className="text-primary-600 font-bold mb-2">
                    ₹{product.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mb-2">
                    Sold by: {product.seller}
                  </Typography>
                  {viewMode === 'list' && (
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {product.description}
                    </Typography>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShoppingCart />}
                      className="flex-1"
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      Buy Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ExternalLink />}
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default SmartSuggestionsPage 