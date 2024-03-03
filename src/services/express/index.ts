import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/api/users/model';

export const asyncRoute =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
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
      req.user = user;
      next();
      return;
    } catch (e) {
      next();
    }
  };
};
