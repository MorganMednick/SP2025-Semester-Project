import cors from 'cors';
import { Application } from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, NODE_ENV, SESSION_SECRET, DATABASE_URL } from '../config/env';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const configureCors = (app: Application): void => {
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
      allowedHeaders: ['Content-Type'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  );
};

export const configureServerCookies = (app: Application): void => {
  app.use(cookieParser());
};

export const configureServerSession = (app: Application): void => {
  app.use(
    session({
      store: new (pgSession(session))({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
};
