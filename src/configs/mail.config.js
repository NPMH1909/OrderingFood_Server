// import dotenv from 'dotenv'

// dotenv.config()
// export const MAIL_CONFIG = {
//   SMTP_HOST: process.env.SMTP_HOST,
//   GOOGLE_GMAIL: process.env.GOOGLE_GMAIL,
//   GOOGLE_KEY: process.env.GOOGLE_KEY
// }

// configs/mail.config.js
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const transporter = nodemailer.createTransport({
  SES: { ses, aws: AWS },
});

export const MAIL_CONFIG = {
  FROM_EMAIL: process.env.SES_FROM_EMAIL,
};
