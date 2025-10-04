# Config: Configurações e Variáveis de Ambiente ⚙️# Config: Configuração de Ambiente# Config: Configurações e Variáveis de Ambiente



Centralização da configuração do projeto com validação robusta de variáveis de ambiente usando Zod.



## 📁 EstruturaValidação e carregamento de variáveis de ambiente com Zod para garantir configuração correta em todos os ambientes.Esta pasta centraliza toda a configuração do projeto, especialmente o carregamento e validação das variáveis de ambiente.



```

config/

└── env.ts          # Validação e tipagem de variáveis de ambiente## 📁 Arquivo## Principais arquivos

```

- `env.ts`: Carrega `.env`, valida e tipa as variáveis de ambiente usando Zod.

## 🎯 Responsabilidade

### `env.ts` - Validação de Ambiente

O módulo `config` é responsável por:

## Variáveis suportadas

1. **Carregar** variáveis de ambiente do arquivo `.env`

2. **Validar** tipos e formatos com schemas Zod**Funcionalidade:**- `NODE_ENV`: Ambiente de execução (`development`, `production`, `test`).

3. **Tipar** configurações para TypeScript

4. **Aplicar** regras de segurança por ambiente- Carrega variáveis do `.env` com dotenv- `PORT`: Porta do servidor (padrão: 4444).

5. **Falhar rápido** se configuração inválida

- Valida com schema Zod- `DATABASE_URL`: String de conexão do banco (obrigatória).

## 📋 Variáveis de Ambiente

- Tipifica para TypeScript- `JWT_KEY`: Chave secreta para JWT (mínimo 32 caracteres, recomendado 64+ em produção).

### Obrigatórias

- Aplica regras de segurança por ambiente- `ALLOWED_ORIGINS`: Origens permitidas para CORS.

#### `DATABASE_URL`

String de conexão do PostgreSQL.- `RATE_LIMIT_WINDOW_MS`: Janela de tempo do rate limit (ms).



```bash## 🔧 Variáveis de Ambiente- `RATE_LIMIT_MAX_REQUESTS`: Máximo de requisições por janela.

# Desenvolvimento

DATABASE_URL="postgresql://user:password@localhost:5432/blog?schema=public"- `LOG_LEVEL`: Nível de log (`error`, `warn`, `info`, `debug`).



# Produção (com SSL)### Obrigatórias

DATABASE_URL="postgresql://user:password@host:5432/blog?schema=public&sslmode=require"

```## Exemplo de uso



**Formato:** `postgresql://[user]:[password]@[host]:[port]/[database]?[options]`**`DATABASE_URL`**```typescript



⚠️ **Produção:** Sempre use `sslmode=require` para conexões seguras.```bashimport { validateEnv } from './config/env';



#### `JWT_KEY`DATABASE_URL="postgresql://user:pass@localhost:5432/blog"const env = validateEnv();

Chave secreta para assinar tokens JWT.

```console.log(env.PORT);

```bash

# Desenvolvimento (mínimo 32 caracteres)- Conexão PostgreSQL```

JWT_KEY="dev-secret-key-with-32-chars-min"

- Deve incluir `?sslmode=require` em produção

# Produção (mínimo 64 caracteres)

JWT_KEY="prod-secret-key-with-64-chars-min-generated-with-crypto-randomBytes"## Boas práticas

```

**`JWT_KEY`**- Sempre valide as variáveis antes de iniciar o servidor.

**Requisitos:**

- Desenvolvimento: ≥ 32 caracteres```bash- Em produção, use JWT_KEY com pelo menos 64 caracteres e banco com SSL.

- Produção: ≥ 64 caracteres

JWT_KEY="sua-chave-super-secreta-com-64-chars-ou-mais-para-producao"- Mantenha segredos fora do código-fonte, usando `.env` ou variáveis do ambiente.

**Gerar chave segura:**

```bash```

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```- Chave para assinar tokens JWT---



### Opcionais (com Defaults)- **Development:** ≥32 caracteresConsulte este README para saber quais variáveis são obrigatórias e como configurar corretamente o ambiente.



#### `NODE_ENV`- **Production:** ≥64 caracteres

Ambiente de execução da aplicação.- Geração recomendada: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`



```bash### Opcionais com Defaults

NODE_ENV="development"  # ou "production" ou "test"

```**`NODE_ENV`**

```bash

**Default:** `development`NODE_ENV="development" # ou "production" ou "test"

```

**Impacto:**- Default: `development`

- Logs detalhados em development- Controla comportamento de logs, validações

- Validações mais rigorosas em production

- Testes isolados em test**`PORT`**

```bash

#### `PORT`PORT=4444

Porta HTTP do servidor.```

