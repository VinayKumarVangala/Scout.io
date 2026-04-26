import { Request, Response, NextFunction } from 'express';
import { clientCache } from '../cache/client.cache';
import { ClientModel } from '../models/Client.model';
import { ERROR_CODES } from '@scout-io/shared';

export interface TenantRequest extends Request {
  tenant?: any;
}

export const tenantMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  const clientId = req.headers['x-client-id'] || req.query.clientId;
  const origin = req.headers.origin || req.headers.referer;

  if (!clientId) {
    return res.status(401).json({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Missing Client ID',
    });
  }

  try {
    // 1. Check Cache
    let client = await clientCache.get(clientId as string);

    // 2. Fallback to DB
    if (!client) {
      client = await ClientModel.findById(clientId).lean();
      if (client) {
        await clientCache.set(clientId as string, client as any);
      }
    }

    if (!client) {
      return res.status(404).json({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Client not found',
      });
    }

    // 3. Domain Verification (Security check for widget)
    if (origin && client.domains.length > 0) {
      const isWhitelisted = client.domains.some(domain => origin.includes(domain));
      if (!isWhitelisted && process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          code: ERROR_CODES.FORBIDDEN,
          message: 'Domain not authorized',
        });
      }
    }

    // 4. Attach to Request
    req.tenant = client;
    next();
  } catch (error) {
    next(error);
  }
};
