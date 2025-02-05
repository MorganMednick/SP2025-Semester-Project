import { Router } from 'express';
import authRoutes from './authRoutes';
import { StatusCodes } from 'http-status-codes';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

// router.use for all other routes goes here!
router.use('/auth', authRoutes);

export default router;
