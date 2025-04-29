import { useState } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, SparklesIcon, ArrowRightIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

const COMMON_ITEMS = [
  'T-shirt', 'Jeans', 'Sneakers', 'Headphones', 'Laptop', 'Backpack', 'Sunglasses', 'Watch', 'Book', 'Coffee Mug',
  'Milk', 'Eggs', 'Bread', 'Banana', 'Apple'
]

const fetchProductImage = async (query) => {
  // Use Unsplash for a universal product image
  return `https://source.unsplash.com/100x100/?${encodeURIComponent(query)},shopping,product`;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const ShoppingList = ({ onAddToComparison, comparisonIds = [] }) => {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const addItem = async (nameOverride) => {
    const name = nameOverride || newItem.trim()
    if (!name) {
      toast.error('Please enter an item name')
      return
    }
    setLoading(true)
    const image = await fetchProductImage(name)
    const newItemObj = {
      id: Date.now(),
      name,
      completed: false,
      category: 'Uncategorized',
      image,
    }
    setItems([...items, newItemObj])
    setNewItem('')
    setLoading(false)
    toast.success('Item added successfully')
  }

  const toggleComplete = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
    toast.success('Item deleted')
  }

  const startEditing = (item) => {
    setEditingItem(item)
    setNewItem(item.name)
  }

  const saveEdit = () => {
    if (!newItem.trim()) {
      toast.error('Please enter an item name')
      return
    }
    setItems(items.map(item =>
      item.id === editingItem.id
        ? { ...item, name: newItem.trim() }
        : item
    ))
    setEditingItem(null)
    setNewItem('')
    toast.success('Item updated successfully')
  }

  // Stats
  const total = items.length
  const completed = items.filter(i => i.completed).length
  const remaining = total - completed

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Personalized Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">{getGreeting()}, Smart Shopper!</h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Your universal shopping assistant for everything you need.</p>
      </div>
      {/* Stats and Quick Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="card bg-primary-50 dark:bg-primary-900/30 p-4 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-300">{total}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">Items</span>
          </div>
          <div className="card bg-green-50 dark:bg-green-900/30 p-4 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-lg font-bold text-green-600 dark:text-green-300">{completed}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">Completed</span>
          </div>
          <div className="card bg-yellow-50 dark:bg-yellow-900/30 p-4 flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-300">{remaining}</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">Remaining</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_ITEMS.map((item) => (
            <button
              key={item}
              className="btn btn-secondary flex items-center gap-1 text-xs px-2 py-1"
              onClick={() => addItem(item)}
              disabled={loading}
            >
              <SparklesIcon className="h-4 w-4" /> {item}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Shopping List</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          className="input flex-1"
          onKeyPress={(e) => e.key === 'Enter' && (editingItem ? saveEdit() : addItem())}
          disabled={loading}
        />
        <button
          onClick={editingItem ? saveEdit : () => addItem()}
          className="btn btn-primary"
          disabled={loading}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        {items.map(item => {
          const inComparison = comparisonIds.includes(item.id)
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
                className="h-5 w-5 rounded border-gray-300"
              />
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 rounded object-cover"
                onError={e => e.currentTarget.src = `https://source.unsplash.com/100x100/?shopping,product`}
              />
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(item)}
                  className="p-1 hover:text-primary-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                {onAddToComparison && (
                  <button
                    onClick={() => !inComparison && onAddToComparison(item)}
                    className={`p-1 ${inComparison ? 'text-green-600 cursor-not-allowed' : 'hover:text-accent-600'}`}
                    title={inComparison ? 'Already in comparison' : 'Add to comparison'}
                    disabled={inComparison}
                  >
                    {inComparison ? <CheckIcon className="h-5 w-5" /> : <ArrowRightIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShoppingList 