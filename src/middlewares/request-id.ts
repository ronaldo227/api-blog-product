import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
