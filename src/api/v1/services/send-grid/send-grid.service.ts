import { EmailOptions, MessagePayload } from './interface';
import { config, logger } from '../../../../config';
const sgMail = require('@sendgrid/mail');

// Log the API key length to verify it's being set (without exposing the key)
logger.info(`SendGrid API Key length: ${config.SENDGRID_API_KEY?.length || 0}`);
logger.info(`SendGrid Mail From: ${config.SENDGRID_MAIL_FROM || 'not set'}`);

sgMail.setApiKey(config.SENDGRID_API_KEY);

const sendGridMailFrom = config.SENDGRID_MAIL_FROM as string;

export const sendEmail = async ({
  from = config.SENDGRID_MAIL_FROM,
  to,
  subject,
  text = '',
  html = '',
  attachments = [],
}: EmailOptions): Promise<void> => {
  if (!config.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key is not configured');
  }

  if (!config.SENDGRID_MAIL_FROM) {
    throw new Error('SendGrid sender email is not configured');
  }

  if (to && subject && (text || html)) {
    const content = html
      ? [{ type: 'text/html', value: html }]
      : [{ type: 'text/plain', value: text }];

    const msg: MessagePayload = {
      from: from || sendGridMailFrom,
      to,
      subject,
      content,
      attachments: [...attachments],
    };

    // Log the message being sent (without sensitive content)
    logger.info('Attempting to send email:', {
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      hasHtml: !!html,
      hasText: !!text,
    });

    try {
      await sgMail.send(msg);
      logger.info(`Email sent successfully from ${msg.from} to ${to}`);
    } catch (error: any) {
      logger.error('SendGrid error details:', {
        error: error.toString(),
        response: error.response?.body,
        statusCode: error.code,
        message: error.message,
        headers: error.response?.headers,
        name: error.name,
        stack: error.stack,
      });
      throw error;
    }
  } else {
    throw new Error(
      "To send an email 'to', 'subject', 'text' or 'html' parameters are required"
    );
  }
};
