import dotenv from 'dotenv';
import { RUN_ENVIRONMENTS } from '../data/constants';

dotenv.config();

export const { DATABASE_URL, JWT_SECRET, CLIENT_URL, NODE_ENV } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    '\n\nDATABASE_URL is not defined in your environment variables.\n\n'
  );
}

if (!JWT_SECRET) {
  throw new Error(
    `\n\nJWT_SECRET must be set in your .env to run this application. Need to generate one? Try running: \nopenssl rand -base64 64\nin your terminal!\n\n\n`
  );
}

if (!CLIENT_URL) {
  throw new Error(
    `\n\CLIENT_URL must be set in your .env to run this application. \n\n\n`
  );
}

if (NODE_ENV && RUN_ENVIRONMENTS.includes(NODE_ENV)) {
} else {
  throw new Error(
    `\n\NODE_ENV must be set in your .env to run this application. Possible runtime options are: ${RUN_ENVIRONMENTS.toString()}\n\n\n`
  );
}
