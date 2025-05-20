import { Router } from 'express';
import { login, me, register } from '../controller/auth/controller';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', me);

export { router as AuthRoutes };