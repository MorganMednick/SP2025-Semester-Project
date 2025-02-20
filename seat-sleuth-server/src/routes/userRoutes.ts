import { Router } from 'express';

import { getUserInfo } from '../controllers/userController';

const router = Router();

router.get('/settings', getUserInfo);

export default router;
