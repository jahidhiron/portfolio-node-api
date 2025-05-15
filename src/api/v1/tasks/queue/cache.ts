import { QUEUE } from '../../constants';
import { delCache, setCache } from '../workers';
import { addQueue, createWorker } from '../bullmq';

type QueueData = Record<string, unknown>; // Define a type for the data object

export const set = async (name: string, data: QueueData): Promise<void> => {
  await addQueue(QUEUE.CACHE, name, data);
  createWorker(QUEUE.CACHE, setCache);
};

export const del = async (name: string, data: QueueData): Promise<void> => {
  await addQueue(QUEUE.CACHE, name, data);
  createWorker(QUEUE.CACHE, delCache);
};
