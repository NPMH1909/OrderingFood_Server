import { MAIL_CONFIG } from "../configs/mail.config.js"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    port: 465,
    host: MAIL_CONFIG.SMTP_HOST,
    auth: {
      user: MAIL_CONFIG.GOOGLE_GMAIL,
      pass: MAIL_CONFIG.GOOGLE_KEY
    },
    secure: true
  })
  const sendMail = ({ to, subject, html }) => {
    const mailData = {
      from: 'Group 13',
      to,
      subject,
      html
    }
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        return err
      } else {
        return info.messageId
      }
    })
  }



  const sendVerificationCode = async (to, verificationCode) => {
    const subject = 'Verification Code'
    const html = `
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p><em>Note: This code will expire in 1 minute.</em></p>
    `;
    transporter.sendMail({ to, subject, html }, (err, info) => {
      if (err) {
        throw err
      } else {
        return info.messageId
      }
    })
  }
  
  export {sendMail, sendVerificationCode}