"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import { Loader2 } from "lucide-react"

interface ExampleCardProps {
  title: string
  description: string
  code: string
  children: React.ReactNode
  onRun: () => Promise<void>
}

export function ExampleCard({ title, description, code, children, onRun }: ExampleCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [showCode, setShowCode] = useState(false)

  const handleRun = async () => {
    try {
      setIsLoading(true)
      setStatus("loading")
      await onRun()
      setStatus("success")
    } catch (error) {
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRun} disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </motion.div>
          ) : (
            "Run Example"
          )}
        </Button>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col items-stretch">
        <Button
          variant="ghost"
          onClick={() => setShowCode(!showCode)}
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {showCode ? "Hide Code" : "Show Code"}
        </Button>

        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CodeBlock code={code} language="javascript" />
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  )
}
