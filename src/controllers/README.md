# Controllers: Camada de Controle HTTP 🎮# Controllers: Lógica dos Endpoints



Handlers de requisições HTTP que orquestram o fluxo entre rotas, validação e serviços.Esta pasta contém os controladores da API. Cada arquivo implementa a lógica dos endpoints HTTP, recebendo requisições, validando/parsing dados e delegando para os serviços.



## 📁 Estrutura## Padrão adotado

- Separe controladores por domínio (ex: `auth.ts`, `admin.ts`, `main.ts`).

```- Cada função de controlador recebe `(req, res, next)` e deve ser enxuta, delegando regras para os services.

controllers/- Use validação de dados (ex: Zod) antes de chamar o service.

├── auth.ts         # Autenticação (signup, signin)

├── auth-modern.ts  # Autenticação moderna (Express 5)## Exemplo

├── admin.ts        # Administração de posts (CRUD)```typescript

└── main.ts         # Endpoints públicos (listagem, detalhes)import { Request, Response, NextFunction } from 'express';

```import * as userService from '../services/user';



## 🎯 Responsabilidadesexport const register = async (req: Request, res: Response, next: NextFunction) => {

  try {

Os controllers são responsáveis por:    // Validação/parsing dos dados

    const user = await userService.createUser(req.body);

1. **Receber** requisições HTTP    res.status(201).json(user);

2. **Validar** dados de entrada (Zod schemas)  } catch (err) {

3. **Chamar** serviços de negócio    next(err);

4. **Formatar** respostas HTTP  }

5. **Tratar** erros de forma consistente};

```

**Não fazem:**

- ❌ Lógica de negócio (isso fica nos services)## Boas práticas

- ❌ Acesso direto ao banco (use services)- Não implemente lógica de negócio nos controllers, apenas orquestre a chamada dos services.

- ❌ Manipulação complexa de dados- Trate erros usando o `next(err)` para o middleware global de erros.

- Documente endpoints complexos neste README, se necessário.

## 📄 Arquivos

---

### `auth.ts` - AutenticaçãoConsulte este README para exemplos e padrões antes de criar novos controladores.


Gerencia cadastro e login de usuários.

#### Funções

##### `signup(req, res)`
Cadastra novo usuário.

**Request:**
```typescript
POST /api/auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha-forte-123"
}
```

**Validações:**
- Email válido (formato)
- Senha ≥ 6 caracteres
- Email único (não duplicado)

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

**Response (409 - Email duplicado):**
```json
{
  "error": "Email já cadastrado"
}
```

**Fluxo:**
```
1. Validar input (schema Zod)
2. Chamar createUser(email, password)
3. Gerar token JWT
4. Retornar 201 com token + dados do usuário
```

##### `signin(req, res)`
Autentica usuário existente.

**Request:**
```typescript
POST /api/auth/signin
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha-forte-123"
}
```

**Validações:**
- Email válido
- Senha fornecida

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

**Response (401):**
```json
{
  "error": "Email ou senha inválidos"
}
```

**Fluxo:**
```
1. Validar input
2. Buscar usuário por email
3. Comparar senha (bcrypt)
4. Gerar token JWT
5. Retornar 200 com token
```

---

### `admin.ts` - Administração

CRUD de posts. **Requer autenticação** (middleware `privateRoute`).

#### Funções

##### `addPost(req, res)`
Cria novo post.

**Request:**
```typescript
POST /api/admin/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Título do Post",
  "body": "Conteúdo do post...",
  "cover": <arquivo>  // Opcional
}
```

**Validações:**
- Title: 5-100 caracteres
- Body: 10-5000 caracteres
- Cover: Imagem (jpg, png, webp) ≤ 5MB

**Response (201):**
```json
{
  "id": 1,
  "slug": "titulo-do-post",
  "title": "Título do Post",
  "body": "Conteúdo do post...",
  "cover": "/uploads/abc123.webp",
  "userId": 1
}
```

**Fluxo:**
```
1. Validar input (schema Zod)
2. Processar upload (se houver)
3. Gerar slug único
4. Criar post no banco
5. Retornar 201 com post criado
```

##### `updatePost(req, res)`
Atualiza post existente.

**Request:**
```typescript
PUT /api/admin/posts/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Novo Título",  // Opcional
  "body": "Novo conteúdo", // Opcional
  "cover": <arquivo>        // Opcional
}
```

**Validações:**
- ID numérico
- Ao menos 1 campo para atualizar
- Usuário é dono do post

