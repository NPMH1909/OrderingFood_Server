// utils/sendMail.js
import { transporter, MAIL_CONFIG } from '../configs/mail.config.js';

const sendMail = async ({ to, subject, html }) => {
  const mailData = {
    from: MAIL_CONFIG.FROM_EMAIL,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailData);
    console.log('📧 Email sent:', info.messageId);
    return {
      from: info.envelope.from,
      to: info.envelope.to,
      subject,
      html,
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

const sendVerificationCode = async (to, verificationCode) => {
  const subject = 'Verification Code';
  const html = `
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p><em>Note: This code will expire in 1 minute.</em></p>
  `;
  return await sendMail({ to, subject, html });
};

const sendNewPassword = async (to, newPassword) => {
  const subject = 'Forgot Password';
  const html = `<p>Your new password is: <strong>${newPassword}</strong></p>`;
  return await sendMail({ to, subject, html });
};

export { sendMail, sendVerificationCode, sendNewPassword };
