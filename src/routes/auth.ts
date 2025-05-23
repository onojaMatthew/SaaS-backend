import { Router } from 'express';
import { login, me, register, registerReader, signin } from '../controller/auth/controller';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', me);
router.post("/auth/signup", registerReader);
router.post("/auth/reader/login", signin);

export { router as AuthRoutes };