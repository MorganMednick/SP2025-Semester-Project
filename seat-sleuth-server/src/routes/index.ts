import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import authRoutes from './authRoutes';
import ticketMasterRoutes from './ticketMasterRoutes';
import userRoutes from './userRoutes';
import watchlistRoutes from './watchlistRoutes';
import scrapeRoutes from './scrapeRoutes';
import { protectRoutes } from '../middleware/protectRoutes';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
});

// router.use for all other routes goes here!
router.use('/auth', authRoutes);

router.use('/tm', ticketMasterRoutes);

router.use('/scrape', scrapeRoutes);

router.use('/user', protectRoutes, userRoutes);

router.use('/watchlist', protectRoutes, watchlistRoutes);

export default router;
