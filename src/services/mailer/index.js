import nodemailer from 'nodemailer';
import moment from 'moment';

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.BOT_EMAIL_ADDR,
    pass: process.env.BOT_EMAIL_PASS
  }
});

export async function newCommentNotification(comment) {
  const date = moment(comment.createdAt).format('DD.MMM.YYYY - HH:mm');
  await transporter.sendMail({
    from: `"FooCommmets" <${process.env.BOT_EMAIL_ADDR}>`,
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