**Response (200):**
```json
{
  "id": 1,
  "slug": "novo-titulo",
  "title": "Novo Título",
  "body": "Novo conteúdo",
  "cover": "/uploads/xyz789.webp",
  "userId": 1
}
```

**Response (403 - Não é dono):**
```json
{
  "error": "Você não tem permissão para editar este post"
}
```

##### `deletePost(req, res)`
Deleta post.

**Request:**
```typescript
DELETE /api/admin/posts/:id
Authorization: Bearer {token}
```

**Response (204):**
```
No Content
```

**Response (403):**
```json
{
  "error": "Você não tem permissão para deletar este post"
}
```

---

### `main.ts` - Endpoints Públicos

Listagem e visualização de posts (sem autenticação).

#### Funções

##### `listPosts(req, res)`
Lista posts públicos com paginação.

**Request:**
```typescript
GET /api/posts?page=1&limit=10
```

**Query Params:**
- `page`: Página (default: 1)
- `limit`: Itens por página (default: 10, max: 100)

**Response (200):**
```json
{
  "posts": [
    {
      "id": 1,
      "slug": "titulo-do-post",
      "title": "Título do Post",
      "body": "Conteúdo...",
      "cover": "/uploads/abc123.webp",
      "user": {
        "id": 1,
        "email": "autor@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

##### `getPost(req, res)`
Detalhes de um post específico.

**Request:**
```typescript
GET /api/posts/:slug
```

**Response (200):**
```json
{
  "id": 1,
  "slug": "titulo-do-post",
  "title": "Título do Post",
  "body": "Conteúdo completo do post...",
  "cover": "/uploads/abc123.webp",
  "createdAt": "2025-10-04T18:30:00Z",
  "user": {
    "id": 1,
    "email": "autor@example.com"
  }
}
```

**Response (404):**
```json
{
  "error": "Post não encontrado"
}
```

---

## 🔒 Autenticação

Controllers protegidos usam `req.userId` injetado pelo middleware `privateRoute`.

**Exemplo:**
```typescript
import { Response } from 'express';
import { ExtendedRequest } from '@/types/extended-request';

export const addPost = async (req: ExtendedRequest, res: Response) => {
  // userId disponível após autenticação
  const userId = req.userId!.id;
  
  const post = await createPost({
    ...req.body,
    userId
  });
  
  res.status(201).json(post);
};
```

## ✅ Validação com Zod

Todos os inputs são validados com schemas Zod.

**Exemplo:**
```typescript
import { authSchema } from '@/schemas/auth';

export const signup = async (req: Request, res: Response) => {
  // Validação
  const result = authSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: result.error.format()
    });
  }
  
  // Input validado
  const { email, password } = result.data;
  
  // Continua processamento...
};
```

## 🛡️ Tratamento de Erros

Erros são tratados de forma consistente usando `httpError`.

**Exemplo:**
```typescript
import { httpError } from '@/utils/http-error';

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await findPostBySlug(req.params.slug);
    
    if (!post) {
      return httpError(res, 404, 'Post não encontrado', 'POST_NOT_FOUND');
    }
    
    res.json(post);
  } catch (error) {
    return httpError(res, 500, 'Erro ao buscar post', 'INTERNAL_ERROR');
  }
};
```

## 📊 Padrões de Response

### Sucesso com Dados
```typescript
res.status(200).json({ data: result });
```

### Criação
```typescript
res.status(201).json({ id: 1, ...createdResource });
```

### Sem Conteúdo
```typescript
res.status(204).send();
```

### Erro
```typescript
res.status(400).json({ error: 'Mensagem de erro' });
```

## 🧪 Testes

**Exemplo de teste de controller:**
```typescript
import request from 'supertest';
import { app } from '@/server';

describe('POST /api/auth/signup', () => {
  it('should create user and return token', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'senha123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });
  
  it('should reject duplicate email', async () => {
    // Criar primeiro usuário
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'senha123' });
    
    // Tentar duplicar
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'senha123' });
    
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email já cadastrado');
  });
});
```

## 📚 Boas Práticas

1. **Controllers finos**: Lógica mínima, delegar para services
2. **Validação no início**: Falhe rápido com inputs inválidos
3. **Respostas consistentes**: Sempre mesmo formato JSON
4. **Status codes corretos**: 200, 201, 400, 401, 404, 500
5. **Erros informativos**: Mensagens claras para o cliente
6. **Type safety**: Use tipos TypeScript corretamente
7. **Async/await**: Sempre use try/catch

## 🔗 Referências

- [Express Request](https://expressjs.com/en/api.html#req)
- [Express Response](https://expressjs.com/en/api.html#res)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [RESTful API Design](https://restfulapi.net/)
