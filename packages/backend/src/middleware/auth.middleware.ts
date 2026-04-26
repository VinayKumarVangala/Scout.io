import { Response, NextFunction } from 'express';
import { jwtService } from '../services/jwt.service';
import { TenantRequest } from './tenant.middleware';
import { ERROR_CODES } from '@scout-io/shared';

export const authMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Authorization token required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwtService.verifyToken(token);
    
    // Ensure the token matches the tenant context if present
    if (req.tenant && payload.clientId !== req.tenant._id.toString()) {
      return res.status(403).json({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Token does not match client context',
      });
    }

    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid or expired token',
    });
  }
};

export const adminAuthMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Static Admin Key for PoC/Initial setup
  const adminKey = req.headers['x-admin-key'];
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    return next();
  }

  return res.status(403).json({
    code: ERROR_CODES.FORBIDDEN,
    message: 'Admin access required',
  });
};
