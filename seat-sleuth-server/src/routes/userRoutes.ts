import { Router } from 'express';

import {
  getUserInfo,
  updatePassword,
  updateUserInfo,
  addToWatchList,
} from '../controllers/userController';

const router = Router();

// TODO: Protect auth routes

router.get('/info', getUserInfo);

router.put('/info', updateUserInfo);

router.put('/watchlist', addToWatchList);

router.get('/watchlist')

router.put('/password', updatePassword);

export default router;
