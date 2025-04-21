import { RUN_ENVIRONMENTS } from '../data/constants';
export const {
  DATABASE_URL, // FATAL
  CLIENT_URL, // FATAL
  NODE_ENV, // FATAL
  SESSION_SECRET, // FATAL
  TM_BASE_URL, // FATAL
  TM_API_KEY, // FATAL
  GMAIL_EMAIL, // FATAL
  GMAIL_PASSWORD, // FATAL
  WATCHLIST_EMAIL_CRON, // NOT FATAL
  PRICE_UPDATE_CRON, // NOT FATAL
} = process.env;

if (!DATABASE_URL) {
  throw new Error('\n\nDATABASE_URL is not defined in your environment variables.\n\n');
}

if (!CLIENT_URL) {
  throw new Error(`\n\nCLIENT_URL must be set in your .env to run this application. \n\n\n`);
}

if (!SESSION_SECRET) {
  throw new Error(`\n\nSESSION_SECRET must be set in your .env to run this application. \n\n\n`);
}

if (!(NODE_ENV && (RUN_ENVIRONMENTS.includes(NODE_ENV) || NODE_ENV === 'test'))) {
  throw new Error(
    `\n\nNODE_ENV must be set in your .env to run this application. Possible runtime options are: ${RUN_ENVIRONMENTS.toString()}\n\n\n`,
  );
}

if (!TM_BASE_URL) {
  throw new Error(`\n\nTM_BASE_URL must be set in your .env to run this application. \n\n\n`);
}

if (!TM_API_KEY) {
  throw new Error(`\n\nTM_API_KEY must be set in your .env to run this application. \n\n\n`);
}

if (!GMAIL_EMAIL) {
  throw new Error(`\n\nGMAIL_EMAIL must be set in your .env to run this application. \n\n\n`);
}

if (!GMAIL_EMAIL) {
  throw new Error(`\n\nGMAIL_PASSWORD must be set in your .env to run this application. \n\n\n`);
}
