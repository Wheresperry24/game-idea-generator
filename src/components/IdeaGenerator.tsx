'use client'

import { useState } from 'react'
import IdeaHistory from './IdeaHistory'
import { TrashIcon } from '@heroicons/react/24/outline'

interface GeneratedIdea {
  result: string;
}

export default function IdeaGenerator() {
  const [userIdea, setUserIdea] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [generatedIdea, setGeneratedIdea] = useState<string>('')
  const [key, setKey] = useState(0)

  const generateIdea = async (type: 'enhance' | 'random') => {
    setIsLoading(true)
    try {
      const prompt = type === 'enhance' ? userIdea : '';
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      const data: GeneratedIdea = await response.json();
      setGeneratedIdea(data.result);
      setKey(prev => prev + 1)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all ideas? This cannot be undone.')) {
      setIsClearing(true)
      try {
        await fetch('/api/ideas', {
          method: 'DELETE',
        });
        setKey(prev => prev + 1)
      } catch (error) {
        console.error('Error clearing history:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold dark:text-white">Enter Your Game Idea</h2>
          <textarea
            className="w-full h-32 p-4 border rounded-lg resize-none bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Enter your game idea here, or click 'Generate Random Idea' below..."
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={() => generateIdea('enhance')}
              disabled={isLoading || !userIdea.trim()}
            >
              {isLoading ? 'Enhancing...' : 'Enhance Idea'}
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              onClick={() => generateIdea('random')}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Random Idea'}
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              onClick={clearHistory}
              disabled={isClearing}
            >
              <TrashIcon className="w-5 h-5" />
              {isClearing ? 'Clearing...' : 'Clear History'}
            </button>
          </div>
        </div>

        {generatedIdea && (
          <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Generated Idea:</h3>
            <div className="whitespace-pre-line dark:text-gray-200">
              {generatedIdea}
            </div>
          </div>
        )}
      </div>
      
      <IdeaHistory key={key} />
    </div>
  )
} 