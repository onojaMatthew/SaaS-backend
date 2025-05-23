import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../services/auth/service';
import { User } from '../../models/user';
import { AppError } from '../../utils/errorHandler';
import { Logger } from '../../utils/logger';
import { Reader } from '../../models/reader';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, businessName, role } = req.body;
   
    const itExists = await User.findOne({ email });
    if (itExists) { 
      return next(new AppError("Email already taken", 400));
    }

    const { user, token, business } = await AuthService.register(
      name,
      email,
      password,
      businessName,
      role
    );

    res.status(201).json({ success: true, data: { user, business, token }, message: 'Registration successful' });
  } catch (error: any) {
    Logger.error(error.message)
    next(new AppError("Failed to register", 500));
  }
}

export const registerReader = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const { user, token } = await AuthService.registerReader(
      email,
      password,
      role
    );
    console.log("after auth class operation")
    res.status(201).json({ success: true, data: { user, token }, message: 'Registration successful' });
  } catch (error: any) {
    Logger.error(error.message)
    next(new AppError("Failed to register", 500));
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token, business } = await AuthService.login(email, password);
    res.json({ success: true, data: {user, token, business}, message: 'Login successful' });
  } catch (error: any) {
    Logger.error(error.message)
    return next(new AppError("Failed to log in", 500));
    
  }
}

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    const { user } = await AuthService.verifyToken(token);

    res.json({ success: true, message: 'User retrieved successfully', data: user });
  } catch (error: any) {
    Logger.error(error.message);
    return next(new AppError("Internal Server Error", 500));
  }
}