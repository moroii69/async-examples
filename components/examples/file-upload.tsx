"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExampleCard } from "@/components/example-card"
import { FileUp, CheckCircle, Upload } from "lucide-react"

const code = `// File Upload with Progress
async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    // Simulate file chunks and progress
    let progress = 0;
    const totalSize = file.size;
    const chunkSize = totalSize / 10; // 10 chunks
    
    const interval = setInterval(() => {
      progress += chunkSize;
      
      // Calculate percentage
      const percentage = Math.min(
        Math.round((progress / totalSize) * 100),
        100
      );
      
      console.log(\`Upload progress: \${percentage}%\`);
      
      // When complete
      if (percentage >= 100) {
        clearInterval(interval);
        resolve({ success: true, filename: file.name });
      }
    }, 300); // Update every 300ms
  });
}

// Usage
async function handleFileUpload(file) {
  try {
    const result = await uploadFile(file);
    console.log("Upload complete:", result);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}`

export function FileUpload() {
  const [progress, setProgress] = useState(0)
  const [chunks, setChunks] = useState<number[]>([])
  const [uploadComplete, setUploadComplete] = useState(false)
  const [currentChunk, setCurrentChunk] = useState(-1)

  const handleRun = async () => {
    // Reset state
    setProgress(0)
    setChunks([])
    setUploadComplete(false)
    setCurrentChunk(-1)

    // Create 10 chunks
    const totalChunks = 10
    setChunks(Array.from({ length: totalChunks }, (_, i) => i))

    // Upload each chunk with progress
    for (let i = 0; i < totalChunks; i++) {
      setCurrentChunk(i)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setProgress((prev) => Math.min(prev + 100 / totalChunks, 100))
    }

    setUploadComplete(true)
    return { success: true, filename: "example.jpg" }
  }

  return (
    <ExampleCard
      title="File Upload with Progress"
      description="Upload a file with progress tracking"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <FileUp className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">example.jpg (2.5MB)</span>
        </div>

        <div className="space-y-3">
          <div className="relative h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          <div className="flex justify-between text-xs text-zinc-500">
            <span>{Math.round(progress)}% complete</span>
            <span>{uploadComplete ? "Complete" : "Uploading..."}</span>
          </div>
        </div>

        <div className="border rounded-md p-3 bg-zinc-50 dark:bg-zinc-900">
          <h4 className="text-sm font-medium mb-2">Upload Chunks:</h4>
          <div className="grid grid-cols-5 gap-2">
            {chunks.map((chunk, index) => (
              <motion.div
                key={chunk}
                className={`p-2 rounded border text-center text-xs font-medium ${
                  index <= currentChunk
                    ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800"
                    : "bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                }`}
                animate={{
                  scale: index === currentChunk ? [1, 1.05, 1] : 1,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <span>Chunk {chunk + 1}</span>
                  {index < currentChunk && <CheckCircle className="h-3 w-3 text-green-500 mt-1" />}
                  {index === currentChunk && <Upload className="h-3 w-3 text-blue-500 mt-1" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {uploadComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center space-x-2 p-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Upload complete! Server processed the file.</span>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  )
}
