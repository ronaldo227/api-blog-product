# Types: Definições de Tipos TypeScript

Tipos customizados e extensões de tipos de bibliotecas externas.

## 📁 Arquivo

### `extended-request.ts` - Extensão do Request Express

**Problema:**
O tipo `Request` do Express não possui a propriedade `userId` que injetamos no middleware `privateRoute`.

**Solução:**
Criar tipo estendido que adiciona `userId` opcional.

```typescript
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  userId?: {
    id: number;
  };
}
```

## 🎯 Uso

### Antes (Erro TypeScript)
```typescript
import { Request, Response } from 'express';

export const addPost = async (req: Request, res: Response) => {
  const userId = req.userId.id; // ❌ Property 'userId' does not exist
};
```

### Depois (Type-safe)
```typescript
import { Response } from 'express';
import { ExtendedRequest } from '@/types/extended-request';

export const addPost = async (req: ExtendedRequest, res: Response) => {
  const userId = req.userId!.id; // ✅ TypeScript sabe que userId existe
};
```

## 🔍 Type Guard

**Verificação segura:**
```typescript
import { ExtendedRequest } from '@/types/extended-request';

export const addPost = async (req: ExtendedRequest, res: Response) => {
  // Type guard para garantir que userId existe
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  // Aqui TypeScript sabe que userId não é undefined
  const userId = req.userId.id;
  
  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      userId: userId // ✅ Type-safe
    }
  });
};
```

## 🛡️ Fluxo de Autenticação

```
1. Cliente envia: Authorization: Bearer <token>
   ↓
2. privateRoute middleware:
   - Extrai token
   - Valida JWT
   - Decodifica payload { userId: 123 }
   - INJETA: req.userId = { id: 123 }
   ↓
3. Controller:
   - req é do tipo ExtendedRequest
   - Acessa req.userId.id com type safety
   - Usa userId nas operações
```

## 📊 Estrutura do userId

```typescript
// O que é injetado pelo privateRoute
req.userId = {
  id: 123  // ID numérico do usuário autenticado
}

// Acesso no controller
const userId = req.userId.id;  // 123 (number)
```

## 🧩 Outros Tipos Customizados (Futuro)

### Pagination
```typescript
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
```

### API Response
```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### JWT Payload
```typescript
export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}
```

## 📖 Uso Avançado

### Tipando Middleware
```typescript
import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '@/types/extended-request';

export const privateRoute = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const payload = verifyToken(token);
    
    // Injeta userId no request
    req.userId = { id: payload.userId };
    
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Tipando Controller com Upload
```typescript
import { Response } from 'express';
import { ExtendedRequest } from '@/types/extended-request';

export const addPost = async (req: ExtendedRequest, res: Response) => {
  // req.file vem do multer (Express.Multer.File)
  if (req.file) {
    const result = await processCover({ file: req.file });
    console.log(result.publicPath);
  }
  
  // req.userId vem do privateRoute
  const userId = req.userId!.id;
  
  // Ambos type-safe!
};
```

## 🔧 Configuração TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

**Importação:**
```typescript
// ✅ Com alias
import { ExtendedRequest } from '@/types/extended-request';

// ❌ Sem alias (caminho relativo longo)
import { ExtendedRequest } from '../../../types/extended-request';
```

## 🧪 Testes

**Mockando ExtendedRequest:**
```typescript
import { ExtendedRequest } from '@/types/extended-request';

const mockRequest = {
  userId: { id: 123 },
  body: { title: 'Test', body: 'Content' },
  file: undefined
} as ExtendedRequest;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
} as any;

await addPost(mockRequest, mockResponse);

expect(mockResponse.status).toHaveBeenCalledWith(201);
```

## 📚 Padrões de Nomenclatura

### Interfaces vs Types

**Use Interface quando:**
- Descrever estrutura de objeto
- Pode ser estendido/implementado
- Precisa de declaration merging

```typescript
export interface ExtendedRequest extends Request {
  userId?: { id: number };
}
```

**Use Type quando:**
- União/intersecção complexa
- Tipos primitivos/literais
- Funções/tuplas

```typescript
export type UserRole = 'admin' | 'user' | 'guest';
export type ApiHandler = (req: Request, res: Response) => Promise<void>;
```

## 📖 Referências

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Express TypeScript](https://expressjs.com/en/advanced/typescript.html)
- [Definite Typing Express](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/express)

---
Consulte este README para exemplos e padrões antes de criar novos tipos customizados.
