"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { User, FileText, Users, ArrowDown, Loader2, CheckCircle } from "lucide-react"

const code = `// Sequential Async Calls
async function fetchUserProfile(userId) {
  // First API call to get user
  console.log("Fetching user data...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  const user = { 
    id: userId, 
    name: "Jane Smith" 
  };
  
  // Second API call to get posts
  console.log("Fetching user's posts...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  const posts = [
    { id: 1, title: "First Post" },
    { id: 2, title: "Second Post" }
  ];
  
  // Third API call to get followers
  console.log("Fetching user's followers...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  const followers = [
    { id: 101, name: "Alice" },
    { id: 102, name: "Bob" }
  ];
  
  // Combine all data
  return {
    user,
    posts,
    followers
  };
}

// Usage
async function loadUserProfile() {
  try {
    const profile = await fetchUserProfile(123);
    console.log("Complete profile:", profile);
    return profile;
  } catch (error) {
    console.error("Failed to load profile:", error);
    throw error;
  }
}`

export function SequentialCalls() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [postsData, setPostsData] = useState<any>(null)
  const [followersData, setFollowersData] = useState<any>(null)

  const handleRun = async () => {
    // Reset state
    setCurrentStep(0)
    setUserData(null)
    setPostsData(null)
    setFollowersData(null)

    // Step 1: Fetch user data
    setCurrentStep(1)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const user = { id: 123, name: "Jane Smith" }
    setUserData(user)

    // Step 2: Fetch posts
    setCurrentStep(2)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const posts = [
      { id: 1, title: "First Post" },
      { id: 2, title: "Second Post" },
    ]
    setPostsData(posts)

    // Step 3: Fetch followers
    setCurrentStep(3)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const followers = [
      { id: 101, name: "Alice" },
      { id: 102, name: "Bob" },
    ]
    setFollowersData(followers)

    // Step 4: Complete
    setCurrentStep(4)

    return {
      user,
      posts,
      followers,
    }
  }

  return (
    <ExampleCard
      title="Sequential Async Calls"
      description="Make multiple API calls in sequence"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <div className="text-sm font-medium mb-2">API Calls Sequence:</div>

          <div className="space-y-4">
            {/* User Data Call */}
            <motion.div
              className={`p-3 rounded-md border flex items-start space-x-3 ${
                currentStep >= 1
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"
              }`}
              animate={{
                scale: currentStep === 1 ? [1, 1.02, 1] : 1,
                transition: { duration: 0.5 },
              }}
            >
              <div className="mt-0.5">
                <User className={`h-5 w-5 ${currentStep >= 1 ? "text-blue-500" : "text-zinc-400"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">1. Fetch User Data</span>
                  <div>
                    {currentStep === 1 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                    {currentStep > 1 && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>

                {userData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-xs bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800"
                  >
                    <pre className="overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div className="flex justify-center" animate={{ opacity: currentStep >= 2 ? 1 : 0.3 }}>
              <ArrowDown className="h-5 w-5 text-zinc-400" />
            </motion.div>

            {/* Posts Data Call */}
            <motion.div
              className={`p-3 rounded-md border flex items-start space-x-3 ${
                currentStep >= 2
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"
              }`}
              animate={{
                scale: currentStep === 2 ? [1, 1.02, 1] : 1,
                transition: { duration: 0.5 },
              }}
            >
              <div className="mt-0.5">
                <FileText className={`h-5 w-5 ${currentStep >= 2 ? "text-blue-500" : "text-zinc-400"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2. Fetch User's Posts</span>
                  <div>
                    {currentStep === 2 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                    {currentStep > 2 && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>

                {postsData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-xs bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800"
                  >
                    <pre className="overflow-auto">{JSON.stringify(postsData, null, 2)}</pre>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div className="flex justify-center" animate={{ opacity: currentStep >= 3 ? 1 : 0.3 }}>
              <ArrowDown className="h-5 w-5 text-zinc-400" />
            </motion.div>

            {/* Followers Data Call */}
            <motion.div
              className={`p-3 rounded-md border flex items-start space-x-3 ${
                currentStep >= 3
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"
              }`}
              animate={{
                scale: currentStep === 3 ? [1, 1.02, 1] : 1,
                transition: { duration: 0.5 },
              }}
            >
              <div className="mt-0.5">
                <Users className={`h-5 w-5 ${currentStep >= 3 ? "text-blue-500" : "text-zinc-400"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3. Fetch User's Followers</span>
                  <div>
                    {currentStep === 3 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                    {currentStep > 3 && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>

                {followersData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-xs bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800"
                  >
                    <pre className="overflow-auto">{JSON.stringify(followersData, null, 2)}</pre>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                All data fetched sequentially!
              </span>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              Notice how each request waited for the previous one to complete before starting.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
