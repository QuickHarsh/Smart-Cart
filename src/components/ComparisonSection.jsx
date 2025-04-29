import React from 'react'

const ComparisonSection = ({ products, onRemove }) => {
  if (!products.length) {
    return (
      <div className="card text-center p-8">
        <h3 className="text-xl font-semibold mb-2">Product Comparison</h3>
        <p className="text-gray-500 dark:text-gray-400">Add products to compare their details side by side.</p>
      </div>
    )
  }
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-4">Product Comparison</h3>
      <div className="flex flex-wrap gap-4 overflow-x-auto">
        {products.map((product, idx) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 min-w-[180px] flex flex-col items-center">
            <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover mb-2" />
            <div className="font-bold mb-1 text-center">{product.name}</div>
            {/* Placeholder for attributes */}
            <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">No extra attributes</div>
            <button onClick={() => onRemove(product.id)} className="btn btn-accent text-xs px-2 py-1 mt-auto">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComparisonSection 