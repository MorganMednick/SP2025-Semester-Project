import cors from 'cors';
import { Application, Response } from 'express';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, NODE_ENV } from '../config/env';

export const configureServerCookies = (app: Application): void => {
  app.use((req, res, next) => {
    if (req.path === '/api/health') {
      return next();
    }
    cors({
      origin: CLIENT_URL,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    })(req, res, next);
  });
  app.use(cookieParser());
};

export const generateCookieForResponseToClient = (
  res: Response,
  token: string
): void => {
  // Send cookie for client auth
  res.cookie('token', token, {
    httpOnly: true, // Like in 330 @ Veda :)
    secure: NODE_ENV === 'production', // We actually don't need express to verify security unless we are in prod! - J
    sameSite: 'strict'
  });
};
