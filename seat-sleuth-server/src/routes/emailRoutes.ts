import { Router } from 'express';

import { sendPriceDropEmail } from '../controllers/emailController';

const router = Router();

router.post('/send-price-alert', sendPriceDropEmail);

export default router;
