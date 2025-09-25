# Serviços (services)

Esta pasta contém a lógica de negócio da aplicação, separando responsabilidades e facilitando testes, manutenção e reuso.

## Padrão de uso
- Cada arquivo implementa funções relacionadas a um domínio (ex: `user.ts`, `auth.ts`, `post.ts`).
- Os services não lidam com requisições HTTP diretamente, apenas com dados e regras de negócio.
- Devem ser puros sempre que possível (sem efeitos colaterais externos).

## Exemplos

### Usuário
```ts
// src/services/user.ts
export const createUser = async ({ name, email, password }: CreateUserProps) => {
  // ... lógica de criação, hash de senha, etc.
};
```

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
