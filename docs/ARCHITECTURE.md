# Documentação de Arquitetura

## Visão Geral
API REST Node.js com TypeScript, Express 5, Prisma ORM e PostgreSQL. Implementa autenticação JWT, limitação de requisições, sanitização de entrada e uploads seguros de arquivos.

## Arquitetura de Segurança

### Camadas de Defesa em Profundidade

1. **Camada de Rede**
   - Limitação de requisições (express-rate-limit): 5 req/15min para auth, 50 req/15min geral
   - Whitelist CORS (configurável via ALLOWED_ORIGINS)
   - Configuração de trust proxy para proxies reversos em produção

2. **Camada de Aplicação**
   - Helmet.js para cabeçalhos de segurança (CSP, HSTS, X-Frame-Options)
   - Middleware de sanitização de requisições (remove __proto__, tags script, URLs js:)
   - Validação JWT com HS256 (TTL configurável)
   - Hash de senha com Bcrypt (12 rounds)

3. **Camada de Dados**
   - Validação de schema Zod (auth, posts)
   - Prisma ORM com queries parametrizadas
   - Limites de tamanho de entrada (corpo 100KB, uploads 5MB)

4. **Segurança de Upload de Arquivos**
   - Validação dupla: tipo MIME + whitelist de extensões
   - Re-codificação Sharp remove EXIF/metadados
   - Nomes de arquivo baseados em UUID previnem colisões
   - Diretórios temp e final separados

## Fluxo de Requisições

```
Requisição do Cliente
    ↓
[Helmet Headers] → Cabeçalhos de segurança aplicados
    ↓
[CORS] → Validação de origem
    ↓
[Rate Limiting] → Limitação de requisições
    ↓
[Body Parser] → Parsing JSON (limite de 100KB)
    ↓
[Sanitização] → Remoção HTML/SQL, verificação de poluição de protótipo
    ↓
[Router] → Correspondência de rotas
    ↓
[Middleware de Validação] → Validação de schema Zod
    ↓
[Middleware de Autenticação] → Verificação JWT (se rota protegida)
    ↓
[Controller] → Lógica de negócio
    ↓
[Camada de Serviço] → Operações de banco de dados (Prisma)
    ↓
[Tratador de Erros] → Formatação centralizada de erros
    ↓
Resposta
```

## Estrutura de Diretórios

```
src/
├── config/          # Validação de ambiente (schemas Zod)
├── controllers/     # Manipuladores de requisições HTTP
├── libs/            # Integrações de terceiros (JWT, Multer, Prisma)
├── middlewares/     # Processamento de requisições (auth, validação, sanitização)
├── routes/          # Definições de rotas
├── services/        # Lógica de negócio (usuário, auth, saúde)
├── types/           # Definições de tipos TypeScript
└── utils/           # Helpers (logger, tratamento de erros, uploads)
```

## Decisões de Design Importantes

### 1. Mitigação de Condição de Corrida TOCTOU

**Problema**: Padrão check-then-act na criação de usuário permitia registros duplicados entre verificação e inserção.

**Solução**: Inserção direta no banco de dados com captura de constraint única:
```typescript
try {
  const user = await prisma.user.create({ data: { email, password } });
  return { success: true, user };
} catch (error) {
  if (error.code === 'P2002') {
    return { success: false, error: 'Email já registrado' };
  }
  throw error;
}
```

**Benefícios**:
- Operação atômica no nível do banco de dados
- Sem janela de corrida
- Aproveita constraints do BD ao invés de lógica de aplicação

### 2. Mitigação de Timing Attack
**Problema**: Retorno antecipado em usuário inexistente vaza informação via tempo.  
**Solução**: Hash bcrypt falso quando usuário não encontrado (comportamento em tempo constante).  
**Benefício**: Previne ataques de enumeração de usuários.

### 3. Prevenção de ReDoS
**Problema**: Regex complexo em strings grandes pode causar backtracking catastrófico.  
**Solução**: Truncar strings para 20KB antes da sanitização com regex.  
**Benefício**: Previne ataques de exaustão de CPU.

### 4. Defesa Contra Poluição de Protótipo
**Problema**: Chaves maliciosas __proto__ ou constructor podem poluir protótipo de Object.  
**Solução**: Abordagem whitelist + verificações Object.hasOwnProperty.  
**Benefício**: Previne execução de código via manipulação da cadeia de protótipos.

### 5. Segurança de Upload
**Problema**: Arquivos maliciosos (polyglot, exploits EXIF) podem burlar validação básica.  
**Solução**: Re-codificação Sharp remove metadados + normaliza formato.  
**Benefício**: Remove payloads ocultos, garante saída limpa.

## Tratamento de Erros

Todos os erros usam formato padronizado via `sendError()`:
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Credenciais inválidas",
    "details": { "field": "password" }
  }
}
```

Códigos internos (ex: AUTH_*, ADMIN_*, VALIDATION_*) permanecem estáveis entre versões para tratamento no lado do cliente.

## Estratégia de Testes

- **Testes Unitários**: Lógica de sanitização, processamento de upload
- **Integration Tests**: Auth flows, admin operations, error scenarios
- **Health Tests**: DB connectivity, degraded state handling

**Foco de Cobertura**: Caminhos críticos de segurança (auth, validação, sanitização).

## Considerações de Deploy

### Variáveis de Ambiente
- `NODE_ENV`: development | production | test
- `JWT_KEY`: ≥32 chars (dev), ≥64 chars (prod)
- `DATABASE_URL`: String de conexão PostgreSQL (SSL obrigatório em prod)
- `JWT_TTL`: Tempo de vida do token (ex: '15m', '2h', '7d')
- `ALLOWED_ORIGINS`: Whitelist CORS separada por vírgulas

### Checklist de Produção
- [ ] Configurar `trust proxy` corretamente (atrás de nginx/cloudflare)
- [ ] Usar SSL/TLS para conexões de banco de dados
- [ ] Rotacionar JWT_KEY regularmente
- [ ] Configurar retenção e monitoramento de logs
- [ ] Configurar endpoint de health check para balanceadores de carga
- [ ] Habilitar rate limiting por usuário (melhoria futura)

## Otimizações de Performance

1. **Compressão**: Gzip/Brotli para respostas >1KB
2. **Cache de Assets Estáticos**: max-age de 1 dia para uploads em produção
3. **Connection Pooling Prisma**: Configurado via parâmetros DATABASE_URL
4. **Saída Antecipada na Sanitização**: Pular operações caras para payloads pequenos

## Melhorias Futuras

### Adições Recomendadas
1. **Rotação de Refresh Token**: Implementar expiração de sessão deslizante
2. **Documentação da API**: Adicionar especificação OpenAPI/Swagger
3. **Métricas**: Endpoint Prometheus para observabilidade
4. **Pipeline CI/CD**: Testes e deploy automatizados (GitHub Actions)
5. **Rate Limiting por Usuário**: Rastrear limites por ID de usuário autenticado ao invés de IP

### Otimizações de Performance
- Cache Redis para posts acessados frequentemente
- Réplicas de leitura do banco de dados para escalonamento de queries
- Integração CDN para servir uploads
