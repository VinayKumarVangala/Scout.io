import rateLimit from 'express-rate-limit';
import { ERROR_CODES } from '@scout-io/shared';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const widgetRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute for widgets
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message: 'Too many chat requests, please slow down',
  },
});
