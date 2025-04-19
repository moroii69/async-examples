"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExampleCard } from "@/components/example-card";
import { Server, Loader2, CheckCircle, Trophy } from "lucide-react";

const code = `// Race Between Tasks (Promise.race)
async function fetchWithFallback(primaryUrl, fallbackUrl) {
  // Create promises for both API endpoints
  const primaryPromise = fetchFromApi(primaryUrl);
  const fallbackPromise = fetchFromApi(fallbackUrl);
  
  // Race the promises - use whichever resolves first
  const result = await Promise.race([
    primaryPromise,
    fallbackPromise
  ]);
  
  console.log("Got result from fastest source:", result);
  return result;
}

// Simulated API function with variable response time
async function fetchFromApi(url) {
  // Extract server name for logging
  const serverName = url.includes("primary") ? "PRIMARY" : "FALLBACK";
  
  // Simulate different response times
  const responseTime = url.includes("primary") ? 3000 : 1500;
  
  console.log(\`\${serverName} server: Starting request...\`);
  
  await new Promise(resolve => setTimeout(resolve, responseTime));
  
  console.log(\`\${serverName} server: Request complete\`);
  return {
    source: serverName,
    data: { message: "Data loaded successfully" },
    responseTime
  };
}

// Usage
async function loadDataFromFastestSource() {
  try {
    const data = await fetchWithFallback(
      "https://api.example.com/primary", 
      "https://api.example.com/fallback"
    );
    console.log("Data loaded from fastest source:", data);
    return data;
  } catch (error) {
    console.error("All sources failed:", error);
    throw error;
  }
}`;

export function RaceBetweenTasks() {
  const [isRunning, setIsRunning] = useState(false);
  const [primaryProgress, setPrimaryProgress] = useState(0);
  const [fallbackProgress, setFallbackProgress] = useState(0);
  const [winner, setWinner] = useState<"primary" | "fallback" | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleRun = async () => {
    // Reset state
    setIsRunning(true);
    setPrimaryProgress(0);
    setFallbackProgress(0);
    setWinner(null);
    setResult(null);

    // Create a flag to track which one wins
    let raceWon = false;

    // Primary server - slower (3s)
    const primaryPromise = new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 3000) * 100, 100);
        setPrimaryProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          const result = {
            source: "PRIMARY",
            data: { message: "Data loaded successfully" },
            responseTime: 3000,
          };

          if (!raceWon) {
            raceWon = true;
            setWinner("primary");
            setResult(result);
          }

          resolve(result);
        }
      }, 50);
    });

    // Fallback server - faster (1.5s)
    const fallbackPromise = new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 1500) * 100, 100);
        setFallbackProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          const result = {
            source: "FALLBACK",
            data: { message: "Data loaded successfully" },
            responseTime: 1500,
          };

          if (!raceWon) {
            raceWon = true;
            setWinner("fallback");
            setResult(result);
          }

          resolve(result);
        }
      }, 50);
    });

    // Race the promises
    await Promise.race([primaryPromise, fallbackPromise]);
    setIsRunning(false);

    return result;
  };

  return (
    <ExampleCard
      title="Race Between Tasks"
      description="Use Promise.race to get results from the fastest source"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium mb-2">Racing Promises:</div>

        <div className="grid gap-4">
          {/* Primary Server */}
          <div
            className={`p-3 rounded-md border ${
              winner === "primary"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Server
                  className={`h-5 w-5 ${
                    winner === "primary" ? "text-green-500" : "text-blue-500"
                  }`}
                />
                <span className="text-sm font-medium">Primary Server (3s)</span>
              </div>
              <div>
                {primaryProgress < 100 && isRunning && (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                )}
                {primaryProgress === 100 && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {winner === "primary" && (
                  <Trophy className="h-4 w-4 text-yellow-500 ml-2" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${
                    winner === "primary" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${primaryProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>{Math.round(primaryProgress)}%</span>
                <span>3000ms total</span>
              </div>
            </div>
          </div>

          {/* Fallback Server */}
          <div
            className={`p-3 rounded-md border ${
              winner === "fallback"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Server
                  className={`h-5 w-5 ${
                    winner === "fallback" ? "text-green-500" : "text-purple-500"
                  }`}
                />
                <span className="text-sm font-medium">
                  Fallback Server (1.5s)
                </span>
              </div>
              <div className="flex items-center">
                {fallbackProgress < 100 && isRunning && (
                  <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                )}
                {fallbackProgress === 100 && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {winner === "fallback" && (
                  <Trophy className="h-4 w-4 text-yellow-500 ml-2" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute top-0 left-0 h-full ${
                    winner === "fallback" ? "bg-green-500" : "bg-purple-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${fallbackProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>{Math.round(fallbackProgress)}%</span>
                <span>1500ms total</span>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {winner === "primary" ? "Primary" : "Fallback"} server won the
                race!
              </span>
            </div>
            <div className="text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
              <pre className="overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            <div className="mt-2 text-xs text-green-700 dark:text-green-300">
              Promise.race returns the result from whichever promise resolves
              first, regardless of the others.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  );
}
