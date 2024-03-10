import nodemailer from 'nodemailer';
const dayjs = require('dayjs');
import { TComment } from '@/types';
import { generateTemplate } from './template';

const transporter = nodemailer.createTransport({
  port: parseInt(`${process.env.BOT_EMAIL_PORT}`) || 465,
  host: process.env.BOT_EMAIL_HOST || 'smtp.gmail.com',
  secure: true,
  auth: {
    user: process.env.BOT_EMAIL_ADDR,
    pass: process.env.BOT_EMAIL_PASS
  }
});

export async function newCommentNotification(userEmail: string, comment: TComment) {
  const date = dayjs(comment.createdAt).format('DD MMM YYYY - HH:mm');
  const template = generateTemplate({
    introduction: `
      <img width="50" src="https://www.gravatar.com/avatar/${comment.gravatar}?d=monsterid">
      <div style="font-size: 14px; line-height: 27px; margin-top: 10px;"> 
        <div><b>User:</b> ${comment.author}</div>
        <div><b>Email:</b> ${comment.email}</div>
        <div><b>Date:</b> ${date}</div>
        <div><b>Page:</b> ${comment.pageUrl}</div>
        <div><b>Comment:</b> ${comment.body}</div>
      </div>
    `,
    buttonUrl: `${process.env.DASHBOARD_URL}/auth`,
    buttonText: 'Sign in to manage comments',
    epilogue: ''
  });

  await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: userEmail,
    subject: 'You have a new comment!',
    html: template
  });
}

export async function sendMagicLink(userEmail: string, authToken: string) {
  const template = generateTemplate({
    introduction: `Click the link below to sign in to your ${process.env.BRAND_NAME} dashboard.`,
    buttonUrl: `${process.env.DASHBOARD_URL}/dashboard?token=${authToken}`,
    buttonText: `Sign in to ${process.env.BRAND_NAME}`,
    epilogue: 'If you did not make this request, you can safely ignore this email.'
  });

  return await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: userEmail,
    subject: `Sign in to ${process.env.BRAND_NAME}`,
    html: template
  });
}
