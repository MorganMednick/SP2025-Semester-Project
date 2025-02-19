import { execSync } from 'child_process';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default async () => {
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
};
