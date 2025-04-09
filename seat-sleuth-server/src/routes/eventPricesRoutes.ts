import { Router } from 'express';
import { fetchPricesForEvent } from '../controllers/eventPricesController';

const router = Router();

router.get('/prices', fetchPricesForEvent);

export default router;
