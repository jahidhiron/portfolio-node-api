import { UserModel } from '../../modules/user/interface/user-model.interface';
import { config } from '../../../../config';
import { EmailContent, SignupEmailTemplateModel } from './interface';

export const forgotPasswordTokenTemplate = (
  data: SignupEmailTemplateModel
): EmailContent => ({
  to: data.email,
  subject: `Password Reset Link for Your ${config.APP_NAME} Account`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="text-align: center; color: #333;">Hello ${data.firstName} ${data.lastName},</h2>
                  
                  <p>We have received a request to reset your password for your <strong>${config.APP_NAME}</strong> account.</p>
                  
                  <p>To proceed, please click the button below to change your password. This link is valid for a limited time to ensure the security of your account.</p>
                  
                  <div style="text-align: center; margin: 20px 0;">
                  <a href="${config.ADMIN_CLOUD_ORIGIN}/auth/reset-password?email=${data.email}&token=${data.code}" style="background-color: #d9534f; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Change Password</a>
                  </div>
                  
                  <p>If you didn’t request a password reset, please ignore this email. Your password will remain unchanged, and your account will remain secure.</p>
                  
                  <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:${config.SENDGRID_MAIL_FROM}" style="color: #d9534f; text-decoration: none;">${config.SENDGRID_MAIL_FROM}</a>. We’re here to help!</p>
                  
                  <p>Best regards,</p>
                  <p><strong>The ${config.APP_NAME} Team</strong></p>
              </div>
              </div>`,
});
