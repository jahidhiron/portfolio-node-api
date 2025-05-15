import { config } from '../../../../config';
import { UserModel } from '../../modules/user/interface/user-model.interface';
import { EmailContent } from './interface';

export const emailVerificationConfirmationTemplate = (
  user: UserModel
): EmailContent => ({
  to: user.email,
  subject: `Email Verification Confirmation - Welcome to ${config.APP_NAME}!`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="text-align: center; color: #333;">Welcome to ${config.APP_NAME}, ${user.firstName} ${user.lastName}!</h2>
                
                <p>We are thrilled to welcome you to <strong>${config.APP_NAME}</strong>! Your email address has been successfully verified, completing your registration with us.</p>
                
                <p>This verification step allows us to communicate with you effectively and securely, ensuring you have access to all the exclusive features and benefits our platform provides.</p>
                
                <p>Thank you for confirming your email address. We’re excited to have you as part of our community, and we look forward to supporting you on your journey with us!</p>
                
                <p>If you have any questions or need assistance, please feel free to reach out to our support team at <a href="mailto:${config.SENDGRID_MAIL_FROM}" style="color: #d9534f; text-decoration: none;">${config.SENDGRID_MAIL_FROM}</a>. We’re here to help!</p>
                
                <p>Best regards,</p>
                <p><strong>The ${config.APP_NAME} Team</strong></p>
            </div>
        </div>`,
});
