# Routes: Definição de Rotas da API

Define todas as rotas HTTP da aplicação e conecta endpoints aos seus respectivos controllers.

## 📋 Estrutura

```
routes/
├── auth.ts       → Rotas de autenticação (signup, signin)
├── admin.ts      → Rotas administrativas (CRUD posts)
└── main.ts       → Rotas públicas (listagem, detalhes)
```

## 📁 Arquivos

### `auth.ts` - Rotas de Autenticação

**Rotas Disponíveis:**
```typescript
POST /auth/signup  → Registro de novo usuário
POST /auth/signin  → Login de usuário
```

**Middlewares Aplicados:**
- ✅ Rate limiting (5 req/15min)
- ✅ Sanitização de body
- ✅ Validação Zod

**Exemplo:**
```typescript
import { Router } from 'express';
import { signup, signin } from '@/controllers/auth';
import { authLimiter } from '@/middlewares/rate-limit-modern';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/signin', authLimiter, signin);

export default router;
```

**Request/Response:**
```bash
# Signup
curl -X POST http://localhost:4444/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Response 201
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### `admin.ts` - Rotas Administrativas

**Rotas Disponíveis:**
```typescript
POST   /admin/post       → Criar post (com upload)
PUT    /admin/post/:id   → Atualizar post
DELETE /admin/post/:id   → Deletar post
```

**Middlewares Aplicados:**
- ✅ Private route (JWT obrigatório)
- ✅ Rate limiting (50 req/15min)
- ✅ Multer (upload de imagem)
- ✅ Sanitização de body
- ✅ Validação Zod

**Exemplo:**
```typescript
import { Router } from 'express';
import { addPost, updatePost, deletePost } from '@/controllers/admin';
import { privateRoute } from '@/middlewares/private-route';
import { upload } from '@/libs/multer';

const router = Router();

// Todas as rotas requerem autenticação
router.post('/post', privateRoute, upload.single('cover'), addPost);
router.put('/post/:id', privateRoute, updatePost);
router.delete('/post/:id', privateRoute, deletePost);

export default router;
```

**Request/Response:**
```bash
# Criar post com upload
curl -X POST http://localhost:4444/api/admin/post \
  -H "Authorization: Bearer eyJhbGci..." \
  -F "title=Meu Post" \
  -F "body=Conteúdo do post..." \
  -F "cover=@imagem.jpg"

# Response 201
{
  "post": {
    "id": 1,
    "title": "Meu Post",
    "slug": "meu-post",
    "body": "Conteúdo do post...",
    "cover": "/uploads/covers/abc-123.jpg",
    "userId": 1,
    "createdAt": "2025-10-04T18:00:00.000Z"
  }
}
```

### `main.ts` - Rotas Públicas

**Rotas Disponíveis:**
```typescript
GET /posts        → Lista todos os posts
GET /post/:slug   → Detalhes de um post específico
GET /ping         → Health check simples
```

**Middlewares Aplicados:**
- ✅ Rate limiting (50 req/15min)
- ✅ Cache headers (futuro)

**Exemplo:**
```typescript
import { Router } from 'express';
import { getPosts, getPost, ping } from '@/controllers/main';

const router = Router();

router.get('/posts', getPosts);
router.get('/post/:slug', getPost);
router.get('/ping', ping);

export default router;
```

**Request/Response:**
```bash
# Listar posts
curl http://localhost:4444/api/posts

# Response 200
{
  "posts": [
    {
      "id": 1,
      "title": "Meu Post",
      "slug": "meu-post",
      "excerpt": "Primeiros 100 chars...",
      "cover": "/uploads/covers/abc-123.jpg",
      "createdAt": "2025-10-04T18:00:00.000Z"
    }
  ],
  "total": 1
}
```

## 🔒 Proteção de Rotas

### Públicas (Sem Autenticação)
```typescript
// main.ts - Qualquer um pode acessar
router.get('/posts', getPosts);
router.get('/post/:slug', getPost);
```

### Protegidas (JWT Obrigatório)
```typescript
// admin.ts - Requer token válido
router.post('/post', privateRoute, addPost);
//                   ^^^^^^^^^^^^
//                   Middleware valida JWT
```

**Fluxo de Proteção:**
```
1. Cliente envia: Authorization: Bearer <token>
2. privateRoute extrai e valida token
3. Se válido: injeta req.userId e chama next()
4. Se inválido: retorna 401
```

## 📊 Rate Limiting por Rota

| Rota | Limite | Janela | Motivo |
|------|--------|--------|--------|
| `/auth/*` | 5 req | 15 min | Prevenir brute force |
| `/admin/*` | 50 req | 15 min | Uso normal admin |
| `/posts` | 50 req | 15 min | Uso público |

**Implementação:**
```typescript
// auth.ts
router.use(authLimiter); // 5 req/15min
router.post('/signup', signup);
router.post('/signin', signin);

// admin.ts
router.use(generalLimiter); // 50 req/15min
router.post('/post', privateRoute, addPost);
```

## 🎯 Padrões de URL

### RESTful
```
GET    /posts           → Lista recursos
GET    /post/:slug      → Detalhes de um recurso
POST   /admin/post      → Cria recurso
PUT    /admin/post/:id  → Atualiza recurso
DELETE /admin/post/:id  → Deleta recurso
```

### Nomes no Singular vs Plural
- **Plural** para coleções: `/posts`
- **Singular** para recurso único: `/post/:slug`

### Prefixos
- `/api/` - Prefixo global (configurado em server.ts)
- `/auth/` - Agrupamento de autenticação
- `/admin/` - Agrupamento administrativo

## 🧪 Testes de Rotas

**Testes em** `src/tests/integration/`:
- ✅ POST /auth/signup (201, 409)
- ✅ POST /auth/signin (200, 401)
- ✅ POST /admin/post sem auth (401)
- ✅ POST /admin/post com auth (201)
- ✅ GET /posts (200)
- ✅ GET /post/:slug (200, 404)

**Exemplo de Teste:**
```typescript
describe('Auth Routes', () => {
  it('POST /auth/signup cria usuário', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'João',
        email: 'joao@test.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 📚 Registrando Rotas

**Em `server.ts`:**
```typescript
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import mainRoutes from './routes/main';

// Prefixo global
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', mainRoutes);

// URLs finais:
// /api/auth/signup
// /api/admin/post
// /api/posts
```

## 🔍 Debugging de Rotas

**Listar todas as rotas:**
```typescript
// Em development
app._router.stack.forEach((r) => {
  if (r.route?.path) {
    console.log(r.route.path);
  }
});
```

**Logs de Requisição:**
```typescript
// Morgan middleware (configurado em server.ts)
app.use(morgan('combined')); // Log de cada requisição
```

## 📖 Referências

- [Express Router](https://expressjs.com/en/guide/routing.html)
- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [HTTP Status Codes](https://httpstatuses.com/)
