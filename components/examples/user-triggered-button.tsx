"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { Loader2, CheckCircle, Mail, Lock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const code = `// User-Triggered Async Button
async function handleFormSubmit(formData) {
  // Disable the button while processing
  const submitButton = document.getElementById("submitButton");
  submitButton.disabled = true;
  submitButton.textContent = "Processing...";
  
  try {
    // Validate form data
    if (!formData.email || !formData.password) {
      throw new Error("Email and password are required");
    }
    
    // Simulate API call to submit form
    console.log("Submitting form data...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful response
    const response = {
      success: true,
      message: "Form submitted successfully"
    };
    
    console.log("Form submitted:", response);
    submitButton.textContent = "Success!";
    
    // Reset form after success
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
      // Clear any form fields
      document.getElementById("emailField").value = "";
      document.getElementById("passwordField").value = "";
    }, 1500);
    
    return response;
  } catch (error) {
    console.error("Form submission failed:", error);
    submitButton.textContent = "Error!";
    
    // Re-enable button after error
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = "Try Again";
    }, 1500);
    
    throw error;
  }
}

// Usage
async function submitLoginForm() {
  const formData = {
    email: document.getElementById("emailField").value,
    password: document.getElementById("passwordField").value
  };
  
  try {
    const result = await handleFormSubmit(formData);
    // Show success message to user
    showNotification("Success", result.message);
  } catch (error) {
    // Show error message to user
    showNotification("Error", error.message);
  }
}`

export function UserTriggeredButton() {
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [buttonText, setButtonText] = useState("Submit")
  const [isDisabled, setIsDisabled] = useState(false)
  const [email, setEmail] = useState("user@example.com")
  const [password, setPassword] = useState("••••••••")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRun = async () => {
    // Update button state
    setButtonState("loading")
    setButtonText("Processing...")
    setIsDisabled(true)
    setShowSuccess(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update to success state
    setButtonState("success")
    setButtonText("Success!")

    // Show success message
    setShowSuccess(true)

    // Reset button after delay
    setTimeout(() => {
      setButtonState("idle")
      setButtonText("Submit")
      setIsDisabled(false)
    }, 1500)

    return {
      success: true,
      message: "Form submitted successfully",
    }
  }

  const getButtonClasses = () => {
    switch (buttonState) {
      case "loading":
        return "bg-blue-500 hover:bg-blue-600"
      case "success":
        return "bg-green-500 hover:bg-green-600"
      case "error":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <ExampleCard
      title="User-Triggered Button"
      description="Handle user interactions with proper button states"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="space-y-4 bg-white dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute left-2.5 top-2.5 text-zinc-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute left-2.5 top-2.5 text-zinc-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                disabled={isDisabled}
              />
            </div>
          </div>

          <motion.button
            className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${getButtonClasses()} ${isDisabled ? "opacity-80 cursor-not-allowed" : ""}`}
            disabled={isDisabled}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
          >
            {buttonState === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonState === "success" && <CheckCircle className="mr-2 h-4 w-4" />}
            {buttonText}
          </motion.button>
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400 space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${buttonState === "idle" ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            ></div>
            <span>Idle: Button is ready for user interaction</span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${buttonState === "loading" ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            ></div>
            <span>Loading: Button is disabled, shows spinner</span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${buttonState === "success" ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            ></div>
            <span>Success: Operation completed successfully</span>
          </div>
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Login Successful</h4>
                <p className="text-xs text-green-700 dark:text-green-300">User authenticated successfully</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
