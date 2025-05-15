import { Worker, Processor, WorkerOptions, KeepJobs } from 'bullmq';
import { redis } from '../../services/redis';

interface CustomWorkerOptions
  extends Omit<WorkerOptions, 'connection' | 'removeOnComplete'> {
  removeOnComplete?: KeepJobs;
  concurrency?: number;
}

export function createWorker(
  name: string,
  fn: Processor,
  options: CustomWorkerOptions = {
    removeOnComplete: { age: 3600 },
    concurrency: 50,
  }
): Worker {
  const worker = new Worker(name, fn, {
    connection: redis.bullMqClient,
    ...options,
  });

  return worker;
}
