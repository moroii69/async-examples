"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExampleCard } from "@/components/example-card";
import { AlertTriangle, XCircle, Loader2 } from "lucide-react";

const code = `// Error Handling with try/catch
async function fetchDataWithErrorHandling(url) {
  try {
    console.log("Attempting to fetch data...");
    
    // Simulate API call that might fail
    const data = await simulateApiCall(url);
    
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    // Handle specific error types
    if (error.name === "NetworkError") {
      console.error("Network error occurred. Please check your connection.");
    } else if (error.name === "AuthError") {
      console.error("Authentication failed. Please log in again.");
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
    
    // Rethrow or return a default value
    throw error; // Rethrow to let caller handle it
  } finally {
    // This code always runs, regardless of success or failure
    console.log("Fetch operation complete");
  }
}

// Simulated API call that randomly succeeds or fails
async function simulateApiCall(url) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly decide if the call should fail (50% chance)
  const shouldFail = Math.random() < 0.5;
  
  if (shouldFail) {
    // Create a custom error
    const error = new Error("Failed to fetch data");
    error.name = "NetworkError";
    throw error;
  }
  
  return { id: 123, name: "Success Data" };
}

// Usage
async function handleDataFetch() {
  try {
    const result = await fetchDataWithErrorHandling("https://api.example.com/data");
    return result;
  } catch (error) {
    // Handle or log the error at the top level
    console.error("Top level error handler:", error);
    // Show user-friendly message
    alert("Sorry, something went wrong. Please try again later.");
  }
}`;

export function ErrorHandling() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<null | { name: string; message: string }>(
    null
  );
  const [showTryCatch, setShowTryCatch] = useState(false);

  const handleRun = async () => {
    // Reset state
    setStep(0);
    setError(null);
    setShowTryCatch(true);

    // Step 1: Enter try block
    setStep(1);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Attempting API call
    setStep(2);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 3: Error occurs
    setStep(3);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 4: Catch block handles error
    setStep(4);
    setError({ name: "NetworkError", message: "Failed to fetch data" });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 5: Finally block executes
    setStep(5);

    // Throw the error for the ExampleCard to catch
    throw new Error("NetworkError: Failed to fetch data");
  };

  return (
    <ExampleCard
      title="Error Handling"
      description="Handle errors gracefully with try/catch blocks"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        {showTryCatch && (
          <div className="space-y-4">
            {/* Try-Catch-Finally Visualization */}
            <div className="grid grid-cols-1 gap-2">
              {/* Try Block */}
              <motion.div
                className={`p-3 rounded-md border ${
                  step >= 1 && step < 4
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
                animate={{
                  scale: step >= 1 && step < 4 ? [1, 1.02, 1] : 1,
                  transition: { duration: 0.5 },
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">try {`{`}</span>
                </div>

                <div className="ml-4 space-y-2">
                  <motion.div
                    animate={{
                      backgroundColor: step >= 1 ? "#dbeafe" : "#f3f4f6",
                      borderColor: step >= 1 ? "#93c5fd" : "#e5e7eb",
                      color: step >= 1 ? "#1e40af" : "#6b7280",
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>console.log("Attempting to fetch data...");</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      backgroundColor: step >= 2 ? "#dbeafe" : "#f3f4f6",
                      borderColor: step >= 2 ? "#93c5fd" : "#e5e7eb",
                      color: step >= 2 ? "#1e40af" : "#6b7280",
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>const data = await simulateApiCall(url);</span>
                      {step === 2 && (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                      )}
                      {step === 3 && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      backgroundColor: "#f3f4f6",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                      opacity: 0.5,
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        console.log("Data fetched successfully:", data);
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-2">
                  <span className="text-sm font-medium">{`}`}</span>
                </div>
              </motion.div>

              {/* Error Visualization */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 40 }}
                      className="w-0.5 bg-red-500 my-1"
                    />
                  </div>
                </motion.div>
              )}

              {/* Catch Block */}
              <motion.div
                className={`p-3 rounded-md border ${
                  step === 4
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
                animate={{
                  scale: step === 4 ? [1, 1.02, 1] : 1,
                  transition: { duration: 0.5 },
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">
                    catch (error) {`{`}
                  </span>
                </div>

                <div className="ml-4 space-y-2">
                  <motion.div
                    animate={{
                      backgroundColor:
                        step >= 4 && error?.name === "NetworkError"
                          ? "#fee2e2"
                          : "#f3f4f6",
                      borderColor:
                        step >= 4 && error?.name === "NetworkError"
                          ? "#fca5a5"
                          : "#e5e7eb",
                      color:
                        step >= 4 && error?.name === "NetworkError"
                          ? "#b91c1c"
                          : "#6b7280",
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>if (error.name === "NetworkError") {`{`}</span>
                    </div>
                    <div className="ml-4">
                      <span>console.error("Network error occurred...");</span>
                    </div>
                    <div>
                      <span>{`}`}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      backgroundColor: "#f3f4f6",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                      opacity: 0.5,
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        else if (error.name === "AuthError") {`{`} ... {`}`}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{
                      backgroundColor: "#f3f4f6",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                      opacity: 0.5,
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        throw error; // Rethrow to let caller handle it
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-2">
                  <span className="text-sm font-medium">{`}`}</span>
                </div>
              </motion.div>

              {/* Finally Block */}
              <motion.div
                className={`p-3 rounded-md border ${
                  step === 5
                    ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                }`}
                animate={{
                  scale: step === 5 ? [1, 1.02, 1] : 1,
                  transition: { duration: 0.5 },
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">finally {`{`}</span>
                </div>

                <div className="ml-4 space-y-2">
                  <motion.div
                    animate={{
                      backgroundColor: step >= 5 ? "#f3e8ff" : "#f3f4f6",
                      borderColor: step >= 5 ? "#d8b4fe" : "#e5e7eb",
                      color: step >= 5 ? "#6b21a8" : "#6b7280",
                    }}
                    className="p-2 rounded-md border text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>console.log("Fetch operation complete");</span>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-2">
                  <span className="text-sm font-medium">{`}`}</span>
                </div>
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error Caught:
                  </span>
                </div>
                <div className="text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  <pre className="overflow-auto">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </div>
                <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                  The try/catch pattern allows you to gracefully handle errors
                  without crashing your application.
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </ExampleCard>
  );
}
