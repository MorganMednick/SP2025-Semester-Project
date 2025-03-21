import { Router } from 'express';

import { sendPriceDropEmail } from '../controllers/emailController';

const router = Router();

router.get('/send-price-alert', sendPriceDropEmail);

export default router;
