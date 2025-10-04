import { Request, Response, NextFunction } from 'express';
import { Logger } from './logger';

// Middleware de logging HTTP próprio (substitui Morgan)
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Captura resposta original
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    const contentLength = res.get('content-length') || Buffer.byteLength(data || '', 'utf8');
    
    // Log da requisição HTTP
    Logger.info('http', 'Request processed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      contentLength,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString()
    });
    
    return originalSend.call(this, data);
  };
  
  next();
};