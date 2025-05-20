import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errorHandler';

const errorHandler: ErrorRequestHandler  = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Something went wrong',
      data: null,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: null,
  });
};

export default errorHandler;