- Default: `4444`

```bash- Porta do servidor HTTP

PORT=4444

```**`JWT_TTL`**

```bash

**Default:** `4444`JWT_TTL="1h" # ou "15m", "7d", "3600"

```

#### `JWT_TTL`- Default: `1h`

Tempo de vida do token JWT.- Tempo de vida do token JWT

- Formatos aceitos: `15m`, `2h`, `7d`, `3600` (segundos)

```bash

JWT_TTL="1h"    # 1 hora (default)**`ALLOWED_ORIGINS`**

JWT_TTL="15m"   # 15 minutos```bash

JWT_TTL="7d"    # 7 diasALLOWED_ORIGINS="http://localhost:3000,https://meufrontend.com"

JWT_TTL="3600"  # 3600 segundos```

```- Default: vazio (permite todas origens em dev)

- Lista separada por vírgulas

**Default:** `1h`- Usado pelo middleware CORS



**Formatos aceitos:****`LOG_LEVEL`**

- Segundos: `3600````bash

- Minutos: `15m`LOG_LEVEL="info" # ou "error", "warn", "debug"

- Horas: `1h`, `24h````

- Dias: `7d`, `30d`- Default: `info`

- Controla verbosidade dos logs Winston

#### `ALLOWED_ORIGINS`

Origens permitidas para CORS.**`RATE_LIMIT_WINDOW_MS`**

```bash

```bashRATE_LIMIT_WINDOW_MS=900000 # 15 minutos

# Single origin```

ALLOWED_ORIGINS="http://localhost:3000"- Default: `900000` (15 min)

- Janela de tempo para rate limiting

# Multiple origins

ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173,https://meuapp.com"**`RATE_LIMIT_MAX_REQUESTS`**

``````bash

RATE_LIMIT_MAX_REQUESTS=5

**Default:** `*` (todas origens em development)```

- Default: `5`

⚠️ **Produção:** Sempre especifique origens explícitas.- Máximo de requisições em auth endpoints



#### `RATE_LIMIT_WINDOW_MS`## 🔐 Schema de Validação

Janela de tempo para rate limiting (em milissegundos).

```typescript

```bashconst envSchema = z.object({

RATE_LIMIT_WINDOW_MS=60000  # 1 minuto  NODE_ENV: z.enum(['development', 'production', 'test'])

RATE_LIMIT_WINDOW_MS=900000 # 15 minutos    .default('development'),

```  

  PORT: z.string()

**Default:** `60000` (1 minuto)    .transform(Number)

    .default(4444),

#### `RATE_LIMIT_MAX_REQUESTS`  

Máximo de requisições por janela.  DATABASE_URL: z.string()

    .min(1, 'DATABASE_URL is required'),

```bash  

RATE_LIMIT_MAX_REQUESTS=100  # 100 requisições por janela  JWT_KEY: z.string()

RATE_LIMIT_MAX_REQUESTS=10   # 10 requisições por janela (mais restritivo)    .min(32, 'JWT_KEY must be at least 32 characters long'),

```  

  JWT_TTL: z.string()

**Default:** `100`    .regex(/^(\d+)([smhd])?$|^\d+[smhd]$/i, 'JWT_TTL format invalid')

    .default('1h'),

#### `LOG_LEVEL`  

Nível de logging.  ALLOWED_ORIGINS: z.string().optional(),

  

```bash  RATE_LIMIT_WINDOW_MS: z.string()

LOG_LEVEL="info"   # Produção (recomendado)    .transform(Number)

LOG_LEVEL="debug"  # Desenvolvimento    .default(900000),

LOG_LEVEL="warn"   # Menos verboso  

LOG_LEVEL="error"  # Apenas erros  RATE_LIMIT_MAX_REQUESTS: z.string()

```    .transform(Number)

    .default(5),

**Default:** `info`  

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug'])

**Níveis (do mais ao menos verboso):**    .default('info')

1. `debug` - Tudo (incluindo queries SQL)});

2. `info` - Informações gerais```

3. `warn` - Avisos

4. `error` - Apenas erros## 🛡️ Validações de Segurança



## 🔧 Uso### Produção: JWT_KEY ≥64 Caracteres

```typescript

### Importar Configuraçãoif (env.NODE_ENV === 'production' && env.JWT_KEY.length < 64) {

  console.warn('⚠️  JWT_KEY should be at least 64 characters in production');

```typescript}

import { validateEnv } from '@/config/env';```



const env = validateEnv();### Produção: SSL no DATABASE_URL

