import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Wand2, ShoppingCart, Star, ExternalLink } from 'lucide-react'
import { TextField, Button, MenuItem, Paper, CircularProgress, Card, CardContent, CardMedia, Typography, Chip } from '@mui/material'
import { generateContent } from '../utils/geminiApi'

const categories = [
  'Electronics', 'Fashion', 'Home', 'Books', 'Beauty', 'Sports', 'Toys', 'Grocery', 'Other'
]
const brands = [
  'Any', 'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Puma', 'Boat', 'Other'
]

const SmartSuggestions = () => {
  const [inputs, setInputs] = useState({
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    minRating: ''
  })
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const fetchProducts = async (query) => {
    try {
      // First, search for products using the Amazon search API
      const searchResponse = await fetch(`https://real-time-amazon-data.p.rapidapi.com/search?query=${query}&page=1&country=US&category_id=aps`, {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      })
      const searchData = await searchResponse.json()

      if (!searchData.data?.products) {
        throw new Error('No products found')
      }

      // Process the search results and fetch detailed offers for each product
      const productsWithOffers = await Promise.all(
        searchData.data.products.slice(0, 3).map(async (product) => {
          try {
            const offersResponse = await fetch(`https://real-time-amazon-data.p.rapidapi.com/product-offers?asin=${product.asin}&country=US&limit=100&page=1`, {
              headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
              }
            })
            const offersData = await offersResponse.json()
            
            // Validate offers data
            const offers = offersData.data?.offers || []
            const bestOffer = offers.length > 0 
              ? offers.reduce((best, current) => {
                  if (!best || (current.price?.amount && current.price.amount < best.price.amount)) {
                    return current
                  }
                  return best
                }, null)
              : null

            return {
              id: product.asin,
              title: product.product_title,
              price: bestOffer?.price?.amount || product.product_price || 'N/A',
              rating: product.product_star_rating || 'N/A',
              image: product.product_photo,
              link: product.product_url,
              source: 'Amazon',
              offers: offers.length,
              seller: bestOffer?.seller_name || 'Amazon',
              prime: bestOffer?.is_prime || false
            }
          } catch (err) {
            console.error('Error fetching offers:', err)
            // Return basic product info if offers fetch fails
            return {
              id: product.asin,
              title: product.product_title,
              price: product.product_price || 'N/A',
              rating: product.product_star_rating || 'N/A',
              image: product.product_photo,
              link: product.product_url,
              source: 'Amazon',
              offers: 0,
              seller: 'Amazon',
              prime: false
            }
          }
        })
      )

      // Filter based on user inputs
      const filteredProducts = productsWithOffers.filter(product => {
        if (inputs.minPrice && (product.price === 'N/A' || product.price < inputs.minPrice)) return false
        if (inputs.maxPrice && (product.price === 'N/A' || product.price > inputs.maxPrice)) return false
        if (inputs.minRating && (product.rating === 'N/A' || product.rating < inputs.minRating)) return false
        if (inputs.brand !== 'Any' && !product.title.toLowerCase().includes(inputs.brand.toLowerCase())) return false
        return true
      })

      if (filteredProducts.length === 0) {
        setError('No products found matching your criteria. Try adjusting your filters.')
      } else {
        setProducts(filteredProducts)
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again later.')
      console.error('Error fetching products:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProducts([])
    setError('')

    try {
      // Try AI-powered suggestions first
      try {
        // Build a prompt for Gemini
        const prompt = `Suggest 5 smart shopping items for:
- Product type: ${inputs.type || 'Any'}
- Category: ${inputs.category || 'Any'}
- Price range: ${inputs.minPrice || 'Any'} to ${inputs.maxPrice || 'Any'} INR
- Brand: ${inputs.brand || 'Any'}
- Minimum rating: ${inputs.minRating || 'Any'}
Give the suggestions as a list with a short reason for each.`

        const result = await generateContent(prompt)
        const suggestions = result.candidates[0].content.parts[0].text
        
        // Extract product names from suggestions
        const productNames = suggestions.split('\n')
          .filter(line => line.trim())
          .map(line => line.split('.')[1]?.trim() || '')
          .filter(name => name)

        // Fetch real products for each suggestion
        for (const name of productNames) {
          await fetchProducts(name)
        }
      } catch (aiError) {
        console.error('AI suggestions failed, falling back to direct search:', aiError)
        
        // Fallback: Direct product search using input type or category
        const searchQuery = inputs.type || inputs.category || 'popular products'
        await fetchProducts(searchQuery)
        
        // Show a user-friendly message about the fallback
        setError('AI suggestions are temporarily unavailable. Showing direct search results instead.')
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again or refine your search criteria.')
      console.error('Error in product search:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={0} className="glass p-8 rounded-2xl mb-8 bg-gradient-to-br from-primary-50/60 via-white/70 to-secondary-100/60 dark:from-gray-900/70 dark:via-gray-950/80 dark:to-gray-900/70 border border-primary-100 dark:border-primary-900/30 shadow-glow">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Wand2 className="h-7 w-7 text-primary-600 dark:text-primary-400 animate-float" />
          <h3 className="text-2xl font-serif font-bold gradient-text tracking-tight">Smart Suggestions</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TextField
            label="Product Type"
            name="type"
            value={inputs.type}
            onChange={handleChange}
            placeholder="e.g. Shoes, Phone"
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          />
          <TextField
            select
            label="Category"
            name="category"
            value={inputs.category}
            onChange={handleChange}
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Brand"
            name="brand"
            value={inputs.brand}
            onChange={handleChange}
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          >
            {brands.map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Min Price (₹)"
            name="minPrice"
            type="number"
            value={inputs.minPrice}
            onChange={handleChange}
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          />
          <TextField
            label="Max Price (₹)"
            name="maxPrice"
            type="number"
            value={inputs.maxPrice}
            onChange={handleChange}
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          />
          <TextField
            label="Min Rating"
            name="minRating"
            type="number"
            value={inputs.minRating}
            onChange={handleChange}
            className="bg-white/80 dark:bg-gray-800/60 rounded-lg"
            InputProps={{ className: 'font-serif' }}
            fullWidth
          />
        </form>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="btn btn-primary px-8 py-3 text-lg rounded-full font-serif shadow-glow"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={22} /> : <Sparkles />}
          onClick={handleSubmit}
        >
          {loading ? 'Thinking...' : 'Get Smart Suggestions'}
        </Button>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-500">
            {error}
          </motion.div>
        )}

        {products.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <Card key={product.id} className="glass hover:shadow-glow transition-all duration-300">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  className="object-contain bg-white p-4"
                />
                <CardContent>
                  <Typography variant="h6" className="font-serif line-clamp-2 mb-2">
                    {product.title}
                  </Typography>
                  <div className="flex items-center gap-2 mb-2">
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
                  </div>
                  <Typography variant="h6" className="text-primary-600 font-bold mb-2">
                    ₹{product.price}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mb-2">
                    Sold by: {product.seller}
                  </Typography>
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
    </Paper>
  )
}

export default SmartSuggestions 