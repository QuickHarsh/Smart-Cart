import React, { useEffect, useState } from 'react'

const PLACEHOLDER = 'https://via.placeholder.com/200x200?text=No+Image'

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-400">★</span>
      ))}
      {halfStar && <span className="text-yellow-400">☆</span>}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <span key={i} className="text-gray-300">★</span>
      ))}
    </div>
  )
}

const TrendingProducts = ({ onQuickAdd }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=8')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="glass p-8 rounded-2xl mb-8 bg-gradient-to-br from-primary-50/60 via-white/70 to-secondary-100/60 dark:from-gray-900/70 dark:via-gray-950/80 dark:to-gray-900/70 border border-primary-100 dark:border-primary-900/30 shadow-glow">
      <h3 className="text-2xl font-serif font-bold gradient-text mb-8 flex items-center gap-3 justify-center relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-primary-400/40 to-transparent rounded-full hidden md:block" />
        <span role="img" aria-label="trending" className="text-3xl">🔥</span> Trending Products
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-l from-primary-400/40 to-transparent rounded-full hidden md:block" />
      </h3>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((prod, idx) => (
            <div key={prod.id} className="relative bg-white/70 dark:bg-gray-900/70 rounded-2xl border-2 border-transparent hover:border-accent-400 dark:hover:border-accent-500 shadow-lg hover:shadow-glow transition-all duration-300 flex flex-col items-center p-6 group backdrop-blur-xl">
              {prod.rating?.rate > 4.5 && (
                <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-bold tracking-wide shadow-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">Hot</span>
              )}
              <div className="mb-3">
                <img 
                  src={prod.image}
                  alt={prod.title}
                  className="h-24 w-24 rounded-xl object-cover shadow-[0_4px_24px_rgba(139,92,246,0.12)] border-4 border-white dark:border-gray-800"
                  onError={e => e.currentTarget.src = PLACEHOLDER}
                />
              </div>
              <div className="font-serif font-bold text-lg text-center mb-1 text-gray-900 dark:text-gray-100 line-clamp-2">{prod.title}</div>
              <StarRating rating={prod.rating?.rate || 0} />
              <div className="text-yellow-600 dark:text-yellow-400 font-serif font-bold text-xl mt-2 mb-3">₹{Math.round(prod.price * 85).toLocaleString('en-IN')}</div>
              <div className="flex gap-2 w-full mt-auto">
                <button className="btn btn-primary flex-1 text-xs py-2 rounded-full font-semibold tracking-wide" onClick={() => onQuickAdd && onQuickAdd(prod.title)}>
                  Add to Cart
                </button>
                <button className="btn btn-secondary flex-1 text-xs py-2 rounded-full font-semibold tracking-wide group-hover:scale-105 transition-transform">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrendingProducts 