import { redis } from '../../services';

interface JobData {
  key: string;
  value?: string;
  ex?: number;
}

interface Job {
  data: JobData;
}

export const setCache = async (job: Job): Promise<void> => {
  const { key, value, ex } = job.data;

  if (key && value && ex) {
    await redis.set(key, value, ex);
  }
};

export const delCache = async (job: Job): Promise<void> => {
  const { key } = job.data;

  if (key) {
    await redis.del(key);
  }
};
