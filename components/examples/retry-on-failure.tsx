"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExampleCard } from "@/components/example-card";
import { RefreshCw, XCircle, CheckCircle, Clock } from "lucide-react";

const code = `// Retry on Failure
async function fetchWithRetry(url, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(\`Attempt \${retries + 1} of \${maxRetries}...\`);

      // Attempt to fetch data
      const response = await fetch(url);

      // If successful, return the data
      const data = await response.json();
      console.log("Success on attempt", retries + 1);
      return data;
    } catch (error) {
      retries++;

      if (retries >= maxRetries) {
        console.error("Max retries reached. Giving up.");
        throw new Error(\`Failed after \${maxRetries} attempts: \${error.message}\`);
      }

      // Wait longer between each retry (exponential backoff)
      const delay = 1000 * Math.pow(2, retries);
      console.log(\`Retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
async function loadDataWithRetry() {
  try {
    const data = await fetchWithRetry("https://api.example.com/flaky-endpoint");
    console.log("Finally got data:", data);
    return data;
  } catch (error) {
    console.error("All retries failed:", error);
    // Handle the failure after all retries
  }
}`;

export function RetryOnFailure() {
  const [attempts, setAttempts] = useState<
    Array<{
      status: "pending" | "failed" | "success";
      delay?: number;
    }>
  >([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleRun = async () => {
    // Reset state
    setAttempts([]);
    setCurrentAttempt(0);
    setIsWaiting(false);
    setWaitTime(0);
    setSuccess(false);

    const maxRetries = 3;

    // First attempt - fails
    setAttempts([{ status: "pending" }]);
    setCurrentAttempt(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAttempts([{ status: "failed" }]);

    // Wait with exponential backoff
    setIsWaiting(true);
    setWaitTime(2000);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWaiting(false);

    // Second attempt - fails
    setAttempts([{ status: "failed" }, { status: "pending" }]);
    setCurrentAttempt(2);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAttempts([{ status: "failed" }, { status: "failed" }]);

    // Wait with exponential backoff
    setIsWaiting(true);
    setWaitTime(4000);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Shortened for demo
    setIsWaiting(false);

    // Third attempt - succeeds
    setAttempts([
      { status: "failed" },
      { status: "failed" },
      { status: "pending" },
    ]);
    setCurrentAttempt(3);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAttempts([
      { status: "failed" },
      { status: "failed" },
      { status: "success" },
    ]);
    setSuccess(true);

    return {
      success: true,
      message: "Data retrieved successfully on attempt 3",
    };
  };

  return (
    <ExampleCard
      title="Retry on Failure"
      description="Automatically retry failed operations with exponential backoff"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium mb-2">Retry Mechanism:</div>

        <div className="space-y-4">
          {attempts.map((attempt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-md border flex items-start space-x-3 ${
                attempt.status === "pending"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : attempt.status === "failed"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              }`}
            >
              <div className="mt-0.5">
                {attempt.status === "pending" && (
                  <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {attempt.status === "failed" && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {attempt.status === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Attempt {index + 1}{" "}
                    {attempt.status === "pending"
                      ? "(In Progress)"
                      : attempt.status === "failed"
                      ? "(Failed)"
                      : "(Success)"}
                  </span>
                </div>

                {attempt.status === "failed" && (
                  <div className="mt-1 text-xs text-red-700 dark:text-red-300">
                    Request failed with error: Network Error
                  </div>
                )}

                {attempt.status === "success" && (
                  <div className="mt-1 text-xs text-green-700 dark:text-green-300">
                    Request succeeded! Data retrieved successfully.
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isWaiting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 flex items-start space-x-3"
            >
              <div className="mt-0.5">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Exponential Backoff
                  </span>
                </div>
                <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  Waiting {waitTime}ms before retry {currentAttempt + 1}...
                </div>
                <div className="mt-2 relative h-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: waitTime / 1000 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Success after retries!
              </span>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              The retry mechanism with exponential backoff helps handle
              transient failures by automatically retrying with increasing
              delays between attempts.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  );
}
