import { createQueue } from './create-queue';

type JobData = Record<string, any>;

export async function addQueue(
  queueName: string,
  jobName: string,
  data: JobData
): Promise<JobData> {
  const queue = await createQueue(queueName);
  queue.add(jobName, data, { removeOnComplete: true });
  return data;
}
