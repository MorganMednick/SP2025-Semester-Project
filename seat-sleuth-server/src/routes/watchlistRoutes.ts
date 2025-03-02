import { Router } from 'express';
import { addToWatchList, getUserWatchList, removeFromWatchList } from '../controllers/watchlistController';
import { protectRoutes } from '../middleware/protectRoutes';


const router = Router();

router.get('/', protectRoutes, getUserWatchList);

router.post('/', protectRoutes, addToWatchList);

router.delete('/', protectRoutes, removeFromWatchList);

export default router;
