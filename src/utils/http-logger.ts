import { Request, Response, NextFunction } from 'express';
import { Logger } from './logger';

/**
 * Middleware de logging HTTP customizado
 * 
 * Implementação própria que substitui a dependência `morgan`.
 * Registra informações detalhadas sobre cada requisição HTTP incluindo:
 * - Método e URL da requisição
 * - Status code da resposta
 * - Tempo de processamento
 * - Tamanho do conteúdo
 * - User Agent e IP do cliente
 * 
 * @param req - Objeto Request do Express
 * @param res - Objeto Response do Express  
 * @param next - Função NextFunction para continuar o pipeline
 * 
 * @example
 * ```typescript
 * // Uso no server.ts
 * app.use(httpLogger);
 * 
 * // Log gerado:
 * // info: [http] Request processed {"method":"GET","url":"/api/posts","status":200,"duration":"45ms",...}
 * ```
 */
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