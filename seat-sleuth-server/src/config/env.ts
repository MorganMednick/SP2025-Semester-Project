import dotenv from 'dotenv';

dotenv.config();

export const { DATABASE_URL, JWT_SECRET } = process.env;

if (!DATABASE_URL) {
  throw new Error('\n\nDATABASE_URL is not defined in your environment variables.\n\n');
}

if (!JWT_SECRET) {
  throw new Error(`\n\nJWT_SECRET must be set in your .env to run this application. Need to generate one? Try running: \nopenssl rand -base64 64\nin your terminal!\n\n\n`);
}
