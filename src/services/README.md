# Services: Lógica de Negócio 💼# Serviços (services)



Camada de serviços que contém toda a lógica de negócio e interação com o banco de dados.Esta pasta contém a lógica de negócio da aplicação, separando responsabilidades e facilitando testes, manutenção e reuso.



## 📁 Estrutura## 📋 Padrão de Uso

- Cada arquivo implementa funções relacionadas a um domínio (ex: `user.ts`, `auth.ts`, `post.ts`)

```- Os services não lidam com requisições HTTP diretamente, apenas com dados e regras de negócio

services/- Devem ser puros sempre que possível (sem efeitos colaterais externos)

├── auth.ts         # Serviços de autenticação

├── user.ts         # Gerenciamento de usuários## 📁 Arquivos

├── post.ts         # Gerenciamento de posts

└── health.ts       # Health check e status### `user.ts` - Gerenciamento de Usuários

```

**Funcionalidades:**

## 🎯 Responsabilidades- `createUser()` - Criação de novo usuário com senha hasheada

- `verifyUser()` - Verificação de credenciais para login

Os services são responsáveis por:

**Segurança Implementada:**

1. **Lógica de negócio** complexa- ✅ **Prevenção de TOCTOU**: Usa inserção direta no Prisma ao invés de check-then-act

2. **Interação com banco** (Prisma)- ✅ **Timing Attack**: Hash dummy em usuários inexistentes mantém tempo constante

3. **Validações de negócio** (além da validação de entrada)- ✅ **Bcrypt**: 12 rounds de hashing para senhas

4. **Transformação de dados**- ✅ **Constraint P2002**: Captura duplicatas no nível do banco de dados

5. **Operações transacionais**

**Exemplo de Uso:**

**Não fazem:**```typescript

- ❌ Lidar com req/res (isso é do controller)// Criar usuário

- ❌ Validação de input (já feita com Zod)const result = await createUser({ 

- ❌ Formatação de resposta HTTP  name: 'João Silva', 

  email: 'joao@example.com', 

---  password: 'senha123' 

});

## 📄 Arquivos

// Verificar credenciais

### `auth.ts` - Autenticaçãoconst user = await verifyUser({ 

  email: 'joao@example.com', 

Geração e verificação de tokens JWT.  password: 'senha123' 

});

#### Funções```



##### `signToken(userId: number): string`### `health.ts` - Health Check

Gera token JWT para usuário autenticado.

**Funcionalidades:**

```typescript- `checkDatabase()` - Verifica conectividade do DB com timeout (1500ms)

import { signToken } from '@/services/auth';- `buildHealthPayload()` - Constrói payload completo de status



const token = signToken(user.id);**Retorno do Health Check:**

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."```json

```{

  "status": "healthy",

##### `verifyUserToken(token: string): number`  "uptime": 3600,

Verifica token e retorna userId.  "db": "up",

  "version": "1.0.0",

```typescript  "commit": "abc123",

const userId = verifyUserToken(token);  "environment": "production",

// 123  "timestamp": "2025-10-04T18:00:00.000Z",

```  "memory": { "rss": 50000000, "heapTotal": 20000000 },

  "nodeVersion": "v20.0.0"

---}

```

### `user.ts` - Usuários

**Estados:**

CRUD de usuários com hash de senhas.- `healthy` - Tudo operacional (DB up)

- `degraded` - DB com problemas (DB down)

#### Funções



##### `createUser(email, password): Promise<User>`## 🔒 Práticas de Segurança

Cria usuário com senha hasheada.

### Prevenção de Race Condition (TOCTOU)

```typescript**Problema:** Padrão check-then-act permite duplicatas entre verificação e inserção.

const user = await createUser('user@example.com', 'senha123');

// { id: 1, email: 'user@example.com' }**Solução Implementada:**

``````typescript

// ❌ ERRADO - Race condition

**Processo:**const existing = await prisma.user.findUnique({ where: { email } });

1. Valida se email já existeif (existing) return false;

2. Hash da senha com bcrypt (12 rounds)const user = await prisma.user.create({ data: { email, password } });

3. Cria usuário no banco

4. Retorna usuário (sem password)// ✅ CORRETO - Atômico

try {

**Erros:**  const user = await prisma.user.create({ data: { email, password } });

- `P2002` - Email duplicado (409)  return user;

} catch (error) {

##### `findUserByEmail(email): Promise<User | null>`  if (error.code === 'P2002') return false; // Duplicata

Busca usuário por email.  throw error;

}

```typescript```

const user = await findUserByEmail('user@example.com');

```### Prevenção de Timing Attack