```typescript

console.log(env.PORT);           // 4444if (env.NODE_ENV === 'production' && !env.DATABASE_URL.includes('ssl')) {

console.log(env.NODE_ENV);       // 'development'  console.warn('⚠️  Consider using SSL for database connection in production');

console.log(env.DATABASE_URL);   // 'postgresql://...'}

console.log(env.JWT_KEY);        // 'your-secret-key'```

```

### Formato JWT_TTL

### No Entry Point```typescript

// Aceitos: '15m', '2h', '7d', '3600'

```typescript// Rejeitados: '1 hour', 'tomorrow', 'abc'

// src/server.ts```

import { validateEnv } from './config/env';

## 📖 Uso no Código

// Valida na inicialização (falha rápido se inválido)

const env = validateEnv();```typescript

import { env } from '@/config/env';

const app = express();

app.listen(env.PORT, () => {// Type-safe access

  console.log(`Server running on port ${env.PORT}`);const port = env.PORT;           // number

});const jwtKey = env.JWT_KEY;      // string

```const nodeEnv = env.NODE_ENV;    // 'development' | 'production' | 'test'



### Em Serviços// Em qualquer lugar do código

console.log(`Server running on port ${env.PORT}`);

```typescriptjwt.sign(payload, env.JWT_KEY, { expiresIn: env.JWT_TTL });

// src/services/auth.ts```

import { validateEnv } from '@/config/env';

## 🔍 Tipo Exportado

const env = validateEnv();

```typescript

export const signToken = (userId: number) => {type ValidatedEnv = {

  return jwt.sign({ userId }, env.JWT_KEY, {  NODE_ENV: 'development' | 'production' | 'test';

    expiresIn: env.JWT_TTL  PORT: number;

  });  DATABASE_URL: string;

};  JWT_KEY: string;

```  JWT_TTL: string;

  ALLOWED_ORIGINS?: string;

## ✅ Validação com Zod  RATE_LIMIT_WINDOW_MS: number;

  RATE_LIMIT_MAX_REQUESTS: number;

O módulo usa Zod para validação rigorosa:  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';

};

```typescript

// env.ts (simplificado)export const env: ValidatedEnv;

import { z } from 'zod';```



