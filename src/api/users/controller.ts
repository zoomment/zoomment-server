import User from './model';
import Sites from '../sites/model';
import jwt from 'jsonwebtoken';
import { asyncRoute } from '@/services/express';
import { sendMagicLink } from '@/services/mailer';
import { cleanEmail } from '@/utils';

export const auth = asyncRoute(async (req, res) => {
  // TODO add validation
  const email = cleanEmail(req.body.email);

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: '1y', algorithm: 'HS256' }
  );

  await sendMagicLink(user.email, token);

  res.json({});
});

export const profile = asyncRoute(async (req, res) => {
  const user = req.user;

  res.json({
    name: user.name,
    email: user.email,
    id: user.id
  });
});

export const remove = asyncRoute(async (req, res) => {
  const userId = req.user.id;
  const { deletedCount } = await User.deleteOne({ _id: userId });

  await Sites.deleteMany({ userId });

  if (deletedCount > 0) {
    res.status(200).json({ _id: userId });
  } else {
    res.status(404).json({ message: 'Account not found' });
  }
});
