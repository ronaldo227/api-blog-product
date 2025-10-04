# Middlewares: Interceptadores HTTP 🛡️# Middlewares: Funções Intermediárias Express



Middlewares Express que processam requisições antes de chegarem aos controllers.Esta pasta contém middlewares Express para autenticação, segurança, validação, tratamento de erros, rate limiting e outras funções intermediárias executadas entre a requisição e a resposta.



## 📁 Estrutura## Padrão adotado

- Separe middlewares por responsabilidade (ex: `error-handler.ts`, `private-route.ts`, `rate-limit-modern.ts`, `security.ts`).

```- Cada middleware deve ser uma função `(req, res, next)` ou um factory que retorna essa função.

middlewares/- Middlewares globais são registrados em `server.ts`.

├── error-handler.ts      # Tratamento global de erros

├── private-route.ts      # Autenticação JWT## Exemplo

├── rate-limit-modern.ts  # Rate limiting (Express 5)```typescript

├── request-id.ts         # ID único por requisição// src/middlewares/error-handler.ts

├── sanitize.ts           # Sanitização de inputimport { Request, Response, NextFunction } from 'express';

├── security.ts           # Headers de segurança (Helmet)

└── validation.ts         # Validação de schemas Zodexport function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

```  console.error(err);

  res.status(500).json({ error: 'Erro interno do servidor' });

## 🔄 Ordem de Execução}

```

A ordem dos middlewares é **crítica** para segurança e funcionamento:

## Boas práticas

```typescript- Use middlewares para centralizar lógica repetitiva (autenticação, validação, logging, etc).

// server.ts- Sempre chame `next(err)` para erros, permitindo o tratamento global.

app.use(requestId);           // 1. Gera ID único- Documente middlewares complexos neste README, se necessário.

app.use(helmet());            // 2. Headers de segurança

app.use(cors());              // 3. CORS---

app.use(rateLimitMiddleware); // 4. Rate limitingConsulte este README para exemplos e padrões antes de criar novos middlewares.

app.use(express.json());      // 5. Parse JSON
app.use(sanitizeMiddleware);  // 6. Sanitiza input
app.use(routes);              // 7. Rotas
app.use(errorHandler);        // 8. Tratamento de erros (último)
```

---

## 📄 Middlewares

### `request-id.ts` - ID de Requisição

Adiciona ID único a cada requisição para rastreamento em logs.

**Uso:**
```typescript
import { requestId } from '@/middlewares/request-id';

app.use(requestId);

// Em qualquer handler
app.get('/test', (req, res) => {
  console.log(req.id); // 'a1b2c3d4-e5f6...'
});
```

**Comportamento:**
- Gera UUID v4 para cada request
- Adiciona header `X-Request-Id` na response
- Útil para correlacionar logs

---

### `security.ts` - Headers de Segurança

Configura Helmet para adicionar headers HTTP de segurança.

**Headers aplicados:**
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

**Proteções:**
- ✅ Clickjacking (X-Frame-Options)
- ✅ MIME sniffing (X-Content-Type-Options)
- ✅ XSS (X-XSS-Protection, CSP)
- ✅ HTTPS forçado (HSTS)

---

### `rate-limit-modern.ts` - Limitação de Taxa

Rate limiting global e por rota para prevenir abuso.

**Configuração:**
```typescript
// Global: 100 requisições / 1 minuto
const rateLimitMiddleware = rateLimit({
  windowMs: 60000,      // 1 minuto
  max: 100,             // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Por Rota:**
```typescript
// Auth: 5 tentativas / 15 minutos
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
});

// Uso
router.post('/auth/signin', authRateLimit, signin);
```

**Headers de Response:**
```http
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1696435260
```

**Erro (429):**
```json
{
  "error": "Muitas requisições. Tente novamente mais tarde."
}
```

---

### `sanitize.ts` - Sanitização de Input

Remove conteúdo malicioso do corpo da requisição.

**Proteções:**
- ✅ XSS: Remove tags `<script>`, `<iframe>`, etc
- ✅ Prototype Pollution: Remove `__proto__`, `constructor`
- ✅ ReDoS: Valida contra regex maliciosos

**Uso automático:**
```typescript
app.use(sanitizeMiddleware);

