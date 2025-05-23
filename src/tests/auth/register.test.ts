import request from 'supertest';
import app from "../../app"
import * as AuthController from "../../controller/auth/controller";
import { AuthService } from '../../services/auth/service';
import { User } from '../../models/user';
// import { AppError } from '../../src/utils/errorHandler';

jest.mock('../../services/auth/service');
jest.mock('../../models/user');

// const app: Application = express();
// app.use(express.json());
// app.post('/register', AuthController.register);
// app.post('/reader-register', AuthController.registerReader);
// app.post('/login', AuthController.login);
// app.post('/signin', AuthController.signin);
// app.get('/me', AuthController.me);

// Helper to mock user in token verification
(AuthService.verifyToken as jest.Mock).mockResolvedValue({ user: { id: '123', email: 'test@example.com' } });

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if user already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app).post('/register').send({
        name: 'John',
        email: 'test@example.com',
        password: 'pass123',
        businessName: 'MyBiz',
        role: 'admin'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already taken');
    });

    it('should register a new user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (AuthService.register as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'new@example.com' },
        token: 'token123',
        business: { name: 'MyBiz' }
      });

      const response = await request(app).post('/register').send({
        name: 'Jane',
        email: 'new@example.com',
        password: 'pass123',
        businessName: 'MyBiz',
        role: 'admin'
      });

      expect(response.status).toBe(201);
      expect(response.body.data.user.email).toBe('new@example.com');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      (AuthService.login as jest.Mock).mockResolvedValue({
        user: { id: '1', email: 'login@example.com' },
        token: 'token456',
        business: { name: 'Biz' }
      });

      const response = await request(app).post('/login').send({
        email: 'login@example.com',
        password: 'password'
      });

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBe('token456');
    });
  });

  describe('me', () => {
    it('should return user from token', async () => {
      const response = await request(app)
        .get('/me')
        .set('Authorization', 'Bearer token123');

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/me');
      expect(response.status).toBe(401);
    });
  });
});