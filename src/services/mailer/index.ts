import nodemailer from 'nodemailer';
const dayjs = require('dayjs');
import { TComment } from '@/types';

if (!process.env.ADMIN_EMAIL_ADDR) {
  console.warn(
    'WARNIGN: ADMIN_EMAIL_ADDR Admin email is not present, you will not be notified about new emails.'
  );
}

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.BOT_EMAIL_ADDR,
    pass: process.env.BOT_EMAIL_PASS
  }
});

export async function newCommentNotification(comment: TComment) {
  if (!process.env.ADMIN_EMAIL_ADDR) {
    return;
  }
  const date = dayjs(comment.createdAt).format('DD MMM YYYY - HH:mm');
  await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: process.env.ADMIN_EMAIL_ADDR,
    subject: 'You have a new comment!',
    html: `
      <div style="padding: 20px;">
        <img width="50" src="https://www.gravatar.com/avatar/${comment.owner.gravatar}?d=monsterid">
        <div style="font-size: 14px; line-height: 27px; margin-top: 10px;"> 
          <div><b>User:</b> ${comment.owner.name}</div>
          <div><b>Email:</b> ${comment.owner.email}</div>
          <div><b>Date:</b> ${date}</div>
          <div><b>Page:</b> ${comment.pageUrl}</div>
          <div><b>Comment:</b> ${comment.body}</div>
        </div>
        <div style="padding-top: 20px; font-size: 12px;">
          [<a href="${process.env.API_URL}/comments/${comment._id}/delete?secret=${comment.secret}">Discard</a>]
        </div>
			<div>
		`
  });
}

export async function sendMagicLink(authToken: string) {
  if (!process.env.ADMIN_EMAIL_ADDR) {
    return;
  }

  return await transporter.sendMail({
    from: `"${process.env.BRAND_NAME}" <${process.env.BOT_EMAIL_ADDR}>`,
    to: process.env.ADMIN_EMAIL_ADDR,
    subject: 'You have a new comment!',
    html: `
      <div style="padding: 20px;">
        <h4>Click the link below to sign in to your ${process.env.BRAND_NAME} dashboard.</h4>
        <a href="${process.env.DASHBOARD_URL}/dashboard?token=${authToken}" target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">Sign in to ${process.env.BRAND_NAME}</a>
        <p>
          If you did not make this request, you can safely ignore this email.
        </p>
			<div>
		`
  });
}