**Problema:** Retorno imediato ao não encontrar usuário revela emails válidos via tempo de resposta.

##### `validateUserPassword(user, password): Promise<boolean>`

Valida senha do usuário.**Solução Implementada:**

```typescript

```typescriptconst user = await prisma.user.findUnique({ where: { email } });

const isValid = await validateUserPassword(user, 'senha123');

// true ou falseif (!user) {

```  // Hash dummy para manter tempo constante

  await bcrypt.compare(password, '$2b$12$dummy...');

**Segurança:**  return false;

- bcrypt compare (timing-safe)}

- Não revela se usuário existe

const valid = await bcrypt.compare(password, user.password);

---return valid ? user : false;

```

### `post.ts` - Posts

**Benefício:** Tempo de resposta permanece constante (~100ms) independente da existência do usuário.

CRUD de posts com geração de slugs.

## 🧪 Testes

#### Funções

Os services são testados em:

##### `createPost(data): Promise<Post>`- `src/tests/unit/` - Testes unitários de funções isoladas

Cria post com slug único.- `src/tests/integration/` - Testes de integração com banco de dados real



```typescript**Cobertura de Testes:**

const post = await createPost({- ✅ Criação de usuário com sucesso

  title: 'Meu Post',- ✅ Detecção de email duplicado

  body: 'Conteúdo...',- ✅ Verificação de credenciais válidas

  userId: 1,- ✅ Rejeição de credenciais inválidas

  cover: '/uploads/abc123.webp'- ✅ Health check com DB up/down

});

```### Post

```ts

**Processo:**// src/services/post.ts

1. Gera slug do título (`meu-post`)export const handleCover = (file?: Express.Multer.File): string => {

2. Verifica unicidade  // ... validação e processamento de imagem de capa

3. Se duplicado, adiciona sufixo (`meu-post-2`)};

4. Cria post no banco```



##### `updatePost(id, userId, data): Promise<Post>`## Boas práticas

Atualiza post (apenas se for do usuário).- Não acessar diretamente objetos de request/response do Express.

- Não acessar variáveis globais ou de ambiente diretamente (usar injeção de dependência se necessário).

```typescript- Manter funções pequenas e focadas.

const post = await updatePost(1, userId, {- Escrever testes unitários para cada função de serviço.

  title: 'Novo Título',# Services: Lógica de Negócio

  body: 'Novo conteúdo'

});Esta pasta contém os serviços da aplicação, responsáveis por toda a lógica de negócio e integração entre controladores, banco de dados (via Prisma) e outros módulos.

```

## Padrão adotado

**Validações:**- Separe serviços por domínio (ex: `user.ts`, `auth.ts`).

- Post existe (404)- Cada função de serviço deve ser pura e reutilizável, sem depender de objetos de request/response.

- Usuário é dono (403)- Use os serviços para centralizar regras de negócio, validações e integrações externas.



##### `deletePost(id, userId): Promise<void>`## Exemplo

Deleta post (apenas se for do usuário).```typescript

import { prisma } from '../libs/prisma';

```typescriptimport bcrypt from 'bcrypt';

await deletePost(1, userId);

```export async function createUser(data: { email: string; password: string }) {

  const hash = await bcrypt.hash(data.password, 10);

##### `findPostById(id): Promise<Post | null>`  return prisma.user.create({

Busca post por ID.    data: { email: data.email, password: hash }

  });

##### `findPostBySlug(slug): Promise<Post | null>`}

Busca post por slug.```



```typescript## Boas práticas

const post = await findPostBySlug('meu-post');- Não acesse diretamente o banco nos controllers, sempre use os services.

```- Centralize validações e regras de negócio aqui.

- Facilite testes unitários mantendo funções puras e sem dependências de contexto HTTP.

##### `listPosts(page, limit): Promise<PaginatedPosts>`

Lista posts com paginação.---

Consulte este README para exemplos e padrões antes de criar novos serviços.

```typescript
const result = await listPosts(1, 10);
/*
{
  posts: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    pages: 5
  }
}
*/
```

---

### `health.ts` - Health Check

