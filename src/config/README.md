# Config: Configurações e Variáveis de Ambiente

Esta pasta centraliza toda a configuração do projeto, especialmente o carregamento e validação das variáveis de ambiente.

## Principais arquivos
- `env.ts`: Carrega `.env`, valida e tipa as variáveis de ambiente usando Zod.

## Variáveis suportadas
- `NODE_ENV`: Ambiente de execução (`development`, `production`, `test`).
- `PORT`: Porta do servidor (padrão: 4444).
- `DATABASE_URL`: String de conexão do banco (obrigatória).
- `JWT_KEY`: Chave secreta para JWT (mínimo 32 caracteres, recomendado 64+ em produção).
- `ALLOWED_ORIGINS`: Origens permitidas para CORS.
- `RATE_LIMIT_WINDOW_MS`: Janela de tempo do rate limit (ms).
- `RATE_LIMIT_MAX_REQUESTS`: Máximo de requisições por janela.
- `LOG_LEVEL`: Nível de log (`error`, `warn`, `info`, `debug`).

## Exemplo de uso
```typescript
import { validateEnv } from './config/env';
const env = validateEnv();
console.log(env.PORT);
```

## Boas práticas
- Sempre valide as variáveis antes de iniciar o servidor.
- Em produção, use JWT_KEY com pelo menos 64 caracteres e banco com SSL.
- Mantenha segredos fora do código-fonte, usando `.env` ou variáveis do ambiente.

---
Consulte este README para saber quais variáveis são obrigatórias e como configurar corretamente o ambiente.
