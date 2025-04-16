import { Router } from 'express';
import { scrapeStubHubForPrice, scrapeVividSeatsForPrice } from '../controllers/scrapeController';

const router = Router();

router.post('/vs', scrapeVividSeatsForPrice);
router.post('/sh', scrapeStubHubForPrice);

export default router;
