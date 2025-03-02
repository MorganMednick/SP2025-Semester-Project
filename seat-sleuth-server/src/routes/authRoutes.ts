import { Router } from 'express';

import { checkLogin, createUser, loginUser, logoutUser } from '../controllers/authController';
import { protectRoutes } from '../middleware/protectRoutes';

const router = Router();

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/login', protectRoutes, checkLogin);

router.post('/logout', logoutUser);

export default router;