// Antes: { name: "<script>alert('xss')</script>" }
// Depois: { name: "" }
```

**Exemplo:**
```typescript
// Input malicioso
POST /api/posts
{
  "title": "<script>alert('XSS')</script>",
  "__proto__": { "isAdmin": true }
}

// Após sanitização
{
  "title": "",
  // __proto__ removido
}
```

---

### `private-route.ts` - Autenticação

Valida token JWT e injeta `userId` no request.

**Uso:**
```typescript
import { privateRoute } from '@/middlewares/private-route';

// Proteger rota
router.post('/admin/posts', privateRoute, addPost);
```

**Fluxo:**
```
1. Extrai token do header Authorization
2. Valida formato: "Bearer {token}"
3. Verifica assinatura JWT
4. Decodifica payload
5. Injeta req.userId = { id: 123 }
6. Chama next()
```

**Request:**
```http
POST /api/admin/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Erros:**
```typescript
// Sem token
401: { error: 'Token não fornecido' }

// Token inválido/expirado
401: { error: 'Token inválido' }
```

**Uso no Controller:**
```typescript
import { ExtendedRequest } from '@/types/extended-request';

export const addPost = async (req: ExtendedRequest, res: Response) => {
  const userId = req.userId!.id; // Type-safe após privateRoute
  // ...
};
```

---

### `validation.ts` - Validação de Schemas

Middleware factory para validar requests com schemas Zod.

**Uso:**
```typescript
import { validate } from '@/middlewares/validation';
import { authSchema } from '@/schemas/auth';

router.post('/auth/signup', validate(authSchema), signup);
```

**Comportamento:**
```typescript
// Request inválido
POST /api/auth/signup
{ "email": "invalid", "password": "123" }

// Response (400)
{
  "error": "Dados inválidos",
  "details": {
    "email": "Email inválido",
    "password": "Mínimo 6 caracteres"
  }
}
```

**Exemplo de Schema:**
```typescript
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(5).max(100),
  body: z.string().min(10).max(5000),
});

router.post('/posts', validate(postSchema), addPost);
```

---

### `error-handler.ts` - Tratamento de Erros

Middleware global de erro (deve ser o **último** middleware).

**Uso:**
```typescript
// Sempre por último
app.use(errorHandler);
```

**Captura:**
- Erros do Prisma (P2002, P2025, etc)
- Erros de validação Zod
- Erros HTTP customizados
- Erros desconhecidos

**Response Padrão:**
```json
{
  "error": "Mensagem amigável",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-04T18:30:00Z"
}
```

**Exemplos:**

```typescript
// Prisma P2002 (Unique constraint)
409: { error: "Email já cadastrado", code: "DUPLICATE_EMAIL" }

// Prisma P2025 (Record not found)
404: { error: "Recurso não encontrado", code: "NOT_FOUND" }

// Erro desconhecido
500: { error: "Erro interno do servidor", code: "INTERNAL_ERROR" }
```

**Logging:**
Todos os erros são logados com detalhes:
```typescript
logger.error('Error occurred', {
  error: error.message,
  stack: error.stack,
  requestId: req.id
});
```

---

## 🔒 Segurança

### Checklist
- [x] Rate limiting ativo
- [x] Helmet configurado
- [x] Sanitização de input
- [x] JWT validado
- [x] CORS configurado
- [x] Error handler não vaza detalhes

### Produção
```typescript
// Ajustar rate limits
authRateLimit.max = 3;          // 3 tentativas
globalRateLimit.max = 50;       // 50 req/min

// CORS específico
cors({
  origin: ['https://meuapp.com'],
  credentials: true
});

// Logs mínimos
LOG_LEVEL=warn
```

---

## 🧪 Testes

```typescript
describe('privateRoute', () => {
  it('should allow valid token', async () => {
    const token = signToken(123);
    
    const response = await request(app)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', body: 'Content' });
    
    expect(response.status).toBe(201);
  });
  
  it('should reject invalid token', async () => {
    const response = await request(app)
      .post('/api/admin/posts')
      .set('Authorization', 'Bearer invalid');
    
    expect(response.status).toBe(401);
  });
});
```

---

## 📚 Referências

- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Helmet](https://helmetjs.github.io/)
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
