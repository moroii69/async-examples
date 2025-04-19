import { ExampleGrid } from "@/components/example-grid"

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Async/Await Examples
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            12 real-world examples of async/await patterns with code snippets and interactive demos.
          </p>
        </div>
        <ExampleGrid />
      </div>
    </main>
  )
}
