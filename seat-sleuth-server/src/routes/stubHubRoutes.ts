import { Router } from 'express';

import { scrapeStubHubController } from '../controllers/stubHubController';

const router = Router();

router.post('/scrape', scrapeStubHubController);

export default router;
