import { Request, Response, NextFunction } from 'express';
import { ERROR_CODES } from '@scout-io/shared';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    code: ERROR_CODES.NOT_FOUND,
    message: `Not Found - ${req.originalUrl}`,
  });
};
