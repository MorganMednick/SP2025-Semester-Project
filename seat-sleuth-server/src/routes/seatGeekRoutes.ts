import { Router } from 'express';
import { fetchSeatGeekEventUrl } from '../controllers/seatGeekController';

const router = Router();

router.post('/event', fetchSeatGeekEventUrl);

export default router;
