"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExampleCard } from "@/components/example-card";
import { Cpu, Loader2, CheckCircle, Clock } from "lucide-react";

const code = `// Simulated Heavy Computation
async function calculatePrimes(max) {
  // Move heavy computation to a Promise to avoid blocking UI
  return new Promise((resolve) => {
    console.log(\`Calculating prime numbers up to \${max}...\`);

    // Use setTimeout to give the event loop a chance to update UI
    setTimeout(() => {
      const startTime = Date.now();
      const primes = [];

      // Simple prime number calculation (not optimized)
      function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;

        if (num % 2 === 0 || num % 3 === 0) return false;

        let i = 5;
        while (i * i <= num) {
          if (num % i === 0 || num % (i + 2) === 0) return false;
          i += 6;
        }

        return true;
      }

      // Find all primes up to max
      for (let i = 2; i <= max; i++) {
        if (isPrime(i)) {
          primes.push(i);
        }
      }

      const duration = Date.now() - startTime;

      resolve({
        primes,
        count: primes.length,
        duration: \`\${duration}ms\`
      });
    }, 0);
  });
}

// Usage with Web Workers (better approach)
function calculatePrimesWithWorker(max) {
  return new Promise((resolve, reject) => {
    // Create a worker
    const worker = new Worker('primeWorker.js');

    // Listen for messages from the worker
    worker.onmessage = function(e) {
      console.log('Calculation complete!');
      resolve(e.data);
      worker.terminate();
    };

    // Handle errors
    worker.onerror = function(error) {
      reject(error);
      worker.terminate();
    };

    // Start the worker
    worker.postMessage({ max });
  });
}

// Usage
async function runHeavyComputation() {
  try {
    console.log("Starting heavy computation...");
    const result = await calculatePrimes(10000);
    console.log(\`Found \${result.count} primes in \${result.duration}\`);
    return result;
  } catch (error) {
    console.error("Computation failed:", error);
    throw error;
  }
}`;

export function HeavyComputation() {
  const [computationState, setComputationState] = useState<
    "idle" | "preparing" | "computing" | "complete"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleRun = async () => {
    // Reset state
    setComputationState("idle");
    setProgress(0);
    setResult(null);
    setElapsedTime(0);

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Step 1: Preparing computation
    setComputationState("preparing");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Start computation
    setComputationState("computing");

    // Start timer
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 10) / 100);
    }, 10);
    setTimerInterval(interval);

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Clear timer
    clearInterval(interval);
    setTimerInterval(null);

    // Step 3: Complete
    setComputationState("complete");
    setResult({
      count: 1229,
      duration: "1250ms",
      message: "Heavy computation completed",
    });

    return result;
  };

  return (
    <ExampleCard
      title="Heavy Computation"
      description="Run CPU-intensive tasks without blocking the UI"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Prime Number Calculator</span>
        </div>

        <div className="space-y-3">
          {/* Computation Visualization */}
          <div
            className={`p-3 rounded-md border ${
              computationState === "idle"
                ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                : computationState === "preparing"
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                : computationState === "computing"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {computationState === "idle" && (
                  <span className="text-sm font-medium">Ready to compute</span>
                )}
                {computationState === "preparing" && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="text-sm font-medium">
                      Preparing computation...
                    </span>
                  </div>
                )}
                {computationState === "computing" && (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                    <span className="text-sm font-medium">
                      Computing prime numbers...
                    </span>
                  </div>
                )}
                {computationState === "complete" && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Computation complete!
                    </span>
                  </div>
                )}
              </div>

              {(computationState === "computing" ||
                computationState === "complete") && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-mono">
                    {elapsedTime.toFixed(2)}s
                  </span>
                </div>
              )}
            </div>

            {(computationState === "computing" ||
              computationState === "complete") && (
              <div className="space-y-1">
                <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute top-0 left-0 h-full ${
                      computationState === "complete"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>

                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{Math.round(progress)}% complete</span>
                  <span>Calculating primes up to 10,000</span>
                </div>
              </div>
            )}

            {computationState === "computing" && (
              <div className="mt-3 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded-full bg-yellow-300 dark:bg-yellow-700"
                    animate={{
                      scaleY: [0.5, 1.5, 0.5],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CPU Utilization Visualization */}
          {computationState === "computing" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md"
            >
              <div className="text-sm font-medium mb-2">CPU Utilization:</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs w-16">Main Thread:</span>
                  <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      animate={{
                        width: ["10%", "30%", "15%", "25%", "10%"],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs w-16">Worker:</span>
                  <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-500"
                      animate={{
                        width: ["60%", "90%", "75%", "95%", "80%"],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                      }}
                    />
                  </div>
                </div>

                <div className="text-xs text-zinc-500 mt-2">
                  Notice how the main thread stays responsive while the worker
                  thread handles the heavy computation.
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
            >
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Computation Results:
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Found prime numbers:</span>
                  <span className="font-medium">{result.count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Computation time:</span>
                  <span className="font-medium">{result.duration}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-700 dark:text-green-300">
                By using a Promise or Web Worker, we can run CPU-intensive tasks
                without blocking the main thread, keeping the UI responsive.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ExampleCard>
  );
}
