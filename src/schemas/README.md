# Schemas: Validação de Dados com Zod 🛡️

Schemas de validação para garantir integridade dos dados de entrada.

## 📁 Estrutura

```
schemas/
├── auth.ts         # Schemas de autenticação (signup, signin)
└── post.ts         # Schemas de posts (create, update)
```

## 🎯 Responsabilidade

Definir regras de validação para dados de entrada usando Zod.

---

## 📄 Arquivos

### `auth.ts` - Autenticação

Validação de cadastro e login de usuários.

#### Schema: `authSchema`

```typescript
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export type AuthInput = z.infer<typeof authSchema>;
```

**Validações:**
- `email`: Formato de email válido
- `password`: Mínimo 6 caracteres

**Uso:**
```typescript
import { authSchema } from '@/schemas/auth';

const result = authSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({
    error: 'Dados inválidos',
    details: result.error.format()
  });
}

// result.data é tipado: { email: string, password: string }
const { email, password } = result.data;
```

**Erro de Validação:**
```json
{
  "error": "Dados inválidos",
  "details": {
    "email": {
      "_errors": ["Email inválido"]
    },
    "password": {
      "_errors": ["Senha deve ter no mínimo 6 caracteres"]
    }
  }
}
```

---

### `post.ts` - Posts

Validação de criação e atualização de posts.

#### Schema: `createPostSchema`

```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string()
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  body: z.string()
    .min(10, 'Conteúdo deve ter no mínimo 10 caracteres')
    .max(5000, 'Conteúdo deve ter no máximo 5000 caracteres')
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

**Validações:**
- `title`: 5-100 caracteres
- `body`: 10-5000 caracteres

#### Schema: `updatePostSchema`

```typescript
export const updatePostSchema = z.object({
  title: z.string()
    .min(5)
    .max(100)
    .optional(),
  body: z.string()
    .min(10)
    .max(5000)
    .optional()
}).refine(
  (data) => data.title || data.body,
  { message: 'Informe ao menos title ou body para atualizar' }
);

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
```

**Validações:**
- `title`: 5-100 caracteres (opcional)
- `body`: 10-5000 caracteres (opcional)
- **Ao menos 1 campo** deve ser fornecido

---

## 🔧 Uso com Middleware

### Com `validate` Middleware
```typescript
import { Router } from 'express';
import { validate } from '@/middlewares/validation';
import { authSchema } from '@/schemas/auth';
import { signup } from '@/controllers/auth';

const router = Router();

router.post('/signup', validate(authSchema), signup);
```

### Validação Manual
```typescript
import { createPostSchema } from '@/schemas/post';

export const addPost = async (req: Request, res: Response) => {
  const result = createPostSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: result.error.format()
    });
  }
  
  const { title, body } = result.data;
  // ... continua
};
```

---

## 🛡️ Segurança

### Prevenção de Ataques

#### XSS
Limites de tamanho previnem payloads grandes:
```typescript
body: z.string().max(5000) // Limita tamanho de conteúdo
```

#### DoS
Limites previnem requisições gigantes:
```typescript
title: z.string().max(100) // Previne títulos enormes
```

#### Injection
Validação de tipos e formatos:
```typescript
email: z.string().email() // Valida formato de email
```

---

## 🧪 Testes

### Validação Bem-sucedida
```typescript
import { authSchema } from '@/schemas/auth';

describe('authSchema', () => {
  it('should validate correct data', () => {
    const result = authSchema.safeParse({
      email: 'user@example.com',
      password: 'senha123'
    });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
    }
  });
});
```

### Validação com Erro
```typescript
it('should reject invalid email', () => {
  const result = authSchema.safeParse({
    email: 'invalid-email',
    password: 'senha123'
  });
  
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].message).toBe('Email inválido');
  }
});

it('should reject short password', () => {
  const result = authSchema.safeParse({
    email: 'user@example.com',
    password: '123'
  });
  
  expect(result.success).toBe(false);
});
```

---

## 📚 Validações Avançadas

### Custom Validation
```typescript
const passwordSchema = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter letra maiúscula')
  .regex(/[a-z]/, 'Deve conter letra minúscula')
  .regex(/[0-9]/, 'Deve conter número')
  .regex(/[^A-Za-z0-9]/, 'Deve conter caractere especial');
```

### Refinements
```typescript
const postSchema = z.object({
  title: z.string(),
  slug: z.string()
}).refine(
  (data) => slugify(data.title) === data.slug,
  { message: 'Slug deve ser derivado do título' }
);
```

### Transforms
```typescript
const emailSchema = z.string()
  .email()
  .transform((email) => email.toLowerCase().trim());
```

---

## 📖 Schemas Futuros

Exemplos de schemas que podem ser adicionados:

### Comment Schema
```typescript
export const commentSchema = z.object({
  body: z.string().min(1).max(500),
  postId: z.number().int().positive()
});
```

### Pagination Schema
```typescript
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
```

### Filter Schema
```typescript
export const postFilterSchema = z.object({
  search: z.string().optional(),
  userId: z.coerce.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
```

---

## 🔗 Referências

- [Zod Documentation](https://zod.dev/)
- [Input Validation Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [TypeScript Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
