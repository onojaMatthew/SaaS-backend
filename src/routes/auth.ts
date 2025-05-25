import { Router } from 'express';
import { login, me, register, registerReader, signin } from '../controller/auth/controller';
import { validate } from '../validation';
import { userInputSchema } from '../validation/business.validator';
import { loginInputSchema } from '../validation/user.validator';

const router = Router();

router.post('/auth/business/register', validate(userInputSchema) as any, register);
router.post('/auth/business/login', validate(loginInputSchema) as any, login);
router.get('/auth/me', me);
router.post("/auth/user/register", validate(loginInputSchema) as any, registerReader);
router.post("/auth/user/login", validate(loginInputSchema) as any, signin);

export { router as AuthRoutes };