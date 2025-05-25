import { Router } from 'express';
import { login, me, register, registerReader, signin } from '../controller/auth/controller';

const router = Router();

router.post('/auth/business/register', register);
router.post('/auth/business/login', login);
router.get('/auth/me', me);
router.post("/auth/user/register", registerReader);
router.post("/auth/user/login", signin);

export { router as AuthRoutes };