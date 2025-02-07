import { Router } from 'express';
import { checkLogin, createUser, loginUser, logoutUser } from '../controllers/authController';

const router = Router();

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/login', checkLogin);

router.post('/logout', logoutUser);

export default router;
