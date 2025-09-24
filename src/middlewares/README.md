# Middlewares: Funções Intermediárias Express

Esta pasta contém middlewares Express para autenticação, segurança, validação, tratamento de erros, rate limiting e outras funções intermediárias executadas entre a requisição e a resposta.

## Padrão adotado
- Separe middlewares por responsabilidade (ex: `error-handler.ts`, `private-route.ts`, `rate-limit-modern.ts`, `security.ts`).
- Cada middleware deve ser uma função `(req, res, next)` ou um factory que retorna essa função.
- Middlewares globais são registrados em `server.ts`.

## Exemplo
```typescript
// src/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
```

## Boas práticas
- Use middlewares para centralizar lógica repetitiva (autenticação, validação, logging, etc).
- Sempre chame `next(err)` para erros, permitindo o tratamento global.
- Documente middlewares complexos neste README, se necessário.

---
Consulte este README para exemplos e padrões antes de criar novos middlewares.
