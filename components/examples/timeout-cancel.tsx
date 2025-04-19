"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { Clock, XCircle, Loader2, Timer } from "lucide-react"

const code = `// Timeout / Cancel on Delay
async function fetchWithTimeout(url, timeoutMs = 3000) {
  // Create a promise that rejects after the timeout
  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(\`Request timed out after \${timeoutMs}ms\`));
    }, timeoutMs);
  });
  
  // Create the fetch promise
  const fetchPromise = fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  });
  
  // Race the fetch against the timeout
  try {
    const data = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]);
    
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error or timeout occurred:", error.message);
    throw error;
  }
}

// Usage with AbortController (modern approach)
async function fetchWithAbort(url, timeoutMs = 3000) {
  // Create an AbortController
  const controller = new AbortController();
  const signal = controller.signal;
  
  // Set up the timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    // Pass the signal to fetch
    const response = await fetch(url, { signal });
    const data = await response.json();
    
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(\`Request aborted after \${timeoutMs}ms timeout\`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}`

export function TimeoutCancel() {
  const [fetchProgress, setFetchProgress] = useState(0)
  const [timeoutProgress, setTimeoutProgress] = useState(0)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const handleRun = async () => {
    // Reset state
    setFetchProgress(0)
    setTimeoutProgress(0)
    setIsTimedOut(false)
    setIsFetching(true)

    const timeoutMs = 2000
    const fetchTime = 5000 // Longer than timeout
    const startTime = Date.now()

    // Start both timers
    const fetchInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / fetchTime) * 100, 100)
      setFetchProgress(progress)

      if (progress >= 100) {
        clearInterval(fetchInterval)
      }
    }, 50)

    const timeoutInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / timeoutMs) * 100, 100)
      setTimeoutProgress(progress)

      if (progress >= 100) {
        clearInterval(timeoutInterval)
        clearInterval(fetchInterval)
        setIsTimedOut(true)
        setIsFetching(false)
      }
    }, 50)

    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    // Create a "fetch" promise that takes longer than the timeout
    const fetchPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: "This will never be returned due to timeout" })
      }, fetchTime)
    })

    // Race the fetch against the timeout
    try {
      await Promise.race([fetchPromise, timeoutPromise])
    } catch (error) {
      // The timeout will win and throw an error
      throw error
    }
  }

  return (
    <ExampleCard
      title="Timeout / Cancel"
      description="Cancel long-running operations that exceed a timeout"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium mb-2">Race Against Time:</div>

        <div className="space-y-4">
          {/* Fetch Request */}
          <div className="p-3 rounded-md border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Loader2 className={`h-5 w-5 ${isFetching ? "text-blue-500 animate-spin" : "text-zinc-400"}`} />
                <span className="text-sm font-medium">Fetch Request (5s)</span>
              </div>
              {isTimedOut && <XCircle className="h-4 w-4 text-red-500" />}
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${isTimedOut ? "bg-red-300" : "bg-blue-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${fetchProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>{Math.round(fetchProgress)}%</span>
                <span>5000ms total</span>
              </div>
            </div>

            {isTimedOut && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300"
              >
                Request canceled before completion
              </motion.div>
            )}
          </div>

          {/* Timeout */}
          <div className="p-3 rounded-md border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Timer
                  className={`h-5 w-5 ${isFetching ? "text-yellow-500" : isTimedOut ? "text-red-500" : "text-zinc-400"}`}
                />
                <span className="text-sm font-medium">Timeout (2s)</span>
              </div>
              {isTimedOut && <Clock className="h-4 w-4 text-red-500" />}
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${isTimedOut ? "bg-red-500" : "bg-yellow-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${timeoutProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>{Math.round(timeoutProgress)}%</span>
                <span>2000ms limit</span>
              </div>
            </div>
          </div>
        </div>

        {isTimedOut && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">Request timed out after 2000ms</span>
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">
              The timeout mechanism prevents your application from waiting indefinitely for responses that might never
              come.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
