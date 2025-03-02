import { Request, Response, NextFunction } from 'express';

export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new Error("User not logged in. Session invalid.")
  }
  next();
};
