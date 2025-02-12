import { Router } from 'express';
import authRoutes from './authRoutes';
import ticketMasterRoutes from './ticketMasterRoutes';
import { StatusCodes } from 'http-status-codes';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

// router.use for all other routes goes here!
router.use('/auth', authRoutes);

router.use('/tm', ticketMasterRoutes);

export default router;
