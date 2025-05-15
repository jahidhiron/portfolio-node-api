import { QUEUE } from '../../constants';
import { logger } from '../../../../config';
import { sendEmailWorker } from '../workers';
import { addQueue, createWorker } from '../bullmq';

interface Job {
  id: string;
}

export const sendEmail = async (
  name: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    const queue = await addQueue(QUEUE.SEND_EMAIL, name, data);

    const worker = createWorker(QUEUE.SEND_EMAIL, sendEmailWorker);

    // Add error handling
    worker.on('error', (error) => {
      logger.error('Email worker error:', error);
    });

    // Add failed job handling
    worker.on('failed', (job, error) => {
      logger.error(`Job ${job?.id} failed:`, error);
      logger.error('Job data:', job?.data);
    });

    // Add active job logging
    worker.on('active', (job) => {
      logger.info(`Processing job ${job.id}`, {
        name: job.name,
        data: job.data,
      });
    });

    worker.on('completed', (job: any) => {
      logger.info(`Job ${job.id} completed successfully`, {
        name: job.name,
        data: job.data,
        result: job.returnvalue,
      });
    });

    process.once('SIGTERM', async () => {
      logger.info('Shutting down email worker...');
      await worker.close();
      await queue.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error in sendEmail:', error);
    throw error;
  }
};
