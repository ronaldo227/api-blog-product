# Controllers: Lógica dos Endpoints

Esta pasta contém os controladores da API. Cada arquivo implementa a lógica dos endpoints HTTP, recebendo requisições, validando/parsing dados e delegando para os serviços.

## Padrão adotado
- Separe controladores por domínio (ex: `auth.ts`, `admin.ts`, `main.ts`).
- Cada função de controlador recebe `(req, res, next)` e deve ser enxuta, delegando regras para os services.
- Use validação de dados (ex: Zod) antes de chamar o service.

## Exemplo
```typescript
import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validação/parsing dos dados
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
```

## Boas práticas
- Não implemente lógica de negócio nos controllers, apenas orquestre a chamada dos services.
- Trate erros usando o `next(err)` para o middleware global de erros.
- Documente endpoints complexos neste README, se necessário.

---
Consulte este README para exemplos e padrões antes de criar novos controladores.
