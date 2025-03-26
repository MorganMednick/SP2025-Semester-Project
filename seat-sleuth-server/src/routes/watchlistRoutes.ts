import { Router } from 'express';
import {
  addToWatchList,
  getUserWatchList,
  isUserWatching,
  removeFromWatchList,
} from '../controllers/watchlistController';

const router = Router();

router.get('/', getUserWatchList);

router.post('/', addToWatchList);

router.delete('/', removeFromWatchList);

router.post('/check', isUserWatching);

export default router;
