import { config } from '../../../../config';
import { EmailContent, SignupEmailTemplateModel } from './interface';

export const signupEmailTemplate = (
  user: SignupEmailTemplateModel
): EmailContent => ({
  to: user.email,
  subject: `Welcome to ${config.APP_NAME}`,
  html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="text-align: center; color: #333;">Welcome to ${config.APP_NAME}, ${user.firstName} ${user.lastName}!</h2>
              <p>We're thrilled to have you join our community at <strong>${config.APP_NAME}</strong>! 🎉</p>
              <p>You're now one step closer to unlocking a world of exclusive products and deals. Your account has been successfully created, and you're ready to explore all that we have to offer.</p>
              
              <p>To ensure the security of your account, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${config.ADMIN_CLOUD_ORIGIN}/auth/email-verification?email=${user.email}&token=${user.code}" style="background-color: #d9534f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Verify Your Email</a>
              </div>
              
              <p>If you have any questions or need assistance, feel free to reach out to us. Our team is here to help and ensure you have a smooth and enjoyable experience with us.</p>
              
              <p>Once again, welcome aboard! We can't wait for you to explore everything <strong>${config.APP_NAME}</strong> has in store.</p>
              
              <p>Best regards,</p>
              <p><strong>The ${config.APP_NAME} Team</strong></p>
          </div>
      </div>`,
});
