import { config } from '../../../../config';
import { UserModel } from '../../modules/user/interface/user-model.interface';
import { EmailContent, SignupEmailTemplateModel } from './interface';

export const changePasswordTemplate = (
  user: SignupEmailTemplateModel
): EmailContent => ({
  to: user.email,
  subject: `Your Password has been Successfully Changed - ${config.APP_NAME}`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="text-align: center; color: #333;">Password Change Confirmation</h2>
                  
                  <p>Dear ${user.firstName} ${user.lastName},</p>
                  
                  <p>This email is to confirm that the password for your <strong>${config.APP_NAME}</strong> account has been successfully changed.</p>
                  
                  <p>If you did not initiate this change, please contact our support team immediately at <a href="mailto:${config.SENDGRID_MAIL_FROM}" style="color: #d9534f; text-decoration: none;">${config.SENDGRID_MAIL_FROM}</a>. Ensuring the security of your account is our top priority, and we are here to assist you.</p>
                  
                  <p>Thank you for choosing <strong>${config.APP_NAME}</strong>. We appreciate having you as part of our community.</p>
                  
                  <p>Best regards,</p>
                  <p><strong>The ${config.APP_NAME} Team</strong></p>
              </div>
          </div>`,
});
