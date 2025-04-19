import { SimulatedApiFetch } from "@/components/examples/simulated-api-fetch";
import { FileUpload } from "@/components/examples/file-upload";
import { SequentialCalls } from "@/components/examples/sequential-calls";
import { ParallelCalls } from "@/components/examples/parallel-calls";
import { RaceBetweenTasks } from "@/components/examples/race-between-tasks";
import { ErrorHandling } from "@/components/examples/error-handling";
import { RetryOnFailure } from "@/components/examples/retry-on-failure";
import { TimeoutCancel } from "@/components/examples/timeout-cancel";
import { UserTriggeredButton } from "@/components/examples/user-triggered-button";
import { AsyncLoop } from "@/components/examples/async-loop";
import { ChainedFunctions } from "@/components/examples/chained-functions";
import { HeavyComputation } from "@/components/examples/heavy-computation";

export function ExampleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SimulatedApiFetch />
      <FileUpload />
      <SequentialCalls />
      <ParallelCalls />
      <RaceBetweenTasks />
      <ErrorHandling />
      <RetryOnFailure />
      <TimeoutCancel />
      <UserTriggeredButton />
      <AsyncLoop />
      <ChainedFunctions />
      <HeavyComputation />
    </div>
  );
}
