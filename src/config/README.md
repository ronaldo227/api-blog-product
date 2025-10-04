# Config: Configuração de Ambiente# Config: Configurações e Variáveis de Ambiente



Validação e carregamento de variáveis de ambiente com Zod para garantir configuração correta em todos os ambientes.Esta pasta centraliza toda a configuração do projeto, especialmente o carregamento e validação das variáveis de ambiente.



## 📁 Arquivo## Principais arquivos

- `env.ts`: Carrega `.env`, valida e tipa as variáveis de ambiente usando Zod.

### `env.ts` - Validação de Ambiente

## Variáveis suportadas

**Funcionalidade:**- `NODE_ENV`: Ambiente de execução (`development`, `production`, `test`).

- Carrega variáveis do `.env` com dotenv- `PORT`: Porta do servidor (padrão: 4444).

- Valida com schema Zod- `DATABASE_URL`: String de conexão do banco (obrigatória).

- Tipifica para TypeScript- `JWT_KEY`: Chave secreta para JWT (mínimo 32 caracteres, recomendado 64+ em produção).

- Aplica regras de segurança por ambiente- `ALLOWED_ORIGINS`: Origens permitidas para CORS.

- `RATE_LIMIT_WINDOW_MS`: Janela de tempo do rate limit (ms).

## 🔧 Variáveis de Ambiente- `RATE_LIMIT_MAX_REQUESTS`: Máximo de requisições por janela.

- `LOG_LEVEL`: Nível de log (`error`, `warn`, `info`, `debug`).

### Obrigatórias

## Exemplo de uso

**`DATABASE_URL`**```typescript

```bashimport { validateEnv } from './config/env';

DATABASE_URL="postgresql://user:pass@localhost:5432/blog"const env = validateEnv();

```console.log(env.PORT);

- Conexão PostgreSQL```

- Deve incluir `?sslmode=require` em produção

## Boas práticas

**`JWT_KEY`**- Sempre valide as variáveis antes de iniciar o servidor.

```bash- Em produção, use JWT_KEY com pelo menos 64 caracteres e banco com SSL.

JWT_KEY="sua-chave-super-secreta-com-64-chars-ou-mais-para-producao"- Mantenha segredos fora do código-fonte, usando `.env` ou variáveis do ambiente.

```

- Chave para assinar tokens JWT---

- **Development:** ≥32 caracteresConsulte este README para saber quais variáveis são obrigatórias e como configurar corretamente o ambiente.

- **Production:** ≥64 caracteres
- Geração recomendada: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Opcionais com Defaults

**`NODE_ENV`**
```bash
NODE_ENV="development" # ou "production" ou "test"
```
- Default: `development`
- Controla comportamento de logs, validações

**`PORT`**
```bash
PORT=4444
```
- Default: `4444`
- Porta do servidor HTTP

**`JWT_TTL`**
```bash
JWT_TTL="1h" # ou "15m", "7d", "3600"
```
- Default: `1h`
- Tempo de vida do token JWT
- Formatos aceitos: `15m`, `2h`, `7d`, `3600` (segundos)

**`ALLOWED_ORIGINS`**
```bash
ALLOWED_ORIGINS="http://localhost:3000,https://meufrontend.com"
```
- Default: vazio (permite todas origens em dev)
- Lista separada por vírgulas
- Usado pelo middleware CORS

**`LOG_LEVEL`**
```bash
LOG_LEVEL="info" # ou "error", "warn", "debug"
```
- Default: `info`
- Controla verbosidade dos logs Winston

**`RATE_LIMIT_WINDOW_MS`**
```bash
RATE_LIMIT_WINDOW_MS=900000 # 15 minutos
```
- Default: `900000` (15 min)
- Janela de tempo para rate limiting

**`RATE_LIMIT_MAX_REQUESTS`**
```bash
RATE_LIMIT_MAX_REQUESTS=5
```
- Default: `5`
- Máximo de requisições em auth endpoints

