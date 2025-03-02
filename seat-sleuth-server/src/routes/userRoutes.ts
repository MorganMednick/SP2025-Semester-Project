import { Router } from 'express';

import { getUserInfo, updatePassword, updateUserInfo } from '../controllers/userController';

const router = Router();

router.get('/info', getUserInfo);

router.put('/info', updateUserInfo);

router.put('/password', updatePassword);

export default router;
