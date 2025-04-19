"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExampleCard } from "@/components/example-card";
import { Loader2, CheckCircle, User, Users } from "lucide-react";

const code = `// Async Loop over Array
async function processItems(items) {
  const results = [];

  // Process each item sequentially
  for (const item of items) {
    console.log(\`Processing item: \${item.name}\`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate processing logic
    const processedItem = {
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    };

    results.push(processedItem);
    console.log(\`Completed: \${item.name}\`);
  }

  console.log("All items processed");
  return results;
}

// Process items in parallel with Promise.all
async function processItemsParallel(items) {
  console.log("Processing all items in parallel");

  // Create an array of promises
  const promises = items.map(async (item) => {
    console.log(\`Started: \${item.name}\`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate processing logic
    const processedItem = {
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    };

    console.log(\`Completed: \${item.name}\`);
    return processedItem;
  });

  // Wait for all promises to resolve
  const results = await Promise.all(promises);
  console.log("All items processed in parallel");
  return results;
}

// Usage
async function processUserData() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];

  // Process sequentially
  const sequentialResults = await processItems(users);
  console.log("Sequential results:", sequentialResults);

  // Process in parallel
  const parallelResults = await processItemsParallel(users);
  console.log("Parallel results:", parallelResults);

  return {
    sequential: sequentialResults,
    parallel: parallelResults
  };
}`;

export function AsyncLoop() {
  const [items, setItems] = useState([
    { id: 1, name: "Alice", status: "pending" },
    { id: 2, name: "Bob", status: "pending" },
    { id: 3, name: "Charlie", status: "pending" },
  ]);
  const [currentItem, setCurrentItem] = useState(-1);
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleRun = async () => {
    // Reset state
    setItems([
      { id: 1, name: "Alice", status: "pending" },
      { id: 2, name: "Bob", status: "pending" },
      { id: 3, name: "Charlie", status: "pending" },
    ]);
    setCurrentItem(-1);
    setProcessedItems([]);
    setIsComplete(false);

    const results = [];

    // Process each item sequentially
    for (let i = 0; i < items.length; i++) {
      // Update current item
      setCurrentItem(i);

      // Update item status to processing
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "processing" } : item
        )
      );

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add processed item to results
      const processedItem = {
        ...items[i],
        status: "completed",
        processed: true,
        timestamp: new Date().toISOString(),
      };

      results.push(processedItem);

      // Update item status to completed
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "completed" } : item
        )
      );

      // Update processed items
      setProcessedItems((prev) => [...prev, processedItem]);
    }

    // Mark as complete
    setCurrentItem(-1);
    setIsComplete(true);

    return {
      message: "All items processed",
      results,
    };
  };

  return (
    <ExampleCard
      title="Async Loop"
      description="Process arrays of items asynchronously"
      code={code}
      onRun={handleRun}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Processing User Data</span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={`p-3 rounded-md border flex items-center space-x-3 ${
                item.status === "pending"
                  ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  : item.status === "processing"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              }`}
              animate={{
                scale: currentItem === index ? [1, 1.02, 1] : 1,
                transition: { duration: 0.5 },
              }}
            >
              <div>
                <User
                  className={`h-5 w-5 ${
                    item.status === "pending"
                      ? "text-zinc-400"
                      : item.status === "processing"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="text-xs text-zinc-500">ID: {item.id}</div>
                </div>
                <div>
                  {item.status === "processing" && (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {item.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {processedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md"
          >
            <h4 className="text-sm font-medium mb-2">Processed Items:</h4>
            <div className="text-xs bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
              <pre className="overflow-auto">
                {JSON.stringify(processedItems, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                All items processed successfully!
              </span>
            </div>
            <div className="mt-1 text-xs text-green-700 dark:text-green-300">
              The async loop pattern allows you to process each item in
              sequence, waiting for each operation to complete before moving to
              the next.
            </div>
          </motion.div>
        )}
      </div>
    </ExampleCard>
  );
}
