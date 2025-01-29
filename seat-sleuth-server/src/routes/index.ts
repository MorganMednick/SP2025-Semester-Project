import { Router } from 'express';

const router = Router();

// Simple health check for express router
router.get('/health', (req, res) => {
  res.sendStatus(200).json({ message: 'Healthy!!' });
});

// router.use for all other routes goes here!

export default router;
