/* eslint-disable no-unused-vars */
import { TUser } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: TUser | null;
    }
  }
}

export {};
