# Routes: Definição de Rotas 🛣️

Mapeamento de URLs para controllers com middlewares específicos.

## 📁 Estrutura

```
routes/
├── auth.ts         # Rotas de autenticação
├── auth-modern.ts  # Rotas de autenticação (Express 5)
├── admin.ts        # Rotas administrativas (protegidas)
└── main.ts         # Rotas públicas
```

## 🗺️ Mapa de Rotas

### Autenticação (`/api/auth`)

| Método | Endpoint | Controller | Middleware | Rate Limit | Descrição |
|--------|----------|------------|------------|------------|-----------|
| POST | `/signup` | `signup` | validate | 5/15min | Cadastro de usuário |
| POST | `/signin` | `signin` | validate | 5/15min | Login de usuário |

**Exemplo:**
```bash
# Signup
curl -X POST http://localhost:4444/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'

# Signin
curl -X POST http://localhost:4444/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'
```

---

### Admin (`/api/admin`)

**Todas as rotas requerem autenticação** (middleware `privateRoute`)

| Método | Endpoint | Controller | Middlewares | Rate Limit | Descrição |
|--------|----------|------------|-------------|------------|-----------|
| POST | `/posts` | `addPost` | privateRoute, upload, validate | 20/1min | Criar post |
| PUT | `/posts/:id` | `updatePost` | privateRoute, upload, validate | 30/1min | Atualizar post |
| DELETE | `/posts/:id` | `deletePost` | privateRoute | 30/1min | Deletar post |

**Exemplo:**
```bash
# Criar post
curl -X POST http://localhost:4444/api/admin/posts \
  -H "Authorization: Bearer {token}" \
  -F "title=Meu Post" \
  -F "body=Conteúdo do post" \
  -F "cover=@imagem.jpg"

# Atualizar post
curl -X PUT http://localhost:4444/api/admin/posts/1 \
  -H "Authorization: Bearer {token}" \
  -F "title=Novo Título"

# Deletar post
curl -X DELETE http://localhost:4444/api/admin/posts/1 \
  -H "Authorization: Bearer {token}"
```

---

### Público (`/api`)

Rotas sem autenticação (acesso público).

| Método | Endpoint | Controller | Rate Limit | Descrição |
|--------|----------|------------|------------|-----------|
| GET | `/posts` | `listPosts` | 100/1min | Listar posts (paginado) |
| GET | `/posts/:slug` | `getPost` | 100/1min | Detalhes de um post |

**Exemplo:**
```bash
# Listar posts
curl http://localhost:4444/api/posts?page=1&limit=10

# Detalhes do post
curl http://localhost:4444/api/posts/meu-primeiro-post
```

---

### Health Check (`/health`)

| Método | Endpoint | Controller | Descrição |
|--------|----------|------------|-----------|
| GET | `/health` | `healthCheck` | Status da API e banco |

**Exemplo:**
```bash
curl http://localhost:4444/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T18:30:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

---

## 🔒 Proteção de Rotas

### Rotas Públicas
```typescript
// Sem middleware de autenticação
router.get('/posts', listPosts);
router.get('/posts/:slug', getPost);
```

### Rotas Protegidas
```typescript
// Requer token JWT válido
router.post('/admin/posts', privateRoute, addPost);
router.put('/admin/posts/:id', privateRoute, updatePost);
router.delete('/admin/posts/:id', privateRoute, deletePost);
```

### Com Upload
```typescript
// Protegida + Upload de arquivo
router.post('/admin/posts', 
  privateRoute,           // 1. Valida JWT
  upload.single('cover'), // 2. Processa upload
  validate(postSchema),   // 3. Valida dados
  addPost                 // 4. Controller
);
```

---

## ⚡ Rate Limiting

### Global
```typescript
// 100 requisições por minuto (todas as rotas)
app.use(rateLimitMiddleware);
```

### Por Rota

#### Autenticação (Restritivo)
```typescript
// 5 tentativas a cada 15 minutos
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

router.post('/auth/signin', authRateLimit, signin);
router.post('/auth/signup', authRateLimit, signup);
```

#### Admin (Moderado)
```typescript
// 20 criações por minuto
const adminCreateLimit = rateLimit({
  windowMs: 60000,
  max: 20
});

router.post('/admin/posts', adminCreateLimit, addPost);
```

#### Público (Permissivo)
```typescript
// 100 leituras por minuto
const publicReadLimit = rateLimit({
  windowMs: 60000,
  max: 100
});

router.get('/posts', publicReadLimit, listPosts);
```

---

## 📊 Estrutura de Arquivo de Rota

### Padrão
```typescript
import { Router } from 'express';
import { signup, signin } from '@/controllers/auth';
import { validate } from '@/middlewares/validation';
import { authSchema } from '@/schemas/auth';

const router = Router();

// POST /api/auth/signup
router.post('/signup', 
  validate(authSchema),  // Middleware de validação
  signup                 // Controller
);

// POST /api/auth/signin
router.post('/signin',
  validate(authSchema),
  signin
);

export default router;
```

### Com Múltiplos Middlewares
```typescript
router.post('/admin/posts',
  privateRoute,            // 1. Autenticação
  upload.single('cover'),  // 2. Upload
  validate(postSchema),    // 3. Validação
  addPost                  // 4. Controller
);
```

---

## 🎯 Convenções RESTful

### Recursos
- **Singular para detalhes:** `/posts/:id` ou `/posts/:slug`
- **Plural para coleções:** `/posts`
- **Ações em subpaths:** `/admin/posts` (não `/posts/admin`)

### Métodos HTTP
- **GET** - Buscar/Listar (idempotente)
- **POST** - Criar
- **PUT** - Atualizar completo
- **PATCH** - Atualizar parcial
- **DELETE** - Deletar (idempotente)

### Status Codes
- **200** - OK (GET, PUT, PATCH)
- **201** - Created (POST)
- **204** - No Content (DELETE)
- **400** - Bad Request (validação)
- **401** - Unauthorized (sem token/token inválido)
- **403** - Forbidden (autenticado mas sem permissão)
- **404** - Not Found
- **409** - Conflict (duplicação)
- **429** - Too Many Requests (rate limit)
- **500** - Internal Server Error

---

## 🧪 Testes

### Rota Pública
```typescript
describe('GET /api/posts', () => {
  it('should list posts', async () => {
    const response = await request(app).get('/api/posts');
    
    expect(response.status).toBe(200);
    expect(response.body.posts).toBeInstanceOf(Array);
  });
});
```

### Rota Protegida
```typescript
describe('POST /api/admin/posts', () => {
  it('should create post with valid token', async () => {
    const token = signToken(1);
    
    const response = await request(app)
      .post('/api/admin/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', body: 'Content' });
    
    expect(response.status).toBe(201);
  });
  
  it('should reject without token', async () => {
    const response = await request(app)
      .post('/api/admin/posts')
      .send({ title: 'Test', body: 'Content' });
    
    expect(response.status).toBe(401);
  });
});
```

---

## 📚 Referências

- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