## 🔐 Schema de Validação

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),
  
  PORT: z.string()
    .transform(Number)
    .default(4444),
  
  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required'),
  
  JWT_KEY: z.string()
    .min(32, 'JWT_KEY must be at least 32 characters long'),
  
  JWT_TTL: z.string()
    .regex(/^(\d+)([smhd])?$|^\d+[smhd]$/i, 'JWT_TTL format invalid')
    .default('1h'),
  
  ALLOWED_ORIGINS: z.string().optional(),
  
  RATE_LIMIT_WINDOW_MS: z.string()
    .transform(Number)
    .default(900000),
  
  RATE_LIMIT_MAX_REQUESTS: z.string()
    .transform(Number)
    .default(5),
  
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug'])
    .default('info')
});
```

## 🛡️ Validações de Segurança

### Produção: JWT_KEY ≥64 Caracteres
```typescript
if (env.NODE_ENV === 'production' && env.JWT_KEY.length < 64) {
  console.warn('⚠️  JWT_KEY should be at least 64 characters in production');
}
```

### Produção: SSL no DATABASE_URL
```typescript
if (env.NODE_ENV === 'production' && !env.DATABASE_URL.includes('ssl')) {
  console.warn('⚠️  Consider using SSL for database connection in production');
}
```

### Formato JWT_TTL
```typescript
// Aceitos: '15m', '2h', '7d', '3600'
// Rejeitados: '1 hour', 'tomorrow', 'abc'
```

## 📖 Uso no Código

```typescript
import { env } from '@/config/env';

// Type-safe access
const port = env.PORT;           // number
const jwtKey = env.JWT_KEY;      // string
const nodeEnv = env.NODE_ENV;    // 'development' | 'production' | 'test'

// Em qualquer lugar do código
console.log(`Server running on port ${env.PORT}`);
jwt.sign(payload, env.JWT_KEY, { expiresIn: env.JWT_TTL });
```

## 🔍 Tipo Exportado

```typescript
type ValidatedEnv = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_KEY: string;
  JWT_TTL: string;
  ALLOWED_ORIGINS?: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
};

export const env: ValidatedEnv;
```

## ⚠️ Tratamento de Erros

**Se validação falhar:**
```typescript
try {
  const env = envSchema.parse(process.env);
  // ...
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    console.error(error.flatten().fieldErrors);
    process.exit(1); // Termina aplicação
  }
}
```

**Exemplo de erro:**
```bash
❌ Invalid environment variables:
{
  JWT_KEY: [ 'JWT_KEY must be at least 32 characters long' ],
  DATABASE_URL: [ 'DATABASE_URL is required' ]
}
```

## 🧪 Ambientes

### Development (.env.development)
```bash
NODE_ENV=development
PORT=4444
DATABASE_URL=postgresql://localhost:5432/blog_dev
JWT_KEY=chave-de-32-caracteres-minimo
JWT_TTL=24h
LOG_LEVEL=debug
```

### Production (.env.production)
```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@prod-db:5432/blog?sslmode=require
JWT_KEY=chave-super-secreta-com-64-caracteres-ou-mais-para-seguranca-maxima
JWT_TTL=1h
ALLOWED_ORIGINS=https://meufrontend.com,https://api.meufrontend.com
LOG_LEVEL=warn
```

### Test (.env.test)
```bash
NODE_ENV=test
PORT=4445
DATABASE_URL=postgresql://localhost:5432/blog_test
JWT_KEY=test-key-with-32-chars-minimum
JWT_TTL=1h
LOG_LEVEL=error
```

## 🔐 Segurança

### ✅ O Que Fazer

1. **Gerar JWT_KEY seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Nunca commitar .env:**
```gitignore
.env
.env.local
.env.*.local
```

3. **Usar variáveis de ambiente em CI/CD:**
- GitHub Actions: Repository Secrets
- Vercel: Environment Variables
- Heroku: Config Vars

4. **Rotacionar JWT_KEY regularmente:**
- A cada 3-6 meses em produção
- Sempre que houver suspeita de vazamento

### ❌ O Que NÃO Fazer

- ❌ Commitar .env no git
- ❌ Usar JWT_KEY curto (<32 chars)
- ❌ Hardcodear secrets no código
- ❌ Compartilhar .env de produção
- ❌ Usar mesma JWT_KEY em dev e prod

## 📚 Exemplo Completo

**arquivo .env:**
```bash
NODE_ENV=development
PORT=4444
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blog_dev
JWT_KEY=minha-chave-super-secreta-com-32-caracteres-ou-mais
JWT_TTL=1h
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
LOG_LEVEL=debug
```

**Uso no código:**
```typescript
// src/config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // ... schema
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
export type ValidatedEnv = z.infer<typeof envSchema>;
```

## 📖 Referências

- [Zod Documentation](https://zod.dev/)
- [dotenv](https://github.com/motdotla/dotenv)
- [12 Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
