"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { User, FileText, Bell, Loader2, CheckCircle } from "lucide-react"

const code = `// Parallel Async Calls (Promise.all)
async function fetchDashboardData(userId) {
  console.log("Fetching dashboard data in parallel...");
  
  // Define all promises but don't await yet
  const userPromise = fetchUser(userId);
  const postsPromise = fetchPosts(userId);
  const notificationsPromise = fetchNotifications(userId);
  
  // Wait for all promises to resolve in parallel
  const [user, posts, notifications] = await Promise.all([
    userPromise,
    postsPromise,
    notificationsPromise
  ]);
  
  return { user, posts, notifications };
}

// Simulated API functions
async function fetchUser(userId) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { id: userId, name: "Alex Johnson" };
}

async function fetchPosts(userId) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    { id: 1, title: "Hello World" },
    { id: 2, title: "Async/Await is awesome" }
  ];
}

async function fetchNotifications(userId) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 1, message: "New follower" },
    { id: 2, message: "Your post was liked" }
  ];
}

// Usage
async function loadDashboard() {
  try {
    const dashboardData = await fetchDashboardData(456);
    console.log("Dashboard loaded:", dashboardData);
    return dashboardData;
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    throw error;
  }
}`

export function ParallelCalls() {
  const [isRunning, setIsRunning] = useState(false)
  const [userProgress, setUserProgress] = useState(0)
  const [postsProgress, setPostsProgress] = useState(0)
  const [notificationsProgress, setNotificationsProgress] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [postsData, setPostsData] = useState<any>(null)
  const [notificationsData, setNotificationsData] = useState<any>(null)
  const [allComplete, setAllComplete] = useState(false)

  const handleRun = async () => {
    // Reset state
    setIsRunning(true)
    setUserProgress(0)
    setPostsProgress(0)
    setNotificationsProgress(0)
    setUserData(null)
    setPostsData(null)
    setNotificationsData(null)
    setAllComplete(false)

    // Create promises for parallel execution
    const userPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        setUserProgress((prev) => {
          const newProgress = Math.min(prev + 10, 100)
          if (newProgress === 100) {
            clearInterval(interval)
            resolve({ id: 456, name: "Alex Johnson" })
          }
          return newProgress
        })
      }, 200)
    })

    const postsPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        setPostsProgress((prev) => {
          const newProgress = Math.min(prev + 13.33, 100)
          if (newProgress >= 100) {
            clearInterval(interval)
            resolve([
              { id: 1, title: "Hello World" },
              { id: 2, title: "Async/Await is awesome" },
            ])
          }
          return newProgress
        })
      }, 200)
    })

    const notificationsPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        setNotificationsProgress((prev) => {
          const newProgress = Math.min(prev + 20, 100)
          if (newProgress === 100) {
            clearInterval(interval)
            resolve([
              { id: 1, message: "New follower" },
              { id: 2, message: "Your post was liked" },
            ])
          }
          return newProgress
        })
      }, 200)
    })

    // Wait for all promises to resolve
    const [user, posts, notifications] = await Promise.all([userPromise, postsPromise, notificationsPromise])

    setUserData(user)
    setPostsData(posts)
    setNotificationsData(notifications)
    setAllComplete(true)
    setIsRunning(false)

    return { user, posts, notifications }
  }

  return (
    <ExampleCard
      title="Parallel Async Calls"
      description="Execute multiple API calls simultaneously with Promise.all"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium mb-2">Parallel API Calls:</div>

        <div className="grid gap-4">
          {/* User Data Call */}
          <div className="p-3 rounded-md border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">User Data (2s)</span>
              </div>
              <div>
                {userProgress < 100 && isRunning && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {userProgress === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${userProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {userData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
                >
                  <pre className="overflow-auto">{JSON.stringify(userData, null, 2)}</pre>
                </motion.div>
              )}
            </div>
          </div>

          {/* Posts Data Call */}
          <div className="p-3 rounded-md border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Posts Data (1.5s)</span>
              </div>
              <div>
                {postsProgress < 100 && isRunning && <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />}
                {postsProgress === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${postsProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {postsData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
                >
                  <pre className="overflow-auto">{JSON.stringify(postsData, null, 2)}</pre>
                </motion.div>
              )}
            </div>
          </div>

          {/* Notifications Data Call */}
          <div className="p-3 rounded-md border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Notifications Data (1s)</span>
              </div>
              <div>
                {notificationsProgress < 100 && isRunning && (
                  <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                )}
                {notificationsProgress === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${notificationsProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {notificationsData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
                >
                  <pre className="overflow-auto">{JSON.stringify(notificationsData, null, 2)}</pre>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                All data fetched in parallel!
              </span>
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              Notice how all requests started at the same time, but completed at different times based on their
              duration.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
