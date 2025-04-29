import { useState } from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { generateContent } from '../utils/geminiApi'

const AISuggestions = () => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const result = await generateContent(prompt)
      setResponse(result.candidates[0].content.parts[0].text)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Sorry, there was an error processing your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Shopping Assistant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon className="h-6 w-6 text-primary-600" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for shopping suggestions..."
            className="input"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Thinking...' : 'Get Suggestions'}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Try prompts like:</p>
        <ul className="list-disc list-inside mt-2">
          <li>"Create a weekly shopping list for 2 vegetarians"</li>
          <li>"Suggest healthy snacks for kids"</li>
          <li>"What are essential items for a camping trip?"</li>
        </ul>
      </div>
    </div>
  )
}

export default AISuggestions 