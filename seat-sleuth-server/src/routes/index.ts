import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import authRoutes from './authRoutes';
import ticketMasterRoutes from './ticketMasterRoutes';
import userRoutes from './userRoutes';
import watchlistRoutes from './watchlistRoutes';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

// router.use for all other routes goes here!
router.use('/auth', authRoutes);

router.use('/tm', ticketMasterRoutes);

router.use('/user', userRoutes);

router.use('/watchlist', watchlistRoutes);

export default router;
