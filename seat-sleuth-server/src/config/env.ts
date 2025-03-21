import { RUN_ENVIRONMENTS } from '../data/constants';

export const { DATABASE_URL, CLIENT_URL, NODE_ENV, SESSION_SECRET, TM_BASE_URL, TM_API_KEY, SG_BASE_URL, SG_CLIENT_ID } =
  process.env;

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