const envSchema = z.object({## ⚠️ Tratamento de Erros

  DATABASE_URL: z.string().url(),

  JWT_KEY: z.string().min(32), // Validação de tamanho**Se validação falhar:**

  PORT: z.coerce.number().default(4444),```typescript

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),try {

  // ...  const env = envSchema.parse(process.env);

});  // ...

} catch (error) {

export const validateEnv = () => {  if (error instanceof z.ZodError) {

  const result = envSchema.safeParse(process.env);    console.error('❌ Invalid environment variables:');

      console.error(error.flatten().fieldErrors);

  if (!result.success) {    process.exit(1); // Termina aplicação

    console.error('❌ Invalid environment variables:', result.error.format());  }

    process.exit(1);}

  }```

  

  return result.data;**Exemplo de erro:**

};```bash

```❌ Invalid environment variables:

{

### Validações Customizadas  JWT_KEY: [ 'JWT_KEY must be at least 32 characters long' ],

  DATABASE_URL: [ 'DATABASE_URL is required' ]

#### JWT_KEY por Ambiente}

```

```typescript

// Development: mínimo 32 caracteres## 🧪 Ambientes

// Production: mínimo 64 caracteres

if (NODE_ENV === 'production' && JWT_KEY.length < 64) {### Development (.env.development)

  throw new Error('JWT_KEY must be at least 64 characters in production');```bash

}NODE_ENV=development

```PORT=4444

DATABASE_URL=postgresql://localhost:5432/blog_dev

#### Database SSL em ProduçãoJWT_KEY=chave-de-32-caracteres-minimo

JWT_TTL=24h

```typescriptLOG_LEVEL=debug

if (NODE_ENV === 'production' && !DATABASE_URL.includes('sslmode=require')) {```

  console.warn('⚠️  WARNING: Database should use SSL in production');

}### Production (.env.production)

``````bash

NODE_ENV=production

## 🛡️ SegurançaPORT=8080

DATABASE_URL=postgresql://user:pass@prod-db:5432/blog?sslmode=require

### Boas PráticasJWT_KEY=chave-super-secreta-com-64-caracteres-ou-mais-para-seguranca-maxima

JWT_TTL=1h

1. **Nunca commite `.env`**ALLOWED_ORIGINS=https://meufrontend.com,https://api.meufrontend.com

   ```bashLOG_LEVEL=warn

   # .gitignore```

   .env

   .env.local### Test (.env.test)

   .env.production```bash

   ```NODE_ENV=test

PORT=4445

2. **Use `.env.example` como template**DATABASE_URL=postgresql://localhost:5432/blog_test

   ```bashJWT_KEY=test-key-with-32-chars-minimum

   NODE_ENV=developmentJWT_TTL=1h

   PORT=4444LOG_LEVEL=error

   DATABASE_URL="postgresql://user:password@localhost:5432/blog"```

   JWT_KEY="your-secret-key-here"

   ```## 🔐 Segurança



3. **Gere chaves fortes**### ✅ O Que Fazer

   ```bash

   # Chave 32 bytes (64 caracteres hex)1. **Gerar JWT_KEY seguro:**

   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"```bash

   ```node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```

4. **Diferentes secrets por ambiente**

   - Desenvolvimento: chave simples2. **Nunca commitar .env:**

   - Staging: chave forte```gitignore

   - Produção: chave gerada criptograficamente.env

.env.local

5. **Rotacione secrets periodicamente**.env.*.local

   - JWT_KEY a cada 3-6 meses```

   - Database password a cada 6-12 meses

3. **Usar variáveis de ambiente em CI/CD:**

### Checklist de Produção- GitHub Actions: Repository Secrets

- Vercel: Environment Variables

- [ ] `NODE_ENV=production`- Heroku: Config Vars

- [ ] `JWT_KEY` ≥ 64 caracteres

- [ ] `DATABASE_URL` com `sslmode=require`4. **Rotacionar JWT_KEY regularmente:**

- [ ] `ALLOWED_ORIGINS` com domínios específicos- A cada 3-6 meses em produção

- [ ] `RATE_LIMIT_MAX_REQUESTS` ajustado- Sempre que houver suspeita de vazamento

- [ ] `LOG_LEVEL=info` ou `warn`

- [ ] Arquivo `.env` protegido (chmod 600)### ❌ O Que NÃO Fazer

- [ ] Backup de secrets em local seguro

- ❌ Commitar .env no git

## 🧪 Testes- ❌ Usar JWT_KEY curto (<32 chars)

- ❌ Hardcodear secrets no código

```typescript- ❌ Compartilhar .env de produção

// tests/config.test.ts- ❌ Usar mesma JWT_KEY em dev e prod

import { validateEnv } from '@/config/env';

## 📚 Exemplo Completo

describe('validateEnv', () => {

  it('should load valid environment', () => {**arquivo .env:**

    process.env.DATABASE_URL = 'postgresql://localhost/test';```bash

    process.env.JWT_KEY = 'a'.repeat(32);NODE_ENV=development

    PORT=4444

    const env = validateEnv();DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blog_dev

    JWT_KEY=minha-chave-super-secreta-com-32-caracteres-ou-mais

    expect(env.PORT).toBe(4444);JWT_TTL=1h

    expect(env.NODE_ENV).toBe('development');ALLOWED_ORIGINS=http://localhost:3000

  });RATE_LIMIT_WINDOW_MS=900000

  RATE_LIMIT_MAX_REQUESTS=5

  it('should fail with short JWT_KEY', () => {LOG_LEVEL=debug

    process.env.JWT_KEY = 'too-short';```

    

    expect(() => validateEnv()).toThrow();**Uso no código:**

  });```typescript

});// src/config/env.ts

```import { z } from 'zod';

import dotenv from 'dotenv';

## 📚 Exemplo Completo

dotenv.config();

### Arquivo `.env`

const envSchema = z.object({

```bash  // ... schema

# Ambiente});

NODE_ENV=development

const parsed = envSchema.safeParse(process.env);

# Servidor

PORT=4444if (!parsed.success) {

  console.error('❌ Invalid environment variables:', parsed.error.flatten());

# Banco de Dados  process.exit(1);

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_dev?schema=public"}



# JWTexport const env = parsed.data;

JWT_KEY="dev-secret-key-with-minimum-32-characters-required"export type ValidatedEnv = z.infer<typeof envSchema>;

JWT_TTL="7d"```



# CORS## 📖 Referências

ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

- [Zod Documentation](https://zod.dev/)

# Rate Limiting- [dotenv](https://github.com/motdotla/dotenv)

RATE_LIMIT_WINDOW_MS=60000- [12 Factor App - Config](https://12factor.net/config)

RATE_LIMIT_MAX_REQUESTS=100- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)


# Logs
LOG_LEVEL=debug
```

### Uso no Servidor

```typescript
// src/server.ts
import express from 'express';
import { validateEnv } from './config/env';

const env = validateEnv();
const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔒 JWT TTL: ${env.JWT_TTL}`);
});
```

## 🔗 Referências

- [Zod Documentation](https://zod.dev/)
- [Node.js Environment Variables](https://nodejs.org/docs/latest/api/process.html#process_process_env)
- [The Twelve-Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
