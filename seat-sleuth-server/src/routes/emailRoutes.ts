import { Router } from 'express';

import { sendPriceDropEmail } from '../controllers/emailController';

const router = Router();

router.post('/send-price-alert', sendPriceDropEmail);
//TODO: Morgan router.post('/add-to-watchlist', sendWatchlistEmail);

export default router;
