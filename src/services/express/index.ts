import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/api/users/model';

export const asyncRoute =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const auth = (): RequestHandler => {
  return async (req, res, next) => {
    const headerToken = req.headers.token;

    if (!headerToken || Array.isArray(headerToken)) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(headerToken, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findById(decoded.id);

      if (user && !user.isVerified) {
        user.isVerified = true;
        await user.save();
      }

      req.user = user;
      next();
    } catch (e) {
      next();
    }
  };
};

export const access = (level?: 'admin' | 'superAdmin'): RequestHandler => {
  return async (req, res, next) => {
    if (!req.user) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    if (!level) {
      next();
    } else if (level && req.user.role === 2) {
      next();
    } else if (level === 'admin' && req.user.role === 1) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
