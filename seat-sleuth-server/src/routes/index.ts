import { Router } from 'express';
import authRoutes from './authRoutes';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Healthy!!' });
});

// router.use for all other routes goes here!
router.use('/auth', authRoutes);

export default router;
