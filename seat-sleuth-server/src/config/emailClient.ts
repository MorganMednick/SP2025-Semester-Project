import nodemailer from 'nodemailer';
import { GMAIL_EMAIL, GMAIL_PASSWORD } from './env';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string[], subject: string, html: string): Promise<string> => {
  const info = await transporter.sendMail({
    from: '"SeatSleuth" <seatsleuth@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });

  console.info(`Email sent under id: ${info.messageId}`);
  return info.messageId;
};
