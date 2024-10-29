import IdeaGenerator from '@/components/IdeaGenerator'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">
          Game Idea Generator
        </h1>
        <IdeaGenerator />
      </div>
    </main>
  )
} 