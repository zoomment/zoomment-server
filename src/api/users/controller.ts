import User from './model';
import jwt from 'jsonwebtoken';
import { asyncRoute } from '@/services/express';
import { sendMagicLink } from '@/services/mailer';

export const auth = asyncRoute(async (req, res) => {
  // TODO add validation
  const email = req.body.email;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '10d',
    algorithm: 'HS256'
  });

  await sendMagicLink(token);

  res.json({});
});
