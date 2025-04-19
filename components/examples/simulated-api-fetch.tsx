"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { Loader2, CheckCircle, Server, ArrowDown } from "lucide-react"

const code = `// Simulated API Fetch
async function fetchUserData() {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate API response
  const userData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
  };
  
  return userData;
}

// Usage
async function handleFetchUser() {
  try {
    const user = await fetchUserData();
    console.log("User data:", user);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}`

export function SimulatedApiFetch() {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState<null | { id: number; name: string; email: string }>(null)

  const handleRun = async () => {
    // Reset state
    setStep(0)
    setUserData(null)

    // Step 1: Sending request
    setStep(1)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 2: Waiting for response
    setStep(2)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 3: Received response
    const data = { id: 1, name: "John Doe", email: "john@example.com" }
    setUserData(data)
    setStep(3)
  }

  return (
    <ExampleCard
      title="Simulated API Fetch"
      description="Fetch data from a simulated API endpoint with a delay"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: step === 1 ? 1.1 : 1,
                color: step === 1 ? "#3b82f6" : "#6b7280",
              }}
              className="text-zinc-500"
            >
              <Server className="h-5 w-5" />
            </motion.div>
            <span className="text-sm font-medium">Client</span>
          </div>

          <motion.div
            animate={{
              y: step >= 1 && step < 3 ? [0, 10, 0] : 0,
              opacity: step >= 1 && step < 3 ? 1 : 0,
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
          >
            <ArrowDown className={`h-5 w-5 ${step >= 1 && step < 3 ? "text-blue-500" : "text-zinc-300"}`} />
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: step === 2 ? 1.1 : 1,
                color: step === 2 ? "#3b82f6" : "#6b7280",
              }}
              className="text-zinc-500"
            >
              <Server className="h-5 w-5" />
            </motion.div>
            <span className="text-sm font-medium">Server</span>
          </div>
        </div>

        <div className="space-y-2">
          <motion.div
            animate={{
              backgroundColor: step >= 1 ? "#dbeafe" : "#f3f4f6",
              borderColor: step >= 1 ? "#93c5fd" : "#e5e7eb",
            }}
            className="p-2 rounded-md border text-sm"
          >
            <div className="flex items-center space-x-2">
              <motion.div animate={{ opacity: step >= 1 ? 1 : 0.3 }}>
                {step === 1 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step > 1 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </motion.div>
              <span>Sending request to API...</span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              backgroundColor: step >= 2 ? "#dbeafe" : "#f3f4f6",
              borderColor: step >= 2 ? "#93c5fd" : "#e5e7eb",
            }}
            className="p-2 rounded-md border text-sm"
          >
            <div className="flex items-center space-x-2">
              <motion.div animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
                {step === 2 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step > 2 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </motion.div>
              <span>Server processing request...</span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              backgroundColor: step >= 3 ? "#dbeafe" : "#f3f4f6",
              borderColor: step >= 3 ? "#93c5fd" : "#e5e7eb",
            }}
            className="p-2 rounded-md border text-sm"
          >
            <div className="flex items-center space-x-2">
              <motion.div animate={{ opacity: step >= 3 ? 1 : 0.3 }}>
                {step === 3 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </motion.div>
              <span>Received response from server</span>
            </div>
          </motion.div>
        </div>

        {userData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md"
          >
            <h4 className="text-sm font-medium mb-1">Response Data:</h4>
            <pre className="text-xs overflow-auto p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
