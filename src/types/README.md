# Types: Tipos TypeScript Customizados 🔷# Types: Definições de Tipos TypeScript



Definições de tipos customizados e extensões de tipos de bibliotecas.Tipos customizados e extensões de tipos de bibliotecas externas.



## 📁 Estrutura## 📁 Arquivo



```### `extended-request.ts` - Extensão do Request Express

types/

└── extended-request.ts     # Extensão do Request do Express**Problema:**

```O tipo `Request` do Express não possui a propriedade `userId` que injetamos no middleware `privateRoute`.



## 🎯 Responsabilidade**Solução:**

Criar tipo estendido que adiciona `userId` opcional.

Centralizar tipos customizados para garantir type safety em toda a aplicação.

```typescript

---import { Request } from 'express';



## 📄 `extended-request.ts`export interface ExtendedRequest extends Request {

  userId?: {

### Problema    id: number;

O tipo `Request` do Express não possui `userId` que injetamos no middleware `privateRoute`.  };

}

### Solução```

```typescript

import { Request } from 'express';## 🎯 Uso



export interface ExtendedRequest extends Request {### Antes (Erro TypeScript)

  userId?: {```typescript

    id: number;import { Request, Response } from 'express';

  };

}export const addPost = async (req: Request, res: Response) => {

```  const userId = req.userId.id; // ❌ Property 'userId' does not exist

};

---```



## 🔧 Uso### Depois (Type-safe)

```typescript

### Em Controllersimport { Response } from 'express';

```typescriptimport { ExtendedRequest } from '@/types/extended-request';

import { Response } from 'express';

import { ExtendedRequest } from '@/types/extended-request';export const addPost = async (req: ExtendedRequest, res: Response) => {

  const userId = req.userId!.id; // ✅ TypeScript sabe que userId existe

export const addPost = async (req: ExtendedRequest, res: Response) => {};

  // ✅ TypeScript sabe que userId existe```

  const userId = req.userId!.id;

  ## 🔍 Type Guard

  const post = await createPost({

    ...req.body,**Verificação segura:**

    userId```typescript

  });import { ExtendedRequest } from '@/types/extended-request';

  

  res.status(201).json(post);export const addPost = async (req: ExtendedRequest, res: Response) => {

};  // Type guard para garantir que userId existe

```  if (!req.userId) {

    return res.status(401).json({ error: 'Não autenticado' });

### Em Middlewares  }

```typescript  

import { Response, NextFunction } from 'express';  // Aqui TypeScript sabe que userId não é undefined

import { ExtendedRequest } from '@/types/extended-request';  const userId = req.userId.id;

  

export const privateRoute = async (  const post = await prisma.post.create({

  req: ExtendedRequest,    data: {

  res: Response,      title: req.body.title,

  next: NextFunction      userId: userId // ✅ Type-safe

) => {    }

  const token = req.headers.authorization?.replace('Bearer ', '');  });

  };

  if (!token) {```

    return res.status(401).json({ error: 'Token não fornecido' });

  }## 🛡️ Fluxo de Autenticação

  

  const payload = verifyToken(token);```

  1. Cliente envia: Authorization: Bearer <token>

  // Injeta userId (type-safe)   ↓

  req.userId = { id: payload.userId };2. privateRoute middleware:

     - Extrai token

  next();   - Valida JWT

};   - Decodifica payload { userId: 123 }

```   - INJETA: req.userId = { id: 123 }

   ↓

---3. Controller:

   - req é do tipo ExtendedRequest

## 🛡️ Type Guards   - Acessa req.userId.id com type safety

   - Usa userId nas operações

### Verificação Segura```

```typescript

export const addPost = async (req: ExtendedRequest, res: Response) => {## 📊 Estrutura do userId

  // Type guard

  if (!req.userId) {```typescript

    return res.status(401).json({ error: 'Não autenticado' });// O que é injetado pelo privateRoute

  }req.userId = {

    id: 123  // ID numérico do usuário autenticado

  // Aqui TypeScript sabe que userId não é undefined}

  const userId = req.userId.id;

  // Acesso no controller

  // ... resto do códigoconst userId = req.userId.id;  // 123 (number)

};```

```

## 🧩 Outros Tipos Customizados (Futuro)

---

### Pagination

## 📚 Tipos Futuros```typescript

export interface PaginationQuery {

Exemplos de tipos que podem ser adicionados:  page?: number;

  limit?: number;

### Pagination  sortBy?: string;

```typescript  order?: 'asc' | 'desc';

export interface PaginationQuery {}

  page?: number;```

  limit?: number;

  sortBy?: string;### API Response

  order?: 'asc' | 'desc';```typescript

}export interface ApiResponse<T> {

```  data: T;

  message?: string;

### API Response  timestamp: string;

```typescript}

export interface ApiResponse<T> {

  data: T;export interface ApiError {

  message?: string;  error: {

  timestamp: string;    code: string;

}    message: string;

    details?: any;

export interface ApiError {  };

  error: {}

    code: string;```

    message: string;

    details?: unknown;### JWT Payload

  };```typescript

}export interface JwtPayload {

```  userId: number;

  iat: number;

### JWT Payload  exp: number;

```typescript}

export interface JwtPayload {```

  userId: number;

  iat: number;## 📖 Uso Avançado

  exp: number;

}### Tipando Middleware

``````typescript

import { Response, NextFunction } from 'express';

---import { ExtendedRequest } from '@/types/extended-request';



## 🔗 Referênciasexport const privateRoute = async (

  req: ExtendedRequest,

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)  res: Response,

- [Express TypeScript](https://expressjs.com/en/advanced/typescript.html)  next: NextFunction

- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)) => {

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
