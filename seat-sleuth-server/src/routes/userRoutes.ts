import { Router } from 'express';

import {
  getUserInfo,
  updatePassword,
  updateUserInfo,
} from '../controllers/userController';
import { protectRoutes } from '../middleware/protectRoutes';

const router = Router();

router.get('/info', protectRoutes, getUserInfo);

router.put('/info', protectRoutes, updateUserInfo);

router.put('/password', protectRoutes, updatePassword);

export default router;
