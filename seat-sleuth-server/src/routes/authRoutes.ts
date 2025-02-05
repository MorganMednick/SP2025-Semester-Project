import { Router } from 'express';
import { checkLogin, createUser, loginUser } from '../controllers/authController';

const router = Router();

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/login', checkLogin);

export default router;
