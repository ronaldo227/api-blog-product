# Types: Tipos TypeScript Customizados

Esta pasta contém tipos TypeScript customizados usados em todo o projeto para garantir tipagem forte, segurança e clareza no desenvolvimento.

## Exemplo
```typescript
// src/types/extended-resquest.ts
import { Request } from 'express';
import { User } from '@prisma/client';

type userWithoutPassword = Omit<User, 'password'>;
export type ExtendedRequest = Request & {
    userId?: userWithoutPassword;
};
```

## Boas práticas
- Centralize tipos compartilhados nesta pasta para evitar duplicidade.
- Use tipos para estender objetos de bibliotecas (ex: Express Request).
- Documente tipos complexos neste README.

---
Consulte este README para exemplos e padrões antes de criar novos tipos customizados.
