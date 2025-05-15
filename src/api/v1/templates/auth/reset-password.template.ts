import { config } from '../../../../config';
import { UserModel } from '../../modules/user/interface/user-model.interface';
import { EmailContent, SignupEmailTemplateModel } from './interface';

export const resetPasswordTemplate = (
  user: SignupEmailTemplateModel
): EmailContent => ({
  to: user.email,
  subject: `Password Reset Confirmation`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="text-align: center; color: #333;">Password Reset Confirmation</h2>
                  
                  <p>Dear ${user.firstName} ${user.lastName},</p>
                  
                  <p>This is to confirm that the password for your account at <strong>${config.APP_NAME}</strong> has been successfully reset.</p>
                  
                  <p>If you initiated this password reset, you can now log in to your account using your new password.</p>
                  
                  <p>If you did not request this password reset, or if you have any concerns about the security of your account, please contact our support team immediately at <a href="mailto:${config.SENDGRID_MAIL_FROM}" style="color: #d9534f; text-decoration: none;">${config.SENDGRID_MAIL_FROM}</a>. Your security is our priority, and we’re here to help.</p>
                  
                  <p>Thank you for choosing <strong>${config.APP_NAME}</strong>. We’re glad to have you with us.</p>
                  
                  <p>Best regards,</p>
                  <p><strong>The ${config.APP_NAME} Team</strong></p>
              </div>
          </div>`,
});
