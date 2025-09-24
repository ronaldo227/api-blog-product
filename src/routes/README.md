# Routes: Definição e Organização das Rotas

Esta pasta define as rotas da API, agrupando endpoints por domínio (ex: auth, admin, main). Cada arquivo exporta um router Express pronto para ser importado no roteador principal.

## Padrão adotado
- Separe rotas por domínio de negócio (ex: `auth.ts`, `admin.ts`, `main.ts`).
- Cada arquivo deve exportar um objeto `Router` do Express.
- Use middlewares específicos por rota quando necessário.
- Centralize o registro das rotas em `routes/main.ts`.

## Exemplo
```typescript
// src/routes/auth.ts
import { Router } from 'express';
import * as authController from '../controllers/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;
```

## Boas práticas
- Não implemente lógica de negócio nas rotas, apenas direcione para controllers.
- Use middlewares de autenticação/validação diretamente nas rotas quando necessário.
- Documente endpoints e exemplos de uso neste README, se necessário.

---
Consulte este README para exemplos e padrões antes de criar novas rotas.
