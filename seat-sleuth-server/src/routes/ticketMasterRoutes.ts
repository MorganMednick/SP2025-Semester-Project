import { Router } from 'express';

import { fetchTicketMasterEvents } from '../controllers/ticketMasterController';

const router = Router();

router.post('/events', fetchTicketMasterEvents);

export default router;
