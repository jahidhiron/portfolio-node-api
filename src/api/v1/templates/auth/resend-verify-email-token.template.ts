import { config } from '../../../../config';
import { EmailContent, SignupEmailTemplateModel } from './interface';

export const resendEmailVerificationTokenTemplate = (
  data: SignupEmailTemplateModel
): EmailContent => ({
  to: data.email,
  subject: `Email Verification Link for ${config.APP_NAME}`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="text-align: center; color: #333;">Email Verification for ${config.APP_NAME}</h2>
                
                <p>Dear ${data.firstName} ${data.lastName},</p>
                
                <p>To ensure the security of your account, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${config.ADMIN_CLOUD_ORIGIN}/auth/email-verification?email=${data.email}&token=${data.code}" style="background-color: #d9534f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Verify Your Email</a>
                </div>
                
                <p>If you have any questions or need assistance, feel free to reach out to us. Our team is here to help and ensure you have a smooth and enjoyable experience with us.</p>
                
                <p>Once again, welcome aboard! We can't wait for you to explore everything <strong>${config.APP_NAME}</strong> has in store.</p>
  
                <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:${config.SENDGRID_MAIL_FROM}" style="color: #d9534f; text-decoration: none;">${config.SENDGRID_MAIL_FROM}</a>. We’re here to help!</p>
                
                <p>Best regards,</p>
                <p><strong>The ${config.APP_NAME} Team</strong></p>
            </div>
        </div>`,
});
