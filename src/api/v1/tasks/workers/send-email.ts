import { JOB } from 'api/v1/constants';
import { logger } from '../../../../config';
import * as helpers from '../../helpers';
import { EmailOptions } from '../../services/send-grid/interface';

interface JobData {
  template: EmailOptions;
}

interface Job {
  data: JobData;
}

export const sendEmailWorker = async (job: Job): Promise<void> => {
  const { template } = job.data;
  try {
    logger.info('Starting email worker process:', {
      jobId: job.data.template.to,
      data: job.data,
    });

    // Log email configuration
    logger.info('Email configuration:', {
      template: job.data.template,
      to: job.data.template.to,
      subject: job.data.template.subject,
    });

    if (template) {
      const result = await helpers.sendEmail(JOB.SEND_EMAIL, { template });

      logger.info('Email sent successfully:', {
        jobId: job.data.template.to,
        result,
      });

      return result;
    }
  } catch (error) {
    logger.error('Email worker failed:', {
      jobId: job.data.template.to,
      error: error,
    });
    throw error;
  }
};
