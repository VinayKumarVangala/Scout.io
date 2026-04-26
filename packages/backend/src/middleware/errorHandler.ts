import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '@scout-io/shared';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;

  console.error(`[Error] ${errorCode}: ${err.message}`, {
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    status: 'error',
    code: errorCode,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
