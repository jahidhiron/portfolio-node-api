import * as services from '../services';
import { EmailOptions } from '../services/send-grid/interface';

export const sendEmail = async (
  jobType: string,
  { template }: { template: EmailOptions }
): Promise<void> => {
  await services.sendEmail(template);
};
