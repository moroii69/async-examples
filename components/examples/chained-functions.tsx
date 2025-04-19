"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { Loader2, CheckCircle, User, Key, Shield, ArrowDown } from "lucide-react"

const code = `// Chained Async Functions
async function authenticateUser(credentials) {
  console.log("Authenticating user...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful authentication
  return {
    userId: "user123",
    token: "jwt-token-here",
    expiresIn: 3600
  };
}

async function fetchUserProfile(userId) {
  console.log(\`Fetching profile for user \${userId}...\`);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate user profile data
  return {
    id: userId,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "admin"
  };
}

async function fetchUserPermissions(userRole) {
  console.log(\`Fetching permissions for role \${userRole}...\`);
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simulate permissions based on role
  const permissions = {
    admin: ["read", "write", "delete", "manage-users"],
    editor: ["read", "write"],
    viewer: ["read"]
  };
  
  return permissions[userRole] || [];
}

// Chain all functions together
async function initializeUserSession(credentials) {
  try {
    // Step 1: Authenticate
    const authData = await authenticateUser(credentials);
    
    // Step 2: Get user profile using auth data
    const userProfile = await fetchUserProfile(authData.userId);
    
    // Step 3: Get permissions using profile data
    const permissions = await fetchUserPermissions(userProfile.role);
    
    // Combine all data into a session object
    const session = {
      user: userProfile,
      auth: authData,
      permissions,
      isActive: true
    };
    
    console.log("User session initialized:", session);
    return session;
  } catch (error) {
    console.error("Failed to initialize session:", error);
    throw error;
  }
}

// Usage
async function loginUser() {
  const credentials = {
    username: "sarah",
    password: "password123"
  };
  
  try {
    const session = await initializeUserSession(credentials);
    // Store session in app state
    console.log("Login successful:", session);
    return session;
  } catch (error) {
    console.error("Login failed:", error);
    // Show error to user
  }
}`

export function ChainedFunctions() {
  const [step, setStep] = useState(0)
  const [authData, setAuthData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [permissionsData, setPermissionsData] = useState<any>(null)
  const [sessionData, setSessionData] = useState<any>(null)

  const handleRun = async () => {
    // Reset state
    setStep(0)
    setAuthData(null)
    setProfileData(null)
    setPermissionsData(null)
    setSessionData(null)

    // Step 1: Authenticate
    setStep(1)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const auth = {
      userId: "user123",
      token: "jwt-token-here",
      expiresIn: 3600,
    }
    setAuthData(auth)

    // Step 2: Get user profile
    setStep(2)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const profile = {
      id: auth.userId,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "admin",
    }
    setProfileData(profile)

    // Step 3: Get permissions
    setStep(3)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const permissions = ["read", "write", "delete", "manage-users"]
    setPermissionsData(permissions)

    // Step 4: Combine into session
    setStep(4)
    const session = {
      user: profile,
      auth: auth,
      permissions,
      isActive: true,
    }
    setSessionData(session)

    return session
  }

  return (
    <ExampleCard
      title="Chained Functions"
      description="Chain multiple async functions together in sequence"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium mb-2">Function Chain:</div>

        <div className="space-y-4">
          {/* Step 1: Authentication */}
          <motion.div
            className={`p-3 rounded-md border ${
              step >= 1
                ? step === 1
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
            animate={{
              scale: step === 1 ? [1, 1.02, 1] : 1,
              transition: { duration: 0.5 },
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Key
                  className={`h-5 w-5 ${
                    step === 0 ? "text-zinc-400" : step === 1 ? "text-blue-500" : "text-green-500"
                  }`}
                />
                <span className="text-sm font-medium">1. authenticateUser(credentials)</span>
              </div>
              <div>
                {step === 1 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step > 1 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            {authData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <pre className="overflow-auto">{JSON.stringify(authData, null, 2)}</pre>
              </motion.div>
            )}
          </motion.div>

          {/* Arrow */}
          <motion.div className="flex justify-center" animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <ArrowDown className="h-5 w-5 text-zinc-400" />
          </motion.div>

          {/* Step 2: User Profile */}
          <motion.div
            className={`p-3 rounded-md border ${
              step >= 2
                ? step === 2
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
            animate={{
              scale: step === 2 ? [1, 1.02, 1] : 1,
              transition: { duration: 0.5 },
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User
                  className={`h-5 w-5 ${step < 2 ? "text-zinc-400" : step === 2 ? "text-blue-500" : "text-green-500"}`}
                />
                <span className="text-sm font-medium">2. fetchUserProfile(userId)</span>
              </div>
              <div>
                {step === 2 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step > 2 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            {profileData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <pre className="overflow-auto">{JSON.stringify(profileData, null, 2)}</pre>
              </motion.div>
            )}
          </motion.div>

          {/* Arrow */}
          <motion.div className="flex justify-center" animate={{ opacity: step >= 3 ? 1 : 0.3 }}>
            <ArrowDown className="h-5 w-5 text-zinc-400" />
          </motion.div>

          {/* Step 3: Permissions */}
          <motion.div
            className={`p-3 rounded-md border ${
              step >= 3
                ? step === 3
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
            animate={{
              scale: step === 3 ? [1, 1.02, 1] : 1,
              transition: { duration: 0.5 },
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield
                  className={`h-5 w-5 ${step < 3 ? "text-zinc-400" : step === 3 ? "text-blue-500" : "text-green-500"}`}
                />
                <span className="text-sm font-medium">3. fetchUserPermissions(userRole)</span>
              </div>
              <div>
                {step === 3 && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                {step > 3 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            {permissionsData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <pre className="overflow-auto">{JSON.stringify(permissionsData, null, 2)}</pre>
              </motion.div>
            )}
          </motion.div>
        </div>

        {sessionData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Session Initialized!</span>
            </div>
            <div className="text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
              <pre className="overflow-auto">{JSON.stringify(sessionData, null, 2)}</pre>
            </div>
            <div className="mt-2 text-xs text-green-700 dark:text-green-300">
              Chaining async functions allows you to use the result of one operation as input to the next, creating a
              clean sequence of dependent operations.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
