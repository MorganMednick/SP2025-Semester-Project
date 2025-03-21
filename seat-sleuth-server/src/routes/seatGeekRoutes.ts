import { Router } from 'express';

import { fetchTicketMasterEvents } from '../controllers/ticketMasterController';
import { fetchSeatGeekEventUrl } from '../controllers/seatGeekController';

const router = Router();

router.post('/event', fetchSeatGeekEventUrl);

export default router;
