# Convenções da API

## Formato de Resposta de Sucesso
Sempre JSON. Exemplos:

```json
{ "user": { "id": 1, "email": "user@example.com" }, "token": "<jwt>" }
```

## Formato de Erro Padronizado
```json
{
  "error": {
    "code": "AUTH_INVALID_DATA",
    "message": "Dados inválidos",
    "details": { "email": ["Email inválido"] }
  }
}
```

Campo | Descrição
------|----------
`error.code` | Código interno estável (UPPER_SNAKE) para lógica de frontend/monitoramento.
`error.message` | Mensagem legível ao usuário (pt-BR). Pode ser traduzida.
`error.details` | Objetos de validação ou contexto opcional.

## Códigos Atuais (Parcial)
Área | Código | HTTP | Caso
-----|--------|------|-----
Auth | AUTH_INVALID_DATA | 400 | Falha de validação no signup
Auth | AUTH_USER_EXISTS | 409 | Usuário já existe
Auth | AUTH_INVALID_CREDENTIALS | 400 | Campos de credenciais ausentes/mal formatados
Auth | AUTH_UNAUTHORIZED | 401 | Token ausente/inválido
Auth | AUTH_SIGNUP_ERROR | 500 | Erro inesperado ao criar usuário
Auth | AUTH_SIGNIN_ERROR | 500 | Erro inesperado ao autenticar
Admin | ADMIN_UNAUTHORIZED | 401 | Acesso a rota admin sem autenticação
Admin | ADMIN_POST_INVALID | 400 | Título ou conteúdo ausentes
Admin | ADMIN_POST_CREATE_ERROR | 500 | Falha no prisma ao criar post

## Diretrizes de Criação de Novos Códigos
1. Prefixo por domínio (AUTH_, ADMIN_, POST_, etc.).
2. HTTP 4xx para erros do cliente; 5xx para falhas internas.
3. Evitar expor tecnologia (ex: não retornar stack trace em produção).
4. Mensagens em português simples (coerente com resto do projeto).

## Boas Práticas
- Sempre usar `sendError` para manter consistência.
- Incluir `details` somente quando ajuda (ex: validação Zod).
- Não retornar senhas, hashes ou tokens sensíveis.
- Logar internamente com nível apropriado (`warn` 4xx, `error` 5xx).

## Exemplo de Uso (`sendError`)
```ts
import { sendError } from '@/utils/http-error';

if (!req.userId) {
  return sendError(res, {
    status: 401,
    code: 'AUTH_UNAUTHORIZED',
    message: 'Não autorizado'
  });
}
```

## Versionamento
Mudanças de formato ou códigos devem ser anotadas em `CHANGELOG.md` sob a seção "API".
