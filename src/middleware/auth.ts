import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errorHandler';
import { Reader } from '../models/reader';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError("Access denied, no token provided", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      businessId: string;
      role: string;
    };
    // Get user from database
    let user;

    user = await User.findById(decoded.id).select('-password');
    if (!user) user = await Reader.findById(decoded.id).select('-password');
    
    // Attach user and business to request
    req.user = user;
    req.businessId = decoded.businessId;

    next();
  } catch (error) {
    Logger.error('Authentication error:', error);
    return next(new AppError("Not authorized", 401));
  }
};

// Role-based access control middleware
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};