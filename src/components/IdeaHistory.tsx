'use client'

import { useEffect, useState } from 'react'

interface Idea {
  id: number
  content: string
  type: string
  originalIdea: string | null
  createdAt: string
}

export default function IdeaHistory() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas')
        const data = await response.json()
        setIdeas(data)
      } catch (error) {
        console.error('Error fetching ideas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Recent Ideas</h2>
      {isLoading ? (
        <p className="dark:text-white">Loading ideas...</p>
      ) : (
        <div className="space-y-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full dark:text-gray-200">
                  {idea.type}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
              {idea.originalIdea && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Original Idea:</p>
                  <p className="dark:text-gray-200">{idea.originalIdea}</p>
                </div>
              )}
              <div className="whitespace-pre-line dark:text-gray-200">{idea.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 