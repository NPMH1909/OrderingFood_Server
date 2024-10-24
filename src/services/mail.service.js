import { MAIL_CONFIG } from "../configs/mail.config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    port: 465,
    host: MAIL_CONFIG.SMTP_HOST,
    auth: {
        user: MAIL_CONFIG.GOOGLE_GMAIL,
        pass: MAIL_CONFIG.GOOGLE_KEY,
    },
    secure: true,
});

const sendMail = async ({ to, subject, html }) => {
  const mailData = {
      from: MAIL_CONFIG.GOOGLE_GMAIL, 
      to,
      subject,
      html,
  };
  await transporter.sendMail(mailData);
//   try {
//       const info = await transporter.sendMail(mailData);
//       const result = {
//           from: info.envelope.from,
//           to: info.envelope.to,   
//           subject: subject,
//           html: html,
//       };
//       return result; 
//   } catch (err) {
//       throw err; 
//   }
};

const sendVerificationCode = async (to, verificationCode) => {
    console.log('code',verificationCode)
    const subject = 'Verification Code';
    const html = `
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p><em>Note: This code will expire in 1 minute.</em></p>
    `;
    await sendMail({ to, subject, html })
    // try {
    //     const result = await sendMail({ to, subject, html })
    //     return true
    // } catch (error) {
    //     return false
    // }
};

const sendNewPassword = async (to, newPassword) => {
    const subject = 'Forgot Password';
    const html = `<p>Your new password is: <strong>${newPassword}</strong></p>`;
    const result = await sendMail({ to, subject, html }); 
    // try {
    //     const result = await sendMail({ to, subject, html }); 
    //     return result
    //   } catch (error) {
    //     throw error
    //   }
};

export { sendMail, sendVerificationCode, sendNewPassword }