Verifica status da aplicação e dependências.

#### Funções

##### `checkHealth(): Promise<HealthStatus>`
Verifica status da API e banco.

```typescript
const health = await checkHealth();
/*
{
  status: 'healthy',
  timestamp: '2025-10-04T18:30:00Z',
  uptime: 3600,
  database: 'connected'
}
*/
```

**Checks:**
- ✅ API respondendo
- ✅ Banco conectado (query de teste)
- ✅ Uptime do processo

**Timeout:**
- Query de teste: 5 segundos
- Se falhar: `status: 'degraded'`

---

## 🏗️ Padrões de Design

### Separation of Concerns
```typescript
// ❌ Controller com lógica de negócio
export const signup = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: { email: req.body.email, password: hash }
  });
  res.json(user);
};

// ✅ Controller delega para service
export const signup = async (req, res) => {
  const user = await createUser(req.body.email, req.body.password);
  const token = signToken(user.id);
  res.status(201).json({ token, user });
};
```

### Single Responsibility
```typescript
// user.ts - apenas lógica de usuário
export const createUser = async (email, password) => { ... };
export const findUserByEmail = async (email) => { ... };

// auth.ts - apenas lógica de autenticação
export const signToken = (userId) => { ... };
export const verifyUserToken = (token) => { ... };
```

### Error Handling
```typescript
export const findPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { user: { select: { id: true, email: true } } }
    });
    
    return post;
  } catch (error) {
    logger.error('Error finding post', { slug, error });
    throw error; // Controller trata
  }
};
```

---

## 🔒 Segurança

### Hash de Senhas
```typescript
// bcrypt com 12 rounds (padrão seguro)
const hash = await bcrypt.hash(password, 12);
```

**Custo computacional:**
- 10 rounds: ~10ms
- 12 rounds: ~150ms (recomendado)
- 14 rounds: ~1s

### Timing-Safe Comparison
```typescript
// bcrypt.compare é timing-safe
const isValid = await bcrypt.compare(password, user.password);
```

### Prevenção de Enumeração
```typescript
// Sempre mesmo tempo de resposta (login)
const user = await findUserByEmail(email);
if (!user) {
  await bcrypt.hash(password, 12); // Hash falso
  return null;
}
return await validateUserPassword(user, password);
```

---

## 🧪 Testes

### Unit Tests
```typescript
import { createUser } from '@/services/user';
import { prisma } from '@/libs/prisma';

describe('createUser', () => {
  it('should create user with hashed password', async () => {
    const user = await createUser('test@example.com', 'senha123');
    
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBeUndefined(); // Não retorna senha
    
    // Verifica no banco
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    expect(dbUser.password).not.toBe('senha123'); // Hasheada
  });
  
  it('should reject duplicate email', async () => {
    await createUser('test@example.com', 'senha123');
    
    await expect(
      createUser('test@example.com', 'senha456')
    ).rejects.toThrow();
  });
});
```

### Integration Tests
```typescript
describe('Post service', () => {
  it('should create post with unique slug', async () => {
    const user = await createUser('test@example.com', 'senha123');
    
    const post1 = await createPost({
      title: 'Meu Post',
      body: 'Conteúdo',
      userId: user.id
    });
    
    const post2 = await createPost({
      title: 'Meu Post',
      body: 'Outro conteúdo',
      userId: user.id
    });
    
    expect(post1.slug).toBe('meu-post');
    expect(post2.slug).toBe('meu-post-2');
  });
});
```

---

## 📚 Boas Práticas

1. **Funções puras**: Sem side effects quando possível
2. **Retorno consistente**: Sempre mesmo tipo/formato
3. **Logging**: Log operações importantes
4. **Transactions**: Use para operações múltiplas
5. **Validação de negócio**: Além da validação de input
6. **Tratamento de erro**: Throw erros específicos
7. **Performance**: Otimize queries N+1

### Exemplo de Transaction
```typescript
export const transferPost = async (postId: number, newUserId: number) => {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({ where: { id: postId } });
    
    if (!post) throw new Error('Post not found');
    
    await tx.post.update({
      where: { id: postId },
      data: { userId: newUserId }
    });
    
    await tx.notification.create({
      data: {
        userId: newUserId,
        message: `Post ${post.title} transferido para você`
      }
    });
  });
};
```

---

## 🔗 Referências

- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Transaction Safety](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
