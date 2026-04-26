import { Request, Response, NextFunction } from 'express';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. NoSQL Injection Prevention (Simple regex for $)
  const hasNoSqlInjection = (obj: any): boolean => {
    if (typeof obj !== 'object' || obj === null) return false;
    for (const key in obj) {
      if (key.startsWith('$')) return true;
      if (hasNoSqlInjection(obj[key])) return true;
    }
    return false;
  };

  if (hasNoSqlInjection(req.body) || hasNoSqlInjection(req.query)) {
    return res.status(400).json({ error: 'Potential NoSQL Injection detected' });
  }

  // 2. Path Traversal Prevention
  const pathTraversalPattern = /(\.\.\/|\.\.\\)/;
  if (pathTraversalPattern.test(req.url) || pathTraversalPattern.test(JSON.stringify(req.body))) {
    return res.status(400).json({ error: 'Potential Path Traversal detected' });
  }

  // 3. XSS Protection Headers (Already handled by helmet, but can add custom filters here)
  
  next();
};
