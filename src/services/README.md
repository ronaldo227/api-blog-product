# Serviços (services)

Esta pasta contém a lógica de negócio da aplicação, separando responsabilidades e facilitando testes, manutenção e reuso.

## 📋 Padrão de Uso
- Cada arquivo implementa funções relacionadas a um domínio (ex: `user.ts`, `auth.ts`, `post.ts`)
- Os services não lidam com requisições HTTP diretamente, apenas com dados e regras de negócio
- Devem ser puros sempre que possível (sem efeitos colaterais externos)

## 📁 Arquivos

### `user.ts` - Gerenciamento de Usuários

**Funcionalidades:**
- `createUser()` - Criação de novo usuário com senha hasheada
- `verifyUser()` - Verificação de credenciais para login

**Segurança Implementada:**
- ✅ **Prevenção de TOCTOU**: Usa inserção direta no Prisma ao invés de check-then-act
- ✅ **Timing Attack**: Hash dummy em usuários inexistentes mantém tempo constante
- ✅ **Bcrypt**: 12 rounds de hashing para senhas
- ✅ **Constraint P2002**: Captura duplicatas no nível do banco de dados

**Exemplo de Uso:**
```typescript
// Criar usuário
const result = await createUser({ 
  name: 'João Silva', 
  email: 'joao@example.com', 
  password: 'senha123' 
});

// Verificar credenciais
const user = await verifyUser({ 
  email: 'joao@example.com', 
  password: 'senha123' 
});
```

### `health.ts` - Health Check

**Funcionalidades:**
- `checkDatabase()` - Verifica conectividade do DB com timeout (1500ms)
- `buildHealthPayload()` - Constrói payload completo de status

**Retorno do Health Check:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "db": "up",
  "version": "1.0.0",
  "commit": "abc123",
  "environment": "production",
  "timestamp": "2025-10-04T18:00:00.000Z",
  "memory": { "rss": 50000000, "heapTotal": 20000000 },
  "nodeVersion": "v20.0.0"
}
```

**Estados:**
- `healthy` - Tudo operacional (DB up)
- `degraded` - DB com problemas (DB down)


## 🔒 Práticas de Segurança

### Prevenção de Race Condition (TOCTOU)
**Problema:** Padrão check-then-act permite duplicatas entre verificação e inserção.

**Solução Implementada:**
```typescript
// ❌ ERRADO - Race condition
const existing = await prisma.user.findUnique({ where: { email } });
if (existing) return false;
const user = await prisma.user.create({ data: { email, password } });

// ✅ CORRETO - Atômico
try {
  const user = await prisma.user.create({ data: { email, password } });
  return user;
} catch (error) {
  if (error.code === 'P2002') return false; // Duplicata
  throw error;
}
```

### Prevenção de Timing Attack
**Problema:** Retorno imediato ao não encontrar usuário revela emails válidos via tempo de resposta.

**Solução Implementada:**
```typescript
const user = await prisma.user.findUnique({ where: { email } });

if (!user) {
  // Hash dummy para manter tempo constante
  await bcrypt.compare(password, '$2b$12$dummy...');
  return false;
}

const valid = await bcrypt.compare(password, user.password);
return valid ? user : false;
```

**Benefício:** Tempo de resposta permanece constante (~100ms) independente da existência do usuário.

## 🧪 Testes

Os services são testados em:
- `src/tests/unit/` - Testes unitários de funções isoladas
- `src/tests/integration/` - Testes de integração com banco de dados real

**Cobertura de Testes:**
- ✅ Criação de usuário com sucesso
- ✅ Detecção de email duplicado
- ✅ Verificação de credenciais válidas
- ✅ Rejeição de credenciais inválidas
- ✅ Health check com DB up/down

### Post
```ts
// src/services/post.ts
export const handleCover = (file?: Express.Multer.File): string => {
  // ... validação e processamento de imagem de capa
};
```

## Boas práticas
- Não acessar diretamente objetos de request/response do Express.
- Não acessar variáveis globais ou de ambiente diretamente (usar injeção de dependência se necessário).
- Manter funções pequenas e focadas.
- Escrever testes unitários para cada função de serviço.
# Services: Lógica de Negócio

Esta pasta contém os serviços da aplicação, responsáveis por toda a lógica de negócio e integração entre controladores, banco de dados (via Prisma) e outros módulos.

## Padrão adotado
- Separe serviços por domínio (ex: `user.ts`, `auth.ts`).
- Cada função de serviço deve ser pura e reutilizável, sem depender de objetos de request/response.
- Use os serviços para centralizar regras de negócio, validações e integrações externas.

## Exemplo
```typescript
import { prisma } from '../libs/prisma';
import bcrypt from 'bcrypt';

export async function createUser(data: { email: string; password: string }) {
  const hash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { email: data.email, password: hash }
  });
}
```

## Boas práticas
- Não acesse diretamente o banco nos controllers, sempre use os services.
- Centralize validações e regras de negócio aqui.
- Facilite testes unitários mantendo funções puras e sem dependências de contexto HTTP.

---
Consulte este README para exemplos e padrões antes de criar novos serviços.
