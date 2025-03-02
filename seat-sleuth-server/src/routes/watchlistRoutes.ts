import { Router } from 'express';
import {
  addToWatchList,
  getUserWatchList,
  removeFromWatchList,
} from '../controllers/watchlistController';

const router = Router();

router.get('/', getUserWatchList);

router.post('/', addToWatchList);

router.delete('/', removeFromWatchList);

export default router;
