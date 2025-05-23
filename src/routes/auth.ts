import { Router } from 'express';
import { login, me, register, registerReader } from '../controller/auth/controller';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', me);
router.post("/auth/signup", registerReader);

export { router as AuthRoutes };