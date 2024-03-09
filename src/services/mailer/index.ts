import nodemailer from 'nodemailer';
const dayjs = require('dayjs');
import { TComment } from '@/types';

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.BOT_EMAIL_ADDR,
    pass: process.env.BOT_EMAIL_PASS
  }
});

export async function newCommentNotification(userEmail: string, comment: TComment) {
  const date = dayjs(comment.createdAt).format('DD MMM YYYY - HH:mm');
  await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: userEmail,
    subject: 'You have a new comment!',
    html: `
      <div style="padding: 20px;">
        <img width="50" src="https://www.gravatar.com/avatar/${comment.gravatar}?d=monsterid">
        <div style="font-size: 14px; line-height: 27px; margin-top: 10px;"> 
          <div><b>User:</b> ${comment.author}</div>
          <div><b>Email:</b> ${comment.email}</div>
          <div><b>Date:</b> ${date}</div>
          <div><b>Page:</b> ${comment.pageUrl}</div>
          <div><b>Comment:</b> ${comment.body}</div>
        </div>
        <div style="padding-top: 20px;">
          <a href="${process.env.DASHBOARD_URL}/auth" style="border: none; border-radius: 8px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 10px 15px; text-decoration: none; text-transform: capitalize; background-color: #1677ff; color: #ffffff;">Sign in to manage comments</a>
        </div>
			<div>
		`
  });
}

export async function sendMagicLink(userEmail: string, authToken: string) {
  return await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: userEmail,
    subject: `Sign in to ${process.env.BRAND_NAME}`,
    html: `
      <div style="padding: 20px;">
        <h4 style="margin-bottom: 10px;">Click the link below to sign in to your ${process.env.BRAND_NAME} dashboard.</h4>
        <a href="${process.env.DASHBOARD_URL}/dashboard?token=${authToken}" target="_blank" style="border: none; border-radius: 8px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 10px 15px; text-decoration: none; text-transform: capitalize; background-color: #1677ff; color: #ffffff;">Sign in to ${process.env.BRAND_NAME}</a>
        <p style="margin-top: 10px;">
          If you did not make this request, you can safely ignore this email.
        </p>
			<div>
		`
  });
}
