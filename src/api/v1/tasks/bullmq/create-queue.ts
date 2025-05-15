import { Queue } from 'bullmq';
import { redis } from '../../services/redis';

export async function createQueue(name: string): Promise<Queue> {
  const queue = new Queue(name, { connection: redis.bullMqClient });
  return queue;
}
